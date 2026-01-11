// Geo utility functions

import type { GeoPoint } from '../types/provider.js';

/**
 * Calculate distance between two points using Haversine formula
 * @returns Distance in miles
 */
export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Estimate driving time based on distance
 * Assumes average speed of 25 mph for urban areas
 */
export function estimateDrivingTime(distanceMiles: number): number {
  const avgSpeedMph = 25;
  return Math.round((distanceMiles / avgSpeedMph) * 60); // minutes
}

/**
 * Estimate walking time based on distance
 * Assumes average walking speed of 3 mph
 */
export function estimateWalkingTime(distanceMiles: number): number {
  const avgSpeedMph = 3;
  return Math.round((distanceMiles / avgSpeedMph) * 60); // minutes
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
  if (miles < 0.1) {
    const feet = Math.round(miles * 5280);
    return `${feet} ft`;
  }
  if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  }
  return `${Math.round(miles)} mi`;
}

/**
 * Check if a point is within a radius of another point
 */
export function isWithinRadius(
  center: GeoPoint,
  point: GeoPoint,
  radiusMiles: number
): boolean {
  return calculateDistance(center, point) <= radiusMiles;
}

/**
 * Get bounding box for a center point and radius
 * Useful for initial database queries before precise filtering
 */
export function getBoundingBox(
  center: GeoPoint,
  radiusMiles: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const latDelta = radiusMiles / 69; // ~69 miles per degree latitude
  const lngDelta = radiusMiles / (69 * Math.cos(toRadians(center.lat)));

  return {
    minLat: center.lat - latDelta,
    maxLat: center.lat + latDelta,
    minLng: center.lng - lngDelta,
    maxLng: center.lng + lngDelta,
  };
}

// Dallas-specific neighborhood coordinates
export const DALLAS_NEIGHBORHOODS: Record<string, GeoPoint> = {
  'downtown': { lat: 32.7801, lng: -96.7997 },
  'uptown': { lat: 32.8012, lng: -96.7985 },
  'deep ellum': { lat: 32.7832, lng: -96.7843 },
  'bishop arts': { lat: 32.7479, lng: -96.8265 },
  'lower greenville': { lat: 32.8183, lng: -96.7700 },
  'oak lawn': { lat: 32.8115, lng: -96.8115 },
  'design district': { lat: 32.7903, lng: -96.8236 },
  'victory park': { lat: 32.7879, lng: -96.8087 },
  'knox-henderson': { lat: 32.8205, lng: -96.7852 },
  'lakewood': { lat: 32.8231, lng: -96.7474 },
};

/**
 * Parse location string to get coordinates
 * Handles neighborhood names for Dallas
 */
export function parseLocation(location: string): GeoPoint | null {
  const normalized = location.toLowerCase().trim();
  
  // Check Dallas neighborhoods
  for (const [name, coords] of Object.entries(DALLAS_NEIGHBORHOODS)) {
    if (normalized.includes(name)) {
      return coords;
    }
  }
  
  // Check if it mentions Dallas generally
  if (normalized.includes('dallas')) {
    return DALLAS_NEIGHBORHOODS['downtown'] ?? null;
  }
  
  return null;
}
