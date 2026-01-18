// Foundry Agent Service - Azure AI Agents SDK Integration
// Connects to the existing GNOPlanner agent for real AI-powered responses

import { generateId } from '@youbiquti/core';
import { agentTelemetry, trackException, SpanStatusCode } from '../telemetry.js';
import type { Restaurant, Bar } from '@youbiquti/core';
import type {
  AgentState,
  ChatMessage,
  ChatSession,
  NightPlan,
  PlanItem,
  SendMessageResponse,
} from '../types/index.js';

// Azure AI Agents SDK types - we use 'any' for complex union types that are hard to type correctly
// The SDK uses complex union types that require runtime type narrowing

// Azure Functions base URL - deployed or local
const AZURE_FUNCTIONS_URL = process.env.AZURE_FUNCTION_APP_URL || 'http://localhost:7071/api';

// Price level type
type PriceLevel = 1 | 2 | 3 | 4;

// Helper to safely cast price level
const toPriceLevel = (val: unknown): PriceLevel | undefined => {
  if (val === 1 || val === 2 || val === 3 || val === 4) return val;
  return undefined;
};

/**
 * Call an Azure Function endpoint
 */
async function callAzureFunction(functionName: string, args: Record<string, unknown>): Promise<unknown> {
  const url = `${AZURE_FUNCTIONS_URL}/${functionName}`;
  console.log(`[FoundryAgent] Calling Azure Function: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[FoundryAgent] Azure Function error: ${response.status} - ${errorText}`);
      throw new Error(`Azure Function ${functionName} failed: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`[FoundryAgent] Azure Function ${functionName} returned successfully`);
    return result;
  } catch (error) {
    console.error(`[FoundryAgent] Failed to call Azure Function ${functionName}:`, error);
    throw error;
  }
}

// Tool function implementations - now calling Azure Functions
const TOOL_HANDLERS: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  search_restaurants: async (args) => {
    return callAzureFunction('searchRestaurants', {
      location: args.location,
      cuisine: args.cuisine,
      priceLevel: toPriceLevel(args.price_level),
      partySize: args.party_size,
      vibes: args.vibes,
    });
  },
  
  search_bars: async (args) => {
    return callAzureFunction('searchBars', {
      location: args.location,
      vibes: args.vibes,
      priceLevel: toPriceLevel(args.price_level),
      openLate: args.open_late,
    });
  },
  
  search_events: async (args) => {
    return callAzureFunction('searchEvents', {
      location: args.location,
      dateRange: args.date ? { start: args.date, end: args.date } : undefined,
      vibes: args.categories,
      priceLevel: toPriceLevel(args.max_price),
    });
  },
  
  get_rideshare_estimate: async (args) => {
    return callAzureFunction('getRideshareEstimate', {
      origin: args.pickup_address,
      destination: args.dropoff_address,
      partySize: args.passenger_count,
    });
  },
  
  get_directions: async (args) => {
    return callAzureFunction('getDirections', {
      origin: args.origin,
      destination: args.destination,
      mode: args.mode,
    });
  },
  
  check_availability: async (args) => {
    return callAzureFunction('checkAvailability', {
      venueId: args.venue_id,
      date: args.date,
      partySize: args.party_size,
      preferredTime: args.time,
    });
  },
};

/**
 * Configuration for the Foundry Agent
 */
interface FoundryConfig {
  projectEndpoint: string;
  modelDeploymentName: string;
  agentName: string;
  existingAgentId?: string;
}

// Map of tool names to snake_case used in Foundry
const TOOL_NAME_MAP: Record<string, string> = {
  'searchRestaurants': 'search_restaurants',
  'searchBars': 'search_bars', 
  'searchEvents': 'search_events',
  'getRideshareEstimate': 'get_rideshare_estimate',
  'getDirections': 'get_directions',
  'checkAvailability': 'check_availability',
  // Also support snake_case input
  'search_restaurants': 'search_restaurants',
  'search_bars': 'search_bars',
  'search_events': 'search_events',
  'get_rideshare_estimate': 'get_rideshare_estimate',
  'get_directions': 'get_directions',
  'check_availability': 'check_availability',
};

/**
 * Foundry Agent Service
 * Uses Azure AI Agents SDK to interact with the existing GNOPlanner agent
 * 
 * This service connects to the pre-configured GNOPlanner agent in Azure AI Foundry
 * and handles tool calls locally using mock services.
 */
// Simplified agent type
interface FoundryAgent {
  id: string;
  name?: string;
}

// Run type
interface FoundryRun {
  id: string;
  status: string;
  requiredAction?: {
    type: string;
    submitToolOutputs?: {
      toolCalls: Array<{
        id: string;
        type: string;
        function?: {
          name: string;
          arguments?: string;   // Some SDK versions use 'arguments'
          parameters?: string;  // Some SDK versions use 'parameters'
        };
      }>;
    };
  };
}

export class FoundryAgentService {
  private config: FoundryConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null;
  private agent: FoundryAgent | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  
  // Store thread IDs by session for conversation continuity
  private sessionThreads: Map<string, string> = new Map();

  constructor() {
    this.config = {
      projectEndpoint: process.env.PROJECT_ENDPOINT ||
        process.env.AZURE_EXISTING_AIPROJECT_ENDPOINT ||
        'https://youbiqiuity-agents-resource.services.ai.azure.com/api/projects/youbiqiuity-agents',
      modelDeploymentName: process.env.MODEL_DEPLOYMENT_NAME || 'gpt-5-mini',
      agentName: process.env.AGENT_NAME || 'GNOPlanner',
      existingAgentId: process.env.AZURE_EXISTING_AGENT_ID, // e.g., 'asst_abc123'
    };
  }

  /**
   * Initialize the Azure AI Agents client and get/create agent (lazy loading, singleton pattern)
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      console.log('[FoundryAgent] Initializing Azure AI Projects client (new Foundry)...');
      console.log(`[FoundryAgent] Endpoint: ${this.config.projectEndpoint}`);
      console.log(`[FoundryAgent] Model: ${this.config.modelDeploymentName}`);
      
      // Dynamic import for @azure/ai-projects (new Foundry SDK)
      const { AIProjectClient } = await import('@azure/ai-projects');
      const { DefaultAzureCredential } = await import('@azure/identity');

      this.client = new AIProjectClient(
        this.config.projectEndpoint,
        new DefaultAzureCredential()
      );

      // Try to find existing agent or create new one
      await this.getOrCreateAgent();

      this.initialized = true;
      console.log('[FoundryAgent] Azure AI Projects client initialized successfully (new Foundry)');
      console.log(`[FoundryAgent] Using agent: ${this.agent?.name} (${this.agent?.id})`);

      // Track agent initialization
      agentTelemetry.trackAgentInit(this.agent?.id ?? 'unknown', this.agent?.name ?? 'GNOPlanner');
    } catch (error) {
      console.warn('[FoundryAgent] Failed to initialize Azure AI Projects SDK:', error);
      console.log('[FoundryAgent] Falling back to mock mode');
      // Leave initialized = false so we use mock processing
    }
  }

  /**
   * Get existing agent by ID or list agents to find by name, or create new one
   */
  private async getOrCreateAgent(): Promise<void> {
    if (!this.client) return;

    try {
      // First, try to list existing agents and find GNOPlanner
      // Using new Foundry pattern: client.agents.listAgents()
      console.log('[FoundryAgent] Looking for existing GNOPlanner agent...');
      const agents = this.client.agents.listAgents();
      
      for await (const agent of agents) {
        if (agent.name === this.config.agentName || agent.name?.startsWith(this.config.agentName)) {
          console.log(`[FoundryAgent] Found existing agent: ${agent.name} (${agent.id})`);
          this.agent = agent;
          return;
        }
      }

      // No existing agent found, create a new one with tools
      console.log('[FoundryAgent] No existing agent found, creating new GNOPlanner agent...');
      this.agent = await this.createAgentWithTools();
      console.log(`[FoundryAgent] Created new agent: ${this.agent?.name ?? 'unknown'} (${this.agent?.id ?? 'unknown'})`);
    } catch (error) {
      console.warn('[FoundryAgent] Error finding/creating agent:', error);
      throw error;
    }
  }

  /**
   * Create a new agent with all tool definitions
   * Using new Foundry pattern: client.agents.createAgent()
   */
  private async createAgentWithTools(): Promise<FoundryAgent> {
    if (!this.client) throw new Error('Client not initialized');

    const tools = this.getToolDefinitions();
    
    return this.client.agents.createAgent(this.config.modelDeploymentName, {
      name: this.config.agentName,
      instructions: this.getSystemPrompt(),
      tools: tools,
    });
  }

  /**
   * Get tool definitions for the agent
   */
  private getToolDefinitions(): Array<{ type: 'function'; function: { name: string; description: string; parameters: unknown } }> {
    return [
      {
        type: 'function' as const,
        function: {
          name: 'search_restaurants',
          description: 'Search for restaurants in a specific location. Use this to find dinner spots.',
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string', description: 'City or neighborhood to search in (e.g., "Dallas, TX" or "Deep Ellum, Dallas")' },
              cuisine: { type: 'string', description: 'Type of cuisine (e.g., "italian", "mexican", "american")' },
              price_level: { type: 'integer', description: 'Price level 1-4 (1=cheap, 4=expensive)', minimum: 1, maximum: 4 },
              party_size: { type: 'integer', description: 'Number of people in the group' },
              vibes: { type: 'array', items: { type: 'string' }, description: 'Desired atmosphere (e.g., ["romantic", "trendy", "casual"])' },
            },
            required: ['location'],
          },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'search_bars',
          description: 'Search for bars, lounges, and nightlife spots. Use this after dinner plans are set.',
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string', description: 'City or neighborhood to search in' },
              vibes: { type: 'array', items: { type: 'string' }, description: 'Desired atmosphere (e.g., ["dance", "chill", "rooftop", "cocktail"])' },
              price_level: { type: 'integer', description: 'Price level 1-4', minimum: 1, maximum: 4 },
              open_late: { type: 'boolean', description: 'Whether the bar should be open late (after midnight)' },
            },
            required: ['location'],
          },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'search_events',
          description: 'Search for events, concerts, comedy shows, etc. happening on a specific date.',
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string', description: 'City to search in' },
              date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
              categories: { type: 'array', items: { type: 'string' }, description: 'Event types (e.g., ["concert", "comedy", "art"])' },
              max_price: { type: 'integer', description: 'Maximum ticket price' },
            },
            required: ['location'],
          },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'get_rideshare_estimate',
          description: 'Get estimated rideshare (Uber/Lyft) prices and times between two addresses.',
          parameters: {
            type: 'object',
            properties: {
              pickup_address: { type: 'string', description: 'Starting address' },
              dropoff_address: { type: 'string', description: 'Destination address' },
              passenger_count: { type: 'integer', description: 'Number of passengers' },
            },
            required: ['pickup_address', 'dropoff_address'],
          },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'get_directions',
          description: 'Get directions and travel time between two locations.',
          parameters: {
            type: 'object',
            properties: {
              origin: { type: 'string', description: 'Starting address' },
              destination: { type: 'string', description: 'Destination address' },
              mode: { type: 'string', enum: ['walking', 'driving', 'transit'], description: 'Mode of transportation' },
            },
            required: ['origin', 'destination'],
          },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'check_availability',
          description: 'Check if a restaurant has availability for a reservation. Use before recommending specific times.',
          parameters: {
            type: 'object',
            properties: {
              venue_id: { type: 'string', description: 'The venue ID from search results' },
              date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
              time: { type: 'string', description: 'Preferred time in HH:MM format (24-hour)' },
              party_size: { type: 'integer', description: 'Number of people' },
            },
            required: ['venue_id', 'date', 'party_size'],
          },
        },
      },
    ];
  }

  /**
   * Process a user message and generate a response using Foundry agent
   */
  async processMessage(
    session: ChatSession,
    userMessage: string
  ): Promise<SendMessageResponse> {
    // Track message processing with telemetry
    const messageSpan = agentTelemetry.trackMessageProcessing(session.id, userMessage.length);

    await this.initialize();

    // If SDK isn't available, use simplified mock
    if (!this.initialized || !this.client || !this.agent) {
      console.log('[FoundryAgent] Using mock processing (SDK not available)');
      agentTelemetry.trackFallbackToMock('SDK not available');
      messageSpan.setStatus({ code: SpanStatusCode.OK });
      messageSpan.end();
      return this.processMockMessage(session, userMessage);
    }

    try {
      console.log(`[FoundryAgent] Processing message for session ${session.id}`);
      
      // Get or create thread for this session
      // Using new Foundry pattern: client.agents.threads.create()
      let threadId: string = this.sessionThreads.get(session.id) ?? '';
      
      if (!threadId) {
        const thread = await this.client.agents.threads.create();
        threadId = thread.id as string;
        this.sessionThreads.set(session.id, threadId);
        console.log(`[FoundryAgent] Created new thread: ${threadId}`);

        // Track thread creation
        agentTelemetry.trackThreadCreated(threadId, session.id);
        
        // Add existing conversation history if any
        for (const msg of session.messages) {
          if (msg.role === 'user' || msg.role === 'assistant') {
            await this.client.agents.messages.create(threadId, msg.role, msg.content);
          }
        }
      }

      // Add the new user message
      await this.client.agents.messages.create(threadId, 'user', userMessage);

      // Create a run with the agent
      const runStartTime = Date.now();
      let run = await this.client.agents.runs.create(threadId, this.agent.id);
      console.log(`[FoundryAgent] Created run: ${run.id}`);

      // Track run creation
      agentTelemetry.trackRunCreated(run.id, threadId);

      // Poll for completion, handling tool calls
      const toolResults: Array<{ tool: string; result: unknown }> = [];
      run = await this.pollRunWithToolExecution(threadId, run.id, toolResults);

      console.log(`[FoundryAgent] Run completed with status: ${run.status}`);

      // Track run completion
      agentTelemetry.trackRunCompleted(run.id, run.status, Date.now() - runStartTime);

      // Handle failed runs - fall back to mock processing
      if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
        console.log(`[FoundryAgent] Run failed with status ${run.status}, falling back to mock`);
        agentTelemetry.trackFallbackToMock(`Run ${run.status}`);
        return this.processMockMessage(session, userMessage);
      }

      // Get the latest assistant message
      // Using new Foundry pattern: client.agents.messages.list()
      let responseContent = '';
      const messages = this.client.agents.messages.list(threadId, { order: 'desc', limit: 10 });
      for await (const msg of messages) {
        if (msg.role === 'assistant') {
          for (const content of msg.content) {
            if (content.type === 'text') {
              // Handle both text content formats
              const textContent = content as { type: 'text'; text?: { value: string }; value?: string };
              responseContent = textContent.text?.value ?? textContent.value ?? '';
              if (responseContent) break;
            }
          }
          if (responseContent) break;
        }
      }

      // Create response message
      const responseMessage: ChatMessage = {
        id: generateId('msg'),
        role: 'assistant',
        content: responseContent || "I'm having trouble right now. Let me try again!",
        timestamp: new Date().toISOString(),
      };

      // Extract plan from tool results and response
      console.log(`[FoundryAgent] Tool results collected: ${toolResults.length} results`);
      if (toolResults.length > 0) {
        console.log(`[FoundryAgent] Tool names: ${toolResults.map(r => r.tool).join(', ')}`);
      }
      const plan = this.extractPlanFromResponse(responseContent, toolResults, session);

      // Determine state based on response content
      const nextState = this.inferState(responseContent, session.state);

      messageSpan.setStatus({ code: SpanStatusCode.OK });
      messageSpan.end();

      return {
        message: responseMessage,
        state: nextState,
        plan: plan ?? session.currentPlan,
      };
    } catch (error) {
      console.error('[FoundryAgent] Error processing message:', error);
      console.log('[FoundryAgent] Falling back to mock processing');

      // Track error and fallback
      messageSpan.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message });
      messageSpan.recordException(error as Error);
      messageSpan.end();
      agentTelemetry.trackFallbackToMock((error as Error).message);
      trackException(error as Error, { sessionId: session.id, fallback: 'mock' });

      return this.processMockMessage(session, userMessage);
    }
  }

  /**
   * Poll a run until completion, executing tool calls as needed
   * Using new Foundry pattern: client.agents.runs.get/submitToolOutputs()
   */
  private async pollRunWithToolExecution(
    threadId: string,
    runId: string,
    toolResults: Array<{ tool: string; result: unknown }>
  ): Promise<FoundryRun> {
    if (!this.client) throw new Error('Client not initialized');

    const maxIterations = 30;
    const pollInterval = 1000;

    for (let i = 0; i < maxIterations; i++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      const run: FoundryRun = await this.client.agents.runs.get(threadId, runId);
      console.log(`[FoundryAgent] Run status: ${run.status}`);

      if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
        // Log additional details for failed runs
        if (run.status === 'failed') {
          const runDetails = run as unknown as { lastError?: { code?: string; message?: string } };
          if (runDetails.lastError) {
            console.error(`[FoundryAgent] Run failed - Code: ${runDetails.lastError.code}, Message: ${runDetails.lastError.message}`);
          }
        }
        return run;
      }

      if (run.status === 'requires_action' && run.requiredAction?.type === 'submit_tool_outputs') {
        // Execute tool calls
        const toolOutputs: Array<{ toolCallId: string; output: string }> = [];
        const toolCalls = run.requiredAction.submitToolOutputs?.toolCalls ?? [];

        for (const toolCall of toolCalls) {
          if (toolCall.type === 'function' && toolCall.function) {
            const toolName = TOOL_NAME_MAP[toolCall.function.name] || toolCall.function.name;
            let args: Record<string, unknown> = {};
            
            try {
              // Handle both 'arguments' and 'parameters' (SDK version differences)
              const argsString = toolCall.function.arguments || toolCall.function.parameters || '{}';
              args = JSON.parse(argsString);
            } catch {
              console.warn(`[FoundryAgent] Failed to parse args for ${toolName}`);
            }

            console.log(`[FoundryAgent] Executing tool: ${toolName}`, args);

            // Track tool call with telemetry
            const toolStartTime = Date.now();
            const toolSpan = agentTelemetry.trackToolCallStart(toolName, args);

            try {
              const result = await this.executeToolCall(toolName, args);
              toolResults.push({ tool: toolName, result });
              toolOutputs.push({
                toolCallId: toolCall.id,
                output: JSON.stringify(result),
              });

              // Track tool success
              const toolDuration = Date.now() - toolStartTime;
              toolSpan.setStatus({ code: SpanStatusCode.OK });
              toolSpan.end();
              agentTelemetry.trackToolCall(toolName, toolDuration, true);
              console.log(`[FoundryAgent] Tool ${toolName} completed successfully (${toolDuration}ms)`);
            } catch (error) {
              console.error(`[FoundryAgent] Tool ${toolName} failed:`, error);

              // Track tool failure
              const toolDuration = Date.now() - toolStartTime;
              toolSpan.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message });
              toolSpan.recordException(error as Error);
              toolSpan.end();
              agentTelemetry.trackToolCall(toolName, toolDuration, false);

              toolOutputs.push({
                toolCallId: toolCall.id,
                output: JSON.stringify({ error: 'Tool execution failed' }),
              });
            }
          }
        }

        // Submit tool outputs back to the run
        if (toolOutputs.length > 0) {
          await this.client.agents.runs.submitToolOutputs(threadId, runId, toolOutputs);
          console.log(`[FoundryAgent] Submitted ${toolOutputs.length} tool outputs`);
        }
      }
    }

    throw new Error('Run timed out');
  }

  /**
   * Get the system prompt for the GNO planning agent
   * Based on infra/gno-system-prompt.md
   */
  private getSystemPrompt(): string {
    return `You are GNO (Girls Night Out), a fun and knowledgeable AI concierge that helps groups plan perfect nights out. You're like that friend who always knows the best spots.

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
Format the final plan as a clear timeline with emoji headers, venue names in bold, prices, addresses, and an estimated total per person.

## Tool Usage Guidelines
- search_restaurants: ALWAYS search before suggesting any dinner spot. Match price_level to budget (1-2=budget, 2-3=moderate, 3-4=splurge).
- search_bars: Search AFTER dinner plans are set. Match the vibe they described.
- search_events: Check for special events happening that night.
- get_directions: Use to calculate accurate travel times between venues.
- get_rideshare_estimate: Use for groups of 4+ people or distant venues.
- check_availability: Use BEFORE recommending a specific reservation time.

## Important Constraints
- Only suggest real venues returned by your search tools
- Don't confirm bookings - provide booking links for them to complete
- Stay within their stated budget
- Focus on Dallas, Texas area`;
  }

  /**
   * Fallback mock processing when Foundry isn't available
   */
  private async processMockMessage(
    session: ChatSession,
    userMessage: string
  ): Promise<SendMessageResponse> {
    const lowerMessage = userMessage.toLowerCase();
    let content = "I'm here to help you plan the perfect night out! 💅 Tell me what you're looking for.";
    let nextState: AgentState = session.state;
    const toolResults: Array<{ tool: string; result: unknown }> = [];

    console.log(`[FoundryAgent] Mock processing - current state: ${session.state}, message: "${userMessage.substring(0, 50)}..."`);

    // Use switch statement for cleaner state-based logic
    switch (session.state) {
      case 'greeting':
        content = "Hey girl! 💅 I'm so excited to help you plan an amazing night out in Dallas! Tell me about your crew - how many people are we planning for, and when are you thinking?";
        nextState = 'gathering';
        break;

      case 'gathering':
        // User is providing details - search for venues
        content = "Perfect! Let me search for some fabulous options for you... 🔍";
        nextState = 'searching';

        // Trigger restaurant search
        try {
          const restaurants = await callAzureFunction('searchRestaurants', {
            location: 'Dallas, TX',
            partySize: 4,
          }) as { restaurants: Restaurant[]; total: number };

          toolResults.push({ tool: 'search_restaurants', result: restaurants });

          if (restaurants.restaurants.length > 0) {
            const top3 = restaurants.restaurants.slice(0, 3);
            content = `I found some amazing spots! Here are my top picks:\n\n${top3.map((r: Restaurant, i: number) =>
              `${i + 1}. **${r.name}** - ${r.cuisine} (${'$'.repeat(r.priceLevel)}) ⭐ ${r.rating}`
            ).join('\n')}\n\nWhat do you think? Want more details on any of these, or should we also look for bars? ✨`;
            nextState = 'presenting';
          }
        } catch (error) {
          console.error('[FoundryAgent] Search failed:', error);
          content = "I'm searching for the best spots... What kind of vibe are you going for?";
        }
        break;

      case 'searching':
        // Still searching - present results
        try {
          const restaurants = await callAzureFunction('searchRestaurants', {
            location: 'Dallas, TX',
            partySize: 4,
          }) as { restaurants: Restaurant[]; total: number };

          toolResults.push({ tool: 'search_restaurants', result: restaurants });

          if (restaurants.restaurants.length > 0) {
            const top3 = restaurants.restaurants.slice(0, 3);
            content = `Here are my top picks:\n\n${top3.map((r: Restaurant, i: number) =>
              `${i + 1}. **${r.name}** - ${r.cuisine} (${'$'.repeat(r.priceLevel)}) ⭐ ${r.rating}`
            ).join('\n')}\n\nAny of these catch your eye? ✨`;
            nextState = 'presenting';
          } else {
            content = "Hmm, I'm having trouble finding places right now. Can you tell me more about what you're looking for?";
          }
        } catch (error) {
          content = "Let me keep looking for the perfect spots for you!";
        }
        break;

      case 'presenting':
        // User is responding to presented options
        if (lowerMessage.includes('bar') || lowerMessage.includes('drink') || lowerMessage.includes('cocktail')) {
          try {
            const bars = await callAzureFunction('searchBars', {
              location: 'Dallas, TX',
            }) as { bars: Bar[]; total: number };

            toolResults.push({ tool: 'search_bars', result: bars });

            if (bars.bars.length > 0) {
              const top3 = bars.bars.slice(0, 3);
              content = `Ooh, I love bar hunting! 🍸 Here are some fab options:\n\n${top3.map((b: Bar, i: number) =>
                `${i + 1}. **${b.name}** - ${b.vibes.join(', ')} (${'$'.repeat(b.priceLevel)}) ⭐ ${b.rating}`
              ).join('\n')}\n\nAny of these catch your eye?`;
            } else {
              content = "Let me dig a bit deeper for the perfect bar spots!";
            }
          } catch (error) {
            content = "Looking for the perfect bar spots for you! 🍸";
          }
        } else if (lowerMessage.includes('yes') || lowerMessage.includes('sounds good') || lowerMessage.includes('perfect') || lowerMessage.includes('love') || lowerMessage.includes('great')) {
          content = "Amazing choice! 💃 I'll add that to your plan. Want me to look for bars or live music venues next?";
          nextState = 'refining';
        } else {
          content = "Would you like more details on any of these options? Or should we look for bars and nightlife next? 🌙";
        }
        break;

      case 'refining':
        if (lowerMessage.includes('bar') || lowerMessage.includes('drink') || lowerMessage.includes('music') || lowerMessage.includes('yes')) {
          try {
            const bars = await callAzureFunction('searchBars', {
              location: 'Dallas, TX',
            }) as { bars: Bar[]; total: number };

            toolResults.push({ tool: 'search_bars', result: bars });

            if (bars.bars.length > 0) {
              const top3 = bars.bars.slice(0, 3);
              content = `For drinks and vibes, check these out! 🍸\n\n${top3.map((b: Bar, i: number) =>
                `${i + 1}. **${b.name}** - ${b.vibes.join(', ')} (${'$'.repeat(b.priceLevel)}) ⭐ ${b.rating}`
              ).join('\n')}\n\nLet me know which one sounds good!`;
              nextState = 'presenting';
            }
          } catch (error) {
            content = "Searching for the perfect spots for after dinner! 🌙";
          }
        } else if (lowerMessage.includes('done') || lowerMessage.includes('complete') || lowerMessage.includes('that\'s it') || lowerMessage.includes('looks good')) {
          content = "Your plan is looking amazing! 🎉 Have the best night out! Let me know if you need any changes.";
          nextState = 'complete';
        } else {
          content = "Would you like to add bars, live music, or are you all set with your plan? 💅";
        }
        break;

      case 'confirming':
        content = "Everything looks great! 🎉 Your night is going to be amazing. Have fun!";
        nextState = 'complete';
        break;

      case 'complete':
        content = "Glad I could help plan your night! 💃 If you want to start a new plan, just click 'New Plan' at the top.";
        break;

      default:
        content = "I'm here to help you plan the perfect night out! 💅 Tell me what you're looking for - dinner, drinks, events, or all of the above?";
        nextState = 'gathering';
    }

    const responseMessage: ChatMessage = {
      id: generateId('msg'),
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
    };

    // Extract plan from tool results
    const plan = this.extractPlanFromResponse(content, toolResults, session);

    return {
      message: responseMessage,
      state: nextState,
      plan: plan ?? session.currentPlan,
    };
  }

  /**
   * Infer conversation state from response
   */
  private inferState(responseText: string, currentState: AgentState): AgentState {
    const lower = responseText.toLowerCase();
    
    if (lower.includes('searching') || lower.includes('let me find') || lower.includes('looking for')) {
      return 'searching';
    }
    if (lower.includes('here are') || lower.includes('found') || lower.includes('top picks')) {
      return 'presenting';
    }
    if (lower.includes('confirmed') || lower.includes('all set') || lower.includes('booked')) {
      return 'complete';
    }
    if (lower.includes('tell me') || lower.includes('how many') || lower.includes('when')) {
      return 'gathering';
    }
    
    return currentState;
  }

  /**
   * Execute a tool call locally and return the result
   */
  async executeToolCall(toolName: string, args: Record<string, unknown>): Promise<unknown> {
    const handler = TOOL_HANDLERS[toolName];
    if (!handler) {
      throw new Error(`Unknown tool: ${toolName}`);
    }
    return handler(args);
  }

  /**
   * Extract plan items from response and tool results
   */
  private extractPlanFromResponse(
    _responseText: string,
    toolResults: Array<{ tool: string; result: unknown }>,
    session: ChatSession
  ): NightPlan | undefined {
    console.log(`[FoundryAgent] extractPlanFromResponse called with ${toolResults.length} tool results`);

    const restaurantResults = toolResults.find(r => r.tool === 'search_restaurants');
    const barResults = toolResults.find(r => r.tool === 'search_bars');

    console.log(`[FoundryAgent] Found restaurant results: ${!!restaurantResults}, bar results: ${!!barResults}`);

    if (!restaurantResults && !barResults) {
      console.log('[FoundryAgent] No restaurant or bar results found, returning undefined');
      return undefined;
    }

    const items: PlanItem[] = session.currentPlan?.items ?? [];
    
    if (restaurantResults) {
      const data = restaurantResults.result as { restaurants: Restaurant[] };
      const restaurant = data.restaurants[0];
      if (restaurant) {
        const existingIndex = items.findIndex(i => i.type === 'restaurant');
        const item: PlanItem = {
          id: generateId('item'),
          type: 'restaurant',
          name: restaurant.name,
          time: '19:00',
          duration: 90,
          confirmed: false,
          details: {
            venueId: restaurant.id,
            address: restaurant.address,
            cuisine: restaurant.cuisine,
            priceLevel: restaurant.priceLevel,
            rating: restaurant.rating,
          },
        };
        if (existingIndex >= 0) {
          items[existingIndex] = item;
        } else {
          items.push(item);
        }
      }
    }

    if (barResults) {
      const data = barResults.result as { bars: Bar[] };
      const bar = data.bars[0];
      if (bar) {
        const existingIndex = items.findIndex(i => i.type === 'bar');
        const item: PlanItem = {
          id: generateId('item'),
          type: 'bar',
          name: bar.name,
          time: '21:30',
          duration: 120,
          confirmed: false,
          details: {
            venueId: bar.id,
            address: bar.address,
            vibes: bar.vibes,
            priceLevel: bar.priceLevel,
            rating: bar.rating,
          },
        };
        if (existingIndex >= 0) {
          items[existingIndex] = item;
        } else {
          items.push(item);
        }
      }
    }

    return {
      id: session.currentPlan?.id ?? generateId('plan'),
      items,
      createdAt: session.currentPlan?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const foundryAgentService = new FoundryAgentService();
