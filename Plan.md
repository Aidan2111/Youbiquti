# Girls Night Out - Azure AI Foundry Development Plan

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│  React Web App (Azure Static Web Apps)                             │
│  - Chat UI                                                         │
│  - Plan visualization                                              │
│  - Links to booking sites                                          │
└─────────────────────────┬──────────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  API Layer (Azure Container Apps)                                  │
│  - User session management                                         │
│  - Calls Foundry Agent                                             │
│  - Executes tool calls                                             │
└─────────────────────────┬──────────────────────────────────────────┘
                          │ Foundry SDK
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  Azure AI Foundry                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Agent: "GNO Planner"                                        │  │
│  │  - System prompt (configured in portal)                      │  │
│  │  - Tool definitions (configured in portal)                   │  │
│  │  - Model: GPT-4o                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                       │
│                            │ Tool calls                            │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Custom Tools (Azure Functions)                              │  │
│  │  - search_restaurants                                        │  │
│  │  - search_bars                                               │  │
│  │  - search_events                                             │  │
│  │  - get_rideshare_estimate                                    │  │
│  │  - get_directions                                            │  │
│  │  - check_availability                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Tracing → Application Insights                                    │
└────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  External APIs                                                     │
│  Yelp Fusion │ Google Places │ Google Maps │ (future: OpenTable)   │
└────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
girls-night-out/
├── tools/                    # Azure Functions - Custom tools
│   ├── src/
│   │   ├── functions/
│   │   │   ├── searchRestaurants.ts
│   │   │   ├── searchBars.ts
│   │   │   ├── searchEvents.ts
│   │   │   ├── getRideshareEstimate.ts
│   │   │   ├── getDirections.ts
│   │   │   ├── checkAvailability.ts
│   │   │   └── health.ts
│   │   ├── services/
│   │   │   ├── yelp.ts
│   │   │   ├── google.ts
│   │   │   ├── rideshare.ts
│   │   │   └── events.ts
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   └── host.json
│
├── api/                      # Container App - API wrapper
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chat.ts
│   │   │   └── sessions.ts
│   │   ├── services/
│   │   │   ├── agent.ts
│   │   │   └── sessions.ts
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
│
├── web/                      # React web app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── InputBar.tsx
│   │   │   └── PlanCard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   │   └── useChat.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── docs/
    └── prompts/              # Version controlled prompts
```

## Timeline

| Phase | Focus | Days |
|-------|-------|------|
| 1 | Azure Infrastructure + Foundry Project | 1 |
| 2 | Agent Configuration in Foundry Portal | 1 |
| 3 | Custom Tools (Azure Functions) | 2-3 |
| 4 | API Wrapper (Container Apps) | 1-2 |
| 5 | React Web App | 1-2 |
| 6 | Connect Everything + Polish | 1 |

**Total: ~8-10 days**

---

## Phase 1: Azure Infrastructure Setup

### Step 1.1: Create All Resources

**Azure CLI Script:**

```bash
# Variables
RG="rg-girls-night-out"
LOCATION="eastus"

# Create resource group
az group create --name $RG --location $LOCATION

# Create Log Analytics (needed for Container Apps)
az monitor log-analytics workspace create \
  --resource-group $RG \
  --workspace-name log-gno

# Create Application Insights
az monitor app-insights component create \
  --app appi-gno \
  --location $LOCATION \
  --resource-group $RG \
  --workspace log-gno

# Create Azure OpenAI
az cognitiveservices account create \
  --name aoai-gno \
  --resource-group $RG \
  --location $LOCATION \
  --kind OpenAI \
  --sku S0

# Deploy GPT-4o
az cognitiveservices account deployment create \
  --name aoai-gno \
  --resource-group $RG \
  --deployment-name gpt-4o \
  --model-name gpt-4o \
  --model-version "2024-08-06" \
  --model-format OpenAI \
  --sku-capacity 30 \
  --sku-name Standard

# Create Cosmos DB (serverless)
az cosmosdb create \
  --name cosmos-gno \
  --resource-group $RG \
  --locations regionName=$LOCATION \
  --capabilities EnableServerless

az cosmosdb sql database create \
  --account-name cosmos-gno \
  --resource-group $RG \
  --name girlsnightout

az cosmosdb sql container create \
  --account-name cosmos-gno \
  --resource-group $RG \
  --database-name girlsnightout \
  --name sessions \
  --partition-key-path /userId

# Create Storage (for Functions)
az storage account create \
  --name stgno$RANDOM \
  --resource-group $RG \
  --location $LOCATION \
  --sku Standard_LRS

# Create Function App
az functionapp create \
  --name func-gno-tools \
  --resource-group $RG \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --storage-account $(az storage account list -g $RG --query "[0].name" -o tsv)

# Create Container Apps Environment
LOG_ID=$(az monitor log-analytics workspace show -g $RG -n log-gno --query customerId -o tsv)
LOG_KEY=$(az monitor log-analytics workspace get-shared-keys -g $RG -n log-gno --query primarySharedKey -o tsv)

az containerapp env create \
  --name cae-gno \
  --resource-group $RG \
  --location $LOCATION \
  --logs-workspace-id $LOG_ID \
  --logs-workspace-key $LOG_KEY

# Create Static Web App (for React frontend)
az staticwebapp create \
  --name swa-gno \
  --resource-group $RG \
  --location centralus
```

### Step 1.2: Create AI Foundry Hub and Project

**In Azure Portal (portal.azure.com):**

1. Search for "Azure AI Foundry"
2. Click **+ New hub**
   - Hub name: `aihub-gno`
   - Resource group: `rg-girls-night-out`
   - Region: East US
   - Connect Azure OpenAI: `aoai-gno`
   - Connect Application Insights: `appi-gno`
3. Create hub, then create project inside it: `GirlsNightOut`
4. Note the **Project connection string** from Settings → Properties

---

## Phase 2: Agent Configuration in Foundry Portal

### Step 2.1: Create Agent

**In AI Foundry Portal (ai.azure.com):**

1. Open your project
2. Go to **Build → Agents**
3. Click **+ New agent**
4. Name: `GNO Planner`
5. Model: `gpt-4o`

### Step 2.2: System Prompt

**Paste this into the Instructions field:**

```
You are GNO (Girls Night Out), a fun and knowledgeable AI concierge that helps groups plan perfect nights out. You're like that friend who always knows the best spots.

## Personality
- Warm and enthusiastic, not over the top
- Speak casually like a helpful friend
- Use emoji sparingly (1-2 per message max)
- Be confident in your recommendations

## Planning Process

### Step 1: Gather Essentials
Before searching, you need:
- **Date & time**: When is this happening?
- **Group size**: How many people?
- **Location**: What city/neighborhood?
- **Vibe**: What kind of night? (chill, wild, classy, dancing, low-key)
- **Budget**: Budget-friendly, moderate, or splurge-worthy?
- **Dietary needs**: Any restrictions?

Ask conversationally, 1-2 questions at a time.

Example: "Hey! I'd love to help plan this. When are you thinking - this weekend? And how many of you are going out?"

### Step 2: Search and Curate
Once you have basics:
1. Use your tools to search for real options
2. Pick 2-3 best fits (not a long list)
3. Explain WHY each works
4. Include practical details

IMPORTANT: Only suggest places from search results. Never make up venue names.

### Step 3: Build the Timeline
A great night needs good flow:
- Start time → Dinner → Drinks → Optional activity → End
- Account for travel between venues (use get_directions)
- Realistic timing: dinner = 1.5-2 hours
- Get rideshare estimates for groups of 4+ or venues far apart

### Step 4: Present the Plan
Format as a clear timeline:

**Your Saturday Night Plan** 🌙

🍽️ **7:00 PM** - Dinner at **[Restaurant]**
   [Brief description] | ~$35-45/person
   [Yelp link]

🚗 **8:45 PM** - Head to [Area]
   Uber ~$20-25, 12 min

🍸 **9:00 PM** - Drinks at **[Bar]**
   [Brief description] | ~$15-20/person

💰 **Estimated total:** $XX-XX per person

## Tool Usage

### search_restaurants
- Always search before suggesting dinner spots
- Include cuisine if mentioned
- Match price_level to budget (1=cheap, 4=expensive)

### search_bars  
- Search after dinner is set
- Match the vibe they want

### search_events
- Check for special events that night
- Good for adding unexpected elements

### get_directions
- Calculate travel times for timeline
- Use for realistic scheduling

### get_rideshare_estimate
- Groups of 4+ people
- Venues more than 10 min walk apart

### check_availability
- Before recommending specific times
- Offer alternatives if unavailable

## Constraints
- Only suggest real venues from search results
- Don't confirm bookings (provide links instead)
- Stay within stated budget
- Be realistic about timing
```

### Step 2.3: Add Tool Definitions

**Add each tool in the portal:**

#### search_restaurants
```json
{
  "name": "search_restaurants",
  "description": "Search for restaurants in a location. Returns up to 10 results.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and neighborhood, e.g., 'Downtown Austin'"
      },
      "cuisine": {
        "type": "string",
        "description": "Type of cuisine, e.g., 'Italian', 'Mexican', 'Sushi'"
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

#### search_bars
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

#### search_events
```json
{
  "name": "search_events",
  "description": "Search for events, concerts, shows happening on a date.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string"
      },
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

#### get_rideshare_estimate
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
      "passenger_count": {
        "type": "integer"
      }
    },
    "required": ["pickup_address", "dropoff_address"]
  }
}
```

#### get_directions
```json
{
  "name": "get_directions",
  "description": "Get travel time between two locations.",
  "parameters": {
    "type": "object",
    "properties": {
      "origin": {
        "type": "string"
      },
      "destination": {
        "type": "string"
      },
      "mode": {
        "type": "string",
        "enum": ["walking", "driving", "transit"]
      }
    },
    "required": ["origin", "destination", "mode"]
  }
}
```

#### check_availability
```json
{
  "name": "check_availability",
  "description": "Check restaurant availability for reservations.",
  "parameters": {
    "type": "object",
    "properties": {
      "venue_id": {
        "type": "string"
      },
      "venue_name": {
        "type": "string"
      },
      "date": {
        "type": "string",
        "description": "YYYY-MM-DD"
      },
      "time": {
        "type": "string",
        "description": "HH:MM format"
      },
      "party_size": {
        "type": "integer"
      }
    },
    "required": ["venue_id", "venue_name", "date", "time", "party_size"]
  }
}
```

### Step 2.4: Save and Test in Playground

Test with: "Plan a girls night for 5 this Saturday in Austin. We want nice dinner then drinks."

Note the **Agent ID** for later.

---

## Phase 3: Custom Tools (Azure Functions)

### Step 3.1: Initialize Project

```bash
mkdir girls-night-out && cd girls-night-out
mkdir tools api web
cd tools
func init --typescript
```

**Copilot Prompt:**

```
Update this Azure Functions project with:

1. package.json dependencies:
   - axios
   - zod
   - @googlemaps/google-maps-services-js
   - applicationinsights

2. Create src/ folder structure:
   /functions
   /services  
   /types

3. local.settings.json with:
   - YELP_API_KEY
   - GOOGLE_MAPS_API_KEY
   - APPLICATIONINSIGHTS_CONNECTION_STRING
```

### Step 3.2: Types

**Create file:** `src/types/index.ts`

**Copilot Prompt:**

```
Create TypeScript types for the tools:

1. Restaurant:
   - id, name, cuisine, price_level (1-4), rating, review_count
   - address, neighborhood, coordinates {lat, lng}
   - photos[], highlights[], hours_today
   - yelp_url, booking_url?

2. Bar (extends Restaurant pattern):
   - Add: bar_type, music_type?, dress_code?, open_until

3. Event:
   - id, name, venue, address, date, start_time, end_time?
   - category, price, ticket_url?, description, image_url?

4. DirectionsResult:
   - duration_minutes, duration_text, distance_miles, distance_text

5. RideshareEstimate:
   - estimated_price_low, estimated_price_high
   - estimated_duration_minutes
   - uber_url, lyft_url, disclaimer

6. AvailabilityResult:
   - available, venue_name, requested_time
   - alternative_times[], booking_url?, waitlist_available

Include Zod schemas for each.
```

### Step 3.3: Yelp Service

**Create file:** `src/services/yelp.ts`

**Copilot Prompt:**

```
Create Yelp Fusion API service:

1. Config: API key from env, base URL https://api.yelp.com/v3

2. searchBusinesses function:
   Params: location, term?, categories?, price?, limit (default 10)
   
   - Call /v3/businesses/search
   - Transform to our Restaurant type
   - Include yelp_url for each result
   
3. mapVibesToCategories helper:
   - 'trendy' → 'newamerican,cocktailbars'
   - 'upscale' → 'finedinig'  
   - 'casual' → 'gastropubs'
   - 'romantic' → 'french,wine_bars'

4. Error handling: return empty array on error
```

### Step 3.4: Google Service

**Create file:** `src/services/google.ts`

**Copilot Prompt:**

```
Create Google Maps service:

1. getDirections function:
   Params: origin, destination, mode
   Returns: DirectionsResult
   
   - Use Directions API
   - Extract duration and distance
   - Convert to miles

2. geocodeAddress function:
   Params: address
   Returns: {lat, lng} or null

Handle errors gracefully.
```

### Step 3.5: Rideshare Service

**Create file:** `src/services/rideshare.ts`

**Copilot Prompt:**

```
Create rideshare estimation service:

1. estimateRide function:
   Params: pickup coords, dropoff coords, passengers
   Returns: RideshareEstimate
   
   Estimate logic:
   - Calculate distance (Haversine)
   - Base: $2.50, per mile: $1.75, min: $8
   - Add 15% for high estimate
   - XL pricing if passengers > 4
   
   Generate URLs (not deep links, just web):
   - Uber: https://m.uber.com/ul/?pickup[latitude]=X&dropoff[latitude]=Y...
   - Lyft: https://lyft.com/ride?pickup[latitude]=X...
   
   Include disclaimer about estimates.
```

### Step 3.6: Events Service (Mock)

**Create file:** `src/services/events.ts`

**Copilot Prompt:**

```
Create mock events service for demo:

1. searchEvents function:
   Params: location, date, categories?
   Returns: Event[]
   
2. Include 15 mock events for Austin:
   - Concerts, comedy, art shows, food events
   - Mix of prices ($0 to $50)
   - Realistic venue names
   - Weekend dates

3. Filter by category if provided
4. Add small delay (200ms) for realism
```

### Step 3.7: Function Endpoints

**Create file:** `src/functions/searchRestaurants.ts`

**Copilot Prompt:**

```
Create Azure Function for search_restaurants:

HTTP POST /api/tools/search_restaurants

Request body: {
  location: string,
  cuisine?: string,
  price_level?: number,
  party_size: number,
  vibes?: string[]
}

Implementation:
1. Validate with Zod
2. Map vibes to Yelp categories
3. Call Yelp service
4. Return { success: true, results: [], result_count: n }

On error: { success: false, error: "message", results: [] }
```

**Create similar functions for each tool:**

- `searchBars.ts` - Same pattern, different categories
- `searchEvents.ts` - Uses mock service
- `getRideshareEstimate.ts` - Geocode addresses first, then estimate
- `getDirections.ts` - Uses Google service
- `checkAvailability.ts` - Mock: 70% available, 30% suggest alternatives

### Step 3.8: Deploy Functions

```bash
npm run build
func azure functionapp publish func-gno-tools
```

Get the function app URL and default key for the API layer.

---

## Phase 4: API Wrapper (Container Apps)

### Step 4.1: Initialize Project

```bash
cd ../api
npm init -y
```

**Copilot Prompt:**

```
Set up Express TypeScript API project:

1. package.json with:
   - express, cors, helmet
   - @azure/identity, @azure/ai-projects
   - @azure/cosmos
   - zod, dotenv
   - typescript, ts-node-dev

2. tsconfig.json for ES2022

3. Dockerfile:
   - Node 20 alpine
   - Multi-stage build
   - Port 8080

4. src/ structure:
   /routes
   /services
   index.ts
```

### Step 4.2: Agent Service

**Create file:** `src/services/agent.ts`

**Copilot Prompt:**

```
Create Foundry agent service:

1. Import AIProjectsClient from @azure/ai-projects

2. Initialize with:
   - Connection string from env
   - DefaultAzureCredential
   - Agent ID from env

3. createThread(): Create new conversation thread

4. sendMessage(threadId, message):
   a. Add user message to thread
   b. Create run with agent
   c. Poll for completion
   d. When requires_action (tool calls):
      - Execute tools by calling Function App
      - Submit tool outputs
      - Continue polling
   e. Return final assistant message

5. executeToolCall(name, args):
   - POST to Function App endpoint
   - Return result
   
Environment:
- AZURE_AI_PROJECT_CONNECTION_STRING
- AZURE_AI_AGENT_ID  
- FUNCTION_APP_URL
- FUNCTION_APP_KEY
```

### Step 4.3: Session Service

**Create file:** `src/services/sessions.ts`

**Copilot Prompt:**

```
Create Cosmos session service:

Session type: {
  id: string,
  userId: string,
  threadId: string,
  createdAt: string,
  updatedAt: string,
  status: 'active' | 'completed'
}

Functions:
1. getOrCreateSession(userId, sessionId?):
   - If sessionId, fetch existing
   - Otherwise create new thread + session record
   
2. updateSession(id, updates)

3. listSessions(userId): Recent sessions for user

4. getSession(id, userId): Single session with ownership check
```

### Step 4.4: Routes

**Create file:** `src/routes/chat.ts`

**Copilot Prompt:**

```
Create Express routes:

1. POST /api/chat
   Body: { userId, sessionId?, message }
   
   - Get or create session
   - Send message to agent
   - Return { sessionId, message, toolsUsed? }

2. GET /api/sessions
   Query: userId
   - Return list of sessions

3. GET /api/sessions/:id  
   Query: userId
   - Return session details

Simple error handling middleware.
```

### Step 4.5: Main Entry

**Create file:** `src/index.ts`

**Copilot Prompt:**

```
Create Express app:

- CORS (allow web app origin)
- Helmet security headers
- JSON body parser
- Mount /api routes
- Health check at /health
- Error handling
- Listen on PORT (default 8080)
```

### Step 4.6: Deploy to Container Apps

```bash
# Build and push
az acr build --registry <acr> --image gno-api:latest .

# Create container app
az containerapp create \
  --name ca-gno-api \
  --resource-group rg-girls-night-out \
  --environment cae-gno \
  --image <acr>.azurecr.io/gno-api:latest \
  --target-port 8080 \
  --ingress external \
  --env-vars \
    AZURE_AI_PROJECT_CONNECTION_STRING=secret \
    AZURE_AI_AGENT_ID=your-agent-id \
    FUNCTION_APP_URL=https://func-gno-tools.azurewebsites.net/api/tools \
    FUNCTION_APP_KEY=your-key \
    COSMOS_CONNECTION_STRING=secret
```

---

## Phase 5: React Web App

### Step 5.1: Initialize Project

```bash
cd ../web
npm create vite@latest . -- --template react-ts
npm install
```

**Copilot Prompt:**

```
Configure the Vite React project:

1. Install dependencies:
   - @tanstack/react-query
   - tailwindcss, postcss, autoprefixer

2. Initialize Tailwind:
   npx tailwindcss init -p

3. Configure tailwind.config.js for src/**/*.tsx

4. Create folder structure:
   /components
   /hooks
   /services
```

### Step 5.2: API Service

**Create file:** `src/services/api.ts`

**Copilot Prompt:**

```
Create API client:

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

Types:
- ChatResponse: { sessionId, message, toolsUsed? }
- Session: { id, createdAt, updatedAt, status }

Functions:
1. sendMessage(userId, sessionId, message): Promise<ChatResponse>
   - POST /api/chat
   
2. getSessions(userId): Promise<Session[]>
   - GET /api/sessions

3. getUserId(): string
   - Get from localStorage or generate UUID

Simple fetch, no streaming for now.
```

### Step 5.3: Chat Hook

**Create file:** `src/hooks/useChat.ts`

**Copilot Prompt:**

```
Create useChat hook:

State:
- sessionId: string | null
- messages: Array<{id, role, content, timestamp}>
- isLoading: boolean
- error: string | null

Functions:
- sendMessage(text): Add user message, call API, add response
- startNewChat(): Clear state
- setError, clearError

Use useState, handle async properly.
Return all state and functions.
```

### Step 5.4: Chat Component

**Create file:** `src/components/Chat.tsx`

**Copilot Prompt:**

```
Create the main Chat component:

Layout (full viewport height):
- Header: "Girls Night Out 🌙" + "New Chat" button
- Messages area: scrollable, flex-grow
- Input bar: fixed at bottom

Use Tailwind for styling:
- Clean, modern look
- Pink/purple accent colors (#ec4899, #a855f7)
- Dark header, light chat area

Import and use: MessageList, InputBar
Get state from useChat hook
```

### Step 5.5: Message Components

**Create file:** `src/components/MessageList.tsx`

**Copilot Prompt:**

```
Create MessageList component:

Props: messages array

- Map messages to MessageBubble components
- Auto-scroll to bottom on new messages
- Empty state: "Start planning your perfect night out!"
```

**Create file:** `src/components/MessageBubble.tsx`

**Copilot Prompt:**

```
Create MessageBubble component:

Props: { role, content, timestamp }

Styling:
- User: right-aligned, pink/purple gradient background, white text
- Assistant: left-aligned, light gray background, dark text
- Rounded corners, padding, margin between messages
- Show timestamp below in smaller text

Parse assistant content for:
- Bold text (**text**)
- Line breaks
- Links (make clickable)
```

### Step 5.6: Input Bar

**Create file:** `src/components/InputBar.tsx`

**Copilot Prompt:**

```
Create InputBar component:

Props: { onSend, disabled }

- Text input with placeholder "Plan your night out..."
- Send button (arrow icon or "Send")
- Disable input and button when disabled=true
- Submit on Enter key
- Clear input after send

Styling:
- Sticky bottom
- Border top
- Padding
- Send button with accent color
```

### Step 5.7: App Entry

**Create file:** `src/App.tsx`

**Copilot Prompt:**

```
Create App component:

- QueryClientProvider wrapper (react-query)
- Chat component
- Simple container with max-width for larger screens
```

### Step 5.8: Local Testing

```bash
# Terminal 1: API (needs Foundry access)
cd api && npm run dev

# Terminal 2: Web
cd web && npm run dev
```

Open http://localhost:5173

### Step 5.9: Deploy to Static Web Apps

```bash
cd web
npm run build

az staticwebapp deploy \
  --name swa-gno \
  --resource-group rg-girls-night-out \
  --source dist \
  --env-vars VITE_API_URL=https://ca-gno-api.azurecontainerapps.io/api
```

---

## Phase 6: Connect Everything + Polish

### Step 6.1: Test Full Flow

1. Open web app
2. Type: "Plan a girls night for 4 this Saturday in Austin"
3. Verify:
   - Agent responds with questions
   - Tool calls execute (check Function App logs)
   - Results incorporated into response
   - Plan builds over conversation

### Step 6.2: View Traces in Foundry

1. Go to AI Foundry Portal → your project
2. Open **Tracing**
3. See conversation traces with:
   - Each message
   - Tool calls with inputs/outputs
   - Latencies

### Step 6.3: App Insights Dashboard

**Create workbook with:**

```kusto
// Response times
requests
| where name contains "chat"
| summarize avg(duration), p95=percentile(duration, 95) by bin(timestamp, 1h)
| render timechart

// Tool usage
customEvents
| where name == "ToolExecuted"  
| summarize count() by tostring(customDimensions.tool)
| render piechart
```

### Step 6.4: Quick Fixes

| Issue | Fix |
|-------|-----|
| CORS errors | Add web app origin to API CORS config |
| Tools timeout | Increase Function App timeout in host.json |
| Agent loops | Refine system prompt to be more decisive |
| Slow responses | Check cold starts, consider premium functions |

---

## Environment Variables Summary

### Tools (Function App)
```
YELP_API_KEY=xxx
GOOGLE_MAPS_API_KEY=xxx
APPLICATIONINSIGHTS_CONNECTION_STRING=xxx
```

### API (Container App)
```
AZURE_AI_PROJECT_CONNECTION_STRING=xxx
AZURE_AI_AGENT_ID=xxx
FUNCTION_APP_URL=https://func-gno-tools.azurewebsites.net/api/tools
FUNCTION_APP_KEY=xxx
COSMOS_CONNECTION_STRING=xxx
APPLICATIONINSIGHTS_CONNECTION_STRING=xxx
```

### Web (Static Web App)
```
VITE_API_URL=https://ca-gno-api.azurecontainerapps.io/api
```

---

## Quick Commands

```bash
# Start everything locally
cd tools && npm start &
cd api && npm run dev &
cd web && npm run dev

# Deploy tools
cd tools && func azure functionapp publish func-gno-tools

# Deploy API  
cd api && az acr build --registry <acr> --image gno-api:v2 . && \
az containerapp update --name ca-gno-api -g rg-girls-night-out --image <acr>.azurecr.io/gno-api:v2

# Deploy web
cd web && npm run build && az staticwebapp deploy --name swa-gno --source dist
```

---

## Demo Checklist

- [ ] Web app loads
- [ ] Can start conversation
- [ ] Agent asks clarifying questions
- [ ] Restaurant search works
- [ ] Bar search works  
- [ ] Rideshare estimates show
- [ ] Timeline plan renders
- [ ] Links to Yelp work
- [ ] Traces visible in Foundry
- [ ] App Insights shows metrics