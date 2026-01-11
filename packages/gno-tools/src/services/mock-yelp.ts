// Mock Yelp Service - Simulates Yelp API responses

import type { Restaurant, Bar, SearchRestaurantsRequest, SearchBarsRequest } from '@youbiquti/core';
import { searchDallasRestaurants } from '../data/dallas-restaurants.js';
import { searchDallasBars } from '../data/dallas-bars.js';

/**
 * Mock Yelp API service for restaurant and bar searches
 * This will be replaced with real Yelp API integration later
 */
export class MockYelpService {
  private readonly apiDelay: number;

  constructor(options: { apiDelay?: number } = {}) {
    this.apiDelay = options.apiDelay ?? 200; // Simulate API latency
  }

  /**
   * Simulate API delay
   */
  private async simulateLatency(): Promise<void> {
    return new Promise<void>(resolve => globalThis.setTimeout(resolve, this.apiDelay));
  }

  /**
   * Search for restaurants
   */
  async searchRestaurants(request: SearchRestaurantsRequest): Promise<{
    restaurants: Restaurant[];
    total: number;
    source: 'mock-yelp';
  }> {
    await this.simulateLatency();

    const restaurants = searchDallasRestaurants({
      location: request.location,
      cuisine: request.cuisine,
      priceLevel: request.priceLevel,
      vibes: request.vibes,
      limit: request.limit ?? 10,
    });

    return {
      restaurants,
      total: restaurants.length,
      source: 'mock-yelp',
    };
  }

  /**
   * Search for bars
   */
  async searchBars(request: SearchBarsRequest): Promise<{
    bars: Bar[];
    total: number;
    source: 'mock-yelp';
  }> {
    await this.simulateLatency();

    const bars = searchDallasBars({
      location: request.location,
      vibes: request.vibes,
      priceLevel: request.priceLevel,
      openLate: request.openLate,
      barType: request.barType,
      limit: request.limit ?? 10,
    });

    return {
      bars,
      total: bars.length,
      source: 'mock-yelp',
    };
  }

  /**
   * Get restaurant by ID
   */
  async getRestaurant(id: string): Promise<Restaurant | null> {
    await this.simulateLatency();
    const results = searchDallasRestaurants({});
    return results.find(r => r.id === id) ?? null;
  }

  /**
   * Get bar by ID
   */
  async getBar(id: string): Promise<Bar | null> {
    await this.simulateLatency();
    const results = searchDallasBars({});
    return results.find(b => b.id === id) ?? null;
  }
}

// Default instance
export const mockYelpService = new MockYelpService();
