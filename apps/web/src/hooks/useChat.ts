// useChat hook - manages chat state and communication

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
}

// Demo user ID - in real app, this would come from auth
const DEMO_USER_ID = 'usr_sarah_001';

export function useChat(): UseChatReturn {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [plan, setPlan] = useState<NightPlan | null>(null);
  const [state, setState] = useState<AgentState>('greeting');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start a new session
  const startNewSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newSession = await createSession(DEMO_USER_ID);
      setSession(newSession);
      setMessages(newSession.messages);
      setPlan(newSession.currentPlan ?? null);
      setState(newSession.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      console.error('Error starting session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
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
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiSendMessage(session.id, content);
      
      // Replace temp message and add response
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove temp message
        { ...userMessage, id: `msg_${Date.now()}` }, // Add real user message
        response.message, // Add assistant response
      ]);
      
      setState(response.state);
      
      if (response.plan) {
        setPlan(response.plan);
      }
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1));
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Auto-start session on mount
  useEffect(() => {
    startNewSession();
  }, [startNewSession]);

  return {
    session,
    messages,
    plan,
    state,
    isLoading,
    error,
    sendMessage,
    startNewSession,
  };
}
