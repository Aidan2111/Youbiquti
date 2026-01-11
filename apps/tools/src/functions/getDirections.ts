// Azure Function: Get Directions
// HTTP-triggered function to get directions between locations

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { DirectionsRequest } from '@youbiquti/core';
import { mockGoogleMapsService } from '@youbiquti/gno-tools';

export async function getDirections(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('getDirections function processed a request.');

  try {
    // Parse request body
    const body = await request.json() as DirectionsRequest;
    
    if (!body || !body.origin || !body.destination) {
      return {
        status: 400,
        jsonBody: { error: 'Origin and destination are required' },
      };
    }

    // Get directions
    const directions = await mockGoogleMapsService.getDirections(body);

    return {
      status: 200,
      jsonBody: directions,
    };
  } catch (error) {
    context.error('Error in getDirections:', error);
    return {
      status: 500,
      jsonBody: { error: 'Internal server error' },
    };
  }
}

app.http('getDirections', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: getDirections,
});
