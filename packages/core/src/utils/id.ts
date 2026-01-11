// ID generation utilities

import { nanoid } from 'nanoid';

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix?: string): string {
  const id = nanoid(12);
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate IDs for different entity types
 */
export const ids = {
  user: () => generateId('usr'),
  connection: () => generateId('con'),
  provider: () => generateId('prv'),
  offering: () => generateId('off'),
  request: () => generateId('req'),
  match: () => generateId('mat'),
  negotiation: () => generateId('neg'),
  transaction: () => generateId('txn'),
  review: () => generateId('rev'),
  session: () => generateId('ses'),
  message: () => generateId('msg'),
  endorsement: () => generateId('end'),
  event: () => generateId('evt'),
  restaurant: () => generateId('rst'),
  bar: () => generateId('bar'),
} as const;

/**
 * Hash a phone number for contact matching
 * In production, use a proper cryptographic hash
 */
export function hashPhone(phone: string): string {
  // Normalize phone number
  const normalized = phone.replace(/\D/g, '');
  // Simple hash for demo - in production use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `ph_${Math.abs(hash).toString(36)}`;
}

/**
 * Validate ID format
 */
export function isValidId(id: string, prefix?: string): boolean {
  if (!id || typeof id !== 'string') return false;
  if (prefix) {
    return id.startsWith(`${prefix}_`) && id.length > prefix.length + 1;
  }
  return id.length >= 12;
}
