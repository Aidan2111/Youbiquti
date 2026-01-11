// Trust Routes - Expose Service Graph trust functionality

import { Router, Request, Response } from 'express';
import type { Router as RouterType } from 'express';
import { socialGraphService } from '@youbiquti/service-graph';

const router: RouterType = Router();

/**
 * GET /trust/:userId/:providerId
 * Calculate trust score between a user and provider
 */
router.get('/:userId/:providerId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const providerId = req.params.providerId;
    
    if (!userId || !providerId) {
      res.status(400).json({ error: 'userId and providerId are required' });
      return;
    }
    
    const trustScore = socialGraphService.calculateTrustScore(userId, providerId);
    const connectionPath = socialGraphService.getConnectionPath(userId, providerId);
    const networkReviews = socialGraphService.getNetworkReviews(userId, providerId);
    const networkRating = socialGraphService.getNetworkRating(userId, providerId);
    
    res.json({
      userId,
      providerId,
      trustScore,
      connectionPath,
      networkReviews,
      networkRating,
    });
    return;
  } catch (error) {
    console.error('Error calculating trust:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

/**
 * GET /trust/:userId/connections
 * Get all connections for a user
 */
router.get('/:userId/connections', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    
    const degreeParam = parseInt(req.query.degree as string) || 2;
    const degree = (degreeParam > 3 ? 3 : degreeParam < 1 ? 1 : degreeParam) as 1 | 2 | 3;
    
    const connections = socialGraphService.getConnections(userId, degree);
    
    res.json({
      userId,
      degree,
      connections,
    });
    return;
  } catch (error) {
    console.error('Error getting connections:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

/**
 * POST /trust/:userId/endorse/:providerId
 * Endorse a provider
 */
router.post('/:userId/endorse/:providerId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const providerId = req.params.providerId;
    const { note } = req.body;
    
    if (!userId || !providerId) {
      return res.status(400).json({ error: 'userId and providerId are required' });
    }
    
    const endorsement = socialGraphService.endorseProvider(userId, providerId, note);
    
    res.status(201).json({ endorsement });
    return;
  } catch (error) {
    console.error('Error endorsing provider:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router;
