// Mock Events Service - Simulates Eventbrite/Ticketmaster API responses

import type { Event, SearchEventsRequest } from '@youbiquti/core';
import { searchDallasEvents, getThisWeekendEvents, dallasEvents } from '../data/dallas-events.js';

/**
 * Mock Events service for event searches
 * This will be replaced with real Eventbrite/Ticketmaster integration later
 */
export class MockEventsService {
  private readonly apiDelay: number;

  constructor(options: { apiDelay?: number } = {}) {
    this.apiDelay = options.apiDelay ?? 200;
  }

  /**
   * Simulate API delay
   */
  private async simulateLatency(): Promise<void> {
    return new Promise<void>(resolve => globalThis.setTimeout(resolve, this.apiDelay));
  }

  /**
   * Search for events
   */
  async searchEvents(request: SearchEventsRequest): Promise<{
    events: Event[];
    total: number;
    source: 'mock-events';
  }> {
    await this.simulateLatency();

    // Parse date range from request
    let dateRange: { start: Date; end: Date } | undefined;
    if (request.dateRange) {
      dateRange = {
        start: new Date(request.dateRange.start),
        end: new Date(request.dateRange.end),
      };
    }

    const events = searchDallasEvents({
      location: request.location,
      eventType: request.eventType,
      vibes: request.vibes,
      priceLevel: request.priceLevel,
      dateRange,
      limit: request.limit ?? 10,
    });

    return {
      events,
      total: events.length,
      source: 'mock-events',
    };
  }

  /**
   * Get events happening this weekend
   */
  async getWeekendEvents(): Promise<{
    events: Event[];
    total: number;
    source: 'mock-events';
  }> {
    await this.simulateLatency();

    const events = getThisWeekendEvents();

    return {
      events,
      total: events.length,
      source: 'mock-events',
    };
  }

  /**
   * Get event by ID
   */
  async getEvent(id: string): Promise<Event | null> {
    await this.simulateLatency();
    return dallasEvents.find(e => e.id === id) ?? null;
  }

  /**
   * Get events by type
   */
  async getEventsByType(eventType: string, limit?: number): Promise<Event[]> {
    await this.simulateLatency();
    
    let events = dallasEvents.filter(e => 
      e.eventType.toLowerCase() === eventType.toLowerCase()
    );
    
    // Sort by date
    events.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    if (limit) {
      events = events.slice(0, limit);
    }
    
    return events;
  }

  /**
   * Get events suitable for girls night
   */
  async getGirlsNightEvents(limit?: number): Promise<Event[]> {
    await this.simulateLatency();
    
    const girlsNightVibes = ['girls night', 'fun', 'dance', 'social', 'creative'];
    
    let events = dallasEvents.filter(e =>
      e.vibes.some(v => 
        girlsNightVibes.some(gv => v.toLowerCase().includes(gv))
      )
    );
    
    // Sort by date
    events.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    if (limit) {
      events = events.slice(0, limit);
    }
    
    return events;
  }
}

// Default instance
export const mockEventsService = new MockEventsService();
