// API Types for the frontend

export type AgentState = 
  | 'greeting'
  | 'gathering'
  | 'searching'
  | 'presenting'
  | 'refining'
  | 'confirming'
  | 'complete';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface PlanItem {
  id: string;
  type: 'restaurant' | 'bar' | 'event' | 'transit';
  name: string;
  time?: string;
  duration?: number;
  details: Record<string, unknown>;
  confirmed: boolean;
}

export interface NightPlan {
  id: string;
  items: PlanItem[];
  estimatedCost?: { min: number; max: number };
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  state: AgentState;
  messages: ChatMessage[];
  currentPlan?: NightPlan;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageResponse {
  message: ChatMessage;
  state: AgentState;
  plan?: NightPlan;
}
