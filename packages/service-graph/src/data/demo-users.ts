// Demo users with pre-set social connections for testing

import type { User, Connection, Endorsement, UserPreferences } from '@youbiquti/core';

// ============================================================================
// DEMO USERS
// ============================================================================

export const demoUsers: User[] = [
  {
    id: 'usr_sarah_001',
    phone: '+12145551001',
    phoneHash: 'ph_sarah001',
    displayName: 'Sarah Chen',
    email: 'sarah@example.com',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: new Date('2025-06-15'),
    lastActiveAt: new Date('2026-01-11'),
  },
  {
    id: 'usr_emma_002',
    phone: '+12145551002',
    phoneHash: 'ph_emma002',
    displayName: 'Emma Rodriguez',
    email: 'emma@example.com',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    createdAt: new Date('2025-07-01'),
    lastActiveAt: new Date('2026-01-10'),
  },
  {
    id: 'usr_lisa_003',
    phone: '+12145551003',
    phoneHash: 'ph_lisa003',
    displayName: 'Lisa Park',
    email: 'lisa@example.com',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    createdAt: new Date('2025-08-10'),
    lastActiveAt: new Date('2026-01-09'),
  },
  {
    id: 'usr_alex_004',
    phone: '+12145551004',
    phoneHash: 'ph_alex004',
    displayName: 'Alex Kim',
    email: 'alex@example.com',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: new Date('2025-09-01'),
    lastActiveAt: new Date('2026-01-08'),
  },
  {
    id: 'usr_mike_005',
    phone: '+12145551005',
    phoneHash: 'ph_mike005',
    displayName: 'Mike Johnson',
    email: 'mike@example.com',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    createdAt: new Date('2025-05-20'),
    lastActiveAt: new Date('2026-01-11'),
  },
  {
    id: 'usr_pat_006',
    phone: '+12145551006',
    phoneHash: 'ph_pat006',
    displayName: 'Pat Driver',
    email: 'pat@example.com',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pat',
    createdAt: new Date('2025-04-01'),
    lastActiveAt: new Date('2026-01-11'),
  },
];

// ============================================================================
// CONNECTIONS (Social Graph)
// ============================================================================

/*
 * Social Graph Structure:
 * 
 * Sarah (user-1)
 * ├── 1st degree: Emma (best friend), Mike (coworker)
 * │   ├── Emma → Lisa (1st degree for Emma)
 * │   └── Mike → Pat (1st degree for Mike, provider)
 * └── 2nd degree (via Emma): Lisa
 * └── 2nd degree (via Mike): Pat
 * └── 3rd degree (via Lisa): Alex
 */

export const demoConnections: Connection[] = [
  // Sarah's 1st degree connections
  {
    id: 'con_001',
    fromUserId: 'usr_sarah_001',
    toUserId: 'usr_emma_002',
    toUserName: 'Emma Rodriguez',
    degree: 1,
    source: 'contacts',
    strength: 0.95, // Best friends
    createdAt: new Date('2025-06-20'),
  },
  {
    id: 'con_002',
    fromUserId: 'usr_sarah_001',
    toUserId: 'usr_mike_005',
    toUserName: 'Mike Johnson',
    degree: 1,
    source: 'manual',
    strength: 0.6, // Coworker
    createdAt: new Date('2025-07-01'),
  },
  
  // Emma's 1st degree (Sarah's 2nd degree)
  {
    id: 'con_003',
    fromUserId: 'usr_emma_002',
    toUserId: 'usr_sarah_001',
    toUserName: 'Sarah Chen',
    degree: 1,
    source: 'contacts',
    strength: 0.95,
    createdAt: new Date('2025-06-20'),
  },
  {
    id: 'con_004',
    fromUserId: 'usr_emma_002',
    toUserId: 'usr_lisa_003',
    toUserName: 'Lisa Park',
    degree: 1,
    source: 'contacts',
    strength: 0.8,
    createdAt: new Date('2025-08-15'),
  },
  
  // Lisa's connections
  {
    id: 'con_005',
    fromUserId: 'usr_lisa_003',
    toUserId: 'usr_emma_002',
    toUserName: 'Emma Rodriguez',
    degree: 1,
    source: 'contacts',
    strength: 0.8,
    createdAt: new Date('2025-08-15'),
  },
  {
    id: 'con_006',
    fromUserId: 'usr_lisa_003',
    toUserId: 'usr_alex_004',
    toUserName: 'Alex Kim',
    degree: 1,
    source: 'contacts',
    strength: 0.7,
    createdAt: new Date('2025-09-10'),
  },
  
  // Mike's connections
  {
    id: 'con_007',
    fromUserId: 'usr_mike_005',
    toUserId: 'usr_sarah_001',
    toUserName: 'Sarah Chen',
    degree: 1,
    source: 'manual',
    strength: 0.6,
    createdAt: new Date('2025-07-01'),
  },
  {
    id: 'con_008',
    fromUserId: 'usr_mike_005',
    toUserId: 'usr_pat_006',
    toUserName: 'Pat Driver',
    degree: 1,
    source: 'manual',
    strength: 0.5, // Used Pat's service 3 times
    createdAt: new Date('2025-10-01'),
  },
  
  // Alex's connections
  {
    id: 'con_009',
    fromUserId: 'usr_alex_004',
    toUserId: 'usr_lisa_003',
    toUserName: 'Lisa Park',
    degree: 1,
    source: 'contacts',
    strength: 0.7,
    createdAt: new Date('2025-09-10'),
  },
];

// ============================================================================
// ENDORSEMENTS
// ============================================================================

export const demoEndorsements: Endorsement[] = [
  {
    id: 'end_001',
    userId: 'usr_mike_005',
    userName: 'Mike Johnson',
    providerId: 'prv_pat_driver',
    note: 'Super reliable! Always on time and great conversation.',
    createdAt: new Date('2025-11-15'),
  },
];

// ============================================================================
// USER PREFERENCES
// ============================================================================

export const demoPreferences: UserPreferences[] = [
  {
    userId: 'usr_sarah_001',
    dietary: {
      restrictions: [],
      allergies: ['shellfish'],
      cuisinePreferences: [
        { cuisine: 'italian', score: 0.9 },
        { cuisine: 'mexican', score: 0.8 },
        { cuisine: 'sushi', score: 0.7 },
        { cuisine: 'thai', score: -0.3 }, // Avoids
      ],
      avoidIngredients: [],
    },
    budget: {
      dining: { min: 30, max: 60, currency: 'USD' },
      transportation: { min: 0, max: 40, currency: 'USD' },
      services: { min: 0, max: 100, currency: 'USD' },
      flexibility: 'flexible',
    },
    transportation: {
      preferredServices: ['uber', 'lyft'],
      shareRidesOk: true,
      maxWalkMinutes: 10,
      accessibilityNeeds: [],
    },
    venue: {
      ambiancePreferences: ['trendy', 'lively'],
      seatingPreferences: ['booth', 'patio'],
      accessibilityNeeds: [],
    },
    scheduling: {
      preferredMealTimes: {
        dinner: { start: '19:00', end: '21:00' },
        brunch: { start: '11:00', end: '13:00' },
      },
      avoidDays: [1], // Avoid Mondays
      timezone: 'America/Chicago',
    },
    location: {
      home: { lat: 32.8012, lng: -96.7985 }, // Uptown Dallas
      work: { lat: 32.7801, lng: -96.7997 }, // Downtown
      preferredAreas: ['uptown', 'deep ellum', 'bishop arts'],
      avoidAreas: [],
      maxTravelMinutes: 30,
    },
    completenessScore: 85,
    lastUpdated: new Date('2026-01-10'),
  },
  {
    userId: 'usr_emma_002',
    dietary: {
      restrictions: ['vegetarian'],
      allergies: [],
      cuisinePreferences: [
        { cuisine: 'italian', score: 0.9 },
        { cuisine: 'indian', score: 0.8 },
        { cuisine: 'mediterranean', score: 0.7 },
      ],
      avoidIngredients: ['meat'],
    },
    budget: {
      dining: { min: 25, max: 50, currency: 'USD' },
      transportation: { min: 0, max: 30, currency: 'USD' },
      services: { min: 0, max: 80, currency: 'USD' },
      flexibility: 'strict',
    },
    transportation: {
      preferredServices: ['uber'],
      shareRidesOk: true,
      maxWalkMinutes: 15,
      accessibilityNeeds: [],
    },
    venue: {
      ambiancePreferences: ['casual', 'cozy'],
      seatingPreferences: ['booth'],
      accessibilityNeeds: [],
    },
    scheduling: {
      preferredMealTimes: {
        dinner: { start: '18:30', end: '20:30' },
      },
      avoidDays: [],
      timezone: 'America/Chicago',
    },
    location: {
      home: { lat: 32.7832, lng: -96.7843 }, // Deep Ellum
      preferredAreas: ['deep ellum', 'lower greenville'],
      avoidAreas: [],
      maxTravelMinutes: 25,
    },
    completenessScore: 75,
    lastUpdated: new Date('2026-01-08'),
  },
  {
    userId: 'usr_lisa_003',
    dietary: {
      restrictions: [],
      allergies: ['gluten'],
      cuisinePreferences: [
        { cuisine: 'mexican', score: 0.9 },
        { cuisine: 'american', score: 0.6 },
      ],
      avoidIngredients: ['wheat', 'barley'],
    },
    budget: {
      dining: { min: 20, max: 45, currency: 'USD' },
      transportation: { min: 0, max: 25, currency: 'USD' },
      services: { min: 0, max: 60, currency: 'USD' },
      flexibility: 'flexible',
    },
    transportation: {
      preferredServices: ['lyft', 'uber'],
      shareRidesOk: false,
      maxWalkMinutes: 8,
      accessibilityNeeds: [],
    },
    venue: {
      ambiancePreferences: ['lively', 'trendy'],
      seatingPreferences: ['patio', 'bar'],
      accessibilityNeeds: [],
    },
    scheduling: {
      preferredMealTimes: {
        dinner: { start: '19:30', end: '21:30' },
      },
      avoidDays: [0], // Avoid Sundays
      timezone: 'America/Chicago',
    },
    location: {
      home: { lat: 32.7479, lng: -96.8265 }, // Bishop Arts
      preferredAreas: ['bishop arts', 'oak cliff'],
      avoidAreas: [],
      maxTravelMinutes: 20,
    },
    completenessScore: 70,
    lastUpdated: new Date('2026-01-05'),
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getUserById(id: string): User | undefined {
  return demoUsers.find(u => u.id === id);
}

export function getConnectionsForUser(userId: string): Connection[] {
  return demoConnections.filter(c => c.fromUserId === userId);
}

export function getPreferencesForUser(userId: string): UserPreferences | undefined {
  return demoPreferences.find(p => p.userId === userId);
}

export function getEndorsementsForProvider(providerId: string): Endorsement[] {
  return demoEndorsements.filter(e => e.providerId === providerId);
}

/**
 * Find connection path between two users (BFS)
 * Returns array of user IDs in the path, or null if no path exists
 */
export function findConnectionPath(
  fromUserId: string,
  toUserId: string,
  maxDegree: number = 3
): string[] | null {
  if (fromUserId === toUserId) return [fromUserId];
  
  const visited = new Set<string>();
  const queue: { userId: string; path: string[] }[] = [
    { userId: fromUserId, path: [fromUserId] }
  ];
  
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    
    if (current.path.length > maxDegree + 1) continue;
    
    if (visited.has(current.userId)) continue;
    visited.add(current.userId);
    
    const connections = getConnectionsForUser(current.userId);
    
    for (const conn of connections) {
      const newPath = [...current.path, conn.toUserId];
      
      if (conn.toUserId === toUserId) {
        return newPath;
      }
      
      if (!visited.has(conn.toUserId) && newPath.length <= maxDegree + 1) {
        queue.push({ userId: conn.toUserId, path: newPath });
      }
    }
  }
  
  return null;
}

/**
 * Get connection degree between two users
 */
export function getConnectionDegree(
  fromUserId: string,
  toUserId: string
): 1 | 2 | 3 | null {
  const path = findConnectionPath(fromUserId, toUserId);
  if (!path) return null;
  
  const degree = path.length - 1;
  if (degree >= 1 && degree <= 3) return degree as 1 | 2 | 3;
  return null;
}
