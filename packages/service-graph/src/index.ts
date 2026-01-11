// Service Graph Package - Main Entry Point

// Export all services
export { socialGraphService, SocialGraphService } from './services/social-graph.service.js';
export { preferenceService, PreferenceService } from './services/preference.service.js';
export { matchingService, MatchingService } from './services/matching.service.js';
export { serviceRegistryService, ServiceRegistryService } from './services/service-registry.service.js';

// Export demo data for testing
export * from './data/demo-users.js';
export * from './data/demo-providers.js';
