import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import * as restaurantService from '../services/restaurantService';

const router = Router();

// GET /api/restaurant - Get restaurant info (public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await restaurantService.getRestaurantInfo();
    res.status(200).json({ data: restaurant });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/restaurant/hours - Get hours and open status (public)
router.get('/hours', async (_req: Request, res: Response): Promise<void> => {
  try {
    const hoursInfo = await restaurantService.getFormattedHours();
    res.status(200).json({ data: hoursInfo });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET: Fetch restaurant stats (protected - admin only)
router.get('/stats', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await restaurantService.getStats();
    res.status(200).json({ data: stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// PUT /api/restaurant - Update restaurant info (protected - admin only)
router.put('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, address, phone, email, website, instagram, openingTime, closingTime, hoursJson } = req.body;

    const restaurant = await restaurantService.updateRestaurantInfo(
      name,
      description,
      address,
      phone,
      email,
      website,
      instagram,
      openingTime,
      closingTime,
      hoursJson
    );

    res.status(200).json({
      data: {
        ...restaurant,
        message: 'Restaurant information updated successfully',
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
});

// PUT /api/restaurant/:field - Update specific field (protected - admin only)
router.put('/:field', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { field } = req.params;
    const { value } = req.body;

    if (!value) {
      res.status(400).json({ error: 'Value is required' });
      return;
    }

    const restaurant = await restaurantService.updateRestaurantField(field, value);

    res.status(200).json({
      data: {
        ...restaurant,
        message: `Field "${field}" updated successfully`,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
