# Youbiquti - The Service Graph

A trust-weighted commerce protocol where **Girls' Night Out (GNO)** is the first client application.

## 🎯 Vision

The Service Graph connects service seekers with providers through trust-weighted networks. Unlike traditional platforms that rely on anonymous reviews, we leverage your real social connections to surface providers your friends actually trust.

## 📦 Project Structure

```
youbiquti/
├── packages/
│   ├── core/           # Shared types, schemas, utilities
│   ├── service-graph/  # Trust calculation, preferences, matching
│   └── gno-tools/      # GNO-specific tools (Dallas venues mock data)
├── apps/
│   ├── tools/          # Azure Functions for tool endpoints
│   ├── api/            # Express API with mock agent
│   └── web/            # React chat frontend
└── IMPLEMENTATION_PLAN.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Azure Functions Core Tools (for running tools locally)

### Installation

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm build
```

### Running the App

```bash
# Terminal 1: Start the API server
cd apps/api
pnpm dev

# Terminal 2: Start the web frontend
cd apps/web
pnpm dev

# (Optional) Terminal 3: Start Azure Functions
cd apps/tools
pnpm start
```

Open http://localhost:3000 to chat with the GNO assistant!

## 🧠 Architecture

### The Service Graph Core

**Trust Score Calculation**
- 40% Connection Distance (1st degree = 100, 2nd = 60, 3rd = 30)
- 35% Network Reviews (weighted by connection proximity)
- 15% Endorsements (skill-specific recommendations)
- 10% Global Reputation (fallback for strangers)

**Key Services**
- `SocialGraphService` - Connection tracking, trust calculation
- `PreferenceService` - User & group preference aggregation
- `MatchingService` - Trust-weighted venue matching
- `ServiceRegistryService` - Provider/offering lookup

### GNO Tools (6 Azure Functions)

1. `searchRestaurants` - Search Dallas restaurants
2. `searchBars` - Search Dallas bars
3. `searchEvents` - Search Dallas events
4. `getRideshareEstimate` - Get Uber/Lyft estimates
5. `getDirections` - Get directions between venues
6. `checkAvailability` - Check venue availability

### Mock Agent

Until Azure AI Foundry access is available, the `MockAgentService` implements a state-machine dialog:

```
greeting → gathering → searching → presenting → refining → confirming → complete
```

## 🧪 Demo Data

### Demo Users (6)

| User | Connection to Sarah |
|------|---------------------|
| Sarah | — (main user) |
| Emma | 1st degree (besties) |
| Lisa | 2nd degree (via Emma) |
| Alex | 2nd degree (via Emma) |
| Mike | 1st degree (friendly) |
| Pat | 2nd degree (driver via Mike) |

### Dallas Venues

- **15 Restaurants** (Uptown, Deep Ellum, Bishop Arts, Downtown, Lower Greenville)
- **15 Bars** (cocktail, speakeasy, rooftop, dive, brewery)
- **15 Events** (concerts, comedy, art, wine, dance)

## 🛣️ Roadmap

### Phase 1: Foundation ✅
- [x] Monorepo structure
- [x] Type definitions & schemas
- [x] Service Graph core services
- [x] Mock venue data (Dallas)
- [x] Azure Functions structure
- [x] Mock agent dialog
- [x] Chat frontend

### Phase 2: Azure Integration 🔜
- [ ] Azure AI Foundry agent (replace mock)
- [ ] Cosmos DB (replace LowDB)
- [ ] Azure Static Web Apps deployment
- [ ] Real Yelp/Google APIs

### Phase 3: Trust Features 🔮
- [ ] Real social graph import
- [ ] Provider onboarding
- [ ] Review/endorsement flow
- [ ] Group planning features

## 📄 License

Private - All rights reserved

## 🤝 Contributing

This is a private prototype. Contact the maintainers for access.
