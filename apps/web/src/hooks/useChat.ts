// useChat hook - manages chat state and communication with session persistence

import { useState, useCallback, useEffect } from 'react';
import type { ChatSession, ChatMessage, NightPlan, AgentState } from '../types';
import { createSession, sendMessage as apiSendMessage, getSession } from '../api';

interface UseChatReturn {
  session: ChatSession | null;
  messages: ChatMessage[];
  plan: NightPlan | null;
  state: AgentState;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  startNewSession: () => Promise<void>;
  confirmPlanItem: (itemId: string) => void;
  removePlanItem: (itemId: string) => void;
}

// Demo user ID - in real app, this would come from auth
const DEMO_USER_ID = 'usr_sarah_001';

// Storage key for session persistence
const STORAGE_KEY = 'gno_chat_session';

interface StoredSession {
  sessionId: string;
  messages: ChatMessage[];
  plan: NightPlan | null;
  state: AgentState;
  timestamp: string;
}

// Save session to localStorage
function saveSession(
  sessionId: string,
  messages: ChatMessage[],
  plan: NightPlan | null,
  state: AgentState
) {
  try {
    const stored: StoredSession = {
      sessionId,
      messages,
      plan,
      state,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch (e) {
    console.warn('Failed to save session to localStorage:', e);
  }
}

// Load session from localStorage
function loadSession(): StoredSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session: StoredSession = JSON.parse(stored);

    // Check if session is less than 24 hours old
    const timestamp = new Date(session.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session;
  } catch (e) {
    console.warn('Failed to load session from localStorage:', e);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// Clear stored session
function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear session from localStorage:', e);
  }
}

export function useChat(): UseChatReturn {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [plan, setPlan] = useState<NightPlan | null>(null);
  const [state, setState] = useState<AgentState>('greeting');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Start a new session
  const startNewSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    clearStoredSession();

    try {
      const newSession = await createSession(DEMO_USER_ID);
      setSession(newSession);
      setMessages(newSession.messages);
      setPlan(newSession.currentPlan ?? null);
      setState(newSession.state);

      // Save to localStorage
      saveSession(
        newSession.id,
        newSession.messages,
        newSession.currentPlan ?? null,
        newSession.state
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      console.error('Error starting session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!session) {
        setError('No active session');
        return;
      }

      // Optimistically add user message
      const userMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiSendMessage(session.id, content);

        // Replace temp message and add response
        const newMessages = [
          ...messages,
          { ...userMessage, id: `msg_${Date.now()}` },
          response.message,
        ];

        setMessages(newMessages);
        setState(response.state);

        const newPlan = response.plan || plan;
        if (response.plan) {
          setPlan(response.plan);
        }

        // Save updated session
        saveSession(session.id, newMessages, newPlan, response.state);
      } catch (err) {
        // Remove optimistic message on error
        setMessages((prev) => prev.slice(0, -1));
        setError(err instanceof Error ? err.message : 'Failed to send message');
        console.error('Error sending message:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [session, messages, plan]
  );

  // Confirm a plan item (local state update)
  const confirmPlanItem = useCallback(
    (itemId: string) => {
      if (!plan) return;

      const updatedPlan: NightPlan = {
        ...plan,
        items: plan.items.map((item) =>
          item.id === itemId ? { ...item, confirmed: true } : item
        ),
        updatedAt: new Date().toISOString(),
      };

      setPlan(updatedPlan);

      // Save to localStorage
      if (session) {
        saveSession(session.id, messages, updatedPlan, state);
      }
    },
    [plan, session, messages, state]
  );

  // Remove a plan item (local state update)
  const removePlanItem = useCallback(
    (itemId: string) => {
      if (!plan) return;

      const updatedPlan: NightPlan = {
        ...plan,
        items: plan.items.filter((item) => item.id !== itemId),
        updatedAt: new Date().toISOString(),
      };

      setPlan(updatedPlan);

      // Save to localStorage
      if (session) {
        saveSession(session.id, messages, updatedPlan, state);
      }
    },
    [plan, session, messages, state]
  );

  // Initialize: try to restore session or start new one
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const initializeSession = async () => {
      const stored = loadSession();

      if (stored) {
        try {
          // Health check: verify the stored session is still valid on the backend
          await getSession(stored.sessionId);
          // If the health check succeeds, restore the saved session
          setSession({ id: stored.sessionId } as ChatSession);
          setMessages(stored.messages);
          setPlan(stored.plan);
          setState(stored.state);
        } catch {
          // If validation fails, clear stale session and start fresh
          clearStoredSession();
          await startNewSession();
        }
      } else {
        // No stored session: start fresh
        await startNewSession();
      }
    };

    void initializeSession();
  }, [initialized, startNewSession]);

  return {
    session,
    messages,
    plan,
    state,
    isLoading,
    error,
    sendMessage,
    startNewSession,
    confirmPlanItem,
    removePlanItem,
  };
}
