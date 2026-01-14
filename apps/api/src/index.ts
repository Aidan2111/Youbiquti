// GNO API Server - Main entry point

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
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 GNO API Server running at http://localhost:${PORT}`);
  console.log(`📚 API documentation at http://localhost:${PORT}/`);
});

export default app;
