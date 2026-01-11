// Dallas Bar Mock Data

import type { Bar } from '@youbiquti/core';

export const dallasBars: Bar[] = [
  // === UPTOWN ===
  {
    id: 'bar_standard_pour_001',
    name: 'The Standard Pour',
    barType: 'cocktail',
    priceLevel: 3,
    rating: 4.4,
    reviewCount: 876,
    address: '2900 McKinney Ave, Dallas, TX 75204',
    neighborhood: 'Uptown',
    city: 'Dallas',
    phone: '(214) 935-1370',
    hours: {
      monday: { open: '16:00', close: '00:00' },
      tuesday: { open: '16:00', close: '00:00' },
      wednesday: { open: '16:00', close: '00:00' },
      thursday: { open: '16:00', close: '02:00' },
      friday: { open: '16:00', close: '02:00' },
      saturday: { open: '16:00', close: '02:00' },
      sunday: { open: '12:00', close: '00:00' },
    },
    vibes: ['upscale', 'trendy', 'craft cocktails'],
    musicType: 'DJ on weekends',
    features: ['craft cocktails', 'whiskey selection', 'late night'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/the-standard-pour-dallas',
    coordinates: { lat: 32.8023, lng: -96.7965 },
  },
  {
    id: 'bar_happiest_hour_002',
    name: 'Happiest Hour',
    barType: 'rooftop',
    priceLevel: 2,
    rating: 4.2,
    reviewCount: 1234,
    address: '2616 Olive St, Dallas, TX 75201',
    neighborhood: 'Uptown',
    city: 'Dallas',
    phone: '(469) 334-0830',
    hours: {
      monday: { open: '16:00', close: '00:00' },
      tuesday: { open: '16:00', close: '00:00' },
      wednesday: { open: '16:00', close: '00:00' },
      thursday: { open: '16:00', close: '02:00' },
      friday: { open: '14:00', close: '02:00' },
      saturday: { open: '11:00', close: '02:00' },
      sunday: { open: '11:00', close: '00:00' },
    },
    vibes: ['lively', 'rooftop', 'great for groups'],
    features: ['rooftop patio', 'games', 'great happy hour'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/happiest-hour-dallas',
    coordinates: { lat: 32.7998, lng: -96.8012 },
  },
  {
    id: 'bar_kung_fu_003',
    name: 'Kung Fu Saloon',
    barType: 'dive',
    priceLevel: 1,
    rating: 4.0,
    reviewCount: 567,
    address: '2625 Elm St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 741-4436',
    hours: {
      monday: { open: '16:00', close: '02:00' },
      tuesday: { open: '16:00', close: '02:00' },
      wednesday: { open: '16:00', close: '02:00' },
      thursday: { open: '16:00', close: '02:00' },
      friday: { open: '14:00', close: '02:00' },
      saturday: { open: '14:00', close: '02:00' },
      sunday: { open: '14:00', close: '02:00' },
    },
    vibes: ['casual', 'fun', 'retro'],
    features: ['arcade games', 'cheap drinks', 'nostalgic'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/kung-fu-saloon-dallas',
    coordinates: { lat: 32.7835, lng: -96.7855 },
  },
  
  // === DEEP ELLUM ===
  {
    id: 'bar_truth_alibi_004',
    name: 'Truth & Alibi',
    barType: 'speakeasy',
    priceLevel: 3,
    rating: 4.5,
    reviewCount: 678,
    address: '2818 Main St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 749-8336',
    hours: {
      wednesday: { open: '19:00', close: '02:00' },
      thursday: { open: '19:00', close: '02:00' },
      friday: { open: '19:00', close: '02:00' },
      saturday: { open: '19:00', close: '02:00' },
    },
    vibes: ['intimate', 'romantic', 'speakeasy'],
    dressCode: 'Smart casual',
    musicType: 'Live jazz',
    features: ['hidden entrance', 'craft cocktails', 'live music'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/truth-and-alibi-dallas',
    coordinates: { lat: 32.7840, lng: -96.7838 },
  },
  {
    id: 'bar_braindead_005',
    name: 'Braindead Brewing',
    barType: 'brewery',
    priceLevel: 2,
    rating: 4.4,
    reviewCount: 923,
    address: '2625 Main St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 749-0600',
    hours: {
      monday: { open: '11:00', close: '00:00' },
      tuesday: { open: '11:00', close: '00:00' },
      wednesday: { open: '11:00', close: '00:00' },
      thursday: { open: '11:00', close: '00:00' },
      friday: { open: '11:00', close: '02:00' },
      saturday: { open: '11:00', close: '02:00' },
      sunday: { open: '11:00', close: '00:00' },
    },
    vibes: ['casual', 'trendy', 'great for groups'],
    features: ['house-brewed beer', 'great food', 'large patio'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/braindead-brewing-dallas',
    coordinates: { lat: 32.7832, lng: -96.7848 },
  },
  {
    id: 'bar_midnight_rambler_006',
    name: 'Midnight Rambler',
    barType: 'cocktail',
    priceLevel: 3,
    rating: 4.6,
    reviewCount: 534,
    address: '1530 Main St, Dallas, TX 75201',
    neighborhood: 'Downtown',
    city: 'Dallas',
    phone: '(214) 261-4601',
    hours: {
      monday: { open: '17:00', close: '00:00' },
      tuesday: { open: '17:00', close: '00:00' },
      wednesday: { open: '17:00', close: '00:00' },
      thursday: { open: '17:00', close: '02:00' },
      friday: { open: '17:00', close: '02:00' },
      saturday: { open: '17:00', close: '02:00' },
      sunday: { open: '17:00', close: '00:00' },
    },
    vibes: ['upscale', 'intimate', 'craft cocktails'],
    dressCode: 'Smart casual',
    musicType: 'Vinyl DJ',
    features: ['basement bar', 'top-tier cocktails', 'moody atmosphere'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/midnight-rambler-dallas',
    coordinates: { lat: 32.7812, lng: -96.7985 },
  },
  {
    id: 'bar_it_ll_do_007',
    name: "It'll Do Club",
    barType: 'club',
    priceLevel: 2,
    rating: 4.3,
    reviewCount: 456,
    address: '4322 Elm St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 742-8315',
    hours: {
      friday: { open: '22:00', close: '04:00' },
      saturday: { open: '22:00', close: '04:00' },
    },
    vibes: ['dance club', 'electronic', 'late night'],
    dressCode: 'Casual',
    musicType: 'Electronic/House',
    features: ['legendary dance club', 'great sound system', 'late hours'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/itll-do-club-dallas',
    coordinates: { lat: 32.7842, lng: -96.7795 },
  },
  
  // === LOWER GREENVILLE ===
  {
    id: 'bar_truck_yard_008',
    name: 'Truck Yard',
    barType: 'beer garden',
    priceLevel: 1,
    rating: 4.3,
    reviewCount: 1567,
    address: '5624 Sears St, Dallas, TX 75206',
    neighborhood: 'Lower Greenville',
    city: 'Dallas',
    phone: '(469) 500-0139',
    hours: {
      monday: { open: '11:00', close: '00:00' },
      tuesday: { open: '11:00', close: '00:00' },
      wednesday: { open: '11:00', close: '00:00' },
      thursday: { open: '11:00', close: '02:00' },
      friday: { open: '11:00', close: '02:00' },
      saturday: { open: '11:00', close: '02:00' },
      sunday: { open: '11:00', close: '00:00' },
    },
    vibes: ['casual', 'fun', 'outdoor'],
    features: ['outdoor beer garden', 'food trucks', 'treehouse', 'dog friendly'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/truck-yard-dallas',
    coordinates: { lat: 32.8195, lng: -96.7682 },
  },
  {
    id: 'bar_single_wide_009',
    name: 'Single Wide',
    barType: 'dive',
    priceLevel: 1,
    rating: 4.1,
    reviewCount: 432,
    address: '2615 Elm St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 741-8199',
    hours: {
      monday: { open: '15:00', close: '02:00' },
      tuesday: { open: '15:00', close: '02:00' },
      wednesday: { open: '15:00', close: '02:00' },
      thursday: { open: '15:00', close: '02:00' },
      friday: { open: '15:00', close: '02:00' },
      saturday: { open: '15:00', close: '02:00' },
      sunday: { open: '15:00', close: '02:00' },
    },
    vibes: ['dive bar', 'casual', 'cheap drinks'],
    features: ['cheap beer', 'trailer park theme', 'patio'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/single-wide-dallas',
    coordinates: { lat: 32.7834, lng: -96.7858 },
  },
  {
    id: 'bar_double_wide_010',
    name: 'Double Wide',
    barType: 'dive',
    priceLevel: 1,
    rating: 4.2,
    reviewCount: 567,
    address: '3510 Commerce St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 887-6510',
    hours: {
      monday: { open: '15:00', close: '02:00' },
      tuesday: { open: '15:00', close: '02:00' },
      wednesday: { open: '15:00', close: '02:00' },
      thursday: { open: '15:00', close: '02:00' },
      friday: { open: '15:00', close: '02:00' },
      saturday: { open: '15:00', close: '02:00' },
      sunday: { open: '15:00', close: '02:00' },
    },
    vibes: ['dive bar', 'quirky', 'live music'],
    musicType: 'Live bands',
    features: ['cheap beer', 'live music', 'weird decor'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/double-wide-dallas',
    coordinates: { lat: 32.7822, lng: -96.7798 },
  },
  
  // === DESIGN DISTRICT ===
  {
    id: 'bar_henrys_majestic_011',
    name: "Henry's Majestic",
    barType: 'cocktail',
    priceLevel: 3,
    rating: 4.3,
    reviewCount: 678,
    address: '4900 McKinney Ave, Dallas, TX 75205',
    neighborhood: 'Knox-Henderson',
    city: 'Dallas',
    phone: '(469) 893-4026',
    hours: {
      monday: { open: '11:00', close: '00:00' },
      tuesday: { open: '11:00', close: '00:00' },
      wednesday: { open: '11:00', close: '00:00' },
      thursday: { open: '11:00', close: '02:00' },
      friday: { open: '11:00', close: '02:00' },
      saturday: { open: '10:00', close: '02:00' },
      sunday: { open: '10:00', close: '00:00' },
    },
    vibes: ['upscale', 'trendy', 'brunch'],
    features: ['great cocktails', 'food menu', 'stylish interior'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/henrys-majestic-dallas',
    coordinates: { lat: 32.8188, lng: -96.7925 },
  },
  {
    id: 'bar_hide_012',
    name: 'Hide',
    barType: 'cocktail',
    priceLevel: 3,
    rating: 4.4,
    reviewCount: 345,
    address: '2816 Elm St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(214) 503-4420',
    hours: {
      tuesday: { open: '18:00', close: '02:00' },
      wednesday: { open: '18:00', close: '02:00' },
      thursday: { open: '18:00', close: '02:00' },
      friday: { open: '18:00', close: '02:00' },
      saturday: { open: '18:00', close: '02:00' },
    },
    vibes: ['intimate', 'dark', 'craft cocktails'],
    features: ['craft cocktails', 'dim lighting', 'small plates'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/hide-dallas',
    coordinates: { lat: 32.7839, lng: -96.7840 },
  },
  {
    id: 'bar_parliament_013',
    name: 'Parliament',
    barType: 'cocktail',
    priceLevel: 3,
    rating: 4.5,
    reviewCount: 423,
    address: '2418 Allen St, Dallas, TX 75204',
    neighborhood: 'Uptown',
    city: 'Dallas',
    phone: '(214) 742-2466',
    hours: {
      tuesday: { open: '17:00', close: '02:00' },
      wednesday: { open: '17:00', close: '02:00' },
      thursday: { open: '17:00', close: '02:00' },
      friday: { open: '17:00', close: '02:00' },
      saturday: { open: '17:00', close: '02:00' },
    },
    vibes: ['upscale', 'intimate', 'craft cocktails'],
    dressCode: 'Smart casual',
    features: ['award-winning cocktails', 'intimate setting', 'reservations recommended'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/parliament-dallas',
    coordinates: { lat: 32.7995, lng: -96.7978 },
  },
  {
    id: 'bar_high_fives_014',
    name: 'High Fives',
    barType: 'sports',
    priceLevel: 2,
    rating: 4.0,
    reviewCount: 234,
    address: '2823 Main St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(469) 334-0131',
    hours: {
      monday: { open: '16:00', close: '02:00' },
      tuesday: { open: '16:00', close: '02:00' },
      wednesday: { open: '16:00', close: '02:00' },
      thursday: { open: '16:00', close: '02:00' },
      friday: { open: '14:00', close: '02:00' },
      saturday: { open: '12:00', close: '02:00' },
      sunday: { open: '12:00', close: '00:00' },
    },
    vibes: ['casual', 'sports bar', 'nostalgic'],
    features: ['arcade games', 'sports on TV', 'dallas sports memorabilia'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/high-fives-dallas',
    coordinates: { lat: 32.7841, lng: -96.7836 },
  },
  {
    id: 'bar_stirr_015',
    name: 'STIRR',
    barType: 'rooftop',
    priceLevel: 2,
    rating: 3.9,
    reviewCount: 567,
    address: '2803 Main St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    phone: '(469) 407-2960',
    hours: {
      monday: { open: '16:00', close: '00:00' },
      tuesday: { open: '16:00', close: '00:00' },
      wednesday: { open: '16:00', close: '00:00' },
      thursday: { open: '16:00', close: '02:00' },
      friday: { open: '11:00', close: '02:00' },
      saturday: { open: '11:00', close: '02:00' },
      sunday: { open: '11:00', close: '00:00' },
    },
    vibes: ['trendy', 'rooftop', 'see and be seen'],
    features: ['rooftop views', 'bottle service', 'dj weekends'],
    photos: [],
    yelpUrl: 'https://www.yelp.com/biz/stirr-dallas',
    coordinates: { lat: 32.7839, lng: -96.7839 },
  },
];

/**
 * Search bars by criteria
 */
export function searchDallasBars(params: {
  location?: string;
  vibes?: string[];
  priceLevel?: 1 | 2 | 3 | 4;
  openLate?: boolean;
  barType?: string;
  limit?: number;
}): Bar[] {
  let results = [...dallasBars];
  
  // Filter by neighborhood
  if (params.location) {
    const locationLower = params.location.toLowerCase();
    results = results.filter(b => 
      b.neighborhood.toLowerCase().includes(locationLower) ||
      b.city.toLowerCase().includes(locationLower) ||
      b.address.toLowerCase().includes(locationLower)
    );
  }
  
  // Filter by vibes
  if (params.vibes && params.vibes.length > 0) {
    const vibesLower = params.vibes.map(v => v.toLowerCase());
    results = results.filter(b =>
      b.vibes.some(v => vibesLower.some(vl => v.toLowerCase().includes(vl))) ||
      vibesLower.some(vl => b.barType.toLowerCase().includes(vl))
    );
  }
  
  // Filter by price level
  if (params.priceLevel) {
    results = results.filter(b => b.priceLevel <= params.priceLevel!);
  }
  
  // Filter by bar type
  if (params.barType) {
    const typeLower = params.barType.toLowerCase();
    results = results.filter(b => b.barType.toLowerCase().includes(typeLower));
  }
  
  // Filter by open late (after midnight on weekends)
  if (params.openLate) {
    results = results.filter(b => {
      const fridayHours = b.hours.friday;
      if (!fridayHours) return false;
      const closeTime = parseInt(fridayHours.close.split(':')[0] ?? '0');
      return closeTime >= 1 || closeTime === 0; // Closes at 1am or later, or midnight
    });
  }
  
  // Sort by rating
  results.sort((a, b) => b.rating - a.rating);
  
  // Limit results
  if (params.limit) {
    results = results.slice(0, params.limit);
  }
  
  return results;
}
