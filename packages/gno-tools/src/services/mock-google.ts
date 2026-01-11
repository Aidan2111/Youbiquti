// Mock Google Maps Service - Simulates Google Maps API responses

import type { DirectionsRequest, DirectionsResult, GeoPoint } from '@youbiquti/core';
import { calculateDistance, estimateDrivingTime, DALLAS_NEIGHBORHOODS } from '@youbiquti/core';

/**
 * Mock Google Maps service for directions and geocoding
 * This will be replaced with real Google Maps API integration later
 */
export class MockGoogleMapsService {
  private readonly apiDelay: number;

  constructor(options: { apiDelay?: number } = {}) {
    this.apiDelay = options.apiDelay ?? 150;
  }

  /**
   * Simulate API delay
   */
  private async simulateLatency(): Promise<void> {
    return new Promise(resolve => globalThis.setTimeout(resolve, this.apiDelay));
  }

  /**
   * Parse a location string to coordinates
   * Uses known Dallas neighborhoods or falls back to mock coords
   */
  private parseLocation(location: string): GeoPoint {
    const locationLower = location.toLowerCase();
    
    // Check known neighborhoods
    for (const [name, coords] of Object.entries(DALLAS_NEIGHBORHOODS)) {
      if (locationLower.includes(name.toLowerCase())) {
        return coords;
      }
    }
    
    // Default to downtown Dallas
    return DALLAS_NEIGHBORHOODS['downtown'] ?? { lat: 32.7767, lng: -96.7970 };
  }

  /**
   * Get directions between two points
   */
  async getDirections(request: DirectionsRequest): Promise<DirectionsResult> {
    await this.simulateLatency();

    const originCoords = this.parseLocation(request.origin);
    const destCoords = this.parseLocation(request.destination);

    const distanceMiles = calculateDistance(originCoords, destCoords);

    // Calculate duration based on mode
    let durationMinutes: number;
    let modeName: string;
    
    switch (request.mode) {
      case 'walking':
        durationMinutes = Math.round(distanceMiles * 20); // ~3 mph walking
        modeName = 'Walk';
        break;
      case 'bicycling':
        durationMinutes = Math.round(distanceMiles * 5); // ~12 mph cycling
        modeName = 'Bike';
        break;
      case 'transit':
        durationMinutes = Math.round(distanceMiles * 8 + 5); // Transit with wait time
        modeName = 'Transit';
        break;
      case 'driving':
      default:
        durationMinutes = estimateDrivingTime(distanceMiles);
        modeName = 'Drive';
        break;
    }

    // Generate mock step-by-step directions
    const steps = this.generateMockSteps(request.origin, request.destination, modeName);

    return {
      origin: request.origin,
      destination: request.destination,
      mode: request.mode ?? 'driving',
      distanceMiles: Math.round(distanceMiles * 10) / 10,
      durationMinutes,
      steps,
      polyline: this.generateMockPolyline(originCoords, destCoords),
      trafficCondition: this.getTrafficCondition(),
      source: 'mock-google',
    };
  }

  /**
   * Generate mock step-by-step directions
   */
  private generateMockSteps(origin: string, destination: string, mode: string): string[] {
    return [
      `Start at ${origin}`,
      `Head northeast on Main St`,
      `Turn right onto Commerce St`,
      `Continue for 0.5 miles`,
      `Turn left onto Elm St`,
      `${mode} for 0.8 miles`,
      `Turn right onto destination street`,
      `Arrive at ${destination}`,
    ];
  }

  /**
   * Generate a simple mock polyline
   */
  private generateMockPolyline(origin: GeoPoint, destination: GeoPoint): string {
    // In a real implementation, this would be an encoded polyline
    // For mock purposes, we just return a placeholder
    return `mock_polyline_${origin.lat.toFixed(4)}_${origin.lng.toFixed(4)}_to_${destination.lat.toFixed(4)}_${destination.lng.toFixed(4)}`;
  }

  /**
   * Get mock traffic condition based on time of day
   */
  private getTrafficCondition(): 'light' | 'moderate' | 'heavy' {
    const hour = new Date().getHours();
    
    // Rush hours
    if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
      return 'heavy';
    }
    
    // Midday/evening
    if ((hour >= 11 && hour <= 13) || (hour >= 19 && hour <= 21)) {
      return 'moderate';
    }
    
    return 'light';
  }

  /**
   * Geocode an address to coordinates
   */
  async geocode(address: string): Promise<GeoPoint> {
    await this.simulateLatency();
    return this.parseLocation(address);
  }

  /**
   * Reverse geocode coordinates to an address
   */
  async reverseGeocode(coords: GeoPoint): Promise<string> {
    await this.simulateLatency();
    
    // Find nearest neighborhood
    let nearestNeighborhood = 'Downtown Dallas';
    let minDistance = Infinity;
    
    for (const [name, point] of Object.entries(DALLAS_NEIGHBORHOODS)) {
      const distance = calculateDistance(coords, point);
      if (distance < minDistance) {
        minDistance = distance;
        nearestNeighborhood = name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
      }
    }
    
    return `${nearestNeighborhood}, Dallas, TX`;
  }
}

// Default instance
export const mockGoogleMapsService = new MockGoogleMapsService();
