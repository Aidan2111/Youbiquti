// Service Request and Matching Types

import type { GeoPoint } from './provider.js';
import type { BudgetRange } from './preferences.js';

export type RequestStatus =
  | 'pending' // Matching in progress
  | 'matched' // Matches found
  | 'selected' // Provider selected
  | 'negotiating' // In negotiation
  | 'agreed' // Terms agreed
  | 'paid' // Payment captured
  | 'in_progress' // Service being delivered
  | 'completed' // Successfully completed
  | 'cancelled' // Cancelled by user
  | 'expired' // Request expired
  | 'disputed'; // In dispute

export type MatchPriority = 'trust' | 'price' | 'rating' | 'availability';

export interface ServiceRequest {
  id: string;
  buyerId: string;
  category: string;
  requirements: ServiceRequirements;
  matchingPreferences: MatchingPreferences;
  status: RequestStatus;
  matches: MatchResult[];
  selectedProviderId?: string;
  negotiationId?: string;
  transactionId?: string;
  createdAt: Date;
  expiresAt: Date;
  fulfilledAt?: Date;
}

export interface ServiceRequirements {
  dateTime: Date;
  dateTimeFlexibility?: number; // hours of flexibility
  duration?: number; // minutes
  partySize?: number;
  location?: GeoPoint;
  destination?: GeoPoint;
  budget?: BudgetRange;
  attributes: Record<string, unknown>;
  freeformNotes?: string;
}

export interface MatchingPreferences {
  networkOnly: boolean; // Only show providers in user's network
  minTrustScore?: number;
  minRating?: number;
  prioritize: MatchPriority;
}

export interface MatchResult {
  providerId: string;
  providerName: string;
  offeringId: string;
  offeringName: string;
  trustScore: number;
  connectionDegree: 1 | 2 | 3 | null;
  networkReviewCount: number;
  networkAvgRating: number;
  globalRating: number;
  globalReviewCount: number;
  estimatedPrice: number;
  priceRange?: { low: number; high: number };
  availability: 'available' | 'limited' | 'waitlist';
  availableSlots?: Date[];
  preferenceMatchScore: number; // 0-100, how well it matches user preferences
  preferenceHighlights: string[]; // Why it's a good match
  matchScore: number; // Overall combined score
  matchRank: number;
  matchExplanation: string;
  canInstantBook: boolean;
  negotiable: boolean;
}

export interface SearchFilters {
  category?: string;
  location?: GeoPoint;
  radius?: number; // miles
  priceRange?: BudgetRange;
  minRating?: number;
  attributes?: Record<string, unknown>;
  availableAt?: Date;
  networkOnly?: boolean;
  minTrustScore?: number;
}
