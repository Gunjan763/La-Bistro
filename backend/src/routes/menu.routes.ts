import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { menuUpload } from '../middleware/upload';
import * as menuService from '../services/menuService';

const router = Router();

// GET /api/menu/items - Get all items (public)
router.get('/items', async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, featured, available } = req.query as Record<string, string>;
    const items = await menuService.getAllMenuItems(categoryId, featured, available);
    res.status(200).json({ data: items });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/menu/items/category/:categoryId - Get items by category (public)
router.get('/category/:categoryId', async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await menuService.getItemsByCategory(req.params.categoryId);
    res.status(200).json({ data: items });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

// GET /api/menu/items/featured - Get featured items (public)
router.get('/featured', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const items = await menuService.getFeaturedItems(limit);
    res.status(200).json({ data: items });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/menu/items/:id - Get single item (public)
router.get('/items/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await menuService.getMenuItemById(req.params.id);
    res.status(200).json({ data: item });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

// POST /api/menu/items - Create item (protected + file upload)
router.post(
  '/items',
  authMiddleware,
  menuUpload.single('image'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, categoryId, price, description, isFeatured, isAvailable } = req.body;

      const item = await menuService.createMenuItem(
        name,
        categoryId,
        parseFloat(price),
        req.file,
        description,
        isFeatured,
        isAvailable
      );

      res.status(201).json({ data: { ...item, message: 'Menu item created successfully' } });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Internal server error' });
    }
  }
);

// PUT /api/menu/items/:id - Update item metadata (protected)
router.put('/items/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, categoryId, isFeatured, isAvailable,isSpicy,isVeg } = req.body;

    const item = await menuService.updateMenuItemMetadata(
      req.params.id,
      name,
      description,
      price ? parseFloat(price) : undefined,
      categoryId,
      isFeatured,
      isAvailable,
      isSpicy,
      isVeg
    );

    res.status(200).json({ data: item });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

// PUT /api/menu/items/:id/image - Replace item image (protected + file upload)
router.put(
  '/items/:id/image',
  authMiddleware,
  menuUpload.single('image'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Image file is required' });
        return;
      }

      const item = await menuService.replaceMenuItemImage(req.params.id, req.file);
      res.status(200).json({ data: { ...item, message: 'Image replaced successfully' } });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

// DELETE /api/menu/items/:id - Delete item (protected)
router.delete(
  '/items/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await menuService.deleteMenuItem(req.params.id);
      res.status(200).json({ data: 'Menu item deleted successfully' });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

// POST /api/menu/items/:id/availability - Toggle availability (protected)
router.post(
  '/items/:id/availability',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const item = await menuService.toggleAvailability(req.params.id);
      res.status(200).json({
        data: {
          ...item,
          message: `Item ${item.isAvailable ? 'available' : 'unavailable'} successfully`,
        },
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

// POST /api/menu/items/:id/featured - Toggle featured (protected)
router.post(
  '/items/:id/featured',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const item = await menuService.toggleFeatured(req.params.id);
      res.status(200).json({
        data: {
          ...item,
          message: `Item ${item.isFeatured ? 'featured' : 'unfeatured'} successfully`,
        },
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

export default router;
