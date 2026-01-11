// Demo providers and service offerings

import type { Provider, ServiceOffering } from '@youbiquti/core';

// ============================================================================
// DEMO PROVIDERS
// ============================================================================

export const demoProviders: Provider[] = [
  {
    id: 'prv_pat_driver',
    userId: 'usr_pat_006',
    type: 'individual',
    displayName: 'Pat Driver',
    description: 'Professional rideshare driver with 5+ years experience. Safe, reliable, and great conversation!',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pat',
    verificationStatus: 'verified',
    verificationDocs: [
      { type: 'license', url: 'verified', verifiedAt: new Date('2025-04-15') },
      { type: 'insurance', url: 'verified', verifiedAt: new Date('2025-04-15') },
    ],
    verifiedAt: new Date('2025-04-15'),
    stripeConnectId: 'acct_demo_pat',
    payoutEnabled: true,
    totalBookings: 147,
    globalRating: 4.9,
    globalReviewCount: 89,
    status: 'active',
    createdAt: new Date('2025-04-01'),
  },
  {
    id: 'prv_dallas_limo',
    type: 'business',
    displayName: 'Dallas Elite Limo',
    businessName: 'Dallas Elite Limousine Services LLC',
    description: 'Premium limousine and party bus services for special occasions.',
    profileImageUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=DallasLimo',
    businessAddress: '1234 Commerce St, Dallas, TX 75201',
    verificationStatus: 'verified',
    verificationDocs: [
      { type: 'license', url: 'verified', verifiedAt: new Date('2025-03-01') },
      { type: 'insurance', url: 'verified', verifiedAt: new Date('2025-03-01') },
    ],
    verifiedAt: new Date('2025-03-01'),
    stripeConnectId: 'acct_demo_limo',
    payoutEnabled: true,
    totalBookings: 312,
    globalRating: 4.7,
    globalReviewCount: 156,
    status: 'active',
    createdAt: new Date('2025-02-15'),
  },
  {
    id: 'prv_chef_maria',
    userId: 'usr_maria_chef',
    type: 'individual',
    displayName: 'Chef Maria',
    description: 'Personal chef specializing in authentic Mexican cuisine. Available for private dinners and events.',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    verificationStatus: 'verified',
    verificationDocs: [
      { type: 'certification', url: 'verified', verifiedAt: new Date('2025-05-01') },
    ],
    verifiedAt: new Date('2025-05-01'),
    payoutEnabled: true,
    totalBookings: 45,
    globalRating: 4.95,
    globalReviewCount: 38,
    status: 'active',
    createdAt: new Date('2025-04-20'),
  },
];

// ============================================================================
// SERVICE OFFERINGS
// ============================================================================

export const demoOfferings: ServiceOffering[] = [
  // Pat's rideshare service
  {
    id: 'off_pat_ride',
    providerId: 'prv_pat_driver',
    category: 'transportation',
    subcategory: 'rideshare',
    name: 'Personal Rideshare',
    description: 'Comfortable rides in a clean Toyota Camry. Airport pickups, nights out, or wherever you need to go.',
    images: [],
    pricingModel: 'quote',
    basePrice: 15, // Base fare
    currency: 'USD',
    negotiable: false,
    instantBook: true,
    leadTime: 1, // 1 hour notice
    cancellationPolicy: 'flexible',
    maxCapacity: 4,
    minCapacity: 1,
    location: { lat: 32.7801, lng: -96.7997 }, // Dallas downtown
    attributes: {
      vehicleType: 'sedan',
      vehicleMake: 'Toyota',
      vehicleModel: 'Camry',
      vehicleYear: 2023,
      amenities: ['phone charger', 'water', 'aux cord'],
    },
    status: 'active',
    createdAt: new Date('2025-04-01'),
  },
  
  // Dallas Limo offerings
  {
    id: 'off_limo_sedan',
    providerId: 'prv_dallas_limo',
    category: 'transportation',
    subcategory: 'limo',
    name: 'Executive Sedan',
    description: 'Luxury Lincoln Continental for business or special occasions.',
    images: [],
    pricingModel: 'hourly',
    basePrice: 75,
    currency: 'USD',
    negotiable: true,
    instantBook: false,
    leadTime: 24,
    cancellationPolicy: 'moderate',
    maxCapacity: 3,
    minCapacity: 1,
    location: { lat: 32.7801, lng: -96.7997 },
    attributes: {
      vehicleType: 'luxury sedan',
      amenities: ['champagne', 'privacy partition', 'wifi'],
    },
    status: 'active',
    createdAt: new Date('2025-02-15'),
  },
  {
    id: 'off_limo_partybus',
    providerId: 'prv_dallas_limo',
    category: 'transportation',
    subcategory: 'party_bus',
    name: 'Party Bus Experience',
    description: 'Full-size party bus with LED lights, sound system, and dance pole. Perfect for bachelorette parties!',
    images: [],
    pricingModel: 'hourly',
    basePrice: 200,
    currency: 'USD',
    negotiable: true,
    instantBook: false,
    leadTime: 48,
    cancellationPolicy: 'strict',
    maxCapacity: 20,
    minCapacity: 8,
    location: { lat: 32.7801, lng: -96.7997 },
    attributes: {
      vehicleType: 'party bus',
      amenities: ['LED lights', 'premium sound system', 'dance pole', 'cooler', 'champagne package available'],
    },
    status: 'active',
    createdAt: new Date('2025-02-15'),
  },
  
  // Chef Maria's offerings
  {
    id: 'off_chef_dinner',
    providerId: 'prv_chef_maria',
    category: 'dining',
    subcategory: 'private_chef',
    name: 'Private Mexican Dinner',
    description: 'Authentic 4-course Mexican dinner prepared in your home. Includes shopping, cooking, and cleanup.',
    images: [],
    pricingModel: 'per_person',
    basePrice: 85,
    currency: 'USD',
    negotiable: true,
    instantBook: false,
    leadTime: 72,
    cancellationPolicy: 'moderate',
    maxCapacity: 12,
    minCapacity: 4,
    location: { lat: 32.7801, lng: -96.7997 },
    attributes: {
      cuisineType: 'mexican',
      mealType: 'dinner',
      courses: 4,
      dietaryAccommodations: ['vegetarian', 'gluten-free available'],
    },
    status: 'active',
    createdAt: new Date('2025-04-20'),
  },
];

// ============================================================================
// REVIEWS (for trust score calculation)
// ============================================================================

export interface DemoReview {
  id: string;
  providerId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  text: string;
  createdAt: Date;
}

export const demoReviews: DemoReview[] = [
  // Reviews for Pat Driver
  {
    id: 'rev_001',
    providerId: 'prv_pat_driver',
    reviewerId: 'usr_mike_005',
    reviewerName: 'Mike Johnson',
    rating: 5,
    text: 'Pat is amazing! Always on time and super friendly. My go-to driver now.',
    createdAt: new Date('2025-10-15'),
  },
  {
    id: 'rev_002',
    providerId: 'prv_pat_driver',
    reviewerId: 'usr_mike_005',
    reviewerName: 'Mike Johnson',
    rating: 5,
    text: 'Used Pat again for airport pickup. Flawless experience.',
    createdAt: new Date('2025-11-20'),
  },
  {
    id: 'rev_003',
    providerId: 'prv_pat_driver',
    reviewerId: 'usr_mike_005',
    reviewerName: 'Mike Johnson',
    rating: 5,
    text: 'Third ride with Pat. Consistent quality every time.',
    createdAt: new Date('2025-12-10'),
  },
  
  // Reviews for Chef Maria
  {
    id: 'rev_004',
    providerId: 'prv_chef_maria',
    reviewerId: 'usr_lisa_003',
    reviewerName: 'Lisa Park',
    rating: 5,
    text: 'Chef Maria made our dinner party incredible! The mole was to die for.',
    createdAt: new Date('2025-09-25'),
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getProviderById(id: string): Provider | undefined {
  return demoProviders.find(p => p.id === id);
}

export function getOfferingsForProvider(providerId: string): ServiceOffering[] {
  return demoOfferings.filter(o => o.providerId === providerId);
}

export function getOfferingById(id: string): ServiceOffering | undefined {
  return demoOfferings.find(o => o.id === id);
}

export function getReviewsForProvider(providerId: string): DemoReview[] {
  return demoReviews.filter(r => r.providerId === providerId);
}

export function searchOfferings(
  category?: string,
  subcategory?: string,
  maxPrice?: number
): ServiceOffering[] {
  return demoOfferings.filter(o => {
    if (category && o.category !== category) return false;
    if (subcategory && o.subcategory !== subcategory) return false;
    if (maxPrice && o.basePrice > maxPrice) return false;
    return o.status === 'active';
  });
}
