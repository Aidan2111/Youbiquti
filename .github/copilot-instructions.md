# Youbiquti - Copilot Instructions

## Project Overview

This is a **pnpm monorepo** implementing "The Service Graph" - a trust-weighted commerce protocol. The first client is **Girls' Night Out (GNO)**, a Dallas-focused planning assistant.

## Architecture

```
packages/           # Shared libraries (internal dependencies)
├── core/           # Types, schemas, utilities (@youbiquti/core)
├── service-graph/  # Trust calculation, matching engine (@youbiquti/service-graph)
└── gno-tools/      # Mock Dallas venue data (@youbiquti/gno-tools)

apps/               # Deployable applications
├── api/            # Express server with MockAgentService (port 3001)
├── tools/          # Azure Functions for external tool endpoints
└── web/            # React + Vite frontend (port 3000)
```

### Key Service Boundaries
- **`SocialGraphService`** ([social-graph.service.ts](packages/service-graph/src/services/social-graph.service.ts)): Calculates trust scores using connection distance (40%), network reviews (35%), endorsements (15%), global reputation (10%)
- **`MatchingService`** ([matching.service.ts](packages/service-graph/src/services/matching.service.ts)): Matches service requests to providers using trust-weighted scoring
- **`MockAgentService`** ([mock-agent.ts](apps/api/src/services/mock-agent.ts)): State-machine dialog flow (`greeting → gathering → searching → presenting → refining → confirming → complete`)

## Development Commands

```bash
pnpm install          # Install all workspace dependencies
pnpm build            # Build all packages (required before first run)
pnpm dev              # Start api + web concurrently
pnpm dev:tools        # Start Azure Functions locally (requires Azure Functions Core Tools)
```

Run apps individually:
```bash
cd apps/api && pnpm dev    # Express API at http://localhost:3001
cd apps/web && pnpm dev    # React app at http://localhost:3000
cd apps/tools && pnpm start # Azure Functions at http://localhost:7071
```

## Conventions

### Package References
- Use `workspace:*` for internal dependencies in `package.json`
- Import from package name: `import { generateId } from '@youbiquti/core'`
- All packages use ESM (`"type": "module"`) with `.js` extensions in imports

### TypeScript Patterns
- Strict mode enabled with `noUncheckedIndexedAccess`
- Types defined in `packages/core/src/types/` - export via barrel files
- Services are singletons exported alongside their classes:
  ```typescript
  export class SocialGraphService { ... }
  export const socialGraphService = new SocialGraphService();
  ```

### Azure Functions Pattern
Functions in `apps/tools/src/functions/` follow this structure:
```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function functionName(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Parse request, call service, return jsonBody
}

app.http('functionName', { methods: ['POST'], authLevel: 'anonymous', handler: functionName });
```

### Mock Services
All external APIs are mocked in `packages/gno-tools/src/services/`:
- `MockYelpService` - restaurants/bars search
- `MockEventsService` - events search  
- `MockGoogleService` - directions/rideshare

Mock data is hardcoded Dallas venues in `packages/gno-tools/src/data/`.

## Key Patterns

### Trust Score Calculation
Trust scores (0-100) combine four weighted factors - see `TRUST_WEIGHTS` and `CONNECTION_SCORES` constants in [trust.ts](packages/core/src/types/trust.ts).

### Demo Data
Six demo users centered on "Sarah" (`usr_sarah_001`) with various connection degrees. Use `DEMO_USER_ID` in [useChat.ts](apps/web/src/hooks/useChat.ts) for testing.

### ID Generation
Use `generateId(prefix)` from `@youbiquti/core` for consistent IDs: `ses_xxx`, `msg_xxx`, `usr_xxx`, `prv_xxx`.

## Future Integrations
- Replace `MockAgentService` with Azure AI Foundry agent
- Replace mock services with real Yelp/Google APIs
- Add Cosmos DB Gremlin for production social graph storage
