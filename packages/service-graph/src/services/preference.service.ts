// Preference Engine - User preferences and group aggregation

import type {
  UserPreferences,
  GroupPreferences,
  PreferenceConflict,
  PreferenceCompleteness,
  SearchFilters,
  GeoPoint,
} from '@youbiquti/core';

import { demoPreferences, getPreferencesForUser } from '../data/demo-users.js';

/**
 * Preference Engine
 * 
 * Manages user preferences, infers from behavior, and aggregates for groups.
 * In production, this would use LowDB or Cosmos DB.
 */
export class PreferenceService {
  
  // =========================================================================
  // USER PREFERENCES
  // =========================================================================
  
  /**
   * Get preferences for a user
   */
  getPreferences(userId: string): UserPreferences | null {
    return getPreferencesForUser(userId) ?? null;
  }
  
  /**
   * Update user preferences
   */
  updatePreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): UserPreferences {
    const existing = this.getPreferences(userId);
    
    if (!existing) {
      // Create new preferences with defaults
      const newPrefs: UserPreferences = this.createDefaultPreferences(userId);
      Object.assign(newPrefs, updates);
      newPrefs.lastUpdated = new Date();
      newPrefs.completenessScore = this.calculateCompleteness(newPrefs).overallScore;
      
      demoPreferences.push(newPrefs);
      return newPrefs;
    }
    
    // Merge updates
    const updated = this.mergePreferences(existing, updates);
    updated.lastUpdated = new Date();
    updated.completenessScore = this.calculateCompleteness(updated).overallScore;
    
    // Update in array (in production: save to DB)
    const index = demoPreferences.findIndex(p => p.userId === userId);
    if (index >= 0) {
      demoPreferences[index] = updated;
    }
    
    return updated;
  }
  
  /**
   * Create default preferences for a new user
   */
  private createDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      dietary: {
        restrictions: [],
        allergies: [],
        cuisinePreferences: [],
        avoidIngredients: [],
      },
      budget: {
        dining: { min: 20, max: 50, currency: 'USD' },
        transportation: { min: 0, max: 30, currency: 'USD' },
        services: { min: 0, max: 100, currency: 'USD' },
        flexibility: 'flexible',
      },
      transportation: {
        preferredServices: ['uber', 'lyft'],
        shareRidesOk: true,
        maxWalkMinutes: 10,
        accessibilityNeeds: [],
      },
      venue: {
        ambiancePreferences: [],
        seatingPreferences: [],
        accessibilityNeeds: [],
      },
      scheduling: {
        preferredMealTimes: {},
        avoidDays: [],
        timezone: 'America/Chicago',
      },
      location: {
        preferredAreas: [],
        avoidAreas: [],
        maxTravelMinutes: 30,
      },
      completenessScore: 10,
      lastUpdated: new Date(),
    };
  }
  
  /**
   * Deep merge preferences
   */
  private mergePreferences(
    existing: UserPreferences,
    updates: Partial<UserPreferences>
  ): UserPreferences {
    return {
      ...existing,
      ...updates,
      dietary: { ...existing.dietary, ...updates.dietary },
      budget: { ...existing.budget, ...updates.budget },
      transportation: { ...existing.transportation, ...updates.transportation },
      venue: { ...existing.venue, ...updates.venue },
      scheduling: { ...existing.scheduling, ...updates.scheduling },
      location: { ...existing.location, ...updates.location },
    };
  }
  
  // =========================================================================
  // COMPLETENESS SCORING
  // =========================================================================
  
  /**
   * Calculate how complete a user's preferences are
   */
  calculateCompleteness(prefs: UserPreferences): PreferenceCompleteness {
    const sections = {
      dietary: this.scoreDietaryCompleteness(prefs.dietary),
      budget: this.scoreBudgetCompleteness(prefs.budget),
      transportation: this.scoreTransportCompleteness(prefs.transportation),
      venue: this.scoreVenueCompleteness(prefs.venue),
      scheduling: this.scoreSchedulingCompleteness(prefs.scheduling),
      location: this.scoreLocationCompleteness(prefs.location),
    };
    
    const overallScore = Math.round(
      Object.values(sections).reduce((sum, score) => sum + score, 0) / 6
    );
    
    const missingFields: string[] = [];
    const suggestedQuestions: string[] = [];
    
    if (sections.dietary < 50) {
      missingFields.push('dietary.cuisinePreferences');
      suggestedQuestions.push('What are your favorite types of cuisine?');
    }
    if (sections.budget < 50) {
      missingFields.push('budget.dining');
      suggestedQuestions.push('What\'s your typical dining budget per person?');
    }
    if (sections.location < 50) {
      missingFields.push('location.preferredAreas');
      suggestedQuestions.push('What neighborhoods do you like to go out in?');
    }
    
    return {
      userId: prefs.userId,
      overallScore,
      sections,
      missingFields,
      suggestedQuestions,
    };
  }
  
  private scoreDietaryCompleteness(dietary: UserPreferences['dietary']): number {
    let score = 20; // Base score for having dietary section
    if (dietary.cuisinePreferences.length > 0) score += 40;
    if (dietary.restrictions.length > 0 || dietary.allergies.length > 0) score += 20;
    if (dietary.avoidIngredients.length > 0) score += 20;
    return Math.min(score, 100);
  }
  
  private scoreBudgetCompleteness(budget: UserPreferences['budget']): number {
    let score = 30; // Base for having defaults
    if (budget.dining.max !== 50) score += 30; // User customized
    if (budget.flexibility !== 'flexible') score += 20;
    if (budget.transportation.max !== 30) score += 20;
    return Math.min(score, 100);
  }
  
  private scoreTransportCompleteness(transport: UserPreferences['transportation']): number {
    let score = 40; // Good defaults
    if (transport.preferredServices.length > 0) score += 30;
    if (transport.maxWalkMinutes !== 10) score += 15;
    if (transport.accessibilityNeeds.length > 0) score += 15;
    return Math.min(score, 100);
  }
  
  private scoreVenueCompleteness(venue: UserPreferences['venue']): number {
    let score = 20;
    if (venue.ambiancePreferences.length > 0) score += 40;
    if (venue.seatingPreferences.length > 0) score += 20;
    if (venue.accessibilityNeeds.length > 0) score += 20;
    return Math.min(score, 100);
  }
  
  private scoreSchedulingCompleteness(scheduling: UserPreferences['scheduling']): number {
    let score = 30; // Timezone set
    if (Object.keys(scheduling.preferredMealTimes).length > 0) score += 40;
    if (scheduling.avoidDays.length > 0) score += 30;
    return Math.min(score, 100);
  }
  
  private scoreLocationCompleteness(location: UserPreferences['location']): number {
    let score = 20;
    if (location.home) score += 25;
    if (location.work) score += 15;
    if (location.preferredAreas.length > 0) score += 40;
    return Math.min(score, 100);
  }
  
  // =========================================================================
  // GROUP AGGREGATION
  // =========================================================================
  
  /**
   * Aggregate preferences for a group of users
   * Used for group outings like Girls Night Out
   */
  aggregateGroupPreferences(
    userIds: string[],
    category: string = 'dining'
  ): GroupPreferences {
    const preferences = userIds
      .map(id => this.getPreferences(id))
      .filter((p): p is UserPreferences => p !== null);
    
    if (preferences.length === 0) {
      throw new Error('No preferences found for any group members');
    }
    
    // Aggregate dietary restrictions (union - if anyone has a restriction, include it)
    const requiredRestrictions = [...new Set(
      preferences.flatMap(p => p.dietary.restrictions)
    )];
    
    const requiredAllergenFree = [...new Set(
      preferences.flatMap(p => p.dietary.allergies)
    )];
    
    const requiredAccessibility = [...new Set(
      preferences.flatMap(p => [
        ...p.transportation.accessibilityNeeds,
        ...p.venue.accessibilityNeeds,
      ])
    )];
    
    // Budget: use the lowest max (most restrictive)
    const budgets = preferences.map(p => p.budget.dining);
    const minBudget = Math.min(...budgets.map(b => b.min));
    const maxBudget = Math.min(...budgets.map(b => b.max));
    
    // Cuisine scores: average across group
    const cuisineScores = this.aggregateCuisineScores(preferences);
    
    // Ambiance scores: average across group
    const ambianceScores = this.aggregateAmbianceScores(preferences);
    
    // Detect conflicts
    const conflicts = this.detectConflicts(preferences, category);
    
    return {
      userIds,
      requiredRestrictions,
      requiredAllergenFree,
      requiredAccessibility,
      budgetRange: {
        min: minBudget,
        max: maxBudget,
        perPerson: maxBudget,
      },
      cuisineScores,
      ambianceScores,
      conflicts,
      computedAt: new Date(),
    };
  }
  
  /**
   * Average cuisine preferences across group
   */
  private aggregateCuisineScores(
    preferences: UserPreferences[]
  ): Map<string, number> {
    const scores = new Map<string, { sum: number; count: number }>();
    
    for (const pref of preferences) {
      for (const cuisine of pref.dietary.cuisinePreferences) {
        const existing = scores.get(cuisine.cuisine) ?? { sum: 0, count: 0 };
        existing.sum += cuisine.score;
        existing.count += 1;
        scores.set(cuisine.cuisine, existing);
      }
    }
    
    const averaged = new Map<string, number>();
    for (const [cuisine, data] of scores) {
      averaged.set(cuisine, data.sum / data.count);
    }
    
    return averaged;
  }
  
  /**
   * Average ambiance preferences across group
   */
  private aggregateAmbianceScores(
    preferences: UserPreferences[]
  ): Map<string, number> {
    const counts = new Map<string, number>();
    
    for (const pref of preferences) {
      for (const ambiance of pref.venue.ambiancePreferences) {
        counts.set(ambiance, (counts.get(ambiance) ?? 0) + 1);
      }
    }
    
    // Convert to score (percentage of group who prefer this)
    const scores = new Map<string, number>();
    for (const [ambiance, count] of counts) {
      scores.set(ambiance, count / preferences.length);
    }
    
    return scores;
  }
  
  /**
   * Detect preference conflicts in a group
   */
  detectConflicts(
    preferences: UserPreferences[],
    _category: string
  ): PreferenceConflict[] {
    const conflicts: PreferenceConflict[] = [];
    
    // Check budget conflicts
    const budgets = preferences.map(p => ({
      userId: p.userId,
      max: p.budget.dining.max,
      flexibility: p.budget.flexibility,
    }));
    
    const strictBudgets = budgets.filter(b => b.flexibility === 'strict');
    const lowestMax = Math.min(...budgets.map(b => b.max));
    const highestMax = Math.max(...budgets.map(b => b.max));
    
    if (highestMax - lowestMax > 30 && strictBudgets.length > 0) {
      conflicts.push({
        type: 'budget',
        description: `Budget range varies significantly ($${lowestMax} - $${highestMax})`,
        affectedUsers: strictBudgets.map(b => b.userId),
        suggestions: [
          `Consider venues in the $${lowestMax}-${lowestMax + 15} range`,
          'Some members may need to splurge a bit',
        ],
      });
    }
    
    // Check cuisine conflicts (someone loves what another hates)
    const cuisineConflicts = this.findCuisineConflicts(preferences);
    conflicts.push(...cuisineConflicts);
    
    return conflicts;
  }
  
  private findCuisineConflicts(
    preferences: UserPreferences[]
  ): PreferenceConflict[] {
    const conflicts: PreferenceConflict[] = [];
    const cuisineByUser = new Map<string, Map<string, number>>();
    
    for (const pref of preferences) {
      const userCuisines = new Map<string, number>();
      for (const cuisine of pref.dietary.cuisinePreferences) {
        userCuisines.set(cuisine.cuisine, cuisine.score);
      }
      cuisineByUser.set(pref.userId, userCuisines);
    }
    
    // Find cuisines where one person loves (>0.5) and another hates (<-0.5)
    const allCuisines = new Set(
      preferences.flatMap(p => p.dietary.cuisinePreferences.map(c => c.cuisine))
    );
    
    for (const cuisine of allCuisines) {
      const lovers: string[] = [];
      const haters: string[] = [];
      
      for (const [userId, scores] of cuisineByUser) {
        const score = scores.get(cuisine);
        if (score !== undefined) {
          if (score > 0.5) lovers.push(userId);
          if (score < -0.5) haters.push(userId);
        }
      }
      
      if (lovers.length > 0 && haters.length > 0) {
        conflicts.push({
          type: 'cuisine',
          description: `${cuisine} is loved by some and disliked by others`,
          affectedUsers: [...lovers, ...haters],
          suggestions: [
            `Consider a ${cuisine} fusion place with other options`,
            'Choose a different cuisine everyone enjoys',
          ],
        });
      }
    }
    
    return conflicts;
  }
  
  // =========================================================================
  // SEARCH FILTERS GENERATION
  // =========================================================================
  
  /**
   * Generate search filters from user preferences
   */
  generateSearchFilters(
    userId: string,
    category: string
  ): SearchFilters {
    const prefs = this.getPreferences(userId);
    if (!prefs) {
      return {}; // No preferences, no filters
    }
    
    const filters: SearchFilters = {
      category,
    };
    
    // Location
    if (prefs.location.home) {
      filters.location = prefs.location.home;
      filters.radius = prefs.location.maxTravelMinutes / 2; // Rough estimate
    }
    
    // Budget
    if (category === 'dining') {
      filters.priceRange = prefs.budget.dining;
    }
    
    return filters;
  }
  
  /**
   * Generate search filters for a group
   */
  generateGroupSearchFilters(
    userIds: string[],
    category: string
  ): SearchFilters {
    const groupPrefs = this.aggregateGroupPreferences(userIds, category);
    
    const filters: SearchFilters = {
      category,
      priceRange: {
        min: groupPrefs.budgetRange.min,
        max: groupPrefs.budgetRange.max,
        currency: 'USD',
      },
    };
    
    // Find a central location among group members
    const locations = userIds
      .map(id => this.getPreferences(id)?.location.home)
      .filter((l): l is GeoPoint => l !== undefined);
    
    if (locations.length > 0) {
      filters.location = this.findCentroid(locations);
      filters.radius = 10; // 10 mile radius from centroid
    }
    
    return filters;
  }
  
  /**
   * Find geographic center of multiple points
   */
  private findCentroid(points: GeoPoint[]): GeoPoint {
    const avgLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const avgLng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat: avgLat, lng: avgLng };
  }
}

// Export singleton instance
export const preferenceService = new PreferenceService();
