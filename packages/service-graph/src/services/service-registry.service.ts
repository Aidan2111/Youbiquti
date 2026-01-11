// Service Registry - Provider and offering management

import type {
  Provider,
  ServiceOffering,
  ServiceCategory,
} from '@youbiquti/core';

import {
  demoProviders,
  demoOfferings,
  getProviderById,
  getOfferingsForProvider,
  getOfferingById,
  searchOfferings,
} from '../data/demo-providers.js';

/**
 * Service Registry
 * 
 * Manages providers and their service offerings.
 * In production, this would use Cosmos DB.
 */
export class ServiceRegistryService {
  
  // =========================================================================
  // PROVIDER MANAGEMENT
  // =========================================================================
  
  /**
   * Get a provider by ID
   */
  getProvider(providerId: string): Provider | null {
    return getProviderById(providerId) ?? null;
  }
  
  /**
   * List all active providers
   */
  listProviders(status?: Provider['status']): Provider[] {
    if (status) {
      return demoProviders.filter(p => p.status === status);
    }
    return [...demoProviders];
  }
  
  /**
   * Search providers by category
   */
  searchProviders(category: string): Provider[] {
    const offerings = demoOfferings.filter(o => o.category === category);
    const providerIds = [...new Set(offerings.map(o => o.providerId))];
    return providerIds
      .map(id => getProviderById(id))
      .filter((p): p is Provider => p !== null);
  }
  
  // =========================================================================
  // OFFERING MANAGEMENT
  // =========================================================================
  
  /**
   * Get an offering by ID
   */
  getOffering(offeringId: string): ServiceOffering | null {
    return getOfferingById(offeringId) ?? null;
  }
  
  /**
   * Get all offerings for a provider
   */
  getProviderOfferings(providerId: string): ServiceOffering[] {
    return getOfferingsForProvider(providerId);
  }
  
  /**
   * Search offerings with filters
   */
  searchOfferings(filters: {
    category?: string;
    subcategory?: string;
    maxPrice?: number;
    minRating?: number;
  }): ServiceOffering[] {
    let results = searchOfferings(
      filters.category,
      filters.subcategory,
      filters.maxPrice
    );
    
    if (filters.minRating) {
      results = results.filter(offering => {
        const provider = getProviderById(offering.providerId);
        return provider && provider.globalRating >= filters.minRating!;
      });
    }
    
    return results;
  }
  
  // =========================================================================
  // CATEGORIES
  // =========================================================================
  
  /**
   * Get available service categories
   */
  getCategories(): ServiceCategory[] {
    return [
      {
        id: 'transportation',
        name: 'Transportation',
        description: 'Rideshare, limo, and transportation services',
        icon: '🚗',
        attributes: [
          { name: 'vehicleType', type: 'enum', required: true, options: ['sedan', 'suv', 'limo', 'party bus'] },
          { name: 'maxPassengers', type: 'number', required: true },
        ],
      },
      {
        id: 'dining',
        name: 'Dining',
        description: 'Restaurant recommendations and private chef services',
        icon: '🍽️',
        attributes: [
          { name: 'cuisineType', type: 'string', required: true },
          { name: 'priceLevel', type: 'enum', required: true, options: ['1', '2', '3', '4'] },
        ],
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        description: 'Events, shows, and nightlife',
        icon: '🎭',
        attributes: [
          { name: 'eventType', type: 'enum', required: false, options: ['concert', 'comedy', 'theater', 'club'] },
        ],
      },
      {
        id: 'beauty',
        name: 'Beauty & Wellness',
        description: 'Hair, makeup, spa, and wellness services',
        icon: '💅',
        attributes: [
          { name: 'serviceType', type: 'enum', required: true, options: ['hair', 'makeup', 'nails', 'spa'] },
        ],
      },
    ];
  }
  
  /**
   * Get category by ID
   */
  getCategory(categoryId: string): ServiceCategory | null {
    return this.getCategories().find(c => c.id === categoryId) ?? null;
  }
}

// Export singleton instance
export const serviceRegistryService = new ServiceRegistryService();
