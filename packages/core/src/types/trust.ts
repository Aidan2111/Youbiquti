// Trust Score and Network Review Types

export interface TrustScore {
  providerId: string;
  score: number; // 0-100
  degree: 1 | 2 | 3 | null; // Closest connection degree
  networkReviewCount: number;
  networkAvgRating: number;
  endorsementCount: number;
  globalRating: number;
  components: TrustScoreComponents;
  computedAt: Date;
}

export interface TrustScoreComponents {
  connectionScore: number; // 40% weight - based on degree (1st=100, 2nd=60, 3rd=30, none=0)
  reviewScore: number; // 35% weight - weighted avg of network reviews
  endorsementScore: number; // 15% weight - explicit vouches
  globalScore: number; // 10% weight - fallback global rating
}

export interface NetworkReview {
  reviewId: string;
  reviewerId: string;
  reviewerName: string;
  providerId: string;
  rating: number; // 1-5
  text?: string;
  connectionDegree: 1 | 2 | 3;
  weight: number; // Based on degree: 1st=1.0, 2nd=0.6, 3rd=0.3
  createdAt: Date;
}

export interface NetworkRating {
  providerId: string;
  weightedAverage: number;
  reviewCount: number;
  reviewsByDegree: {
    first: number;
    second: number;
    third: number;
  };
}

export interface Review {
  id: string;
  transactionId: string;
  reviewerId: string;
  reviewerName: string;
  providerId: string;
  rating: number;
  text?: string;
  photos?: string[];
  helpfulCount: number;
  createdAt: Date;
}

// Trust score calculation weights
export const TRUST_WEIGHTS = {
  connectionDistance: 0.4,
  networkReviews: 0.35,
  endorsements: 0.15,
  globalReputation: 0.1,
} as const;

// Connection degree scores (out of 100)
export const CONNECTION_SCORES = {
  1: 100, // 1st degree - direct connection
  2: 60, // 2nd degree - friend of friend
  3: 30, // 3rd degree - extended network
  null: 0, // No connection
} as const;
