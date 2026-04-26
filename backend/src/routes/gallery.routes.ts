import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { galleryUpload } from '../middleware/upload';
import * as galleryService from '../services/galleryService';

const router = Router();

// GET /api/gallery - List all gallery images (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured } = req.query as { featured?: string };
    const images = await galleryService.getAllImages(featured);
    res.status(200).json({ data: images });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/gallery/:id - Get single image (public)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const image = await galleryService.getImageById(req.params.id);
    res.status(200).json({ data: image });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

// POST /api/gallery - Upload new image (protected)
router.post(
  '/',
  authMiddleware,
  galleryUpload.single('image'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Image file is required' });
        return;
      }

      const { caption, isFeatured, displayOrder } = req.body;
      const image = await galleryService.uploadImage(
        req.file,
        caption,
        isFeatured,
        displayOrder ? parseInt(displayOrder) : undefined
      );

      res.status(201).json({ data: { ...image, message: 'Image uploaded successfully' } });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
);

// PUT /api/gallery/:id - Update metadata (protected)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { caption, isFeatured, displayOrder } = req.body;
    const image = await galleryService.updateImageMetadata(
      req.params.id,
      caption,
      isFeatured,
      displayOrder
    );
    res.status(200).json({ data: image });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

// PUT /api/gallery/:id/image - Replace image file (protected)
router.put(
  '/:id/image',
  authMiddleware,
  galleryUpload.single('image'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Image file is required' });
        return;
      }

      const image = await galleryService.replaceImageFile(req.params.id, req.file);
      res.status(200).json({ data: { ...image, message: 'Image replaced successfully' } });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

// DELETE /api/gallery/:id - Delete image (protected)
router.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await galleryService.deleteImage(req.params.id);
      res.status(200).json({ data: 'Gallery image deleted successfully' });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

// POST /api/gallery/:id/feature - Toggle featured (protected)
router.post(
  '/:id/feature',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const image = await galleryService.toggleFeatured(req.params.id);
      res.status(200).json({
        data: {
          ...image,
          message: `Image ${image.isFeatured ? 'featured' : 'unfeatured'} successfully`,
        },
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

export default router;
