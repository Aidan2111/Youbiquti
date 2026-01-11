// Provider and Service Offering Types

export type ProviderType = 'individual' | 'business';
export type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'rejected';
export type ProviderStatus = 'active' | 'paused' | 'suspended' | 'inactive';
export type PricingModel = 'fixed' | 'hourly' | 'per_person' | 'quote';
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict' | 'custom';

export interface VerificationDoc {
  type: 'license' | 'insurance' | 'certification' | 'id';
  url: string;
  verifiedAt?: Date;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Provider {
  id: string;
  userId?: string;
  type: ProviderType;
  displayName: string;
  description?: string;
  profileImageUrl?: string;
  businessName?: string;
  businessAddress?: string;
  taxId?: string;
  verificationStatus: VerificationStatus;
  verificationDocs: VerificationDoc[];
  verifiedAt?: Date;
  stripeConnectId?: string;
  payoutEnabled: boolean;
  totalBookings: number;
  globalRating: number;
  globalReviewCount: number;
  status: ProviderStatus;
  createdAt: Date;
}

export interface ServiceOffering {
  id: string;
  providerId: string;
  category: string;
  subcategory?: string;
  name: string;
  description: string;
  images: string[];
  pricingModel: PricingModel;
  basePrice: number;
  currency: string;
  negotiable: boolean;
  instantBook: boolean;
  leadTime: number; // hours
  cancellationPolicy: CancellationPolicy;
  maxCapacity?: number;
  minCapacity?: number;
  serviceArea?: unknown; // GeoJSON geometry
  location?: GeoPoint;
  attributes: Record<string, unknown>;
  status: 'active' | 'paused' | 'inactive';
  createdAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentId?: string;
  attributes: AttributeDefinition[];
}

export interface AttributeDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array';
  required: boolean;
  options?: string[];
  description?: string;
}

export interface AvailabilityRule {
  dayOfWeek: number[]; // 0-6, Sunday = 0
  startTime: string; // HH:MM
  endTime: string;
  slotDuration: number; // minutes
}

export interface AvailabilitySlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
  reason?: string;
}
