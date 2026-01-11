// Azure Function: Check Availability
// HTTP-triggered function to check venue availability

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { AvailabilityRequest } from '@youbiquti/core';
import { mockAvailabilityService } from '@youbiquti/gno-tools';

export async function checkAvailability(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('checkAvailability function processed a request.');

  try {
    // Parse request body
    const body = await request.json() as AvailabilityRequest;
    
    if (!body || !body.venueId || !body.date || !body.partySize) {
      return {
        status: 400,
        jsonBody: { error: 'venueId, date, and partySize are required' },
      };
    }

    // Check availability
    const availability = await mockAvailabilityService.checkAvailability(body);

    return {
      status: 200,
      jsonBody: availability,
    };
  } catch (error) {
    context.error('Error in checkAvailability:', error);
    return {
      status: 500,
      jsonBody: { error: 'Internal server error' },
    };
  }
}

app.http('checkAvailability', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: checkAvailability,
});
