// User Preferences and Group Aggregation Types

import type { GeoPoint } from './provider.js';

export interface CuisineScore {
  cuisine: string;
  score: number; // -1 to 1 (-1 = avoid, 0 = neutral, 1 = love)
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

export interface TimeRange {
  start: string; // HH:MM
  end: string;
}

export interface UserPreferences {
  userId: string;
  dietary: DietaryPreferences;
  budget: BudgetPreferences;
  transportation: TransportationPreferences;
  venue: VenuePreferences;
  scheduling: SchedulingPreferences;
  location: LocationPreferences;
  completenessScore: number; // 0-100
  lastUpdated: Date;
}

export interface DietaryPreferences {
  restrictions: string[]; // 'vegetarian', 'vegan', 'kosher', 'halal'
  allergies: string[]; // 'gluten', 'peanuts', 'dairy', 'shellfish'
  cuisinePreferences: CuisineScore[];
  avoidIngredients: string[];
}

export interface BudgetPreferences {
  dining: BudgetRange;
  transportation: BudgetRange;
  services: BudgetRange;
  flexibility: 'strict' | 'flexible' | 'splurge_ok';
}

export interface TransportationPreferences {
  preferredServices: string[]; // 'uber', 'lyft', 'public_transit'
  shareRidesOk: boolean;
  maxWalkMinutes: number;
  accessibilityNeeds: string[];
}

export interface VenuePreferences {
  ambiancePreferences: string[]; // 'quiet', 'lively', 'trendy', 'casual'
  seatingPreferences: string[]; // 'booth', 'bar', 'patio', 'private'
  accessibilityNeeds: string[];
}

export interface SchedulingPreferences {
  preferredMealTimes: Record<string, TimeRange>; // 'lunch', 'dinner', 'brunch'
  avoidDays: number[]; // 0-6, Sunday = 0
  timezone: string;
}

export interface LocationPreferences {
  home?: GeoPoint;
  work?: GeoPoint;
  preferredAreas: string[];
  avoidAreas: string[];
  maxTravelMinutes: number;
}

// Group Preference Aggregation

export interface GroupPreferences {
  userIds: string[];
  requiredRestrictions: string[]; // Union of all dietary restrictions
  requiredAllergenFree: string[]; // Union of all allergies
  requiredAccessibility: string[]; // Union of all accessibility needs
  budgetRange: {
    min: number;
    max: number;
    perPerson: number;
  };
  cuisineScores: Map<string, number>; // Averaged across group
  ambianceScores: Map<string, number>;
  conflicts: PreferenceConflict[];
  computedAt: Date;
}

export interface PreferenceConflict {
  type: 'budget' | 'dietary' | 'cuisine' | 'time' | 'location';
  description: string;
  affectedUsers: string[];
  suggestions: string[];
}

export interface PreferenceCompleteness {
  userId: string;
  overallScore: number;
  sections: {
    dietary: number;
    budget: number;
    transportation: number;
    venue: number;
    scheduling: number;
    location: number;
  };
  missingFields: string[];
  suggestedQuestions: string[];
}

export interface PreferenceQuestion {
  id: string;
  category: keyof UserPreferences;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: string[];
  priority: number;
}

export interface InferredPreference {
  field: string;
  value: unknown;
  confidence: number;
  source: 'behavior' | 'similar_users' | 'default';
  basedOn?: string[];
}
