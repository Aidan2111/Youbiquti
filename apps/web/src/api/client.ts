// API Client

import type { ChatSession, SendMessageResponse } from '../types';

const API_BASE = '/api';

/**
 * Create a new chat session
 */
export async function createSession(userId: string): Promise<ChatSession> {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create session');
  }
  
  const data = await response.json();
  return data.session;
}

/**
 * Get a chat session by ID
 */
export async function getSession(sessionId: string): Promise<ChatSession> {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get session');
  }
  
  const data = await response.json();
  return data.session;
}

/**
 * Send a message to the chat session
 */
export async function sendMessage(
  sessionId: string,
  content: string
): Promise<SendMessageResponse> {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
}

/**
 * Delete a chat session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete session');
  }
}
