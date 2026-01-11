// Session Routes

import { Router, Request, Response } from 'express';
import type { Router as RouterType } from 'express';
import { generateId } from '@youbiquti/core';
import {
  getSessionById,
  getSessionsByUserId,
  createSession,
  updateSession,
  deleteSession,
} from '../db/index.js';
import { mockAgentService } from '../services/index.js';
import type {
  ChatSession,
  ChatMessage,
  CreateSessionRequest,
  SendMessageRequest,
} from '../types/index.js';

const router: RouterType = Router();

/**
 * GET /sessions
 * List sessions for a user
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      res.status(400).json({ error: 'userId query parameter required' });
      return;
    }
    
    const sessions = await getSessionsByUserId(userId);
    res.json({ sessions });
  } catch (error) {
    console.error('Error listing sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /sessions
 * Create a new session
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateSessionRequest;
    
    if (!body.userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    
    const session: ChatSession = {
      id: generateId('ses'),
      userId: body.userId,
      state: 'greeting',
      messages: [],
      gatheredPreferences: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await createSession(session);
    
    // Generate initial greeting
    const greeting: ChatMessage = {
      id: generateId('msg'),
      role: 'assistant',
      content: "Hey! 👋 I'm here to help plan your perfect girls' night out in Dallas! Tell me what you're thinking - who's coming, when, and what kind of vibe you're going for?",
      timestamp: new Date().toISOString(),
    };
    
    session.messages.push(greeting);
    await updateSession(session.id, { messages: session.messages });
    
    res.status(201).json({ session });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /sessions/:id
 * Get a specific session
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Session id is required' });
      return;
    }
    
    const session = await getSessionById(id);
    
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    res.json({ session });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /sessions/:id/messages
 * Send a message to a session
 */
router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Session id is required' });
      return;
    }
    
    const session = await getSessionById(id);
    
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    const body = req.body as SendMessageRequest;
    
    if (!body.content) {
      res.status(400).json({ error: 'content is required' });
      return;
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId('msg'),
      role: 'user',
      content: body.content,
      timestamp: new Date().toISOString(),
    };
    
    session.messages.push(userMessage);
    
    // Process message with mock agent
    const response = await mockAgentService.processMessage(session, body.content);
    
    // Add assistant response
    session.messages.push(response.message);
    
    // Update session
    await updateSession(session.id, {
      messages: session.messages,
      state: response.state,
      currentPlan: response.plan ?? session.currentPlan,
    });
    
    res.json({
      message: response.message,
      state: response.state,
      plan: response.plan ?? session.currentPlan,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /sessions/:id
 * Delete a session
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Session id is required' });
      return;
    }
    
    const deleted = await deleteSession(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
