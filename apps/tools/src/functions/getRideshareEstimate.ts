// Azure Function: Get Rideshare Estimate
// HTTP-triggered function to get rideshare price estimates

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { RideshareRequest } from '@youbiquti/core';
import { mockRideshareService } from '@youbiquti/gno-tools';

export async function getRideshareEstimate(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('getRideshareEstimate function processed a request.');

  try {
    // Parse request body
    const body = await request.json() as RideshareRequest;
    
    if (!body || !body.origin || !body.destination) {
      return {
        status: 400,
        jsonBody: { error: 'Origin and destination are required' },
      };
    }

    // Get rideshare estimate
    const estimate = await mockRideshareService.getEstimate(body);

    return {
      status: 200,
      jsonBody: estimate,
    };
  } catch (error) {
    context.error('Error in getRideshareEstimate:', error);
    return {
      status: 500,
      jsonBody: { error: 'Internal server error' },
    };
  }
}

app.http('getRideshareEstimate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: getRideshareEstimate,
});
