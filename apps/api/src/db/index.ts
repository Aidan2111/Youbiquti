// LowDB Database Setup

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';
import type { ChatSession } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Database schema
 */
interface DbSchema {
  sessions: ChatSession[];
}

/**
 * Default data
 */
const defaultData: DbSchema = {
  sessions: [],
};

// Database instance
let db: Low<DbSchema> | null = null;

/**
 * Initialize and get database instance
 */
export async function getDb(): Promise<Low<DbSchema>> {
  if (db) return db;

  // Ensure data directory exists
  const dataDir = join(__dirname, '../../data');
  await mkdir(dataDir, { recursive: true });

  // Create adapter and database
  const file = join(dataDir, 'db.json');
  const adapter = new JSONFile<DbSchema>(file);
  db = new Low(adapter, defaultData);

  // Read existing data
  await db.read();

  return db;
}

/**
 * Get all sessions
 */
export async function getAllSessions(): Promise<ChatSession[]> {
  const db = await getDb();
  return db.data.sessions;
}

/**
 * Get session by ID
 */
export async function getSessionById(id: string): Promise<ChatSession | undefined> {
  const db = await getDb();
  return db.data.sessions.find(s => s.id === id);
}

/**
 * Get sessions for a user
 */
export async function getSessionsByUserId(userId: string): Promise<ChatSession[]> {
  const db = await getDb();
  return db.data.sessions.filter(s => s.userId === userId);
}

/**
 * Create a new session
 */
export async function createSession(session: ChatSession): Promise<ChatSession> {
  const db = await getDb();
  db.data.sessions.push(session);
  await db.write();
  return session;
}

/**
 * Update a session
 */
export async function updateSession(
  id: string,
  updates: Partial<ChatSession>
): Promise<ChatSession | undefined> {
  const db = await getDb();
  const index = db.data.sessions.findIndex(s => s.id === id);
  
  if (index === -1) return undefined;
  
  const existing = db.data.sessions[index];
  if (!existing) return undefined;
  
  const updated: ChatSession = {
    ...existing,
    ...updates,
    id: existing.id,
    userId: updates.userId ?? existing.userId,
    state: updates.state ?? existing.state,
    messages: updates.messages ?? existing.messages,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  
  db.data.sessions[index] = updated;
  
  await db.write();
  return updated;
}

/**
 * Delete a session
 */
export async function deleteSession(id: string): Promise<boolean> {
  const db = await getDb();
  const index = db.data.sessions.findIndex(s => s.id === id);
  
  if (index === -1) return false;
  
  db.data.sessions.splice(index, 1);
  await db.write();
  return true;
}
