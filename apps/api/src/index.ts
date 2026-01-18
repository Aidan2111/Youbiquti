// GNO API Server - Main entry point

// IMPORTANT: Telemetry must be imported FIRST before any other modules
import './telemetry.js';

import 'dotenv/config';
import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import {
  sessionsRouter,
  trustRouter,
  preferencesRouter,
  healthRouter,
} from './routes/index.js';

const app: Express = express();
const PORT = process.env.PORT ?? 3001;

// Validate Azure AI Foundry configuration on startup
function validateAzureConfig(): void {
  const useFoundry = process.env.USE_FOUNDRY_AGENT !== 'false';

  if (useFoundry) {
    console.log('\n🔧 Azure AI Foundry Configuration:');

    const endpoint = process.env.PROJECT_ENDPOINT;
    const model = process.env.MODEL_DEPLOYMENT_NAME || 'gpt-4o';
    const agentName = process.env.AGENT_NAME || 'GNOPlanner';
    const functionsUrl = process.env.AZURE_FUNCTION_APP_URL || 'http://localhost:7071/api';

    if (!endpoint) {
      console.warn('  ⚠️  PROJECT_ENDPOINT not set - will fall back to mock agent');
      console.warn('     Set PROJECT_ENDPOINT in .env to connect to Azure AI Foundry');
    } else {
      console.log(`  ✅ Project Endpoint: ${endpoint}`);
      console.log(`  ✅ Model: ${model}`);
      console.log(`  ✅ Agent Name: ${agentName}`);
      console.log(`  ✅ Functions URL: ${functionsUrl}`);
      console.log('  📝 Using DefaultAzureCredential (ensure you are logged in via "az login")');
    }
  } else {
    console.log('\n🎭 Mock Agent Mode (USE_FOUNDRY_AGENT=false)');
  }
  console.log('');
}

validateAzureConfig();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/health', healthRouter);
app.use('/sessions', sessionsRouter);
app.use('/trust', trustRouter);
app.use('/preferences', preferencesRouter);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'GNO API Server',
    version: '0.0.1',
    description: "Girls' Night Out planning assistant API",
    endpoints: {
      health: 'GET /health',
      sessions: {
        list: 'GET /sessions?userId=xxx',
        create: 'POST /sessions',
        get: 'GET /sessions/:id',
        sendMessage: 'POST /sessions/:id/messages',
        delete: 'DELETE /sessions/:id',
      },
      trust: {
        calculate: 'GET /trust/:userId/:providerId',
        connections: 'GET /trust/:userId/connections',
        endorse: 'POST /trust/:userId/endorse/:providerId',
      },
      preferences: {
        get: 'GET /preferences/:userId',
        update: 'PUT /preferences/:userId',
        aggregate: 'POST /preferences/aggregate',
      },
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  // Track exceptions with Application Insights
  import('./telemetry.js').then(({ trackException }) => {
    trackException(err, { endpoint: _req.path, method: _req.method });
  }).catch(() => {/* ignore telemetry errors */});
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 GNO API Server running at http://localhost:${PORT}`);
  console.log(`📚 API documentation at http://localhost:${PORT}/`);
});

export default app;
