// Azure Function: Search Events
// HTTP-triggered function to search for events using mock data

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { SearchEventsRequest, SearchEventsResponse } from '@youbiquti/core';
import { mockEventsService } from '@youbiquti/gno-tools';

export async function searchEvents(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('searchEvents function processed a request.');

  try {
    // Parse request body
    const body = await request.json() as SearchEventsRequest;
    
    if (!body) {
      return {
        status: 400,
        jsonBody: { error: 'Request body is required' },
      };
    }

    // Get events from mock service
    const { events, total } = await mockEventsService.searchEvents(body);

    const response: SearchEventsResponse = {
      events,
      total,
      searchedAt: new Date().toISOString(),
    };

    return {
      status: 200,
      jsonBody: response,
    };
  } catch (error) {
    context.error('Error in searchEvents:', error);
    return {
      status: 500,
      jsonBody: { error: 'Internal server error' },
    };
  }
}

app.http('searchEvents', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: searchEvents,
});
