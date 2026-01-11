// Chat Session Types

// User and GroupPreferences types from core are used in future iterations
// import type { User, GroupPreferences } from '@youbiquti/core';

/**
 * Agent dialog state machine states
 */
export type AgentState = 
  | 'greeting'        // Initial greeting, ask what they're planning
  | 'gathering'       // Collecting preferences (who, when, what)
  | 'searching'       // Actively searching for options
  | 'presenting'      // Showing results to user
  | 'refining'        // User wants to adjust/filter results
  | 'confirming'      // Confirming final plan
  | 'complete';       // Plan finalized

/**
 * Message role
 */
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

/**
 * Tool call made by the agent
 */
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

/**
 * Result from a tool call
 */
export interface ToolResult {
  toolCallId: string;
  result: unknown;
  error?: string;
}

/**
 * Gathered preferences during conversation
 */
export interface GatheredPreferences {
  partySize?: number;
  date?: string;
  timePreference?: 'early' | 'standard' | 'late';
  neighborhood?: string;
  activities?: ('dinner' | 'drinks' | 'event' | 'dancing')[];
  budget?: 'low' | 'medium' | 'high';
  vibes?: string[];
  dietaryRestrictions?: string[];
  transportation?: 'rideshare' | 'driving' | 'transit';
}

/**
 * Plan item (venue or activity in the itinerary)
 */
export interface PlanItem {
  id: string;
  type: 'restaurant' | 'bar' | 'event' | 'transit';
  name: string;
  time?: string;
  duration?: number;
  details: Record<string, unknown>;
  confirmed: boolean;
}

/**
 * The current plan being built
 */
export interface NightPlan {
  id: string;
  items: PlanItem[];
  estimatedCost?: { min: number; max: number };
  createdAt: string;
  updatedAt: string;
}

/**
 * Chat session
 */
export interface ChatSession {
  id: string;
  userId: string;
  state: AgentState;
  messages: ChatMessage[];
  gatheredPreferences: GatheredPreferences;
  currentPlan?: NightPlan;
  participants?: string[]; // User IDs of people in the group
  createdAt: string;
  updatedAt: string;
}

/**
 * Session creation request
 */
export interface CreateSessionRequest {
  userId: string;
}

/**
 * Send message request
 */
export interface SendMessageRequest {
  content: string;
}

/**
 * Send message response
 */
export interface SendMessageResponse {
  message: ChatMessage;
  state: AgentState;
  plan?: NightPlan;
}
