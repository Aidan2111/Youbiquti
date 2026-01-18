// Dallas Restaurant Mock Data

import type { Restaurant } from '@youbiquti/core';

export const dallasRestaurants: Restaurant[] = [
  // === UPTOWN ===
  {
    id: 'rst_henry_001',
    name: 'The Henry',
    cuisine: 'American',
    priceLevel: 3,
    rating: 4.5,
    reviewCount: 1247,
    address: '2301 N Akard St, Dallas, TX 75201',
    neighborhood: 'Uptown',
    city: 'Dallas',
    phone: '(469) 893-3420',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '21:00' },
    },
    vibes: ['trendy', 'upscale', 'great for groups'],
    dietaryOptions: ['vegetarian', 'gluten-free options'],
    features: ['outdoor seating', 'full bar', 'brunch'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/the-henry-dallas',
    bookingUrl: 'https://www.opentable.com/the-henry-dallas',
    coordinates: { lat: 32.7987, lng: -96.8002 },
  },
  {
    id: 'rst_al_biernats_002',
    name: "Al Biernat's",
    cuisine: 'Steakhouse',
    priceLevel: 4,
    rating: 4.7,
    reviewCount: 892,
    address: '4217 Oak Lawn Ave, Dallas, TX 75219',
    neighborhood: 'Oak Lawn',
    city: 'Dallas',
    phone: '(214) 219-2201',
    hours: {
      monday: { open: '17:00', close: '22:00' },
      tuesday: { open: '17:00', close: '22:00' },
      wednesday: { open: '17:00', close: '22:00' },
      thursday: { open: '17:00', close: '22:00' },
      friday: { open: '17:00', close: '23:00' },
      saturday: { open: '17:00', close: '23:00' },
      sunday: { open: '17:00', close: '21:00' },
    },
    vibes: ['upscale', 'romantic', 'special occasion'],
    dietaryOptions: ['gluten-free options'],
    features: ['private dining', 'full bar', 'valet parking'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/al-biernats-dallas',
    bookingUrl: 'https://www.opentable.com/al-biernats',
    coordinates: { lat: 32.8115, lng: -96.8115 },
  },
  {
    id: 'rst_moxies_003',
    name: "Moxie's Grill & Bar",
    cuisine: 'American',
    priceLevel: 2,
    rating: 4.2,
    reviewCount: 634,
    address: '2820 N Henderson Ave, Dallas, TX 75206',
    neighborhood: 'Knox-Henderson',
    city: 'Dallas',
    phone: '(469) 898-0999',
    hours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '00:00' },
      friday: { open: '11:00', close: '01:00' },
      saturday: { open: '11:00', close: '01:00' },
      sunday: { open: '11:00', close: '22:00' },
    },
    vibes: ['casual', 'lively', 'great for groups'],
    dietaryOptions: ['vegetarian', 'gluten-free options'],
    features: ['happy hour', 'outdoor seating', 'full bar'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/moxies-grill-and-bar-dallas',
    coordinates: { lat: 32.8205, lng: -96.7852 },
  },
  
  // === DEEP ELLUM ===
  {
    id: 'rst_pecan_lodge_004',
    name: 'Pecan Lodge',
    cuisine: 'BBQ',
    priceLevel: 2,
    rating: 4.8,
    reviewCount: 3421,
    address: '2702 Main St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 748-8900',
    hours: {
      monday: { open: '11:00', close: '15:00' },
      tuesday: { open: '11:00', close: '21:00' },
      wednesday: { open: '11:00', close: '21:00' },
      thursday: { open: '11:00', close: '21:00' },
      friday: { open: '11:00', close: '21:00' },
      saturday: { open: '11:00', close: '21:00' },
      sunday: { open: '11:00', close: '15:00' },
    },
    vibes: ['casual', 'local favorite', 'iconic'],
    dietaryOptions: ['gluten-free options'],
    features: ['counter service', 'famous brisket', 'sells out early'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/pecan-lodge-dallas',
    coordinates: { lat: 32.7832, lng: -96.7843 },
  },
  {
    id: 'rst_revolver_taco_005',
    name: 'Revolver Taco Lounge',
    cuisine: 'Mexican',
    priceLevel: 2,
    rating: 4.6,
    reviewCount: 876,
    address: '2701 Main St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 272-7163',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '11:00', close: '00:00' },
      sunday: { open: '11:00', close: '22:00' },
    },
    vibes: ['trendy', 'lively', 'creative'],
    dietaryOptions: ['vegetarian', 'vegan options'],
    features: ['craft cocktails', 'upscale tacos', 'great margaritas'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/revolver-taco-lounge-dallas',
    coordinates: { lat: 32.7833, lng: -96.7841 },
  },
  {
    id: 'rst_cane_rosso_006',
    name: 'Cane Rosso',
    cuisine: 'Italian',
    priceLevel: 2,
    rating: 4.5,
    reviewCount: 1567,
    address: '2612 Commerce St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 741-1188',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '21:00' },
    },
    vibes: ['casual', 'trendy', 'great for groups'],
    dietaryOptions: ['vegetarian', 'vegan pizza available'],
    features: ['neapolitan pizza', 'wood-fired oven', 'dog friendly patio'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/cane-rosso-dallas',
    coordinates: { lat: 32.7825, lng: -96.7850 },
  },
  
  // === BISHOP ARTS ===
  {
    id: 'rst_lucia_007',
    name: 'Lucia',
    cuisine: 'Italian',
    priceLevel: 4,
    rating: 4.8,
    reviewCount: 567,
    address: '408 W 8th St, Dallas, TX 75208',
    neighborhood: 'Bishop Arts',
    city: 'Dallas',
    phone: '(214) 948-4998',
    hours: {
      tuesday: { open: '17:30', close: '22:00' },
      wednesday: { open: '17:30', close: '22:00' },
      thursday: { open: '17:30', close: '22:00' },
      friday: { open: '17:30', close: '22:30' },
      saturday: { open: '17:30', close: '22:30' },
    },
    vibes: ['romantic', 'upscale', 'intimate'],
    dietaryOptions: ['vegetarian', 'gluten-free options'],
    features: ['house-made pasta', 'prix fixe available', 'reservations required'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/lucia-dallas',
    bookingUrl: 'https://www.opentable.com/lucia',
    coordinates: { lat: 32.7479, lng: -96.8265 },
  },
  {
    id: 'rst_enos_008',
    name: "Eno's Pizza Tavern",
    cuisine: 'Pizza',
    priceLevel: 2,
    rating: 4.4,
    reviewCount: 423,
    address: '407 N Bishop Ave, Dallas, TX 75208',
    neighborhood: 'Bishop Arts',
    city: 'Dallas',
    phone: '(214) 943-9200',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '11:00', close: '00:00' },
      sunday: { open: '11:00', close: '22:00' },
    },
    vibes: ['casual', 'local favorite', 'family friendly'],
    dietaryOptions: ['vegetarian'],
    features: ['craft beer', 'patio', 'thin crust pizza'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/enos-pizza-tavern-dallas',
    coordinates: { lat: 32.7481, lng: -96.8268 },
  },
  {
    id: 'rst_oddfellows_009',
    name: 'Oddfellows',
    cuisine: 'American',
    priceLevel: 2,
    rating: 4.3,
    reviewCount: 789,
    address: '316 W 7th St, Dallas, TX 75208',
    neighborhood: 'Bishop Arts',
    city: 'Dallas',
    phone: '(214) 944-5765',
    hours: {
      monday: { open: '07:00', close: '22:00' },
      tuesday: { open: '07:00', close: '22:00' },
      wednesday: { open: '07:00', close: '22:00' },
      thursday: { open: '07:00', close: '22:00' },
      friday: { open: '07:00', close: '23:00' },
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '08:00', close: '15:00' },
    },
    vibes: ['casual', 'trendy', 'brunch spot'],
    dietaryOptions: ['vegetarian', 'vegan options'],
    features: ['great brunch', 'coffee shop', 'patio'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/oddfellows-dallas',
    coordinates: { lat: 32.7476, lng: -96.8262 },
  },
  
  // === DOWNTOWN ===
  {
    id: 'rst_nick_sams_010',
    name: "Nick & Sam's",
    cuisine: 'Steakhouse',
    priceLevel: 4,
    rating: 4.6,
    reviewCount: 1123,
    address: '3008 Maple Ave, Dallas, TX 75201',
    neighborhood: 'Uptown',
    city: 'Dallas',
    phone: '(214) 871-7444',
    hours: {
      monday: { open: '17:00', close: '22:00' },
      tuesday: { open: '17:00', close: '22:00' },
      wednesday: { open: '17:00', close: '22:00' },
      thursday: { open: '17:00', close: '22:00' },
      friday: { open: '17:00', close: '23:00' },
      saturday: { open: '17:00', close: '23:00' },
      sunday: { open: '17:00', close: '21:00' },
    },
    vibes: ['upscale', 'romantic', 'live music'],
    dietaryOptions: ['gluten-free options'],
    features: ['live jazz', 'private dining', 'extensive wine list'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/nick-and-sams-dallas',
    bookingUrl: 'https://www.opentable.com/nick-and-sams',
    coordinates: { lat: 32.8005, lng: -96.8045 },
  },
  {
    id: 'rst_dakotas_011',
    name: "Dakota's Steakhouse",
    cuisine: 'Steakhouse',
    priceLevel: 4,
    rating: 4.5,
    reviewCount: 678,
    address: '600 N Akard St, Dallas, TX 75201',
    neighborhood: 'Downtown',
    city: 'Dallas',
    phone: '(214) 740-4001',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '17:00', close: '23:00' },
      sunday: { open: '17:00', close: '21:00' },
    },
    vibes: ['upscale', 'unique', 'hidden gem'],
    dietaryOptions: ['gluten-free options'],
    features: ['underground restaurant', 'waterfall entrance', 'business lunch'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/dakotas-steakhouse-dallas',
    bookingUrl: 'https://www.opentable.com/dakotas-steakhouse',
    coordinates: { lat: 32.7845, lng: -96.7997 },
  },
  {
    id: 'rst_town_hearth_012',
    name: 'Town Hearth',
    cuisine: 'American',
    priceLevel: 4,
    rating: 4.4,
    reviewCount: 534,
    address: '1617 Hi Line Dr, Dallas, TX 75207',
    neighborhood: 'Design District',
    city: 'Dallas',
    phone: '(214) 761-8181',
    hours: {
      tuesday: { open: '17:00', close: '22:00' },
      wednesday: { open: '17:00', close: '22:00' },
      thursday: { open: '17:00', close: '22:00' },
      friday: { open: '17:00', close: '23:00' },
      saturday: { open: '17:00', close: '23:00' },
      sunday: { open: '17:00', close: '21:00' },
    },
    vibes: ['upscale', 'trendy', 'see and be seen'],
    dietaryOptions: ['gluten-free options'],
    features: ['celebrity chef', 'extensive bar', 'vintage decor'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/town-hearth-dallas',
    bookingUrl: 'https://www.opentable.com/town-hearth',
    coordinates: { lat: 32.7903, lng: -96.8236 },
  },
  
  // === LOWER GREENVILLE ===
  {
    id: 'rst_hg_sply_013',
    name: 'HG Sply Co.',
    cuisine: 'American',
    priceLevel: 2,
    rating: 4.3,
    reviewCount: 1234,
    address: '2008 Greenville Ave, Dallas, TX 75206',
    neighborhood: 'Lower Greenville',
    city: 'Dallas',
    phone: '(469) 334-0895',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '10:00', close: '00:00' },
      sunday: { open: '10:00', close: '22:00' },
    },
    vibes: ['casual', 'trendy', 'rooftop'],
    dietaryOptions: ['vegetarian', 'vegan options', 'paleo', 'keto'],
    features: ['rooftop patio', 'healthy options', 'great brunch'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/hg-sply-co-dallas',
    coordinates: { lat: 32.8183, lng: -96.7700 },
  },
  {
    id: 'rst_greenville_ave_pizza_014',
    name: 'Greenville Avenue Pizza Company',
    cuisine: 'Pizza',
    priceLevel: 1,
    rating: 4.4,
    reviewCount: 567,
    address: '1923 Greenville Ave, Dallas, TX 75206',
    neighborhood: 'Lower Greenville',
    city: 'Dallas',
    phone: '(214) 826-0606',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '11:00', close: '00:00' },
      sunday: { open: '11:00', close: '22:00' },
    },
    vibes: ['casual', 'local favorite', 'late night'],
    dietaryOptions: ['vegetarian'],
    features: ['by the slice', 'craft beer', 'late night eats'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/greenville-avenue-pizza-company-dallas',
    coordinates: { lat: 32.8175, lng: -96.7695 },
  },
  {
    id: 'rst_teppo_015',
    name: 'Teppo Yakitori & Sushi Bar',
    cuisine: 'Japanese',
    priceLevel: 3,
    rating: 4.5,
    reviewCount: 445,
    address: '2014 Greenville Ave, Dallas, TX 75206',
    neighborhood: 'Lower Greenville',
    city: 'Dallas',
    phone: '(214) 826-8989',
    hours: {
      monday: { open: '17:00', close: '22:00' },
      tuesday: { open: '17:00', close: '22:00' },
      wednesday: { open: '17:00', close: '22:00' },
      thursday: { open: '17:00', close: '22:00' },
      friday: { open: '17:00', close: '23:00' },
      saturday: { open: '17:00', close: '23:00' },
      sunday: { open: '17:00', close: '21:00' },
    },
    vibes: ['intimate', 'authentic', 'date night'],
    dietaryOptions: ['gluten-free options'],
    features: ['omakase', 'sake selection', 'yakitori grill'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/teppo-yakitori-and-sushi-bar-dallas',
    bookingUrl: 'https://www.opentable.com/teppo',
    coordinates: { lat: 32.8185, lng: -96.7702 },
  },
];

/**
 * Search restaurants by criteria
 */
export function searchDallasRestaurants(params: {
  location?: string;
  cuisine?: string;
  priceLevel?: 1 | 2 | 3 | 4;
  vibes?: string[];
  limit?: number;
}): Restaurant[] {
  let results = [...dallasRestaurants];
  
  // Filter by neighborhood/location - bidirectional matching
  // "Deep Ellum, Dallas" should match restaurants in "Deep Ellum" neighborhood
  if (params.location) {
    const locationLower = params.location.toLowerCase();
    results = results.filter(r => {
      const neighborhoodLower = r.neighborhood.toLowerCase();
      const cityLower = r.city.toLowerCase();
      const addressLower = r.address.toLowerCase();

      // Check if search term contains restaurant's location data (e.g., "deep ellum, dallas" contains "deep ellum")
      // OR if restaurant's data contains search term (e.g., "dallas" contains "dallas")
      return locationLower.includes(neighborhoodLower) ||
        locationLower.includes(cityLower) ||
        neighborhoodLower.includes(locationLower) ||
        cityLower.includes(locationLower) ||
        addressLower.includes(locationLower);
    });
  }
  
  // Filter by cuisine
  if (params.cuisine) {
    const cuisineLower = params.cuisine.toLowerCase();
    results = results.filter(r => 
      r.cuisine.toLowerCase().includes(cuisineLower)
    );
  }
  
  // Filter by price level
  if (params.priceLevel) {
    results = results.filter(r => r.priceLevel <= params.priceLevel!);
  }
  
  // Filter by vibes
  if (params.vibes && params.vibes.length > 0) {
    const vibesLower = params.vibes.map(v => v.toLowerCase());
    results = results.filter(r =>
      r.vibes.some(v => vibesLower.some(vl => v.toLowerCase().includes(vl)))
    );
  }
  
  // Sort by rating
  results.sort((a, b) => b.rating - a.rating);
  
  // Limit results
  if (params.limit) {
    results = results.slice(0, params.limit);
  }
  
  return results;
}
