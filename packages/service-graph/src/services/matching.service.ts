// Matching Engine - Trust-weighted provider matching

import type {
  ServiceRequest,
  MatchResult,
  TrustScore,
  MatchPriority,
} from '@youbiquti/core';

import { socialGraphService } from './social-graph.service.js';
import { preferenceService } from './preference.service.js';
import {
  demoOfferings,
  getProviderById,
  getOfferingById,
} from '../data/demo-providers.js';

/**
 * Matching Engine
 * 
 * The "order book" that matches service requests with offerings
 * using trust scores and preference matching.
 */
export class MatchingService {
  
  /**
   * Find matches for a service request
   */
  findMatches(
    userId: string,
    category: string,
    requirements: Partial<ServiceRequest['requirements']> = {},
    preferences: Partial<ServiceRequest['matchingPreferences']> = {}
  ): MatchResult[] {
    // Get relevant offerings
    const offerings = demoOfferings.filter(o => 
      o.category === category && o.status === 'active'
    );
    
    if (offerings.length === 0) {
      return [];
    }
    
    // Calculate trust scores for all providers
    const providerIds = [...new Set(offerings.map(o => o.providerId))];
    const trustScores = socialGraphService.batchTrustScores(userId, providerIds);
    
    // Get user preferences for preference matching
    const userPrefs = preferenceService.getPreferences(userId);
    
    // Score each offering
    const matches: MatchResult[] = [];
    
    for (const offering of offerings) {
      const provider = getProviderById(offering.providerId);
      if (!provider) continue;
      
      const trustScore = trustScores.get(offering.providerId);
      if (!trustScore) continue;
      
      // Filter by min trust score if specified
      if (preferences.minTrustScore && trustScore.score < preferences.minTrustScore) {
        continue;
      }
      
      // Filter by network only if specified
      if (preferences.networkOnly && trustScore.degree === null) {
        continue;
      }
      
      // Filter by min rating if specified
      if (preferences.minRating && provider.globalRating < preferences.minRating) {
        continue;
      }
      
      // Calculate preference match score
      const { score: prefScore, highlights } = this.calculatePreferenceMatch(
        offering,
        userPrefs,
        requirements
      );
      
      // Calculate overall match score
      const matchScore = this.calculateMatchScore(
        trustScore,
        prefScore,
        provider.globalRating,
        preferences.prioritize ?? 'trust'
      );
      
      // Build match result
      const match: MatchResult = {
        providerId: offering.providerId,
        providerName: provider.displayName,
        offeringId: offering.id,
        offeringName: offering.name,
        trustScore: trustScore.score,
        connectionDegree: trustScore.degree,
        networkReviewCount: trustScore.networkReviewCount,
        networkAvgRating: trustScore.networkAvgRating,
        globalRating: provider.globalRating,
        globalReviewCount: provider.globalReviewCount,
        estimatedPrice: this.estimatePrice(offering, requirements),
        priceRange: offering.negotiable
          ? { low: offering.basePrice * 0.9, high: offering.basePrice * 1.1 }
          : undefined,
        availability: 'available', // Simplified for now
        preferenceMatchScore: prefScore,
        preferenceHighlights: highlights,
        matchScore,
        matchRank: 0, // Will be set after sorting
        matchExplanation: this.generateExplanation(trustScore, prefScore, highlights),
        canInstantBook: offering.instantBook,
        negotiable: offering.negotiable,
      };
      
      matches.push(match);
    }
    
    // Sort by match score and assign ranks
    matches.sort((a, b) => b.matchScore - a.matchScore);
    matches.forEach((match, index) => {
      match.matchRank = index + 1;
    });
    
    return matches;
  }
  
  /**
   * Calculate how well an offering matches user preferences
   */
  private calculatePreferenceMatch(
    offering: typeof demoOfferings[0],
    userPrefs: ReturnType<typeof preferenceService.getPreferences>,
    requirements: Partial<ServiceRequest['requirements']>
  ): { score: number; highlights: string[] } {
    const highlights: string[] = [];
    let score = 50; // Base score
    
    if (!userPrefs) {
      return { score, highlights };
    }
    
    // Budget match
    if (requirements.budget) {
      if (offering.basePrice <= requirements.budget.max) {
        score += 15;
        if (offering.basePrice <= requirements.budget.max * 0.8) {
          highlights.push('Great value for your budget');
        }
      } else {
        score -= 20;
      }
    }
    
    // Party size match
    if (requirements.partySize) {
      if (offering.maxCapacity && requirements.partySize <= offering.maxCapacity) {
        score += 10;
      }
      if (offering.minCapacity && requirements.partySize >= offering.minCapacity) {
        score += 5;
      }
    }
    
    // Location/area match (simplified)
    const preferredAreas = userPrefs.location.preferredAreas;
    if (preferredAreas.length > 0 && offering.attributes) {
      // Would check if offering is in preferred area
      score += 10;
    }
    
    // Instant book preference
    if (offering.instantBook) {
      highlights.push('Instant booking available');
      score += 5;
    }
    
    return {
      score: Math.max(0, Math.min(100, score)),
      highlights,
    };
  }
  
  /**
   * Calculate overall match score with priority weighting
   */
  private calculateMatchScore(
    trustScore: TrustScore,
    preferenceScore: number,
    globalRating: number,
    prioritize: MatchPriority
  ): number {
    // Base weights
    let trustWeight = 0.4;
    let prefWeight = 0.3;
    let ratingWeight = 0.3;
    
    // Adjust weights based on priority
    switch (prioritize) {
      case 'trust':
        trustWeight = 0.6;
        prefWeight = 0.25;
        ratingWeight = 0.15;
        break;
      case 'rating':
        trustWeight = 0.25;
        prefWeight = 0.25;
        ratingWeight = 0.5;
        break;
      case 'price':
        // Price would affect preferenceScore
        trustWeight = 0.3;
        prefWeight = 0.5;
        ratingWeight = 0.2;
        break;
      case 'availability':
        // Would need real-time availability data
        break;
    }
    
    const normalizedRating = globalRating * 20; // Convert 0-5 to 0-100
    
    return Math.round(
      trustScore.score * trustWeight +
      preferenceScore * prefWeight +
      normalizedRating * ratingWeight
    );
  }
  
  /**
   * Estimate price based on offering and requirements
   */
  private estimatePrice(
    offering: typeof demoOfferings[0],
    requirements: Partial<ServiceRequest['requirements']>
  ): number {
    let price = offering.basePrice;
    
    if (offering.pricingModel === 'per_person' && requirements.partySize) {
      price = offering.basePrice * requirements.partySize;
    }
    
    if (offering.pricingModel === 'hourly' && requirements.duration) {
      price = offering.basePrice * (requirements.duration / 60);
    }
    
    return Math.round(price * 100) / 100;
  }
  
  /**
   * Generate human-readable match explanation
   */
  private generateExplanation(
    trustScore: TrustScore,
    prefScore: number,
    highlights: string[]
  ): string {
    const parts: string[] = [];
    
    // Trust explanation
    if (trustScore.degree === 1) {
      parts.push('Direct connection in your network');
    } else if (trustScore.degree === 2) {
      parts.push('Friend of a friend');
    } else if (trustScore.degree === 3) {
      parts.push('In your extended network');
    }
    
    if (trustScore.networkReviewCount > 0) {
      parts.push(`${trustScore.networkReviewCount} review${trustScore.networkReviewCount > 1 ? 's' : ''} from your network`);
    }
    
    if (trustScore.endorsementCount > 0) {
      parts.push('Vouched for by someone you know');
    }
    
    // Preference explanation
    if (prefScore >= 80) {
      parts.push('Excellent match for your preferences');
    } else if (prefScore >= 60) {
      parts.push('Good match for your preferences');
    }
    
    // Include top highlights
    parts.push(...highlights.slice(0, 2));
    
    return parts.join('. ') || 'Based on global ratings';
  }
  
  /**
   * Get a single match result by offering ID
   */
  getMatch(userId: string, offeringId: string): MatchResult | null {
    const offering = getOfferingById(offeringId);
    if (!offering) return null;
    
    const matches = this.findMatches(userId, offering.category);
    return matches.find(m => m.offeringId === offeringId) ?? null;
  }
}

// Export singleton instance
export const matchingService = new MatchingService();
