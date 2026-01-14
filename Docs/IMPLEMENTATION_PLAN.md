# Girls Night Out + Service Graph Implementation Plan

**Created:** January 11, 2026  
**Status:** In Progress  
**Azure Foundry:** Deferred until access granted

---

## Overview

Building a monorepo prototype with **Girls Night Out (GNO)** as the first client application demonstrating **The Service Graph** platform. The prototype uses mocked external APIs and a scripted agent dialog system that will be replaced with Azure AI Foundry agents once access is available.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                    THE SERVICE GRAPH (Platform Layer)                   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────────┐     │
│  │SocialGraph │ │ Preference │ │  Matching  │ │   Transaction    │     │
│  │  Service   │ │   Engine   │ │   Engine   │ │     Engine       │     │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────────┘     │
│  ┌────────────┐ ┌────────────┐                                         │
│  │  Service   │ │Negotiation │                                         │
│  │  Registry  │ │   Engine   │                                         │
│  └────────────┘ └────────────┘                                         │
└────────────────────────────────────────────────────────────────────────┘
                                │ APIs
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│              CLIENT APPLICATIONS (Built on Service Graph)              │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │ Girls Night Out │  │ DriverFirst  │  │     Future Apps...       │   │
│  │    (GNO)        │  │   (future)   │  │                          │   │
│  └─────────────────┘  └──────────────┘  └──────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
youbiquti/
├── packages/
│   ├── core/                          # Shared types & utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── index.ts           # Re-exports all types
│   │   │   │   ├── user.ts            # User, Connection types
│   │   │   │   ├── provider.ts        # Provider, ServiceOffering
│   │   │   │   ├── trust.ts           # TrustScore, NetworkReview
│   │   │   │   ├── preferences.ts     # UserPreferences, GroupPreferences
│   │   │   │   ├── matching.ts        # ServiceRequest, MatchResult
│   │   │   │   ├── transaction.ts     # Transaction, Payment
│   │   │   │   └── gno.ts             # GNO-specific: Restaurant, Bar, Event
│   │   │   ├── schemas/               # Zod validation schemas
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       ├── geo.ts             # Distance calculations
│   │   │       ├── time.ts            # Time formatting
│   │   │       └── id.ts              # ID generation
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── service-graph/                 # Platform Core Services
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   ├── social-graph.service.ts
│   │   │   │   ├── preference.service.ts
│   │   │   │   ├── matching.service.ts
│   │   │   │   └── service-registry.service.ts
│   │   │   ├── data/
│   │   │   │   ├── demo-users.ts      # 6 demo users with connections
│   │   │   │   └── demo-providers.ts  # Sample providers
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── gno-tools/                     # GNO-specific tool implementations
│       ├── src/
│       │   ├── services/
│       │   │   ├── mock-yelp.ts       # 30+ Dallas venues
│       │   │   ├── mock-google.ts     # Hardcoded routes
│       │   │   ├── rideshare.ts       # Distance-based pricing
│       │   │   └── mock-events.ts     # 15 Dallas events
│       │   ├── data/
│       │   │   ├── dallas-restaurants.ts
│       │   │   ├── dallas-bars.ts
│       │   │   └── dallas-events.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── tools/                         # Azure Functions (local dev)
│   │   ├── src/
│   │   │   └── functions/
│   │   │       ├── searchRestaurants.ts
│   │   │       ├── searchBars.ts
│   │   │       ├── searchEvents.ts
│   │   │       ├── getRideshareEstimate.ts
│   │   │       ├── getDirections.ts
│   │   │       ├── checkAvailability.ts
│   │   │       └── health.ts
│   │   ├── local.settings.json
│   │   ├── host.json
│   │   └── package.json
│   │
│   ├── api/                           # Express API Server
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── chat.ts
│   │   │   │   ├── sessions.ts
│   │   │   │   ├── preferences.ts
│   │   │   │   └── trust.ts
│   │   │   ├── services/
│   │   │   │   ├── mock-agent.ts      # Scripted dialog (→ Foundry later)
│   │   │   │   ├── tool-executor.ts
│   │   │   │   └── session-store.ts   # LowDB persistence
│   │   │   ├── middleware/
│   │   │   │   └── error.ts
│   │   │   └── index.ts
│   │   ├── data/
│   │   │   └── db.json                # LowDB database file
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                           # React Frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── Chat.tsx
│       │   │   ├── MessageList.tsx
│       │   │   ├── MessageBubble.tsx
│       │   │   ├── InputBar.tsx
│       │   │   ├── PlanCard.tsx
│       │   │   └── VenueCard.tsx
│       │   ├── hooks/
│       │   │   └── useChat.ts
│       │   ├── services/
│       │   │   └── api.ts
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       └── index.html
│
├── docs/
│   └── prompts/
│       └── gno-planner.md             # Agent system prompt (for Foundry)
│
├── package.json                       # Root monorepo config
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── Plan.md
├── Masterplan.md
├── Generalplan.md
└── IMPLEMENTATION_PLAN.md             # This file
```

---

## Demo Data

### Demo Users (6 interconnected)

| ID | Name | Role | Connections |
|----|------|------|-------------|
| user-1 | Sarah Chen | Primary user | Friends with Emma, knows Mike |
| user-2 | Emma Rodriguez | Sarah's best friend | Friends with Sarah, Lisa |
| user-3 | Lisa Park | Friend of Emma | Friends with Emma, Alex |
| user-4 | Alex Kim | Lisa's friend | Friends with Lisa |
| user-5 | Mike Johnson | Sarah's coworker | Knows Sarah, used Driver Pat |
| user-6 | Pat Driver | Service provider (driver) | Connected via Mike |

### Trust Network Example

```
Sarah (user-1)
├── 1st degree: Emma (user-2), Mike (user-5)
│   ├── Emma reviewed "The Rustic" → Sarah sees with 100% weight
│   └── Mike used Pat's driving service → Sarah sees Pat with trust boost
└── 2nd degree: Lisa (user-3) via Emma
    └── Lisa reviewed "Deep Ellum bars" → Sarah sees with 60% weight
```

### Dallas Venues (30+)

**Restaurants (15+):**
- Uptown: The Henry, Moxie's, Al Biernat's
- Deep Ellum: Pecan Lodge, Revolver Taco, Cane Rosso
- Bishop Arts: Lucia, Eno's Pizza, Oddfellows
- Downtown: Nick & Sam's, Dakota's, Town Hearth

**Bars (15+):**
- Uptown: The Standard Pour, Happiest Hour
- Deep Ellum: Truth & Alibi, Braindead Brewing, Midnight Rambler
- Lower Greenville: HG Sply Co, Truck Yard
- Design District: Henry's Majestic

**Events (15):**
- Concerts at House of Blues, Granada Theater
- Comedy at Addison Improv, Dallas Comedy Club
- Art events in Bishop Arts

---

## Implementation Phases

### Phase 1: Foundation (Steps 1-3) ✅ IN PROGRESS
- [x] Create implementation plan
- [ ] Initialize monorepo (pnpm, TypeScript)
- [ ] Build packages/core with all types
- [ ] Add Zod schemas for validation

### Phase 2: Service Graph (Step 4)
- [ ] SocialGraphService with trust calculation
- [ ] PreferenceEngine with group aggregation
- [ ] MatchingEngine with trust-weighted scoring
- [ ] Demo users and connections data

### Phase 3: GNO Tools (Step 5)
- [ ] Dallas venue mock data
- [ ] MockYelpService
- [ ] MockGoogleService
- [ ] RideshareEstimator
- [ ] MockEventsService

### Phase 4: Azure Functions (Step 6)
- [ ] Project setup for local dev
- [ ] 6 tool function endpoints
- [ ] Health check endpoint

### Phase 5: API Server (Step 7)
- [ ] Express server setup
- [ ] MockAgentService (state machine dialog)
- [ ] Tool executor service
- [ ] Session management with LowDB
- [ ] REST endpoints

### Phase 6: Frontend (Step 8)
- [ ] Vite + React + Tailwind setup
- [ ] Chat components
- [ ] Plan visualization
- [ ] Connect to API

### Phase 7: Integration (Step 9)
- [ ] End-to-end testing
- [ ] Demo scenarios
- [ ] Documentation

---

## Foundry Migration Plan

When Azure AI Foundry access is available:

1. **Create AI Foundry Hub + Project**
   - Hub: `aihub-gno`
   - Project: `GirlsNightOut`

2. **Configure Agent in Portal**
   - Name: `GNO Planner`
   - Model: `gpt-4o`
   - System prompt: Copy from `docs/prompts/gno-planner.md`
   - Add tool definitions (JSON schemas in this doc)

3. **Update API Service**
   - Replace `MockAgentService` with `FoundryAgentService`
   - Use `@azure/ai-projects` SDK
   - Connect tools via Azure Functions URLs

4. **Deploy Infrastructure**
   - Azure Functions for tools
   - Container Apps for API
   - Static Web Apps for frontend
   - Cosmos DB for persistence

---

## Tool Definitions (for Foundry)

### search_restaurants
```json
{
  "name": "search_restaurants",
  "description": "Search for restaurants in a location. Returns up to 10 results.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and neighborhood, e.g., 'Uptown Dallas'"
      },
      "cuisine": {
        "type": "string",
        "description": "Type of cuisine, e.g., 'Italian', 'Mexican', 'Steakhouse'"
      },
      "price_level": {
        "type": "integer",
        "description": "1 (cheap) to 4 (expensive)",
        "enum": [1, 2, 3, 4]
      },
      "party_size": {
        "type": "integer",
        "description": "Number of people"
      },
      "vibes": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Atmosphere: 'trendy', 'upscale', 'casual', 'romantic', 'lively'"
      }
    },
    "required": ["location", "party_size"]
  }
}
```

### search_bars
```json
{
  "name": "search_bars",
  "description": "Search for bars and nightlife spots.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and neighborhood"
      },
      "vibes": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Type: 'cocktail bar', 'wine bar', 'rooftop', 'dive bar', 'dance club'"
      },
      "price_level": {
        "type": "integer",
        "enum": [1, 2, 3, 4]
      },
      "open_late": {
        "type": "boolean",
        "description": "Only venues open past midnight"
      }
    },
    "required": ["location"]
  }
}
```

### search_events
```json
{
  "name": "search_events",
  "description": "Search for events, concerts, shows happening on a date.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "date": {
        "type": "string",
        "description": "YYYY-MM-DD format"
      },
      "categories": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Event types: 'concert', 'comedy', 'art', 'live music'"
      }
    },
    "required": ["location", "date"]
  }
}
```

### get_rideshare_estimate
```json
{
  "name": "get_rideshare_estimate",
  "description": "Get Uber/Lyft price estimates between two locations.",
  "parameters": {
    "type": "object",
    "properties": {
      "pickup_address": {
        "type": "string",
        "description": "Starting address"
      },
      "dropoff_address": {
        "type": "string",
        "description": "Destination address"
      },
      "passenger_count": { "type": "integer" }
    },
    "required": ["pickup_address", "dropoff_address"]
  }
}
```

### get_directions
```json
{
  "name": "get_directions",
  "description": "Get travel time between two locations.",
  "parameters": {
    "type": "object",
    "properties": {
      "origin": { "type": "string" },
      "destination": { "type": "string" },
      "mode": {
        "type": "string",
        "enum": ["walking", "driving", "transit"]
      }
    },
    "required": ["origin", "destination", "mode"]
  }
}
```

### check_availability
```json
{
  "name": "check_availability",
  "description": "Check restaurant availability for reservations.",
  "parameters": {
    "type": "object",
    "properties": {
      "venue_id": { "type": "string" },
      "venue_name": { "type": "string" },
      "date": {
        "type": "string",
        "description": "YYYY-MM-DD"
      },
      "time": {
        "type": "string",
        "description": "HH:MM format"
      },
      "party_size": { "type": "integer" }
    },
    "required": ["venue_id", "venue_name", "date", "time", "party_size"]
  }
}
```

---

## Mock Agent State Machine

```
┌─────────────┐
│  GREETING   │ "Hey! I'd love to help plan your night out..."
└──────┬──────┘
       │ user responds
       ▼
┌─────────────┐
│  GATHERING  │ Collect: date, time, party_size, location, vibe, budget
└──────┬──────┘ Ask 1-2 questions at a time
       │ have enough info
       ▼
┌─────────────┐
│  SEARCHING  │ Call tools: search_restaurants, search_bars
└──────┬──────┘
       │ got results
       ▼
┌─────────────┐
│ PRESENTING  │ Format timeline with venues, travel, costs
└──────┬──────┘
       │ user asks for changes
       ▼
┌─────────────┐
│  REFINING   │ Handle: "show more options", "different vibe", "cheaper"
└─────────────┘
```

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start all services (from root)
pnpm dev

# Or individually:
cd apps/tools && func start          # Functions on :7071
cd apps/api && pnpm dev              # API on :8080
cd apps/web && pnpm dev              # Frontend on :5173
```

---

## Key Decisions

1. **Dallas venues** for mock data (user preference)
2. **LowDB** for persistence (JSON-based, easy Cosmos migration)
3. **6 demo users** with pre-set social connections
4. **Trust scoring algorithm**: 40% connection distance, 35% network reviews, 15% endorsements, 10% global
5. **Mock agent** with state machine until Foundry access
6. **pnpm workspaces** for monorepo management

---

## Next Steps After This Build

1. Get Azure AI Foundry access
2. Create Foundry Hub + Project
3. Configure GNO Planner agent with system prompt
4. Deploy Azure Functions
5. Swap MockAgentService → FoundryAgentService
6. Deploy to Azure (Container Apps, Static Web Apps)
7. Add real Yelp/Google API keys
8. Build second client app (e.g., DriverFirst) on Service Graph
