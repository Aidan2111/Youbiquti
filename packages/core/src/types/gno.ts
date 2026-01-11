// Girls Night Out Specific Types

import type { GeoPoint } from './provider.js';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: 1 | 2 | 3 | 4;
  rating: number;
  reviewCount: number;
  address: string;
  neighborhood: string;
  city: string;
  phone?: string;
  hours: BusinessHours;
  vibes: string[];
  dietaryOptions: string[];
  features: string[];
  photos: string[];
  yelpUrl: string;
  bookingUrl?: string;
  coordinates: GeoPoint;
}

export interface Bar {
  id: string;
  name: string;
  barType: string; // 'cocktail', 'wine', 'sports', 'dive', 'rooftop', 'club'
  priceLevel: 1 | 2 | 3 | 4;
  rating: number;
  reviewCount: number;
  address: string;
  neighborhood: string;
  city: string;
  phone?: string;
  hours: BusinessHours;
  vibes: string[];
  musicType?: string;
  dressCode?: string;
  features: string[];
  photos: string[];
  yelpUrl: string;
  coordinates: GeoPoint;
}

export interface Event {
  id: string;
  name: string;
  eventType: string; // 'concert', 'comedy', 'art', 'food', 'festival', 'dance', etc.
  venue: string;
  address: string;
  neighborhood: string;
  city: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  priceLevel: 1 | 2 | 3 | 4;
  ticketPrice: { min: number; max: number; currency: string };
  description: string;
  vibes: string[];
  ageRestriction: string;
  features: string[];
  photos: string[];
  ticketUrl?: string;
  coordinates: GeoPoint;
}

export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // HH:MM
  close: string; // HH:MM
  closed?: boolean;
}

export interface DirectionsRequest {
  origin: string;
  destination: string;
  mode?: 'walking' | 'driving' | 'transit' | 'bicycling';
}

export interface DirectionsResult {
  origin: string;
  destination: string;
  mode: string;
  distanceMiles: number;
  durationMinutes: number;
  steps: string[];
  polyline: string;
  trafficCondition: 'light' | 'moderate' | 'heavy';
  source: string;
}

export interface RideshareRequest {
  origin: string;
  destination: string;
  partySize?: number;
}

export interface RideshareOption {
  type: 'economy' | 'standard' | 'premium' | 'xl';
  displayName: string;
  priceEstimate: { min: number; max: number; currency: string };
  etaMinutes: number;
  capacity: number;
}

export interface RideshareEstimate {
  origin: string;
  destination: string;
  distanceMiles: number;
  durationMinutes: number;
  options: RideshareOption[];
  surgeMultiplier: number;
  requestedAt: string;
  source: string;
}

export interface AvailabilityRequest {
  venueId: string;
  date: string;
  partySize: number;
  preferredTime?: string;
}

export interface AvailabilityResult {
  venueId: string;
  venueName: string;
  date: string;
  partySize: number;
  availableSlots: string[];
  bookingUrl: string | null;
  source: string;
}

// Tool Request/Response Types

export interface SearchRestaurantsRequest {
  location?: string;
  cuisine?: string;
  priceLevel?: 1 | 2 | 3 | 4;
  partySize?: number;
  vibes?: string[];
  userId?: string;
  limit?: number;
}

export interface SearchRestaurantsResponse {
  restaurants: Restaurant[];
  total: number;
  searchedAt: string;
}

export interface SearchBarsRequest {
  location?: string;
  vibes?: string[];
  priceLevel?: 1 | 2 | 3 | 4;
  openLate?: boolean;
  barType?: string;
  limit?: number;
}

export interface SearchBarsResponse {
  bars: Bar[];
  total: number;
  searchedAt: string;
}

export interface SearchEventsRequest {
  location?: string;
  eventType?: string;
  vibes?: string[];
  priceLevel?: 1 | 2 | 3 | 4;
  dateRange?: { start: string; end: string };
  limit?: number;
}

export interface SearchEventsResponse {
  events: Event[];
  total: number;
  searchedAt: string;
}

export interface ToolResponse<T> {
  success: boolean;
  results: T[];
  resultCount: number;
  error?: string;
}
