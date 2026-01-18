// Application Insights / OpenTelemetry Configuration
// This must be imported FIRST before any other modules

import { useAzureMonitor, AzureMonitorOpenTelemetryOptions } from '@azure/monitor-opentelemetry';
import { trace, context, SpanStatusCode, Span } from '@opentelemetry/api';

const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

// Initialize Azure Monitor OpenTelemetry
if (connectionString) {
  const options: AzureMonitorOpenTelemetryOptions = {
    azureMonitorExporterOptions: {
      connectionString,
    },
    instrumentationOptions: {
      http: { enabled: true },
    },
  };

  useAzureMonitor(options);
  console.log('[Telemetry] Application Insights initialized');
} else {
  console.warn('[Telemetry] APPLICATIONINSIGHTS_CONNECTION_STRING not set - telemetry disabled');
}

// Get tracer for custom spans
const tracer = trace.getTracer('gno-api', '0.0.1');

/**
 * Create a custom span for tracking operations
 */
export function createSpan(name: string, attributes?: Record<string, string | number | boolean>): Span {
  const span = tracer.startSpan(name);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }
  return span;
}

/**
 * Track a custom event
 */
export function trackEvent(
  name: string,
  properties?: Record<string, string>,
  measurements?: Record<string, number>
): void {
  const span = tracer.startSpan(name);

  if (properties) {
    Object.entries(properties).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }

  if (measurements) {
    Object.entries(measurements).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }

  span.end();
}

/**
 * Track an exception
 */
export function trackException(error: Error, properties?: Record<string, string>): void {
  const span = tracer.startSpan('exception');
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
  span.recordException(error);

  if (properties) {
    Object.entries(properties).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }

  span.end();
}

/**
 * Wrap an async function with tracing
 */
export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  const span = createSpan(name, attributes);

  try {
    const result = await fn(span);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message });
    span.recordException(error as Error);
    throw error;
  } finally {
    span.end();
  }
}

/**
 * Track Foundry agent operations
 */
export const agentTelemetry = {
  trackAgentInit(agentId: string, agentName: string): void {
    trackEvent('agent.initialized', {
      'agent.id': agentId,
      'agent.name': agentName,
    });
  },

  trackMessageProcessing(sessionId: string, messageLength: number): Span {
    return createSpan('agent.processMessage', {
      'session.id': sessionId,
      'message.length': messageLength,
    });
  },

  trackThreadCreated(threadId: string, sessionId: string): void {
    trackEvent('agent.threadCreated', {
      'thread.id': threadId,
      'session.id': sessionId,
    });
  },

  trackRunCreated(runId: string, threadId: string): void {
    trackEvent('agent.runCreated', {
      'run.id': runId,
      'thread.id': threadId,
    });
  },

  trackRunCompleted(runId: string, status: string, durationMs: number): void {
    trackEvent('agent.runCompleted', {
      'run.id': runId,
      'run.status': status,
    }, {
      'run.durationMs': durationMs,
    });
  },

  trackToolCall(toolName: string, durationMs: number, success: boolean): void {
    trackEvent('agent.toolCall', {
      'tool.name': toolName,
      'tool.success': String(success),
    }, {
      'tool.durationMs': durationMs,
    });
  },

  trackToolCallStart(toolName: string, args: Record<string, unknown>): Span {
    return createSpan(`tool.${toolName}`, {
      'tool.name': toolName,
      'tool.args': JSON.stringify(args).slice(0, 500), // Truncate large args
    });
  },

  trackFallbackToMock(reason: string): void {
    trackEvent('agent.fallbackToMock', {
      'fallback.reason': reason,
    });
  },
};

export { tracer, trace, context, SpanStatusCode };
