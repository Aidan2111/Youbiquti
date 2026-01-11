// Health check route

import { Router, Request, Response } from 'express';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.0.1',
    services: {
      database: 'ok',
      mockAgent: 'ok',
    },
  });
});

export default router;
