# Azure AI Foundry Setup Guide

## Complete Walkthrough for Agents, Tools, and Configuration

This guide walks you through setting up everything in Azure AI Foundry for the Girls Night Out agent. Follow these steps in order.

---

## Table of Contents

1. [Prerequisites & Resource Creation](#1-prerequisites--resource-creation)
2. [Create AI Foundry Hub](#2-create-ai-foundry-hub)
3. [Create AI Project](#3-create-ai-project)
4. [Connect Required Resources](#4-connect-required-resources)
5. [Deploy GPT-4o Model](#5-deploy-gpt-4o-model)
6. [Create the Agent](#6-create-the-agent)
7. [Configure System Prompt](#7-configure-system-prompt)
8. [Add Tool Definitions](#8-add-tool-definitions)
9. [Test in Playground](#9-test-in-playground)
10. [Get Connection Info for Code](#10-get-connection-info-for-code)
11. [Enable Tracing](#11-enable-tracing)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites & Resource Creation

### What You Need Before Starting

- [ ] Azure subscription with Contributor access
- [ ] Azure CLI installed (`az --version` to verify)
- [ ] Logged into Azure CLI (`az login`)

### Create Supporting Resources First

These resources need to exist BEFORE creating the AI Hub:

```bash
# Set variables
RG="rg-girls-night-out"
LOCATION="eastus"

# Create resource group
az group create --name $RG --location $LOCATION

# Create Azure OpenAI resource
az cognitiveservices account create \
  --name aoai-gno \
  --resource-group $RG \
  --location $LOCATION \
  --kind OpenAI \
  --sku S0

# Create Application Insights (for tracing)
az monitor log-analytics workspace create \
  --resource-group $RG \
  --workspace-name log-gno

az monitor app-insights component create \
  --app appi-gno \
  --location $LOCATION \
  --resource-group $RG \
  --workspace log-gno

# Create Storage Account (required for AI Hub)
az storage account create \
  --name stgnogno$RANDOM \
  --resource-group $RG \
  --location $LOCATION \
  --sku Standard_LRS

# Create Key Vault (required for AI Hub)
az keyvault create \
  --name kv-gno-$RANDOM \
  --resource-group $RG \
  --location $LOCATION
```

### Verify Resources Exist

```bash
az resource list --resource-group $RG --output table
```

You should see:
- Azure OpenAI account
- Application Insights
- Log Analytics workspace
- Storage account
- Key Vault

---

## 2. Create AI Foundry Hub

The Hub is the top-level container that holds projects and shared resources.

### Option A: Azure Portal

1. Go to [portal.azure.com](https://portal.azure.com)

2. Search for **"Azure AI Foundry"** in the top search bar

3. Click **"Azure AI Foundry"** from the results

4. Click **"+ Create"** → **"Hub"**

5. Fill in the **Basics** tab:

   | Field | Value |
   |-------|-------|
   | Subscription | Your subscription |
   | Resource group | `rg-girls-night-out` |
   | Region | East US |
   | Name | `aihub-gno` |

6. Fill in the **Resources** tab:
   
   | Field | Value |
   |-------|-------|
   | Storage account | Select `stgnogno...` (created earlier) |
   | Key vault | Select `kv-gno-...` (created earlier) |
   | Application Insights | Select `appi-gno` |
   | Azure OpenAI | Select `aoai-gno` |

   > ⚠️ **Important**: Connect your existing Azure OpenAI resource here. Don't let it create a new one.

7. **Networking** tab: Leave as default (public access) for demo

8. **Review + create** → **Create**

9. Wait 2-5 minutes for deployment

### Option B: Azure CLI

```bash
# Note: As of 2025, this may require the ml extension
az extension add --name ml

az ml workspace create \
  --name aihub-gno \
  --resource-group $RG \
  --kind hub \
  --storage-account stgnogno... \
  --key-vault kv-gno-... \
  --application-insights appi-gno
```

---

## 3. Create AI Project

Projects live inside Hubs and contain your agents, deployments, and evaluations.

### In Azure Portal

1. Go to your newly created Hub (`aihub-gno`)

2. In the left menu, click **"All projects"**

3. Click **"+ New project"**

4. Configure:
   
   | Field | Value |
   |-------|-------|
   | Name | `GirlsNightOut` |
   | Hub | `aihub-gno` (should be pre-selected) |

5. Click **"Create"**

### In AI Foundry Portal (Alternative)

1. Go to [ai.azure.com](https://ai.azure.com)

2. Sign in with your Azure account

3. Click **"All hubs"** in the left nav

4. Select your hub (`aihub-gno`)

5. Click **"+ New project"**

6. Name it `GirlsNightOut`, click **"Create"**

---

## 4. Connect Required Resources

Your project needs connections to Azure OpenAI and other services.

### Verify Connections

1. In [ai.azure.com](https://ai.azure.com), open your project

2. Click **"Management center"** (gear icon in left nav)

3. Click **"Connected resources"**

4. You should see:
   - ✅ Azure OpenAI (`aoai-gno`) - Status: Connected
   - ✅ Application Insights (`appi-gno`) - Status: Connected

### If Azure OpenAI is Missing

1. Click **"+ New connection"**

2. Select **"Azure OpenAI"**

3. Choose:
   - **Authentication**: API Key or Microsoft Entra ID
   - **Resource**: Select `aoai-gno`

4. Click **"Add connection"**

### If Application Insights is Missing

1. Click **"+ New connection"**

2. Select **"Application Insights"**

3. Select `appi-gno`

4. Click **"Add connection"**

---

## 5. Deploy GPT-4o Model

You need a model deployment before creating an agent.

### Check for Existing Deployment

1. In AI Foundry portal, go to your project

2. Click **"Models + endpoints"** in left nav

3. Look for an existing `gpt-4o` deployment

### Create New Deployment (if needed)

1. Click **"+ Deploy model"** → **"Deploy base model"**

2. Search for **"gpt-4o"**

3. Select **"gpt-4o"** (not gpt-4o-mini for best results)

4. Click **"Confirm"**

5. Configure deployment:

   | Field | Value |
   |-------|-------|
   | Deployment name | `gpt-4o` |
   | Model version | Latest (2024-08-06 or newer) |
   | Deployment type | Standard |
   | Tokens per minute | 30K (adjust based on quota) |

6. Click **"Deploy"**

7. Wait for status to show **"Succeeded"**

### Verify Deployment

1. Go to **"Models + endpoints"**

2. Click on your `gpt-4o` deployment

3. Note the **Deployment name** - you'll need this for the agent

---

## 6. Create the Agent

Now the fun part - creating your AI agent.

### Navigate to Agents

1. In AI Foundry portal ([ai.azure.com](https://ai.azure.com))

2. Open your project (`GirlsNightOut`)

3. In left nav, click **"Build and customize"** → **"Agents"**

   > If you don't see "Agents", you may need to enable preview features (see Troubleshooting)

### Create New Agent

1. Click **"+ New agent"**

2. Configure basic info:

   | Field | Value |
   |-------|-------|
   | Agent name | `GNO Planner` |
   | Description | Girls Night Out planning assistant |

3. Under **Model**, select:
   - **Deployment**: `gpt-4o` (the one you just created)

4. **Don't save yet** - continue to add instructions and tools

---

## 7. Configure System Prompt

### Locate Instructions Field

In the agent configuration, find the **"Instructions"** section (also called "System message" or "System prompt").

### Paste the Full System Prompt

Copy and paste this entire prompt:

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

Ask conversationally, 1-2 questions at a time. Don't interrogate with a list.

Example opening:
"Hey! I'd love to help plan this. When are you thinking - this weekend? And how many of you are going out?"

### Step 2: Search and Curate
Once you have the basics:
1. Use your tools to search for real options
2. Pick 2-3 best fits (not overwhelming lists)
3. Explain WHY each one works for what they described
4. Include practical details they need

CRITICAL: Only suggest places returned by your search tools. Never make up venue names or details.

### Step 3: Build the Timeline
A great night needs good flow:
- Start time → Dinner → Drinks → Optional activity → How they get home
- Account for travel between venues (use get_directions tool)
- Realistic timing: dinner takes 1.5-2 hours, not 45 minutes
- Get rideshare estimates for groups of 4+ or venues far apart

### Step 4: Present the Plan
Format the final plan as a clear timeline:

**Your Saturday Night Plan** 🌙

🍽️ **7:00 PM** - Dinner at **[Restaurant Name]**
   [One line description, why it fits what they wanted]
   ~$35-45/person
   📍 [Address]
   🔗 [Yelp link]

🚗 **8:45 PM** - Head to [Next Area]
   Uber estimate: ~$20-25, 12 min

🍸 **9:00 PM** - Drinks at **[Bar Name]**
   [One line description]
   ~$15-20/person
   📍 [Address]

💰 **Estimated total:** $XX-XX per person (not including drinks at dinner)

## Tool Usage Guidelines

### search_restaurants
- ALWAYS search before suggesting any dinner spot
- Include cuisine type if they mentioned preferences
- Match price_level to their budget:
  - Budget-friendly = 1-2
  - Moderate = 2-3
  - Splurge-worthy = 3-4

### search_bars
- Search AFTER dinner plans are set
- Match the vibe they described
- If they want to dance, include nightclubs in vibes

### search_events
- Check for special events happening that night
- Great for adding an unexpected element
- Proactively mention if you find something cool

### get_directions
- Use to calculate accurate travel times between venues
- Helps you build a realistic timeline
- Use "driving" mode for rideshare estimates

### get_rideshare_estimate
- Use for groups of 4+ people
- Use when venues are more than a 10-minute walk apart
- Include estimates in the final plan

### check_availability
- Use BEFORE recommending a specific reservation time
- If unavailable, immediately search for alternatives
- Don't suggest a time without checking first

## Important Constraints
- Only suggest real venues returned by your search tools
- Don't confirm bookings - provide booking links for them to complete
- Stay within their stated budget
- Be realistic about timing (travel, dining duration)
- If a search returns nothing useful, acknowledge it and try different parameters
```

### Save Instructions

Click **"Save"** or continue to add tools (don't navigate away).

---

## 8. Add Tool Definitions

Tools let your agent take actions like searching for restaurants.

### Navigate to Tools Section

In the agent configuration, find the **"Tools"** section.

### Add Each Tool

Click **"+ Add tool"** → **"Function"** for each tool below.

---

#### Tool 1: search_restaurants

**Name:** `search_restaurants`

**Description:** 
```
Search for restaurants in a location. Use this to find dinner options. Returns real venues with ratings, prices, and links.
```

**Parameters (JSON Schema):**
```json
{
  "type": "object",
  "properties": {
    "location": {
      "type": "string",
      "description": "City and neighborhood or area, e.g., 'Austin, TX' or 'Downtown Austin' or 'East Austin'"
    },
    "cuisine": {
      "type": "string",
      "description": "Type of cuisine, e.g., 'Italian', 'Mexican', 'Japanese', 'American'. Leave empty for all types."
    },
    "price_level": {
      "type": "integer",
      "description": "Price level from 1 (cheap/casual) to 4 (expensive/upscale). Omit to search all price ranges.",
      "enum": [1, 2, 3, 4]
    },
    "party_size": {
      "type": "integer",
      "description": "Number of people in the group. Important for checking if venue can accommodate."
    },
    "vibes": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Desired atmosphere keywords, e.g., ['trendy', 'romantic', 'lively', 'casual', 'upscale', 'cozy', 'instagrammable']"
    }
  },
  "required": ["location", "party_size"]
}
```

Click **"Add"** or **"Save tool"**

---

#### Tool 2: search_bars

**Name:** `search_bars`

**Description:**
```
Search for bars, lounges, and nightlife spots. Use this for post-dinner drinks or late-night venues.
```

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "location": {
      "type": "string",
      "description": "City and neighborhood or area"
    },
    "vibes": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Type of bar atmosphere: 'cocktail bar', 'wine bar', 'rooftop', 'speakeasy', 'dive bar', 'dance club', 'lounge', 'sports bar', 'live music'"
    },
    "price_level": {
      "type": "integer",
      "description": "Price level from 1 to 4",
      "enum": [1, 2, 3, 4]
    },
    "open_late": {
      "type": "boolean",
      "description": "If true, only return venues that are open past midnight"
    }
  },
  "required": ["location"]
}
```

---

#### Tool 3: search_events

**Name:** `search_events`

**Description:**
```
Search for events, concerts, comedy shows, or activities happening on a specific date. Good for adding something special to the night.
```

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "location": {
      "type": "string",
      "description": "City to search for events"
    },
    "date": {
      "type": "string",
      "description": "Date to search in YYYY-MM-DD format"
    },
    "categories": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Event types to search: 'concert', 'comedy', 'art', 'food festival', 'live music', 'theater', 'dance', 'networking'"
    },
    "max_price": {
      "type": "number",
      "description": "Maximum ticket price per person in dollars"
    }
  },
  "required": ["location", "date"]
}
```

---

#### Tool 4: get_rideshare_estimate

**Name:** `get_rideshare_estimate`

**Description:**
```
Get price and time estimates for Uber/Lyft between two locations. Returns cost range and links to book rides.
```

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "pickup_address": {
      "type": "string",
      "description": "Starting address or venue name with city, e.g., 'Uchi Austin, TX' or '801 South Lamar Blvd, Austin, TX'"
    },
    "dropoff_address": {
      "type": "string",
      "description": "Destination address or venue name with city"
    },
    "passenger_count": {
      "type": "integer",
      "description": "Number of passengers. If more than 4, will suggest XL/Plus options."
    }
  },
  "required": ["pickup_address", "dropoff_address"]
}
```

---

#### Tool 5: get_directions

**Name:** `get_directions`

**Description:**
```
Get travel time and distance between two locations. Use this to calculate realistic timing for the itinerary.
```

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "origin": {
      "type": "string",
      "description": "Starting address or place name"
    },
    "destination": {
      "type": "string",
      "description": "Ending address or place name"
    },
    "mode": {
      "type": "string",
      "enum": ["walking", "driving", "transit"],
      "description": "How they're getting there. Use 'driving' for rideshare time estimates."
    }
  },
  "required": ["origin", "destination", "mode"]
}
```

---

#### Tool 6: check_availability

**Name:** `check_availability`

**Description:**
```
Check if a restaurant has availability for a reservation at a specific time. Always use this before suggesting a reservation time.
```

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "venue_id": {
      "type": "string",
      "description": "The venue ID returned from search_restaurants results"
    },
    "venue_name": {
      "type": "string",
      "description": "Human-readable name of the venue for reference"
    },
    "date": {
      "type": "string",
      "description": "Reservation date in YYYY-MM-DD format"
    },
    "time": {
      "type": "string",
      "description": "Desired reservation time in HH:MM format (24-hour), e.g., '19:00' for 7 PM"
    },
    "party_size": {
      "type": "integer",
      "description": "Number of guests for the reservation"
    }
  },
  "required": ["venue_id", "venue_name", "date", "time", "party_size"]
}
```

---

### Save the Agent

After adding all 6 tools, click **"Save"** or **"Create agent"**.

Note the **Agent ID** shown in the URL or agent details - you'll need this later.

---

## 9. Test in Playground

Before writing any code, test the agent's behavior.

### Open Playground

1. In your agent configuration, click **"Test"** or **"Open in playground"**

2. You should see a chat interface

### Test Conversations

**Test 1: Basic Introduction**
```
User: Hi, I need help planning a night out

Expected: Agent greets warmly and asks about date/group size
```

**Test 2: With Details**
```
User: Plan a girls night for 6 people this Saturday in downtown Austin. We want trendy dinner then cocktails.

Expected: Agent attempts to call search_restaurants tool
```

Since your tools aren't deployed yet, the tool calls will fail. That's okay - you're validating that:
- ✅ Agent understands the request
- ✅ Agent calls the right tools
- ✅ Agent passes reasonable parameters

### Review Tool Calls

In the playground, you should see tool call attempts:
```
Tool: search_restaurants
Arguments: {
  "location": "downtown Austin",
  "party_size": 6,
  "vibes": ["trendy"]
}
```

If the agent isn't calling tools or is calling the wrong ones, refine your system prompt.

---

## 10. Get Connection Info for Code

You'll need these values for your API code.

### Project Connection String

1. In AI Foundry portal, go to your project

2. Click **"Management center"** (gear icon) → **"Overview"**

3. Find **"Project connection string"**
   
   Format: `https://xxxxx.api.azureml.ms;subscription_id;resource_group;project_name`

4. Copy this value

### Agent ID

1. Go to **"Agents"** in your project

2. Click on your agent (`GNO Planner`)

3. The URL contains the agent ID:
   `https://ai.azure.com/.../agents/{AGENT_ID}/...`

4. Or look for "Agent ID" in the agent details panel

### Azure OpenAI Endpoint and Key (Alternative Auth)

If not using managed identity:

1. Go to Azure Portal → your OpenAI resource (`aoai-gno`)

2. Click **"Keys and Endpoint"**

3. Copy:
   - Endpoint: `https://aoai-gno.openai.azure.com/`
   - Key 1 or Key 2

### Store These Securely

Create a `.env` file (don't commit to git):

```bash
AZURE_AI_PROJECT_CONNECTION_STRING=https://xxxxx.api.azureml.ms;...
AZURE_AI_AGENT_ID=your-agent-id-here
AZURE_OPENAI_ENDPOINT=https://aoai-gno.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key-here
```

---

## 11. Enable Tracing

Tracing lets you see every conversation turn, tool call, and latency.

### Verify Application Insights Connection

1. In AI Foundry portal → your project

2. **"Management center"** → **"Connected resources"**

3. Confirm Application Insights (`appi-gno`) is connected

### Enable Trace Collection

1. In your project, go to **"Tracing"** in left nav

2. If prompted, enable tracing

3. Tracing should now be **"On"**

### View Traces

After running conversations:

1. Go to **"Tracing"** in your project

2. See recent conversations with:
   - Each message (user and assistant)
   - Tool calls with inputs/outputs
   - Latency for each step
   - Token usage

### Advanced: Application Insights Queries

In Azure Portal → Application Insights → Logs:

```kusto
// Recent agent conversations
traces
| where message contains "agent" or message contains "assistant"
| order by timestamp desc
| take 50

// Tool execution times
dependencies
| where type == "AI Tool"
| summarize avg(duration), max(duration), count() by name
| order by count_ desc
```

---

## 12. Troubleshooting

### "Agents" Not Visible in Portal

**Cause:** Agent Service may be in preview and not enabled.

**Fix:**
1. Go to [ai.azure.com](https://ai.azure.com)
2. Click your profile → **"Preview features"**
3. Enable **"Azure AI Agent Service"** or similar
4. Refresh the page

### Agent Doesn't Call Tools

**Cause:** System prompt isn't clear enough, or tools aren't properly defined.

**Fix:**
1. Add explicit instructions: "You MUST use the search_restaurants tool before suggesting any restaurant."
2. Verify tool schemas are valid JSON
3. Check that required fields are marked correctly

### "Model deployment not found"

**Cause:** Agent is pointing to wrong deployment name.

**Fix:**
1. Go to **"Models + endpoints"**
2. Check exact deployment name (case-sensitive)
3. Update agent configuration to match

### Tool Calls Time Out

**Cause:** Your Azure Functions aren't deployed or are cold-starting.

**Fix:**
1. Deploy your Function App first
2. Hit the health endpoint to warm it up
3. Consider Premium plan if cold starts are problematic

### CORS Errors in Web App

**Cause:** API not configured to accept requests from web app origin.

**Fix in Container App:**
```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-static-web-app.azurestaticapps.net'],
  credentials: true
}));
```

### "Unauthorized" from Foundry SDK

**Cause:** Authentication not set up correctly.

**Fix:**
1. For local dev, ensure you're logged in: `az login`
2. For deployed apps, configure managed identity:
   ```bash
   az containerapp identity assign --name ca-gno-api --resource-group rg-girls-night-out --system-assigned
   ```
3. Grant the managed identity access to the AI project

### Traces Not Appearing

**Cause:** Application Insights not connected or tracing disabled.

**Fix:**
1. Verify connection in Management center
2. Ensure tracing is enabled
3. Check that APPLICATIONINSIGHTS_CONNECTION_STRING is set in your apps
4. Traces can take 2-5 minutes to appear

---

## Quick Reference Card

### URLs

| Resource | URL |
|----------|-----|
| AI Foundry Portal | [ai.azure.com](https://ai.azure.com) |
| Azure Portal | [portal.azure.com](https://portal.azure.com) |
| Your Project | `https://ai.azure.com/projects/{project-name}` |

### Key Values to Save

| Value | Where to Find |
|-------|---------------|
| Project Connection String | Management center → Overview |
| Agent ID | Agent details page or URL |
| Function App URL | Azure Portal → Function App → Overview |
| Function App Key | Azure Portal → Function App → App keys |

### Agent Configuration Checklist

- [ ] Agent created with descriptive name
- [ ] GPT-4o model selected
- [ ] Full system prompt pasted
- [ ] All 6 tools added with correct schemas
- [ ] Tested in playground
- [ ] Agent ID noted

### Next Steps After This Guide

1. **Deploy Azure Functions** with tool implementations
2. **Build API wrapper** that calls the Foundry agent
3. **Build web app** that calls your API
4. **Connect everything** and test end-to-end