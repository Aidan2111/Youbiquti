// User and Connection Types for The Service Graph

export interface User {
  id: string;
  phone: string;
  phoneHash: string; // For contact matching
  displayName: string;
  email?: string;
  profileImageUrl?: string;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  toUserName: string;
  degree: 1 | 2 | 3;
  source: 'contacts' | 'manual' | 'mutual';
  strength: number; // 0-1, based on interaction frequency
  createdAt: Date;
}

export interface ConnectionPath {
  fromUserId: string;
  toUserId: string;
  path: string[]; // Array of user IDs in the path
  degree: 1 | 2 | 3;
}

export interface Endorsement {
  id: string;
  userId: string;
  userName: string;
  providerId: string;
  note?: string;
  createdAt: Date;
}

export type ConnectionDegree = 1 | 2 | 3 | null;
