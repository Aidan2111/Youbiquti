// Dallas Events Mock Data

import type { Event } from '@youbiquti/core';

// Generate dates relative to "now" for realistic mock data
function getUpcomingDate(daysFromNow: number, hour: number = 19): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

export const dallasEvents: Event[] = [
  // === CONCERTS ===
  {
    id: 'evt_concert_001',
    name: 'Jazz Under the Stars',
    eventType: 'concert',
    venue: 'Klyde Warren Park',
    address: '2012 Woodall Rodgers Fwy, Dallas, TX 75201',
    neighborhood: 'Downtown',
    city: 'Dallas',
    startTime: getUpcomingDate(3, 19).toISOString(),
    endTime: getUpcomingDate(3, 22).toISOString(),
    priceLevel: 1,
    ticketPrice: { min: 0, max: 0, currency: 'USD' },
    description: 'Free outdoor jazz concert featuring local Dallas musicians. Bring blankets and picnic!',
    vibes: ['relaxed', 'outdoor', 'romantic'],
    ageRestriction: 'all ages',
    features: ['free admission', 'food trucks', 'outdoor seating'],
    photos: [],
    ticketUrl: 'https://klydewarrenpark.org/events',
    coordinates: { lat: 32.7893, lng: -96.8017 },
  },
  {
    id: 'evt_concert_002',
    name: 'Deep Ellum Live Music Showcase',
    eventType: 'concert',
    venue: 'Trees',
    address: '2709 Elm St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    startTime: getUpcomingDate(5, 20).toISOString(),
    endTime: getUpcomingDate(5, 23).toISOString(),
    priceLevel: 2,
    ticketPrice: { min: 25, max: 35, currency: 'USD' },
    description: 'Showcase featuring 4 up-and-coming indie rock bands from the Dallas music scene.',
    vibes: ['energetic', 'indie', 'live music'],
    ageRestriction: '21+',
    features: ['live bands', 'standing room', 'full bar'],
    photos: [],
    ticketUrl: 'https://treesdallas.com',
    coordinates: { lat: 32.7838, lng: -96.7850 },
  },
  {
    id: 'evt_concert_003',
    name: 'R&B Night at The Bomb Factory',
    eventType: 'concert',
    venue: 'The Factory in Deep Ellum',
    address: '2713 Canton St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    startTime: getUpcomingDate(7, 20).toISOString(),
    endTime: getUpcomingDate(7, 24).toISOString(),
    priceLevel: 3,
    ticketPrice: { min: 45, max: 85, currency: 'USD' },
    description: 'An evening of classic and contemporary R&B with special guest performers.',
    vibes: ['romantic', 'upscale', 'dance'],
    ageRestriction: '21+',
    features: ['VIP section', 'full bar', 'coat check'],
    photos: [],
    ticketUrl: 'https://thefactoryindeepellum.com',
    coordinates: { lat: 32.7832, lng: -96.7842 },
  },
  
  // === COMEDY ===
  {
    id: 'evt_comedy_001',
    name: 'Ladies Night Comedy Special',
    eventType: 'comedy',
    venue: 'Addison Improv',
    address: '4980 Belt Line Rd, Addison, TX 75254',
    neighborhood: 'Addison',
    city: 'Dallas',
    startTime: getUpcomingDate(2, 20).toISOString(),
    endTime: getUpcomingDate(2, 22).toISOString(),
    priceLevel: 2,
    ticketPrice: { min: 25, max: 40, currency: 'USD' },
    description: 'Stand-up comedy night featuring all female comedians. Special girls night pricing!',
    vibes: ['fun', 'girls night', 'laughter'],
    ageRestriction: '18+',
    features: ['two-drink minimum', 'group seating available', 'meet and greet'],
    photos: [],
    ticketUrl: 'https://improv.com/addison',
    coordinates: { lat: 32.9545, lng: -96.8292 },
  },
  {
    id: 'evt_comedy_002',
    name: 'Open Mic Comedy Night',
    eventType: 'comedy',
    venue: 'Hyenas Comedy Club',
    address: '5321 E Mockingbird Ln, Dallas, TX 75206',
    neighborhood: 'Mockingbird Station',
    city: 'Dallas',
    startTime: getUpcomingDate(1, 19).toISOString(),
    endTime: getUpcomingDate(1, 22).toISOString(),
    priceLevel: 1,
    ticketPrice: { min: 10, max: 15, currency: 'USD' },
    description: 'Weekly open mic night showcasing emerging Dallas comedians.',
    vibes: ['casual', 'fun', 'cheap'],
    ageRestriction: '18+',
    features: ['cheap drinks', 'intimate venue', 'new talent'],
    photos: [],
    ticketUrl: 'https://hyenascomedyclub.com',
    coordinates: { lat: 32.8380, lng: -96.7695 },
  },
  
  // === ART & CULTURE ===
  {
    id: 'evt_art_001',
    name: 'First Saturday Arts Walk',
    eventType: 'art',
    venue: 'Bishop Arts District',
    address: 'Bishop Ave & 7th St, Dallas, TX 75208',
    neighborhood: 'Bishop Arts',
    city: 'Dallas',
    startTime: getUpcomingDate(6, 17).toISOString(),
    endTime: getUpcomingDate(6, 22).toISOString(),
    priceLevel: 1,
    ticketPrice: { min: 0, max: 0, currency: 'USD' },
    description: 'Monthly arts walk featuring gallery openings, street performers, and pop-up shops.',
    vibes: ['artsy', 'walkable', 'casual'],
    ageRestriction: 'all ages',
    features: ['free admission', 'gallery openings', 'live music', 'food vendors'],
    photos: [],
    ticketUrl: 'https://bishopartsdistrict.com/events',
    coordinates: { lat: 32.7449, lng: -96.8267 },
  },
  {
    id: 'evt_art_002',
    name: 'After Dark at the DMA',
    eventType: 'art',
    venue: 'Dallas Museum of Art',
    address: '1717 N Harwood St, Dallas, TX 75201',
    neighborhood: 'Arts District',
    city: 'Dallas',
    startTime: getUpcomingDate(4, 18).toISOString(),
    endTime: getUpcomingDate(4, 23).toISOString(),
    priceLevel: 2,
    ticketPrice: { min: 20, max: 35, currency: 'USD' },
    description: 'Evening event with cocktails, live music, and after-hours gallery access.',
    vibes: ['upscale', 'cultured', 'romantic'],
    ageRestriction: '21+',
    features: ['cocktails', 'live dj', 'gallery access', 'photo ops'],
    photos: [],
    ticketUrl: 'https://dma.org/programs/series/late-nights',
    coordinates: { lat: 32.7877, lng: -96.8009 },
  },
  
  // === FOOD & DRINK ===
  {
    id: 'evt_food_001',
    name: 'Dallas Wine Fest',
    eventType: 'festival',
    venue: 'AT&T Performing Arts Center',
    address: '2403 Flora St, Dallas, TX 75201',
    neighborhood: 'Arts District',
    city: 'Dallas',
    startTime: getUpcomingDate(10, 14).toISOString(),
    endTime: getUpcomingDate(10, 20).toISOString(),
    priceLevel: 3,
    ticketPrice: { min: 65, max: 125, currency: 'USD' },
    description: 'Annual wine tasting event featuring over 200 wines from around the world.',
    vibes: ['upscale', 'classy', 'sophisticated'],
    ageRestriction: '21+',
    features: ['wine tastings', 'cheese pairings', 'live music', 'VIP lounge'],
    photos: [],
    ticketUrl: 'https://dallaswinefest.com',
    coordinates: { lat: 32.7899, lng: -96.7978 },
  },
  {
    id: 'evt_food_002',
    name: 'Margarita Mile Pub Crawl',
    eventType: 'social',
    venue: 'Various Locations - Lower Greenville',
    address: 'Greenville Ave, Dallas, TX 75206',
    neighborhood: 'Lower Greenville',
    city: 'Dallas',
    startTime: getUpcomingDate(8, 16).toISOString(),
    endTime: getUpcomingDate(8, 22).toISOString(),
    priceLevel: 2,
    ticketPrice: { min: 30, max: 45, currency: 'USD' },
    description: 'Guided margarita crawl hitting 5 of the best spots on Lower Greenville.',
    vibes: ['fun', 'social', 'party'],
    ageRestriction: '21+',
    features: ['guided crawl', 'drink specials', 'group photos', 'swag bag'],
    photos: [],
    ticketUrl: 'https://margaritamiledallas.com',
    coordinates: { lat: 32.8234, lng: -96.7695 },
  },
  
  // === DANCE & NIGHTLIFE ===
  {
    id: 'evt_dance_001',
    name: 'Salsa Night at Candleroom',
    eventType: 'dance',
    venue: 'Candleroom',
    address: '5039 Willis Ave, Dallas, TX 75206',
    neighborhood: 'Lower Greenville',
    city: 'Dallas',
    startTime: getUpcomingDate(2, 21).toISOString(),
    endTime: getUpcomingDate(3, 1).toISOString(),
    priceLevel: 2,
    ticketPrice: { min: 15, max: 20, currency: 'USD' },
    description: 'Latin dance night with salsa lessons for beginners followed by open dancing.',
    vibes: ['energetic', 'dance', 'social'],
    ageRestriction: '21+',
    features: ['free lesson at 9pm', 'live dj', 'latin music'],
    photos: [],
    ticketUrl: 'https://candleroom.com',
    coordinates: { lat: 32.8255, lng: -96.7678 },
  },
  {
    id: 'evt_dance_002',
    name: '90s Dance Party',
    eventType: 'party',
    venue: 'RBC',
    address: '2617 Commerce St, Dallas, TX 75226',
    neighborhood: 'Deep Ellum',
    city: 'Dallas',
    startTime: getUpcomingDate(9, 22).toISOString(),
    endTime: getUpcomingDate(10, 2).toISOString(),
    priceLevel: 2,
    ticketPrice: { min: 20, max: 30, currency: 'USD' },
    description: 'Throwback dance party playing all your favorite 90s hits. Dress to impress!',
    vibes: ['nostalgic', 'dance', 'fun'],
    ageRestriction: '21+',
    features: ['90s music all night', 'costume contest', 'themed drinks'],
    photos: [],
    ticketUrl: 'https://rbcdallas.com',
    coordinates: { lat: 32.7830, lng: -96.7855 },
  },
  
  // === WELLNESS & SOCIAL ===
  {
    id: 'evt_wellness_001',
    name: 'Sunset Yoga at Klyde Warren',
    eventType: 'wellness',
    venue: 'Klyde Warren Park',
    address: '2012 Woodall Rodgers Fwy, Dallas, TX 75201',
    neighborhood: 'Downtown',
    city: 'Dallas',
    startTime: getUpcomingDate(1, 18).toISOString(),
    endTime: getUpcomingDate(1, 19).toISOString(),
    priceLevel: 1,
    ticketPrice: { min: 10, max: 15, currency: 'USD' },
    description: 'Outdoor yoga session at sunset with wine reception afterward.',
    vibes: ['relaxing', 'wellness', 'social'],
    ageRestriction: '21+',
    features: ['yoga mats provided', 'wine included', 'beginner friendly'],
    photos: [],
    ticketUrl: 'https://klydewarrenpark.org/events',
    coordinates: { lat: 32.7893, lng: -96.8017 },
  },
  {
    id: 'evt_social_001',
    name: 'Singles Mixer - Young Professionals',
    eventType: 'social',
    venue: 'The Rustic',
    address: '3656 Howell St, Dallas, TX 75204',
    neighborhood: 'Uptown',
    city: 'Dallas',
    startTime: getUpcomingDate(4, 18).toISOString(),
    endTime: getUpcomingDate(4, 21).toISOString(),
    priceLevel: 2,
    ticketPrice: { min: 25, max: 35, currency: 'USD' },
    description: 'Networking and social event for young professionals ages 25-40.',
    vibes: ['social', 'networking', 'upscale casual'],
    ageRestriction: '21+',
    features: ['drink ticket included', 'speed networking', 'live music'],
    photos: [],
    ticketUrl: 'https://therustic.com/dallas',
    coordinates: { lat: 32.7998, lng: -96.7962 },
  },
  {
    id: 'evt_paint_001',
    name: 'Sip & Paint: Wine Glass Edition',
    eventType: 'art',
    venue: 'Pinot\'s Palette',
    address: '8021 Walnut Hill Ln, Dallas, TX 75231',
    neighborhood: 'North Dallas',
    city: 'Dallas',
    startTime: getUpcomingDate(3, 19).toISOString(),
    endTime: getUpcomingDate(3, 22).toISOString(),
    priceLevel: 2,
    ticketPrice: { min: 40, max: 55, currency: 'USD' },
    description: 'Paint your own wine glasses while enjoying wine and snacks with friends.',
    vibes: ['creative', 'girls night', 'fun'],
    ageRestriction: '21+',
    features: ['wine included', 'all supplies provided', 'take home your creation'],
    photos: [],
    ticketUrl: 'https://pinotspalette.com/dallas',
    coordinates: { lat: 32.8678, lng: -96.7612 },
  },
];

/**
 * Search events by criteria
 */
export function searchDallasEvents(params: {
  location?: string;
  eventType?: string;
  vibes?: string[];
  priceLevel?: 1 | 2 | 3 | 4;
  dateRange?: { start: Date; end: Date };
  limit?: number;
}): Event[] {
  let results = [...dallasEvents];
  
  // Filter by neighborhood/location
  if (params.location) {
    const locationLower = params.location.toLowerCase();
    results = results.filter(e => 
      e.neighborhood.toLowerCase().includes(locationLower) ||
      e.city.toLowerCase().includes(locationLower) ||
      e.venue.toLowerCase().includes(locationLower) ||
      e.address.toLowerCase().includes(locationLower)
    );
  }
  
  // Filter by event type
  if (params.eventType) {
    const typeLower = params.eventType.toLowerCase();
    results = results.filter(e => e.eventType.toLowerCase().includes(typeLower));
  }
  
  // Filter by vibes
  if (params.vibes && params.vibes.length > 0) {
    const vibesLower = params.vibes.map(v => v.toLowerCase());
    results = results.filter(e =>
      e.vibes.some(v => vibesLower.some(vl => v.toLowerCase().includes(vl)))
    );
  }
  
  // Filter by price level
  if (params.priceLevel) {
    results = results.filter(e => e.priceLevel <= params.priceLevel!);
  }
  
  // Filter by date range
  if (params.dateRange) {
    results = results.filter(e => {
      const eventDate = new Date(e.startTime);
      return eventDate >= params.dateRange!.start && eventDate <= params.dateRange!.end;
    });
  }
  
  // Sort by date (soonest first)
  results.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  // Limit results
  if (params.limit) {
    results = results.slice(0, params.limit);
  }
  
  return results;
}

/**
 * Get events happening this weekend
 */
export function getThisWeekendEvents(): Event[] {
  const now = new Date();
  const friday = new Date(now);
  friday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7));
  friday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);
  sunday.setHours(23, 59, 59, 999);
  
  return searchDallasEvents({ dateRange: { start: friday, end: sunday } });
}
