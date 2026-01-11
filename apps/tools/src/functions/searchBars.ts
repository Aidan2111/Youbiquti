// Azure Function: Search Bars
// HTTP-triggered function to search for bars using mock Yelp data

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { SearchBarsRequest, SearchBarsResponse } from '@youbiquti/core';
import { mockYelpService } from '@youbiquti/gno-tools';

export async function searchBars(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('searchBars function processed a request.');

  try {
    // Parse request body
    const body = await request.json() as SearchBarsRequest;
    
    if (!body) {
      return {
        status: 400,
        jsonBody: { error: 'Request body is required' },
      };
    }

    // Get bars from mock Yelp
    const { bars, total } = await mockYelpService.searchBars(body);

    const response: SearchBarsResponse = {
      bars,
      total,
      searchedAt: new Date().toISOString(),
    };

    return {
      status: 200,
      jsonBody: response,
    };
  } catch (error) {
    context.error('Error in searchBars:', error);
    return {
      status: 500,
      jsonBody: { error: 'Internal server error' },
    };
  }
}

app.http('searchBars', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: searchBars,
});
