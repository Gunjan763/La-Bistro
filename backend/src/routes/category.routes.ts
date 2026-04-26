import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

interface CreateCategoryRequest {
  name?: string;
  order?: number;
  isActive?: boolean;
}

interface UpdateCategoryRequest {
  name?: string;
  order?: number;
  isActive?: boolean;
}

// Default restaurant menu categories
const DEFAULT_CATEGORIES = [
  { name: 'Appetizers', order: 1, isActive: true },
  { name: 'Soups & Salads', order: 2, isActive: true },
  { name: 'Main Courses', order: 3, isActive: true },
  { name: 'Pasta Dishes', order: 4, isActive: true },
  { name: 'Seafood', order: 5, isActive: true },
  { name: 'Grilled Specialties', order: 6, isActive: true },
  { name: 'Vegetarian', order: 7, isActive: true },
  { name: 'Desserts', order: 8, isActive: true },
  { name: 'Beverages', order: 9, isActive: true },
  { name: 'Soft Drinks', order: 10, isActive: true },
  { name: 'Coffee & Tea', order: 11, isActive: true },
  { name: 'Wines', order: 12, isActive: true },
  { name: 'Spirits', order: 13, isActive: true },
  { name: 'Cocktails', order: 14, isActive: true },
  { name: 'Beers', order: 15, isActive: true },
];

// GET /api/categories - List all categories
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });

    res.status(200).json({ data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/categories - Create new category (Protected)
router.post(
  '/',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, order, isActive } = req.body as CreateCategoryRequest;

      // Validate required fields
      if (!name) {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }

      // Check if category already exists (case-insensitive)
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: 'insensitive',
          },
        },
      });

      if (existingCategory) {
        res.status(409).json({ error: 'Category with this name already exists' });
        return;
      }

      // Auto-generate order if not provided
      let categoryOrder = order;
      if (categoryOrder === undefined) {
        const lastCategory = await prisma.category.findFirst({
          orderBy: { order: 'desc' },
        });
        categoryOrder = (lastCategory?.order || 0) + 1;
      }

      // Create category
      const category = await prisma.category.create({
        data: {
          name: name.trim(),
          order: categoryOrder,
        },
      });

      res.status(201).json({
        data: {
          ...category,
          isActive: isActive ?? true,
        },
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/categories/:id - Update category (Protected)
router.put(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, order, isActive } = req.body as UpdateCategoryRequest;

      // Validate at least one field is provided
      if (!name && order === undefined && isActive === undefined) {
        res.status(400).json({ error: 'At least one field (name, order, isActive) is required' });
        return;
      }

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      // Check if new name already exists (if provided)
      if (name && name.trim() !== existingCategory.name) {
        const duplicateCategory = await prisma.category.findFirst({
          where: {
            AND: [
              {
                name: {
                  equals: name.trim(),
                  mode: 'insensitive',
                },
              },
              { id: { not: id } },
            ],
          },
        });

        if (duplicateCategory) {
          res.status(409).json({ error: 'Category with this name already exists' });
          return;
        }
      }

      // Update category
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          ...(name && { name: name.trim() }),
          ...(order !== undefined && { order }),
        },
      });

      res.status(200).json({
        data: {
          ...updatedCategory,
          isActive: isActive ?? true,
        },
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/categories/:id - Delete category (Protected)
router.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      // Check if category has menu items
      const menuItemsCount = await prisma.menuItem.count({
        where: { categoryId: id },
      });

      if (menuItemsCount > 0) {
        res.status(409).json({
          error: `Cannot delete category with ${menuItemsCount} menu items. Please move or delete items first.`,
        });
        return;
      }

      // Delete category
      await prisma.category.delete({
        where: { id },
      });

      res.status(200).json({ data: 'Category deleted successfully' });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /api/categories/seed - Initialize default categories (Protected)
router.post(
  '/seed',
  authMiddleware,
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Check if categories already exist
      const existingCount = await prisma.category.count();

      if (existingCount > 0) {
        res.status(409).json({ error: 'Categories already seeded. Delete existing categories first.' });
        return;
      }

      // Create all default categories
      const createdCategories = await Promise.all(
        DEFAULT_CATEGORIES.map(cat =>
          prisma.category.create({
            data: {
              name: cat.name,
              order: cat.order,
            },
          })
        )
      );

      res.status(201).json({
        data: {
          message: `${createdCategories.length} default categories created`,
          categories: createdCategories.map(cat => ({
            ...cat,
            isActive: true,
          })),
        },
      });
    } catch (error) {
      console.error('Seed categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
