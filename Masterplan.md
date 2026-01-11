# The Service Graph
## A Trust-Weighted Commerce Protocol

**Version:** 1.0  
**Date:** January 2026

---

## Executive Summary

The Service Graph is a **commerce infrastructure layer** that connects buyers (people requesting services) with sellers (service providers) through a trust-weighted matching engine powered by social graph data.

Think of it as:
- **The order book** that matches buy and sell orders
- **The trust layer** that uses your real-world relationships to verify quality
- **The smart router** that finds the right provider based on preferences, availability, price, and social proof

Any application can plug into The Service Graph to offer socially-verified services to their users.

---

## 1. The Problem We Solve

### Current State: Fragmented, Anonymous Marketplaces

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Uber     │     │   DoorDash  │     │    Yelp     │
│  (rides)    │     │  (delivery) │     │  (reviews)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────┐
│                      CONSUMER                        │
│                                                      │
│  • Different app for each service                   │
│  • Reviews from strangers (fake? paid? irrelevant?) │
│  • No coordination between services                  │
│  • No memory of preferences                          │
│  • Can't leverage personal network                   │
└─────────────────────────────────────────────────────┘
```

**Pain points:**
- I want a restaurant my mom would recommend, not a stranger
- I want a driver my coworker vouched for
- I want to plan dinner + drinks + rides without 4 apps
- I want my dietary restrictions remembered everywhere
- I don't trust anonymous 4.8-star ratings

### Future State: Unified, Trust-Weighted Commerce

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │ Girls Night  │ │  DriverFirst │ │  HomeHelper  │ │ Partner    │  │
│  │ Out App      │ │  App         │ │  App         │ │ API Users  │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                      THE SERVICE GRAPH                               │
│                   Commerce Protocol Layer                            │
│                                                                      │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│   │  Matching   │ │   Social    │ │ Preference  │ │ Transaction │   │
│   │  Engine     │ │   Graph     │ │   Engine    │ │   Engine    │   │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVICE PROVIDERS                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │  Individual  │ │  Restaurants │ │   Drivers    │ │ Any Service│  │
│  │  Providers   │ │              │ │              │ │ Business   │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Concepts

### 2.1 The Order Book Model

Just like a stock exchange matches buy orders with sell orders, The Service Graph matches **service requests** with **service offerings**.

```
                        THE ORDER BOOK
                              
     BUY SIDE (Requests)          SELL SIDE (Offerings)
    ┌─────────────────────┐      ┌─────────────────────┐
    │ "I need a ride to   │      │ "I drive in NYC,    │
    │  JFK at 3pm, will   │◄────►│  available now,     │
    │  pay up to $60"     │      │  $45-70 to JFK"     │
    ├─────────────────────┤      ├─────────────────────┤
    │ "Dinner for 4,      │      │ "Italian restaurant │
    │  Italian, tonight,  │◄────►│  West Village,      │
    │  ~$60/person"       │      │  openings at 7,8,9" │
    ├─────────────────────┤      ├─────────────────────┤
    │ "House cleaning,    │      │ "Cleaning service,  │
    │  Saturday morning,  │◄────►│  weekends available │
    │  2BR apt, $100-150" │      │  $50/hr, 3hr min"   │
    └─────────────────────┘      └─────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │   MATCHING    │
            │    ENGINE     │
            │               │
            │ • Constraints │
            │ • Trust score │
            │ • Preferences │
            │ • Availability│
            │ • Price       │
            └───────────────┘
                    │
                    ▼
            ┌───────────────┐
            │    MATCHES    │
            │               │
            │ Ranked list   │
            │ of compatible │
            │ providers     │
            └───────────────┘
```

### 2.2 Trust-Weighted Matching

The key differentiator: **your social graph influences match ranking**.

```
Traditional Matching:
  Score = f(price, rating, availability, distance)
  
Service Graph Matching:
  Score = f(price, rating, availability, distance, TRUST_SCORE)
  
  where TRUST_SCORE = g(connection_distance, network_reviews, endorsements)
```

**Trust Score Components:**

| Factor | Weight | Description |
|--------|--------|-------------|
| Connection Distance | 40% | 1st degree = 100, 2nd = 60, 3rd = 30, none = 0 |
| Network Reviews | 35% | Weighted avg of reviews from YOUR network |
| Explicit Endorsements | 15% | "I vouch for this provider" from connections |
| Global Reputation | 10% | Fallback for providers outside your network |

**Example:**
```
Searching for a driver...

Provider A: 4.9★ global, but no network connection
  Trust Score: 10 (global only)

Provider B: 4.5★ global, your friend Mike used them 3x, rated 5★
  Trust Score: 85 (1st degree + positive review)

Provider C: 4.7★ global, friend-of-friend Sarah recommended
  Trust Score: 55 (2nd degree + endorsement)

Ranking: B > C > A (despite A having highest global rating)
```

### 2.3 The Social Graph

```
                         YOUR NETWORK
                              
                           ┌─────┐
                           │ YOU │
                           └──┬──┘
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
           ┌─────┐         ┌─────┐         ┌─────┐
           │Mike │         │Sarah│         │ Dad │
           │ 1°  │         │ 1°  │         │ 1°  │
           └──┬──┘         └──┬──┘         └──┬──┘
              │               │               │
        ┌─────┴─────┐    ┌────┴────┐    ┌────┴────┐
        ▼           ▼    ▼         ▼    ▼         ▼
     ┌─────┐    ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
     │Alex │    │ Jen │ │ Tom │ │Lisa │ │Uncle│ │Aunt │
     │ 2°  │    │ 2°  │ │ 2°  │ │ 2°  │ │ 2°  │ │ 2°  │
     └─────┘    └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
        │
        ▼
     ┌─────┐
     │ Pat │  ◄── 3° connection (friend of friend of friend)
     │ 3°  │
     └─────┘


When Pat (a driver) gets a 5★ review from Alex:
  → Alex is your 2nd degree connection
  → That review is weighted at 60% in YOUR trust calculation
  → But weighted at 100% for Mike (Alex is Mike's 1st degree)
```

### 2.4 Preference Intelligence

The platform learns and remembers user preferences across all services.

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER PREFERENCE PROFILE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DIETARY          │ BUDGET           │ TRANSPORTATION           │
│  ─────────────    │ ──────────────   │ ────────────────────     │
│  • Gluten-free    │ • Dining: $50-80 │ • Prefers Uber           │
│  • Loves Italian  │ • Transport: $30 │ • Okay with shared rides │
│  • Avoids Thai    │ • Flexible +20%  │ • Max 5 min walk         │
│                   │                  │                          │
│  VENUE            │ SCHEDULING       │ LOCATION                 │
│  ─────────────    │ ──────────────   │ ────────────────────     │
│  • Quiet > loud   │ • Dinner 7-9pm   │ • Home: Brooklyn         │
│  • Outdoor OK     │ • No Mondays     │ • Work: Manhattan        │
│  • Booth seating  │ • Calendar: Gcal │ • Will travel 30 min     │
│                   │                  │                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
            Automatically applied to all service requests
            Aggregated across groups for multi-user bookings
```

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│                                                                              │
│   Consumer Apps          Provider Apps           Partner Integrations        │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────────────┐      │
│  │ Mobile/Web  │        │ Mobile/Web  │        │ API / SDK / Webhooks│      │
│  │ Applications│        │ Dashboard   │        │ for 3rd Party Apps  │      │
│  └──────┬──────┘        └──────┬──────┘        └──────────┬──────────┘      │
└─────────┼──────────────────────┼─────────────────────────┼──────────────────┘
          │                      │                         │
          ▼                      ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY                                       │
│         Authentication │ Rate Limiting │ Routing │ Analytics                 │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                         THE SERVICE GRAPH CORE                               │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      REQUEST PROCESSING                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Request   │  │   Intent    │  │  Request    │  │Orchestration│   │  │
│  │  │   Intake    │─▶│   Parser    │─▶│Decomposition│─▶│  (if multi) │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                       │                                      │
│                                       ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       MATCHING ENGINE                                  │  │
│  │                                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  Candidate  │  │    Trust    │  │ Preference  │  │   Ranking   │   │  │
│  │  │   Query     │─▶│   Scoring   │─▶│   Scoring   │─▶│   & Filter  │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                       │                                      │
│         ┌─────────────────────────────┼─────────────────────────────┐       │
│         ▼                             ▼                             ▼       │
│  ┌─────────────┐              ┌─────────────┐              ┌─────────────┐  │
│  │   SOCIAL    │              │ PREFERENCE  │              │  SERVICE    │  │
│  │   GRAPH     │              │   ENGINE    │              │  REGISTRY   │  │
│  │             │              │             │              │             │  │
│  │ • Users     │              │ • User prefs│              │ • Providers │  │
│  │ • Connections│             │ • Inference │              │ • Offerings │  │
│  │ • Trust     │              │ • Group     │              │ • Availability│ │
│  │ • Reviews   │              │   aggregation│             │ • Pricing   │  │
│  └─────────────┘              └─────────────┘              └─────────────┘  │
│                                       │                                      │
│                                       ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      TRANSACTION LAYER                                 │  │
│  │                                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ Negotiation │  │   Payment   │  │   Escrow    │  │  Fulfillment│   │  │
│  │  │   Engine    │─▶│  Processing │─▶│  Management │─▶│   Tracking  │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                       │                                      │
│                                       ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      COMMUNICATION LAYER                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  Real-time  │  │    Push     │  │     SMS     │  │   Webhooks  │   │  │
│  │  │  Messaging  │  │   Notifs    │  │   Fallback  │  │  (Partners) │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Graph DB   │  │ Relational  │  │    Cache    │  │   Event     │        │
│  │  (Social)   │  │    (Core)   │  │  (Real-time)│  │   Store     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Core Services Detail

#### 3.2.1 Social Graph Service

**Purpose:** Store relationships, calculate trust, aggregate network reviews.

```typescript
interface SocialGraphService {
  
  // === Connection Management ===
  
  // Sync contacts from phone (hashed for privacy)
  syncContacts(userId: string, contactHashes: string[]): Promise<Connection[]>;
  
  // Get user's connections
  getConnections(userId: string, degree?: 1 | 2 | 3): Promise<Connection[]>;
  
  // Manual connection (for testing, invites)
  createConnection(fromUserId: string, toUserId: string): Promise<Connection>;
  
  
  // === Trust Calculation ===
  
  // Calculate trust score between user and provider
  calculateTrustScore(userId: string, providerId: string): Promise<TrustScore>;
  
  // Batch trust scores for multiple providers (for matching)
  batchTrustScores(userId: string, providerIds: string[]): Promise<Map<string, TrustScore>>;
  
  // Get connection path (how are they connected?)
  getConnectionPath(userId: string, targetId: string): Promise<ConnectionPath | null>;
  
  
  // === Network Reviews ===
  
  // Get reviews from user's network only
  getNetworkReviews(userId: string, providerId: string): Promise<NetworkReview[]>;
  
  // Aggregate network rating (weighted by degree)
  getNetworkRating(userId: string, providerId: string): Promise<NetworkRating>;
  
  
  // === Endorsements ===
  
  // Explicit vouch for a provider
  endorseProvider(userId: string, providerId: string, note?: string): Promise<Endorsement>;
  
  // Get endorsements from network
  getNetworkEndorsements(userId: string, providerId: string): Promise<Endorsement[]>;
}

// Data Models
interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  toUserName: string;
  degree: 1 | 2 | 3;
  source: 'contacts' | 'manual' | 'mutual';
  strength: number;              // 0-1, interaction frequency
  createdAt: Date;
}

interface TrustScore {
  providerId: string;
  score: number;                 // 0-100
  degree: 1 | 2 | 3 | null;      // Connection distance
  networkReviewCount: number;
  networkAvgRating: number;
  endorsementCount: number;
  globalRating: number;          // Fallback
  components: {
    connectionScore: number;
    reviewScore: number;
    endorsementScore: number;
    globalScore: number;
  };
  computedAt: Date;
}

interface NetworkReview {
  reviewId: string;
  reviewerId: string;
  reviewerName: string;
  degree: 1 | 2 | 3;
  rating: number;
  text?: string;
  serviceDate: Date;
  weight: number;                // Based on degree
}
```

#### 3.2.2 Service Registry

**Purpose:** Onboard providers, manage offerings, track availability.

```typescript
interface ServiceRegistry {
  
  // === Provider Management ===
  
  // Register new provider
  registerProvider(data: ProviderRegistration): Promise<Provider>;
  
  // Update provider profile
  updateProvider(providerId: string, updates: Partial<Provider>): Promise<Provider>;
  
  // Get provider details
  getProvider(providerId: string): Promise<Provider>;
  
  // Verify provider (background check, docs)
  initiateVerification(providerId: string): Promise<VerificationStatus>;
  
  
  // === Service Offerings ===
  
  // Create service offering
  createOffering(providerId: string, offering: ServiceOfferingInput): Promise<ServiceOffering>;
  
  // Update offering
  updateOffering(offeringId: string, updates: Partial<ServiceOffering>): Promise<ServiceOffering>;
  
  // Search offerings (used by matching engine)
  searchOfferings(query: OfferingQuery): Promise<ServiceOffering[]>;
  
  
  // === Availability ===
  
  // Set availability rules
  setAvailability(offeringId: string, rules: AvailabilityRule[]): Promise<void>;
  
  // Check real-time availability
  checkAvailability(offeringId: string, dateTime: Date, duration?: number): Promise<AvailabilitySlot[]>;
  
  // Block time (booked, personal)
  blockTime(offeringId: string, start: Date, end: Date, reason: string): Promise<void>;
  
  
  // === Categories ===
  
  // Get supported categories
  getCategories(): Promise<ServiceCategory[]>;
  
  // Get category schema (what attributes are needed)
  getCategorySchema(category: string): Promise<CategorySchema>;
}

// Data Models
interface Provider {
  id: string;
  userId?: string;               // Linked user account (for individuals)
  type: 'individual' | 'business';
  
  // Profile
  displayName: string;
  description?: string;
  profileImageUrl?: string;
  
  // Business info (if applicable)
  businessName?: string;
  businessAddress?: string;
  taxId?: string;
  
  // Verification
  verificationStatus: 'pending' | 'in_progress' | 'verified' | 'rejected';
  verificationDocs: VerificationDoc[];
  verifiedAt?: Date;
  
  // Payments
  stripeConnectId?: string;
  payoutEnabled: boolean;
  
  // Stats
  totalBookings: number;
  globalRating: number;
  globalReviewCount: number;
  
  // Status
  status: 'active' | 'paused' | 'suspended' | 'inactive';
  createdAt: Date;
}

interface ServiceOffering {
  id: string;
  providerId: string;
  
  // Classification
  category: string;              // 'rideshare', 'restaurant', 'cleaning', etc.
  subcategory?: string;
  
  // Details
  name: string;
  description: string;
  images: string[];
  
  // Pricing
  pricingModel: PricingModel;
  basePrice: number;
  currency: string;
  negotiable: boolean;
  
  // Booking
  instantBook: boolean;          // Or requires approval
  leadTime: number;              // Minutes advance booking required
  cancellationPolicy: CancellationPolicy;
  
  // Capacity
  maxCapacity?: number;          // People, items, etc.
  minCapacity?: number;
  
  // Location
  serviceArea?: GeoJSON;         // Where they operate
  location?: GeoPoint;           // Fixed location (restaurant, salon)
  
  // Category-specific attributes
  attributes: Record<string, any>;
  
  // Status
  status: 'active' | 'paused' | 'inactive';
  createdAt: Date;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // What type of location model
  locationType: 'provider_travels' | 'customer_travels' | 'virtual' | 'both';
  
  // Does this category support negotiation?
  negotiationEnabled: boolean;
  
  // Required provider verification for this category
  requiredVerifications: string[];
  
  // Attribute schema
  attributes: AttributeDefinition[];
}
```

#### 3.2.3 Preference Engine

**Purpose:** Store user preferences, infer from behavior, aggregate for groups.

```typescript
interface PreferenceEngine {
  
  // === User Preferences ===
  
  // Get user's full preference profile
  getPreferences(userId: string): Promise<UserPreferences>;
  
  // Update preferences (explicit)
  updatePreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences>;
  
  // Record behavior for inference
  recordBehavior(userId: string, behavior: UserBehavior): Promise<void>;
  
  // Get inferred preferences
  getInferredPreferences(userId: string): Promise<InferredPreference[]>;
  
  
  // === Preference Completeness ===
  
  // How much do we know?
  getCompletenessScore(userId: string): Promise<PreferenceCompleteness>;
  
  // Get next question to ask
  getNextQuestion(userId: string, context: string): Promise<PreferenceQuestion | null>;
  
  
  // === Group Aggregation ===
  
  // Aggregate preferences for multiple users
  aggregateGroupPreferences(userIds: string[], category: string): Promise<GroupPreferences>;
  
  // Detect conflicts in group
  detectConflicts(userIds: string[], category: string): Promise<PreferenceConflict[]>;
  
  
  // === Application to Search ===
  
  // Generate search filters from preferences
  generateSearchFilters(userId: string, category: string): Promise<SearchFilters>;
  
  // Generate group search filters
  generateGroupSearchFilters(userIds: string[], category: string): Promise<SearchFilters>;
}

// Data Models
interface UserPreferences {
  userId: string;
  
  // Dietary (applies to food services)
  dietary: {
    restrictions: string[];       // vegetarian, gluten_free, etc.
    allergies: string[];          // CRITICAL - must exclude
    cuisinePreferences: CuisineScore[];
    avoidIngredients: string[];
  };
  
  // Budget
  budget: {
    dining: BudgetRange;
    transportation: BudgetRange;
    services: BudgetRange;        // General services
    flexibility: 'strict' | 'flexible' | 'splurge_ok';
  };
  
  // Transportation
  transportation: {
    preferredServices: string[]; // uber, lyft, etc.
    shareRidesOk: boolean;
    maxWalkMinutes: number;
    accessibilityNeeds: string[];
  };
  
  // Venue/Environment
  venue: {
    ambiancePreferences: string[]; // quiet, lively, romantic
    seatingPreferences: string[];
    accessibilityNeeds: string[];
  };
  
  // Time
  scheduling: {
    preferredMealTimes: Record<string, TimeRange>; // breakfast, lunch, dinner
    avoidDays: number[];          // Days of week to avoid
    timezone: string;
  };
  
  // Location
  location: {
    home?: GeoPoint;
    work?: GeoPoint;
    preferredAreas: string[];
    avoidAreas: string[];
    maxTravelMinutes: number;
  };
  
  completenessScore: number;
  lastUpdated: Date;
}

interface GroupPreferences {
  userIds: string[];
  
  // Hard constraints (union of all restrictions)
  requiredRestrictions: string[];
  requiredAllergenFree: string[];
  requiredAccessibility: string[];
  
  // Budget (intersection - lowest max wins)
  budgetRange: {
    min: number;
    max: number;
    perPerson: number;
  };
  
  // Soft preferences (weighted average)
  cuisineScores: Map<string, number>;
  ambianceScores: Map<string, number>;
  
  // Conflicts to surface to user
  conflicts: PreferenceConflict[];
  
  computedAt: Date;
}

interface PreferenceConflict {
  type: 'budget' | 'dietary' | 'cuisine' | 'time' | 'location';
  severity: 'blocker' | 'compromise_needed' | 'minor';
  description: string;
  affectedUsers: string[];
  suggestions: string[];
}
```

#### 3.2.4 Matching Engine

**Purpose:** The order book—match requests with offerings using trust and preferences.

```typescript
interface MatchingEngine {
  
  // === Request Lifecycle ===
  
  // Submit a service request
  submitRequest(request: ServiceRequestInput): Promise<ServiceRequest>;
  
  // Cancel a request
  cancelRequest(requestId: string, reason: string): Promise<void>;
  
  // Get request status
  getRequest(requestId: string): Promise<ServiceRequest>;
  
  
  // === Matching ===
  
  // Find matching providers for a request
  findMatches(requestId: string): Promise<MatchResult[]>;
  
  // Re-run matching (if preferences change, time passes)
  refreshMatches(requestId: string): Promise<MatchResult[]>;
  
  
  // === Selection ===
  
  // Buyer selects a provider
  selectProvider(requestId: string, providerId: string): Promise<Negotiation>;
  
  
  // === Real-time ===
  
  // Subscribe to match updates
  subscribeToMatches(requestId: string, callback: (matches: MatchResult[]) => void): Subscription;
  
  // For providers: subscribe to incoming requests
  subscribeToRequests(providerId: string, callback: (request: ServiceRequest) => void): Subscription;
}

// Data Models
interface ServiceRequest {
  id: string;
  buyerId: string;
  
  // What they want
  category: string;
  requirements: {
    dateTime: Date;
    dateTimeFlexibility?: number;  // +/- minutes
    duration?: number;
    partySize?: number;
    location?: GeoPoint;
    destination?: GeoPoint;        // For transport
    budget?: BudgetRange;
    attributes: Record<string, any>; // Category-specific
    freeformNotes?: string;
  };
  
  // How to match
  matchingPreferences: {
    networkOnly: boolean;          // Only network-connected providers
    minTrustScore?: number;
    minRating?: number;
    prioritize: 'trust' | 'price' | 'rating' | 'availability';
  };
  
  // State
  status: RequestStatus;
  matches: MatchResult[];
  selectedProviderId?: string;
  negotiationId?: string;
  transactionId?: string;
  
  // Timestamps
  createdAt: Date;
  expiresAt: Date;
  matchedAt?: Date;
  fulfilledAt?: Date;
}

type RequestStatus = 
  | 'pending'           // Matching in progress
  | 'matched'           // Matches found, awaiting selection
  | 'selected'          // Provider selected, negotiation starting
  | 'negotiating'       // In negotiation
  | 'agreed'            // Deal agreed, payment pending
  | 'paid'              // Payment complete
  | 'in_progress'       // Service being delivered
  | 'completed'         // Done
  | 'cancelled'
  | 'expired'
  | 'disputed';

interface MatchResult {
  providerId: string;
  providerName: string;
  offeringId: string;
  offeringName: string;
  
  // Trust
  trustScore: number;
  connectionDegree: 1 | 2 | 3 | null;
  networkReviewCount: number;
  networkAvgRating: number;
  
  // Global fallback
  globalRating: number;
  globalReviewCount: number;
  
  // Fit
  estimatedPrice: number;
  priceRange?: { low: number; high: number };
  availability: 'available' | 'limited' | 'waitlist';
  availableSlots?: Date[];
  
  // Preference match
  preferenceMatchScore: number;
  preferenceHighlights: string[];  // "Gluten-free options", "Quiet ambiance"
  
  // Combined ranking
  matchScore: number;
  matchRank: number;
  
  // Why this match?
  matchExplanation: string;        // "Your friend Sarah rated them 5 stars"
  
  // Actions
  canInstantBook: boolean;
  negotiable: boolean;
}
```

#### 3.2.5 Negotiation Engine

**Purpose:** Facilitate human-to-human negotiation with structure.

```typescript
interface NegotiationEngine {
  
  // === Negotiation Lifecycle ===
  
  // Start negotiation (after buyer selects provider)
  startNegotiation(requestId: string, providerId: string): Promise<Negotiation>;
  
  // Get negotiation state
  getNegotiation(negotiationId: string): Promise<Negotiation>;
  
  
  // === Offers ===
  
  // Make an offer (buyer or provider)
  makeOffer(negotiationId: string, offer: OfferInput): Promise<Offer>;
  
  // Accept current offer
  acceptOffer(negotiationId: string, offerId: string): Promise<Negotiation>;
  
  // Decline/counter
  declineOffer(negotiationId: string, offerId: string, reason?: string): Promise<Negotiation>;
  
  
  // === Messaging ===
  
  // Send message in negotiation
  sendMessage(negotiationId: string, message: string): Promise<NegotiationMessage>;
  
  // Get message history
  getMessages(negotiationId: string): Promise<NegotiationMessage[]>;
  
  
  // === Real-time ===
  
  subscribeToNegotiation(negotiationId: string, callback: (update: NegotiationUpdate) => void): Subscription;
}

// Data Models
interface Negotiation {
  id: string;
  requestId: string;
  buyerId: string;
  providerId: string;
  offeringId: string;
  
  status: NegotiationStatus;
  
  // The evolving deal
  initialOffer: Offer;           // Provider's starting price
  currentOffer: Offer;           // Latest offer
  offerHistory: Offer[];
  
  // Messaging
  messages: NegotiationMessage[];
  
  // Rules
  maxRounds: number;
  currentRound: number;
  responseDeadline: Date;        // Current offer expires
  negotiationExpires: Date;      // Whole negotiation expires
  
  // Outcome
  agreedOffer?: Offer;
  agreedAt?: Date;
  cancelledBy?: 'buyer' | 'provider' | 'system';
  cancellationReason?: string;
  
  createdAt: Date;
}

type NegotiationStatus =
  | 'active'
  | 'buyer_turn'                 // Waiting for buyer response
  | 'provider_turn'              // Waiting for provider response
  | 'agreed'                     // Deal reached
  | 'cancelled'
  | 'expired';

interface Offer {
  id: string;
  negotiationId: string;
  offeredBy: 'buyer' | 'provider';
  
  // Terms
  price: number;
  currency: string;
  dateTime: Date;
  duration?: number;
  partySize?: number;
  inclusions: string[];          // What's included
  exclusions: string[];          // What's not
  terms?: string;                // Free-form terms
  
  // State
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
  responseDeadline: Date;
  
  createdAt: Date;
  respondedAt?: Date;
}
```

#### 3.2.6 Transaction Engine

**Purpose:** Handle payments, escrow, fulfillment tracking, disputes.

```typescript
interface TransactionEngine {
  
  // === Payment ===
  
  // Create payment intent (after negotiation agreed)
  createPayment(negotiationId: string): Promise<PaymentIntent>;
  
  // Capture payment (buyer confirms)
  capturePayment(transactionId: string, paymentMethodId: string): Promise<Transaction>;
  
  
  // === Escrow ===
  
  // Funds are held automatically after capture
  // Release happens on completion
  
  // Manual release (if needed)
  releaseEscrow(transactionId: string): Promise<Transaction>;
  
  // Refund (full or partial)
  refund(transactionId: string, amount?: number, reason?: string): Promise<Transaction>;
  
  
  // === Fulfillment ===
  
  // Provider marks service started
  markInProgress(transactionId: string): Promise<Transaction>;
  
  // Provider marks service complete
  markCompleted(transactionId: string): Promise<Transaction>;
  
  // Buyer confirms completion (releases escrow)
  confirmCompletion(transactionId: string, rating?: number, review?: string): Promise<Transaction>;
  
  
  // === Disputes ===
  
  // Buyer opens dispute
  openDispute(transactionId: string, reason: string, evidence?: string[]): Promise<Dispute>;
  
  // Resolve dispute
  resolveDispute(disputeId: string, resolution: DisputeResolution): Promise<Transaction>;
  
  
  // === Queries ===
  
  getTransaction(transactionId: string): Promise<Transaction>;
  getBuyerTransactions(buyerId: string, status?: TransactionStatus[]): Promise<Transaction[]>;
  getProviderTransactions(providerId: string, status?: TransactionStatus[]): Promise<Transaction[]>;
}

// Data Models
interface Transaction {
  id: string;
  requestId: string;
  negotiationId: string;
  buyerId: string;
  providerId: string;
  
  // Money
  serviceAmount: number;         // What provider gets
  platformFee: number;           // Our cut
  processingFee: number;         // Stripe's cut
  totalAmount: number;           // What buyer pays
  currency: string;
  
  // Payment state
  stripePaymentIntentId: string;
  paymentStatus: 'pending' | 'captured' | 'failed' | 'refunded';
  
  // Escrow state
  escrowStatus: 'held' | 'released' | 'refunded' | 'disputed';
  escrowReleasedAt?: Date;
  
  // Fulfillment
  serviceScheduledAt: Date;
  serviceStartedAt?: Date;
  serviceCompletedAt?: Date;
  buyerConfirmedAt?: Date;
  autoReleaseAt: Date;           // Auto-release escrow if buyer doesn't dispute
  
  // Status
  status: TransactionStatus;
  
  // Dispute
  disputeId?: string;
  
  // Payout
  stripeTransferId?: string;
  payoutStatus: 'pending' | 'scheduled' | 'completed' | 'failed';
  payoutScheduledAt?: Date;
  payoutCompletedAt?: Date;
  
  createdAt: Date;
}

type TransactionStatus =
  | 'pending_payment'
  | 'paid'                       // Escrow held
  | 'in_progress'                // Service being delivered
  | 'completed'                  // Service done, pending confirmation
  | 'confirmed'                  // Buyer confirmed, escrow released
  | 'auto_confirmed'             // Auto-released after timeout
  | 'disputed'
  | 'refunded'
  | 'cancelled';
```

---

## 4. API Design

### 4.1 API Principles

- **RESTful** for CRUD operations
- **GraphQL** for flexible querying (especially social graph)
- **WebSocket** for real-time updates
- **Webhooks** for partner integrations

### 4.2 Core REST Endpoints

```yaml
# === Authentication ===
POST   /auth/otp/send              # Send OTP to phone
POST   /auth/otp/verify            # Verify OTP, get tokens
POST   /auth/refresh               # Refresh access token

# === Users ===
GET    /users/me                   # Get current user
PATCH  /users/me                   # Update profile
POST   /users/me/contacts/sync     # Sync phone contacts
GET    /users/me/connections       # Get connections
GET    /users/me/preferences       # Get preferences
PATCH  /users/me/preferences       # Update preferences

# === Providers ===
POST   /providers                  # Register as provider
GET    /providers/:id              # Get provider profile
PATCH  /providers/:id              # Update provider (owner only)
POST   /providers/:id/verify       # Start verification

# === Offerings ===
POST   /providers/:id/offerings    # Create offering
GET    /providers/:id/offerings    # List provider's offerings
GET    /offerings/:id              # Get offering details
PATCH  /offerings/:id              # Update offering
GET    /offerings/search           # Search offerings (public)

# === Requests ===
POST   /requests                   # Create service request
GET    /requests/:id               # Get request details
GET    /requests/:id/matches       # Get matched providers
POST   /requests/:id/select        # Select a provider
DELETE /requests/:id               # Cancel request

# === Negotiations ===
GET    /negotiations/:id           # Get negotiation state
POST   /negotiations/:id/offers    # Make offer
POST   /negotiations/:id/accept    # Accept current offer
POST   /negotiations/:id/decline   # Decline/counter
POST   /negotiations/:id/messages  # Send message

# === Transactions ===
POST   /transactions               # Create from negotiation
POST   /transactions/:id/pay       # Capture payment
POST   /transactions/:id/confirm   # Buyer confirms completion
POST   /transactions/:id/dispute   # Open dispute
GET    /transactions/:id           # Get transaction

# === Reviews ===
POST   /transactions/:id/review    # Leave review
GET    /providers/:id/reviews      # Get provider reviews
GET    /providers/:id/network-reviews  # Reviews from MY network

# === Trust ===
GET    /trust/:providerId          # Get trust score for provider
POST   /endorse/:providerId        # Endorse a provider
```

### 4.3 Real-time Subscriptions (WebSocket)

```typescript
// Subscribe to request matches
ws.subscribe('request.matches', { requestId: '...' });
// → Emits: { type: 'matches_updated', matches: [...] }

// Subscribe to negotiation updates
ws.subscribe('negotiation', { negotiationId: '...' });
// → Emits: { type: 'offer_received', offer: {...} }
// → Emits: { type: 'message_received', message: {...} }

// Provider: Subscribe to incoming requests
ws.subscribe('provider.requests', { providerId: '...' });
// → Emits: { type: 'new_request', request: {...} }
```

### 4.4 Webhooks (Partner Integration)

```typescript
// Webhook events
type WebhookEvent =
  | 'request.created'
  | 'request.matched'
  | 'negotiation.started'
  | 'negotiation.agreed'
  | 'transaction.paid'
  | 'transaction.completed'
  | 'transaction.disputed'
  | 'review.created';

// Webhook payload
interface WebhookPayload {
  event: WebhookEvent;
  timestamp: Date;
  data: Record<string, any>;
  signature: string;             // HMAC for verification
}
```

---

## 5. Integration Patterns

### 5.1 Example: Building "Girls Night Out" on The Service Graph

```typescript
// Girls Night Out is a CLIENT APPLICATION that uses Service Graph APIs

class GirlsNightOutApp {
  
  private serviceGraph: ServiceGraphClient;
  
  async planEvening(
    organizerId: string,
    friendIds: string[],
    date: Date,
    preferences: EveningPreferences
  ) {
    const allUsers = [organizerId, ...friendIds];
    
    // 1. Aggregate group preferences using Service Graph
    const groupPrefs = await this.serviceGraph.preferences.aggregateGroup(
      allUsers,
      'dining'
    );
    
    // 2. Check calendar availability (if integrated)
    const availability = await this.serviceGraph.calendar.getGroupAvailability(
      allUsers,
      date
    );
    
    // 3. Create restaurant request
    const restaurantRequest = await this.serviceGraph.requests.create({
      buyerId: organizerId,
      category: 'restaurant',
      requirements: {
        dateTime: availability.bestSlot,
        partySize: allUsers.length,
        location: preferences.neighborhood,
        budget: groupPrefs.budgetRange,
        attributes: {
          dietaryRestrictions: groupPrefs.requiredRestrictions,
          cuisinePreferences: groupPrefs.cuisineScores,
          ambiance: groupPrefs.ambianceScores
        }
      },
      matchingPreferences: {
        networkOnly: preferences.networkOnly,
        prioritize: 'trust'
      }
    });
    
    // 4. Get matches (restaurants friends have been to)
    const matches = await this.serviceGraph.requests.getMatches(
      restaurantRequest.id
    );
    
    // 5. Present to user with trust explanations
    return matches.map(m => ({
      restaurant: m,
      whyWeRecommend: m.matchExplanation,  // "Sarah loved this place"
      networkConnection: m.connectionDegree,
      dietaryFit: m.preferenceHighlights
    }));
  }
  
  async bookAndArrangeRides(
    requestId: string,
    providerId: string,
    pickupLocations: Map<string, GeoPoint>  // userId → pickup location
  ) {
    // 1. Select provider, go through negotiation if needed
    const negotiation = await this.serviceGraph.requests.selectProvider(
      requestId,
      providerId
    );
    
    // If instant book, negotiation is auto-accepted
    // Otherwise, handle negotiation flow...
    
    // 2. Once agreed, create transaction
    const transaction = await this.serviceGraph.transactions.create(
      negotiation.id
    );
    
    // 3. Generate ride links for everyone
    const restaurantLocation = transaction.serviceLocation;
    
    const rideLinks = {};
    for (const [userId, pickup] of pickupLocations) {
      rideLinks[userId] = {
        uber: this.generateUberDeepLink(pickup, restaurantLocation),
        lyft: this.generateLyftDeepLink(pickup, restaurantLocation)
      };
    }
    
    // 4. Add to calendars
    await this.serviceGraph.calendar.createGroupEvent(
      pickupLocations.keys(),
      {
        title: `Dinner at ${transaction.providerName}`,
        location: restaurantLocation,
        startTime: transaction.serviceScheduledAt,
        notes: `Ride links: ${JSON.stringify(rideLinks)}`
      }
    );
    
    return { transaction, rideLinks };
  }
}
```

### 5.2 Example: Building "DriverFirst" on The Service Graph

```typescript
// DriverFirst: Trust-first rideshare

class DriverFirstApp {
  
  private serviceGraph: ServiceGraphClient;
  
  async requestRide(
    riderId: string,
    pickup: GeoPoint,
    destination: GeoPoint,
    preferences: RidePreferences
  ) {
    // 1. Create ride request
    const request = await this.serviceGraph.requests.create({
      buyerId: riderId,
      category: 'rideshare',
      requirements: {
        dateTime: new Date(),      // Now
        location: pickup,
        destination: destination,
        attributes: {
          rideType: preferences.rideType,  // standard, xl, etc.
          accessibility: preferences.accessibility
        }
      },
      matchingPreferences: {
        networkOnly: preferences.networkOnlyMode,
        minTrustScore: preferences.minTrust,
        prioritize: 'trust'        // Trust over price
      }
    });
    
    // 2. Get matches - drivers your network has used
    const matches = await this.serviceGraph.requests.getMatches(request.id);
    
    // 3. Show drivers with network context
    return matches.map(driver => ({
      driver,
      networkConnection: driver.connectionDegree,
      friendWhoUsedThem: driver.matchExplanation,
      trustScore: driver.trustScore,
      price: driver.estimatedPrice,
      eta: driver.estimatedArrival
    }));
  }
  
  async acceptRide(requestId: string, driverId: string) {
    // Rideshare is typically instant-book, no negotiation
    const negotiation = await this.serviceGraph.requests.selectProvider(
      requestId,
      driverId
    );
    
    // Provider auto-accepts (if available)
    // Payment captured immediately
    const transaction = await this.serviceGraph.transactions.create(
      negotiation.id
    );
    
    // Return live tracking info
    return {
      transaction,
      trackingUrl: `/track/${transaction.id}`,
      driverInfo: {
        name: transaction.providerName,
        rating: transaction.providerRating,
        vehicle: transaction.providerAttributes.vehicle,
        eta: transaction.estimatedArrival
      }
    };
  }
}
```

### 5.3 Example: Partner Integration (Restaurant Booking App)

```typescript
// External app integrates Service Graph for trust layer

// 1. Register as partner, get API keys
// 2. Implement webhook handlers
// 3. Use SDK

import { ServiceGraphSDK } from '@servicegraph/sdk';

const sg = new ServiceGraphSDK({
  apiKey: process.env.SERVICE_GRAPH_API_KEY,
  webhookSecret: process.env.SERVICE_GRAPH_WEBHOOK_SECRET
});

// Enrich their existing restaurant search with trust scores
async function enrichWithTrust(userId: string, restaurants: Restaurant[]) {
  const providerIds = restaurants.map(r => r.serviceGraphProviderId);
  
  const trustScores = await sg.trust.batchGet(userId, providerIds);
  
  return restaurants.map(r => ({
    ...r,
    trustScore: trustScores.get(r.serviceGraphProviderId),
    networkReviews: trustScores.get(r.serviceGraphProviderId)?.networkReviewCount
  }));
}

// Handle booking through Service Graph for escrow protection
async function bookWithEscrow(
  userId: string,
  restaurantId: string,
  details: BookingDetails
) {
  const request = await sg.requests.create({
    buyerId: userId,
    category: 'restaurant',
    requirements: {
      dateTime: details.dateTime,
      partySize: details.partySize
    }
  });
  
  // Skip matching, go directly to this provider
  const negotiation = await sg.requests.selectProvider(
    request.id,
    restaurantId
  );
  
  // Return payment link
  const payment = await sg.transactions.createPayment(negotiation.id);
  
  return {
    bookingId: request.id,
    paymentUrl: payment.checkoutUrl,
    // Funds held until dinner is served
  };
}

// Webhook handler
app.post('/webhooks/servicegraph', (req, res) => {
  const event = sg.webhooks.verify(req.body, req.headers['x-sg-signature']);
  
  switch (event.type) {
    case 'transaction.completed':
      // Update our records
      markBookingComplete(event.data.requestId);
      break;
    case 'review.created':
      // Sync review to our system
      syncReview(event.data.providerId, event.data.review);
      break;
  }
  
  res.status(200).send('OK');
});
```

---

## 6. Infrastructure

### 6.1 Azure Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AZURE INFRASTRUCTURE                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         NETWORKING                                   │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │  │ Front Door  │───▶│     WAF     │───▶│    VNET     │             │    │
│  │  │ (CDN + LB)  │    │             │    │             │             │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         COMPUTE                                      │    │
│  │                                                                      │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │  │     API     │    │  Functions  │    │  Container  │             │    │
│  │  │ Management  │    │ (Serverless)│    │    Apps     │             │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  │        │                   │                  │                     │    │
│  │        │         ┌─────────┴─────────┐       │                     │    │
│  │        │         │                   │       │                     │    │
│  │        ▼         ▼                   ▼       ▼                     │    │
│  │  ┌───────────────────────────────────────────────┐                 │    │
│  │  │              SERVICE MESH (Dapr)              │                 │    │
│  │  │  • Service discovery                          │                 │    │
│  │  │  • Pub/sub messaging                          │                 │    │
│  │  │  • State management                           │                 │    │
│  │  └───────────────────────────────────────────────┘                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         DATA                                         │    │
│  │                                                                      │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │  │  Cosmos DB  │    │  Azure SQL  │    │    Redis    │             │    │
│  │  │  (Gremlin)  │    │             │    │   Cache     │             │    │
│  │  │             │    │             │    │             │             │    │
│  │  │ Social Graph│    │ Transactions│    │ Real-time   │             │    │
│  │  │ Trust Data  │    │ Users       │    │ Sessions    │             │    │
│  │  │             │    │ Providers   │    │ Matches     │             │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  │                                                                      │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │  │ Service Bus │    │   SignalR   │    │    Blob     │             │    │
│  │  │             │    │   Service   │    │   Storage   │             │    │
│  │  │ Event Queue │    │ Real-time   │    │ Files/Docs  │             │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         INTEGRATIONS                                 │    │
│  │                                                                      │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │  │   Stripe    │    │Communication│    │  AI Foundry │             │    │
│  │  │  Connect    │    │  Services   │    │  (Agents)   │             │    │
│  │  │             │    │             │    │             │             │    │
│  │  │ Payments    │    │ SMS/Email   │    │ Intent      │             │    │
│  │  │ Escrow      │    │ Push Notifs │    │ Parsing     │             │    │
│  │  │ Payouts     │    │             │    │ Coordination│             │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         OBSERVABILITY                                │    │
│  │                                                                      │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │  │ Application │    │   Log       │    │   Monitor   │             │    │
│  │  │  Insights   │    │  Analytics  │    │  Workbooks  │             │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Service Breakdown

| Service | Technology | Purpose |
|---------|------------|---------|
| API Gateway | Azure API Management | Auth, rate limiting, routing |
| Core API | Container Apps (.NET/Node) | Main REST API |
| Matching Engine | Azure Functions | Scalable matching computation |
| Social Graph | Cosmos DB (Gremlin) | Graph traversal, trust calc |
| Transactional DB | Azure SQL | Users, transactions, offerings |
| Cache | Redis | Sessions, active matches, trust cache |
| Events | Service Bus | Async processing, notifications |
| Real-time | SignalR Service | WebSocket connections |
| Files | Blob Storage | Images, documents |
| Payments | Stripe Connect | Payment processing, escrow |
| Notifications | Communication Services | SMS, Email |
| AI/Agents | Azure AI Foundry | Intent parsing, coordination |

---

## 7. Security & Compliance

### 7.1 Data Privacy

| Data Type | Storage | Protection |
|-----------|---------|------------|
| Phone numbers | SHA-256 hash only | Never stored in plain text |
| Contact list | Processed on-device, only hashes sent | Privacy-preserving sync |
| Preferences | User-owned, exportable | GDPR/CCPA compliant |
| Payment info | Stripe (PCI DSS) | Never touches our servers |
| Location | Transient, not stored long-term | Used only for matching |

### 7.2 Trust & Safety

- **Provider Verification:** Background checks for relevant categories
- **Escrow Protection:** Funds held until service confirmed
- **Dispute Resolution:** Structured process with evidence
- **Network Trust:** Hard to fake—requires real relationships
- **Review Authenticity:** Only from completed transactions

### 7.3 Regulatory

- **Money Transmission:** Stripe Connect as payment facilitator
- **Data Residency:** Configurable by region
- **Accessibility:** WCAG 2.1 AA compliant

---

## 8. Business Model

### 8.1 Revenue Streams

```
┌─────────────────────────────────────────────────────────────────┐
│                       REVENUE MODEL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. TRANSACTION FEE                                             │
│     └─▶ 5% of service amount (capped at $25)                    │
│     └─▶ Split: 3% platform, 2% payment processing               │
│                                                                  │
│  2. PROVIDER SUBSCRIPTION (Future)                              │
│     └─▶ Premium placement in matching                           │
│     └─▶ Analytics dashboard                                     │
│     └─▶ Verified badge                                          │
│                                                                  │
│  3. API ACCESS (Future - B2B)                                   │
│     └─▶ Trust-as-a-Service for partner apps                     │
│     └─▶ Per-query pricing for trust scores                      │
│     └─▶ White-label matching engine                             │
│                                                                  │
│  4. DATA INSIGHTS (Future - Anonymized)                         │
│     └─▶ Market trends for service categories                    │
│     └─▶ Pricing intelligence                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Network Effects

```
More Users ──▶ Richer Social Graph ──▶ Better Trust Scores
     │                                        │
     │                                        ▼
     │                               More Accurate Matching
     │                                        │
     │                                        ▼
     │                               Better User Experience
     │                                        │
     └────────────────────────────────────────┘
                     │
                     ▼
              More Providers (quality ones want to be here)
                     │
                     ▼
              More Service Categories
                     │
                     ▼
              Platform becomes essential infrastructure
```

---

## 9. Roadmap

### Phase 1: Foundation (Months 1-3)
- [ ] Core API (users, auth, providers, offerings)
- [ ] Social graph service (contacts sync, connections)
- [ ] Basic matching engine (without trust scoring)
- [ ] Provider onboarding flow
- [ ] Basic mobile app (buyer side)

### Phase 2: Trust Layer (Months 4-6)
- [ ] Trust score calculation
- [ ] Network-scoped reviews
- [ ] Endorsement system
- [ ] Trust-weighted matching
- [ ] Provider mobile app

### Phase 3: Transactions (Months 7-9)
- [ ] Negotiation engine
- [ ] Stripe Connect integration
- [ ] Escrow flow
- [ ] Dispute resolution
- [ ] Review collection

### Phase 4: Intelligence (Months 10-12)
- [ ] Preference engine
- [ ] Behavioral inference
- [ ] Group aggregation
- [ ] Calendar integration
- [ ] AI agent for multi-service coordination

### Phase 5: Platform (Year 2)
- [ ] Partner API & SDK
- [ ] Webhook system
- [ ] White-label options
- [ ] Additional service categories
- [ ] Geographic expansion

---

## 10. Success Metrics

### Platform Health
| Metric | Target |
|--------|--------|
| Request → Match latency | < 3 seconds |
| Match → Transaction conversion | > 40% |
| Transaction completion rate | > 95% |
| Dispute rate | < 2% |
| Platform uptime | 99.9% |

### Trust Quality
| Metric | Target |
|--------|--------|
| Network match rate | > 50% of bookings with network providers |
| Trust score accuracy | User satisfaction with trust-recommended providers |
| Review authenticity | 0% fake reviews (all from verified transactions) |

### Growth
| Metric | Target (Year 1) |
|--------|-----------------|
| Registered users | 100K |
| Active providers | 10K |
| Monthly transactions | 50K |
| GMV | $5M/month |
| Service categories | 5+ |

---

## Appendix A: Example Client Applications

These are **not** the platform—they are applications built ON the platform:

1. **Girls Night Out** — Multi-service evening planner
2. **DriverFirst** — Trust-first rideshare
3. **HomeHelper** — Verified home services
4. **DateNight** — Couples coordination
5. **FamilyFun** — Kid-friendly activity booking
6. **CorporateEvents** — Business entertainment
7. **TravelBuddy** — Destination services

Each uses the same underlying Service Graph APIs, differentiated by UX and vertical focus.

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Service Request** | A buyer's intent to purchase a service (the "buy order") |
| **Service Offering** | A provider's available service (the "sell order") |
| **Trust Score** | Composite score based on social connection and network reviews |
| **Connection Degree** | 1st = direct contact, 2nd = friend of friend, 3rd = 3 hops |
| **Network Reviews** | Reviews from users within your social graph |
| **Endorsement** | Explicit "I vouch for this provider" from a connection |
| **Escrow** | Payment held by platform until service completion |
| **Instant Book** | No negotiation required—accept at listed price |
| **Matching Engine** | System that pairs requests with offerings |
| **Order Book** | The collection of active requests and offerings |

---

*The Service Graph: Trust at scale. Commerce with confidence.*