import { Router } from 'express';

const router = Router();

// GET /api/content
router.get('/', async (_req, res) => {
  try {
    res.status(501).json({ error: 'Not implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/content
router.put('/', async (_req, res) => {
  try {
    res.status(501).json({ error: 'Not implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
