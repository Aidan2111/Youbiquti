// Social Graph Service - Trust calculation and network queries

import type {
  Connection,
  TrustScore,
  TrustScoreComponents,
  NetworkReview,
  NetworkRating,
  Endorsement,
  ConnectionPath,
  ConnectionDegree,
} from '@youbiquti/core';

import { TRUST_WEIGHTS, CONNECTION_SCORES } from '@youbiquti/core';

import {
  demoUsers,
  demoEndorsements,
  findConnectionPath,
  getConnectionsForUser,
} from '../data/demo-users.js';

import {
  demoReviews,
  getProviderById,
} from '../data/demo-providers.js';

/**
 * Social Graph Service
 * 
 * Manages social connections and calculates trust scores.
 * In production, this would use a graph database (Cosmos DB Gremlin, Neo4j).
 * For now, uses in-memory demo data.
 */
export class SocialGraphService {
  
  // =========================================================================
  // CONNECTION MANAGEMENT
  // =========================================================================
  
  /**
   * Get all 1st-degree connections for a user
   */
  getConnections(userId: string, degree?: 1 | 2 | 3): Connection[] {
    if (degree === 1 || !degree) {
      return getConnectionsForUser(userId);
    }
    
    // For higher degrees, we need to traverse the graph
    const firstDegree = getConnectionsForUser(userId);
    const connections: Connection[] = [...firstDegree];
    
    if (degree >= 2) {
      const secondDegreeIds = new Set<string>();
      for (const conn of firstDegree) {
        const theirConnections = getConnectionsForUser(conn.toUserId);
        for (const secondConn of theirConnections) {
          if (secondConn.toUserId !== userId && !firstDegree.some(c => c.toUserId === secondConn.toUserId)) {
            if (!secondDegreeIds.has(secondConn.toUserId)) {
              secondDegreeIds.add(secondConn.toUserId);
              connections.push({
                ...secondConn,
                degree: 2,
                fromUserId: userId,
              });
            }
          }
        }
      }
    }
    
    if (degree >= 3) {
      const thirdDegreeIds = new Set<string>();
      const secondDegree = connections.filter(c => c.degree === 2);
      
      for (const conn of secondDegree) {
        const theirConnections = getConnectionsForUser(conn.toUserId);
        for (const thirdConn of theirConnections) {
          if (!connections.some(c => c.toUserId === thirdConn.toUserId)) {
            if (!thirdDegreeIds.has(thirdConn.toUserId)) {
              thirdDegreeIds.add(thirdConn.toUserId);
              connections.push({
                ...thirdConn,
                degree: 3,
                fromUserId: userId,
              });
            }
          }
        }
      }
    }
    
    return connections;
  }
  
  /**
   * Get connection path between two users
   */
  getConnectionPath(userId: string, targetId: string): ConnectionPath | null {
    const path = findConnectionPath(userId, targetId);
    if (!path) return null;
    
    return {
      fromUserId: userId,
      toUserId: targetId,
      path,
      degree: (path.length - 1) as 1 | 2 | 3,
    };
  }
  
  /**
   * Get connection degree between user and provider/target
   */
  getConnectionDegree(userId: string, targetId: string): ConnectionDegree {
    const path = this.getConnectionPath(userId, targetId);
    if (!path) return null;
    if (path.degree > 3) return null;
    return path.degree;
  }
  
  // =========================================================================
  // TRUST CALCULATION
  // =========================================================================
  
  /**
   * Calculate trust score for a provider from a user's perspective
   * 
   * Trust Score = weighted combination of:
   * - Connection distance (40%): How close in the social graph
   * - Network reviews (35%): Reviews from people in user's network
   * - Endorsements (15%): Explicit vouches from connections
   * - Global reputation (10%): Fallback public rating
   */
  calculateTrustScore(userId: string, providerId: string): TrustScore {
    const provider = getProviderById(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }
    
    // Find connection degree to provider's user
    const providerUserId = provider.userId;
    let degree: ConnectionDegree = null;
    
    if (providerUserId) {
      degree = this.getConnectionDegree(userId, providerUserId);
    }
    
    // Get network reviews
    const networkReviews = this.getNetworkReviews(userId, providerId);
    const networkRating = this.getNetworkRating(userId, providerId);
    
    // Get endorsements
    const endorsements = this.getNetworkEndorsements(userId, providerId);
    
    // Calculate component scores
    const components = this.calculateComponents(
      degree,
      networkRating,
      endorsements.length,
      provider.globalRating
    );
    
    // Calculate final weighted score
    const score = 
      components.connectionScore * TRUST_WEIGHTS.connectionDistance +
      components.reviewScore * TRUST_WEIGHTS.networkReviews +
      components.endorsementScore * TRUST_WEIGHTS.endorsements +
      components.globalScore * TRUST_WEIGHTS.globalReputation;
    
    return {
      providerId,
      score: Math.round(score),
      degree,
      networkReviewCount: networkReviews.length,
      networkAvgRating: networkRating.weightedAverage,
      endorsementCount: endorsements.length,
      globalRating: provider.globalRating,
      components,
      computedAt: new Date(),
    };
  }
  
  /**
   * Calculate trust scores for multiple providers at once
   */
  batchTrustScores(userId: string, providerIds: string[]): Map<string, TrustScore> {
    const scores = new Map<string, TrustScore>();
    
    for (const providerId of providerIds) {
      try {
        const score = this.calculateTrustScore(userId, providerId);
        scores.set(providerId, score);
      } catch {
        // Skip if provider not found
      }
    }
    
    return scores;
  }
  
  /**
   * Calculate individual component scores (each 0-100)
   */
  private calculateComponents(
    degree: ConnectionDegree,
    networkRating: NetworkRating,
    endorsementCount: number,
    globalRating: number
  ): TrustScoreComponents {
    // Connection score: based on degree
    const connectionScore = CONNECTION_SCORES[degree ?? 'null' as unknown as 1] ?? 0;
    
    // Review score: weighted average * 20 (to convert 0-5 to 0-100)
    let reviewScore = 0;
    if (networkRating.reviewCount > 0) {
      reviewScore = networkRating.weightedAverage * 20;
    }
    
    // Endorsement score: capped at 100
    const endorsementScore = Math.min(endorsementCount * 50, 100);
    
    // Global score: rating * 20
    const globalScore = globalRating * 20;
    
    return {
      connectionScore,
      reviewScore,
      endorsementScore,
      globalScore,
    };
  }
  
  // =========================================================================
  // NETWORK REVIEWS
  // =========================================================================
  
  /**
   * Get reviews for a provider from people in the user's network
   */
  getNetworkReviews(userId: string, providerId: string): NetworkReview[] {
    // Get all connections up to 3rd degree
    const connections = this.getConnections(userId, 3);
    const connectionMap = new Map<string, Connection>();
    
    for (const conn of connections) {
      connectionMap.set(conn.toUserId, conn);
    }
    
    // Filter reviews to those from connected users
    const providerReviews = demoReviews.filter(r => r.providerId === providerId);
    const networkReviews: NetworkReview[] = [];
    
    for (const review of providerReviews) {
      const connection = connectionMap.get(review.reviewerId);
      if (connection) {
        const weight = this.getDegreeWeight(connection.degree);
        networkReviews.push({
          reviewId: review.id,
          reviewerId: review.reviewerId,
          reviewerName: review.reviewerName,
          providerId: review.providerId,
          rating: review.rating,
          text: review.text,
          connectionDegree: connection.degree,
          weight,
          createdAt: review.createdAt,
        });
      }
    }
    
    return networkReviews;
  }
  
  /**
   * Get weighted average rating from network reviews
   */
  getNetworkRating(userId: string, providerId: string): NetworkRating {
    const reviews = this.getNetworkReviews(userId, providerId);
    
    if (reviews.length === 0) {
      return {
        providerId,
        weightedAverage: 0,
        reviewCount: 0,
        reviewsByDegree: { first: 0, second: 0, third: 0 },
      };
    }
    
    let totalWeight = 0;
    let weightedSum = 0;
    const reviewsByDegree = { first: 0, second: 0, third: 0 };
    
    for (const review of reviews) {
      weightedSum += review.rating * review.weight;
      totalWeight += review.weight;
      
      if (review.connectionDegree === 1) reviewsByDegree.first++;
      else if (review.connectionDegree === 2) reviewsByDegree.second++;
      else if (review.connectionDegree === 3) reviewsByDegree.third++;
    }
    
    return {
      providerId,
      weightedAverage: totalWeight > 0 ? weightedSum / totalWeight : 0,
      reviewCount: reviews.length,
      reviewsByDegree,
    };
  }
  
  // =========================================================================
  // ENDORSEMENTS
  // =========================================================================
  
  /**
   * Get endorsements for a provider from user's network
   */
  getNetworkEndorsements(userId: string, providerId: string): Endorsement[] {
    const connections = this.getConnections(userId, 3);
    const connectedUserIds = new Set(connections.map(c => c.toUserId));
    
    return demoEndorsements.filter(e => 
      e.providerId === providerId && connectedUserIds.has(e.userId)
    );
  }
  
  /**
   * Create an endorsement (vouching for a provider)
   */
  endorseProvider(
    userId: string,
    providerId: string,
    note?: string
  ): Endorsement {
    const user = demoUsers.find(u => u.id === userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    
    const endorsement: Endorsement = {
      id: `end_${Date.now()}`,
      userId,
      userName: user.displayName,
      providerId,
      note,
      createdAt: new Date(),
    };
    
    // In production, save to database
    demoEndorsements.push(endorsement);
    
    return endorsement;
  }
  
  // =========================================================================
  // HELPERS
  // =========================================================================
  
  private getDegreeWeight(degree: 1 | 2 | 3): number {
    switch (degree) {
      case 1: return 1.0;   // Full weight
      case 2: return 0.6;   // 60% weight
      case 3: return 0.3;   // 30% weight
      default: return 0;
    }
  }
}

// Export singleton instance
export const socialGraphService = new SocialGraphService();
