// Mock Rideshare Service - Simulates Uber/Lyft API responses

import type { RideshareRequest, RideshareEstimate, GeoPoint } from '@youbiquti/core';
import { calculateDistance, estimateDrivingTime, DALLAS_NEIGHBORHOODS } from '@youbiquti/core';

interface RideshareOption {
  type: 'economy' | 'standard' | 'premium' | 'xl';
  displayName: string;
  basePrice: number;
  perMile: number;
  perMinute: number;
  capacity: number;
  etaMinutes: { min: number; max: number };
}

const RIDESHARE_OPTIONS: RideshareOption[] = [
  {
    type: 'economy',
    displayName: 'UberX / Lyft',
    basePrice: 2.50,
    perMile: 1.25,
    perMinute: 0.20,
    capacity: 4,
    etaMinutes: { min: 3, max: 8 },
  },
  {
    type: 'standard',
    displayName: 'Uber Comfort / Lyft XL',
    basePrice: 4.00,
    perMile: 1.75,
    perMinute: 0.30,
    capacity: 4,
    etaMinutes: { min: 5, max: 12 },
  },
  {
    type: 'premium',
    displayName: 'Uber Black / Lyft Lux',
    basePrice: 8.00,
    perMile: 3.50,
    perMinute: 0.50,
    capacity: 4,
    etaMinutes: { min: 8, max: 15 },
  },
  {
    type: 'xl',
    displayName: 'UberXL / Lyft XL',
    basePrice: 5.00,
    perMile: 2.25,
    perMinute: 0.35,
    capacity: 6,
    etaMinutes: { min: 5, max: 15 },
  },
];

/**
 * Mock Rideshare service for Uber/Lyft estimates
 * This simulates what real rideshare APIs would return
 */
export class MockRideshareService {
  private readonly apiDelay: number;

  constructor(options: { apiDelay?: number } = {}) {
    this.apiDelay = options.apiDelay ?? 250;
  }

  /**
   * Simulate API delay
   */
  private async simulateLatency(): Promise<void> {
    return new Promise(resolve => globalThis.setTimeout(resolve, this.apiDelay));
  }

  /**
   * Parse a location string to coordinates
   */
  private parseLocation(location: string): GeoPoint {
    const locationLower = location.toLowerCase();
    
    for (const [name, coords] of Object.entries(DALLAS_NEIGHBORHOODS)) {
      if (locationLower.includes(name.toLowerCase())) {
        return coords;
      }
    }
    
    return DALLAS_NEIGHBORHOODS['downtown'] ?? { lat: 32.7767, lng: -96.7970 };
  }

  /**
   * Get surge multiplier based on time of day and day of week
   */
  private getSurgeMultiplier(): number {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    
    // Weekend nights (Friday/Saturday 10pm-2am)
    if ((dayOfWeek === 5 || dayOfWeek === 6) && (hour >= 22 || hour <= 2)) {
      return 1.5 + Math.random() * 0.5; // 1.5x - 2.0x
    }
    
    // Rush hours (weekdays 7-9am, 4-7pm)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
        return 1.2 + Math.random() * 0.3; // 1.2x - 1.5x
      }
    }
    
    // Normal hours
    return 1.0;
  }

  /**
   * Get rideshare estimates
   */
  async getEstimate(request: RideshareRequest): Promise<RideshareEstimate> {
    await this.simulateLatency();

    const originCoords = this.parseLocation(request.origin);
    const destCoords = this.parseLocation(request.destination);

    const distanceMiles = calculateDistance(originCoords, destCoords);

    const durationMinutes = estimateDrivingTime(distanceMiles);
    const surgeMultiplier = this.getSurgeMultiplier();

    // Filter options based on party size
    let availableOptions = RIDESHARE_OPTIONS;
    if (request.partySize && request.partySize > 4) {
      availableOptions = RIDESHARE_OPTIONS.filter(o => o.capacity >= request.partySize!);
    }

    // Calculate prices for each option
    const options = availableOptions.map(option => {
      const basePrice = option.basePrice + 
        (distanceMiles * option.perMile) + 
        (durationMinutes * option.perMinute);
      
      const adjustedPrice = basePrice * surgeMultiplier;
      
      // Add some variance for price range
      const priceMin = Math.round(adjustedPrice * 0.9 * 100) / 100;
      const priceMax = Math.round(adjustedPrice * 1.1 * 100) / 100;

      return {
        type: option.type,
        displayName: option.displayName,
        priceEstimate: {
          min: priceMin,
          max: priceMax,
          currency: 'USD',
        },
        etaMinutes: Math.round(
          option.etaMinutes.min + 
          Math.random() * (option.etaMinutes.max - option.etaMinutes.min)
        ),
        capacity: option.capacity,
      };
    });

    return {
      origin: request.origin,
      destination: request.destination,
      distanceMiles: Math.round(distanceMiles * 10) / 10,
      durationMinutes,
      options,
      surgeMultiplier: Math.round(surgeMultiplier * 10) / 10,
      requestedAt: new Date().toISOString(),
      source: 'mock-rideshare',
    };
  }

  /**
   * Get price estimate for a specific ride type
   */
  async getPriceForType(
    request: RideshareRequest,
    type: 'economy' | 'standard' | 'premium' | 'xl'
  ): Promise<{ min: number; max: number; currency: string } | null> {
    const estimate = await this.getEstimate(request);
    const option = estimate.options.find(o => o.type === type);
    return option?.priceEstimate ?? null;
  }
}

// Default instance
export const mockRideshareService = new MockRideshareService();
