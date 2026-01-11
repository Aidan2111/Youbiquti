// Azure Function: Search Restaurants
// HTTP-triggered function to search for restaurants using mock Yelp data

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { SearchRestaurantsRequest, SearchRestaurantsResponse } from '@youbiquti/core';
import { mockYelpService } from '@youbiquti/gno-tools';
// Trust services will be used when provider mappings are implemented
// import { matchingService, socialGraphService } from '@youbiquti/service-graph';

export async function searchRestaurants(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('searchRestaurants function processed a request.');

  try {
    // Parse request body
    const body = await request.json() as SearchRestaurantsRequest;
    
    if (!body) {
      return {
        status: 400,
        jsonBody: { error: 'Request body is required' },
      };
    }

    // Get restaurants from mock Yelp
    const { restaurants, total } = await mockYelpService.searchRestaurants(body);

    // If userId provided, calculate trust scores for results
    let enrichedResults = restaurants;
    if (body.userId) {
      // In a full implementation, we would:
      // 1. Look up providers associated with each restaurant
      // 2. Calculate trust scores from the user's perspective
      // 3. Sort by trust-weighted relevance
      
      // For now, we just return the restaurants as-is
      // Trust scoring will be added when we have provider mappings
      context.log(`User ${body.userId} searching for restaurants`);
    }

    const response: SearchRestaurantsResponse = {
      restaurants: enrichedResults,
      total,
      searchedAt: new Date().toISOString(),
    };

    return {
      status: 200,
      jsonBody: response,
    };
  } catch (error) {
    context.error('Error in searchRestaurants:', error);
    return {
      status: 500,
      jsonBody: { error: 'Internal server error' },
    };
  }
}

app.http('searchRestaurants', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: searchRestaurants,
});
