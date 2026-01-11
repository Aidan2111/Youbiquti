// Mock Availability Service - Simulates OpenTable/Resy API responses

import type { AvailabilityRequest, AvailabilityResult, Restaurant, Bar } from '@youbiquti/core';
import { dallasRestaurants } from '../data/dallas-restaurants.js';
import { dallasBars } from '../data/dallas-bars.js';

interface TimeSlot {
  time: string;
  available: boolean;
  partySize: number;
}

/**
 * Mock Availability service for checking restaurant/bar availability
 * This will be replaced with real OpenTable/Resy integration later
 */
export class MockAvailabilityService {
  private readonly apiDelay: number;

  constructor(options: { apiDelay?: number } = {}) {
    this.apiDelay = options.apiDelay ?? 300;
  }

  /**
   * Simulate API delay
   */
  private async simulateLatency(): Promise<void> {
    return new Promise(resolve => globalThis.setTimeout(resolve, this.apiDelay));
  }

  /**
   * Generate available time slots for a venue
   */
  private generateTimeSlots(
    _date: string,
    partySize: number,
    preferredTime?: string
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const targetHour = preferredTime 
      ? parseInt(preferredTime.split(':')[0] ?? '19') 
      : 19;
    
    // Generate slots around the preferred time
    for (let hour = targetHour - 1; hour <= targetHour + 2; hour++) {
      for (const minute of ['00', '30']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        
        // Simulate availability (80% chance of being available, less for large parties)
        const availabilityChance = partySize > 4 ? 0.5 : partySize > 6 ? 0.3 : 0.8;
        const available = Math.random() < availabilityChance;
        
        slots.push({
          time,
          available,
          partySize,
        });
      }
    }
    
    return slots;
  }

  /**
   * Check availability for a venue
   */
  async checkAvailability(request: AvailabilityRequest): Promise<AvailabilityResult> {
    await this.simulateLatency();

    // Try to find the venue
    const restaurant = dallasRestaurants.find(r => r.id === request.venueId);
    const bar = dallasBars.find(b => b.id === request.venueId);
    const venue = restaurant ?? bar;

    if (!venue) {
      return {
        venueId: request.venueId,
        venueName: 'Unknown Venue',
        date: request.date,
        partySize: request.partySize,
        availableSlots: [],
        bookingUrl: null,
        source: 'mock-availability',
      };
    }

    const timeSlots = this.generateTimeSlots(
      request.date,
      request.partySize,
      request.preferredTime
    );

    const availableSlots = timeSlots
      .filter(slot => slot.available)
      .map(slot => slot.time);

    return {
      venueId: request.venueId,
      venueName: venue.name,
      date: request.date,
      partySize: request.partySize,
      availableSlots,
      bookingUrl: (venue as Restaurant).bookingUrl ?? null,
      source: 'mock-availability',
    };
  }

  /**
   * Check availability for multiple venues
   */
  async checkMultipleVenues(
    venueIds: string[],
    date: string,
    partySize: number,
    preferredTime?: string
  ): Promise<AvailabilityResult[]> {
    const results = await Promise.all(
      venueIds.map(venueId =>
        this.checkAvailability({
          venueId,
          date,
          partySize,
          preferredTime,
        })
      )
    );

    return results;
  }

  /**
   * Find venues with availability
   */
  async findAvailableVenues(params: {
    venueType: 'restaurant' | 'bar';
    date: string;
    partySize: number;
    preferredTime?: string;
    neighborhood?: string;
  }): Promise<AvailabilityResult[]> {
    await this.simulateLatency();

    let venues: (Restaurant | Bar)[] = 
      params.venueType === 'restaurant' ? dallasRestaurants : dallasBars;

    // Filter by neighborhood
    if (params.neighborhood) {
      const neighborhoodLower = params.neighborhood.toLowerCase();
      venues = venues.filter(v => 
        v.neighborhood.toLowerCase().includes(neighborhoodLower)
      );
    }

    // Check availability for each venue (limit to 10)
    const results = await Promise.all(
      venues.slice(0, 10).map(venue =>
        this.checkAvailability({
          venueId: venue.id,
          date: params.date,
          partySize: params.partySize,
          preferredTime: params.preferredTime,
        })
      )
    );

    // Return only venues with available slots
    return results.filter(r => r.availableSlots.length > 0);
  }
}

// Default instance
export const mockAvailabilityService = new MockAvailabilityService();
