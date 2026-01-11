// Zod Validation Schemas for The Service Graph

import { z } from 'zod';

// === User & Connection Schemas ===

export const UserSchema = z.object({
  id: z.string(),
  phone: z.string(),
  phoneHash: z.string(),
  displayName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  profileImageUrl: z.string().url().optional(),
  createdAt: z.date(),
  lastActiveAt: z.date(),
});

export const ConnectionSchema = z.object({
  id: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  toUserName: z.string(),
  degree: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  source: z.enum(['contacts', 'manual', 'mutual']),
  strength: z.number().min(0).max(1),
  createdAt: z.date(),
});

// === Provider Schemas ===

export const GeoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const ProviderSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  type: z.enum(['individual', 'business']),
  displayName: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  profileImageUrl: z.string().url().optional(),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  verificationStatus: z.enum(['pending', 'in_progress', 'verified', 'rejected']),
  globalRating: z.number().min(0).max(5),
  globalReviewCount: z.number().int().min(0),
  status: z.enum(['active', 'paused', 'suspended', 'inactive']),
  createdAt: z.date(),
});

// === Trust Schemas ===

export const TrustScoreSchema = z.object({
  providerId: z.string(),
  score: z.number().min(0).max(100),
  degree: z.union([z.literal(1), z.literal(2), z.literal(3), z.null()]),
  networkReviewCount: z.number().int().min(0),
  networkAvgRating: z.number().min(0).max(5),
  endorsementCount: z.number().int().min(0),
  globalRating: z.number().min(0).max(5),
  components: z.object({
    connectionScore: z.number(),
    reviewScore: z.number(),
    endorsementScore: z.number(),
    globalScore: z.number(),
  }),
  computedAt: z.date(),
});

// === Preference Schemas ===

export const BudgetRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: z.string().length(3),
});

export const TimeRangeSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});

export const UserPreferencesSchema = z.object({
  userId: z.string(),
  dietary: z.object({
    restrictions: z.array(z.string()),
    allergies: z.array(z.string()),
    cuisinePreferences: z.array(z.object({
      cuisine: z.string(),
      score: z.number().min(-1).max(1),
    })),
    avoidIngredients: z.array(z.string()),
  }),
  budget: z.object({
    dining: BudgetRangeSchema,
    transportation: BudgetRangeSchema,
    services: BudgetRangeSchema,
    flexibility: z.enum(['strict', 'flexible', 'splurge_ok']),
  }),
  transportation: z.object({
    preferredServices: z.array(z.string()),
    shareRidesOk: z.boolean(),
    maxWalkMinutes: z.number().int().min(0),
    accessibilityNeeds: z.array(z.string()),
  }),
  venue: z.object({
    ambiancePreferences: z.array(z.string()),
    seatingPreferences: z.array(z.string()),
    accessibilityNeeds: z.array(z.string()),
  }),
  scheduling: z.object({
    preferredMealTimes: z.record(TimeRangeSchema),
    avoidDays: z.array(z.number().int().min(0).max(6)),
    timezone: z.string(),
  }),
  location: z.object({
    home: GeoPointSchema.optional(),
    work: GeoPointSchema.optional(),
    preferredAreas: z.array(z.string()),
    avoidAreas: z.array(z.string()),
    maxTravelMinutes: z.number().int().min(0),
  }),
  completenessScore: z.number().min(0).max(100),
  lastUpdated: z.date(),
});

// === GNO Tool Schemas ===

export const SearchRestaurantsRequestSchema = z.object({
  location: z.string().min(1),
  cuisine: z.string().optional(),
  priceLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  partySize: z.number().int().min(1).max(20),
  vibes: z.array(z.string()).optional(),
});

export const SearchBarsRequestSchema = z.object({
  location: z.string().min(1),
  vibes: z.array(z.string()).optional(),
  priceLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  openLate: z.boolean().optional(),
});

export const SearchEventsRequestSchema = z.object({
  location: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  categories: z.array(z.string()).optional(),
});

export const GetRideshareEstimateRequestSchema = z.object({
  pickupAddress: z.string().min(1),
  dropoffAddress: z.string().min(1),
  passengerCount: z.number().int().min(1).max(8).optional(),
});

export const GetDirectionsRequestSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  mode: z.enum(['walking', 'driving', 'transit']),
});

export const CheckAvailabilityRequestSchema = z.object({
  venueId: z.string(),
  venueName: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  partySize: z.number().int().min(1).max(20),
});

export const RestaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  cuisine: z.string(),
  priceLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  address: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  phone: z.string().optional(),
  vibes: z.array(z.string()),
  dietaryOptions: z.array(z.string()),
  features: z.array(z.string()),
  photos: z.array(z.string()),
  yelpUrl: z.string().url(),
  bookingUrl: z.string().url().optional(),
  coordinates: GeoPointSchema,
});

export const BarSchema = z.object({
  id: z.string(),
  name: z.string(),
  barType: z.string(),
  priceLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  address: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  phone: z.string().optional(),
  vibes: z.array(z.string()),
  musicType: z.string().optional(),
  dressCode: z.string().optional(),
  features: z.array(z.string()),
  photos: z.array(z.string()),
  yelpUrl: z.string().url(),
  coordinates: GeoPointSchema,
});

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  venue: z.string(),
  venueAddress: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  category: z.string(),
  price: z.number().min(0),
  priceRange: z.object({ min: z.number(), max: z.number() }).optional(),
  ticketUrl: z.string().url().optional(),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  coordinates: GeoPointSchema,
});

// Type inference helpers
export type SearchRestaurantsInput = z.infer<typeof SearchRestaurantsRequestSchema>;
export type SearchBarsInput = z.infer<typeof SearchBarsRequestSchema>;
export type SearchEventsInput = z.infer<typeof SearchEventsRequestSchema>;
export type GetRideshareInput = z.infer<typeof GetRideshareEstimateRequestSchema>;
export type GetDirectionsInput = z.infer<typeof GetDirectionsRequestSchema>;
export type CheckAvailabilityInput = z.infer<typeof CheckAvailabilityRequestSchema>;
