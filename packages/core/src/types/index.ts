// Re-export all types from core package

// User and Connection types
export * from './user.js';

// Provider and Service Offering types
export * from './provider.js';

// Trust Score types
export * from './trust.js';

// Preference types
export * from './preferences.js';

// Matching types
export * from './matching.js';

// Transaction types
export * from './transaction.js';

// GNO-specific types
export * from './gno.js';

// Common utility types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
