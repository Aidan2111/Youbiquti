// Preferences Routes

import { Router, Request, Response } from 'express';
import type { Router as RouterType } from 'express';
import { preferenceService } from '@youbiquti/service-graph';

const router: RouterType = Router();

/**
 * GET /preferences/:userId
 * Get preferences for a user
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const preferences = preferenceService.getPreferences(userId);
    
    if (!preferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }
    
    const completeness = preferenceService.calculateCompleteness(preferences);
    
    res.json({
      userId,
      preferences,
      completeness,
    });
    return;
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

/**
 * PUT /preferences/:userId
 * Update preferences for a user
 */
router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const preferences = preferenceService.updatePreferences(userId, updates);
    
    res.json({ preferences });
    return;
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

/**
 * POST /preferences/aggregate
 * Aggregate preferences for a group
 */
router.post('/aggregate', async (req: Request, res: Response) => {
  try {
    const { userIds, category = 'dining' } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds array is required' });
    }
    
    // Get preferences for all users
    const preferences = userIds
      .map((id: string) => preferenceService.getPreferences(id))
      .filter((p): p is NonNullable<typeof p> => p !== null);
    
    const groupPreferences = preferenceService.aggregateGroupPreferences(userIds, category);
    const conflicts = preferenceService.detectConflicts(preferences, category);
    const searchFilters = preferenceService.generateGroupSearchFilters(userIds, category);
    
    res.json({
      userIds,
      groupPreferences,
      conflicts,
      searchFilters,
    });
    return;
  } catch (error) {
    console.error('Error aggregating preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router;
