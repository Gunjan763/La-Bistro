import prisma from '../lib/prisma';
import path from 'path';
import fs from 'fs';

// Helper: Delete file safely
const deleteFile = (filePath: string): void => {
  fs.unlink(filePath, err => {
    if (err) console.error('Error deleting file:', err);
  });
};

// Helper: Convert to boolean
const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
};

// Helper: Convert to number
const toNumber = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

// GET: Fetch all menu items with filters
export const getAllMenuItems = async (
  categoryId?: string,
  featured?: string,
  available?: string
) => {
  const whereClause: any = {};

  if (categoryId) whereClause.categoryId = categoryId;
  if (featured === 'true') whereClause.isFeatured = true;
  if (available === 'true') whereClause.isAvailable = true;

  return prisma.menuItem.findMany({
    where: whereClause,
    include: { category: true },
    orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
  });
};

// GET: Fetch single menu item
export const getMenuItemById = async (id: string) => {
  if (!id || id.length === 0) {
    throw new Error('Menu item ID is required');
  }

  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!item) {
    throw new Error('Menu item not found');
  }

  return item;
};

// GET: Fetch items by category
export const getItemsByCategory = async (categoryId: string) => {
  if (!categoryId) {
    throw new Error('Category ID is required');
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return prisma.menuItem.findMany({
    where: { categoryId },
    orderBy: { name: 'asc' },
  });
};

// GET: Fetch featured items
export const getFeaturedItems = async (limit: number = 10) => {
  return prisma.menuItem.findMany({
    where: { isFeatured: true, isAvailable: true },
    take: limit,
    include: { category: true },
  });
};

// POST: Create menu item
export const createMenuItem = async (
  name: string,
  categoryId: string,
  price: number,
  file?: Express.Multer.File,
  description?: string,
  isFeatured?: any,
  isAvailable?: any
) => {
  if (!name || !categoryId || price === undefined) {
    throw new Error('Name, categoryId, and price are required');
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  // Validate price
  if (price < 0) {
    throw new Error('Price must be positive');
  }

  const imageUrl = file ? `/uploads/menu-images/${file.filename}` : '';

  return prisma.menuItem.create({
    data: {
      name: name.trim(),
      description: description?.trim() || '',
      price: toNumber(price),
      categoryId,
      imageUrl,
      isFeatured: toBoolean(isFeatured),
      isAvailable: toBoolean(isAvailable) || true,
    },
    include: { category: true },
  });
};

// PUT: Update menu item metadata
export const updateMenuItemMetadata = async (
  id: string,
  name?: string,
  description?: string,
  price?: number,
  categoryId?: string,
  isFeatured?: any,
  isAvailable?: any,
  isSpicy?: any,
  isVeg?: any,
) => {
  if (
    !name &&
    !description &&
    price === undefined &&
    !categoryId &&
    isFeatured === undefined &&
    isAvailable === undefined
  ) {
    throw new Error('At least one field is required for update');
  }

  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    throw new Error('Menu item not found');
  }

  // If category is being changed, verify it exists
  if (categoryId && categoryId !== item.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }
  }

  // Validate price if provided
  if (price !== undefined && price < 0) {
    throw new Error('Price must be positive');
  }

  return prisma.menuItem.update({
    where: { id },
    data: {
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(price !== undefined && { price: toNumber(price) }),
      ...(categoryId && { categoryId }),
      ...(isFeatured !== undefined && { isFeatured: toBoolean(isFeatured) }),
      ...(isAvailable !== undefined && { isAvailable: toBoolean(isAvailable) }),
      ...(isSpicy  !== undefined && { isSpicy: toBoolean(isSpicy) }),
      ...(isVeg !== undefined && { isVeg: toBoolean(isVeg) }),
    },
    include: { category: true },
  });
};

// PUT: Replace menu item image
export const replaceMenuItemImage = async (id: string, file: Express.Multer.File) => {
  if (!file) {
    throw new Error('Image file is required');
  }

  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    // Clean up uploaded file
    const filePath = path.join(process.cwd(), 'uploads/menu-images', file.filename);
    deleteFile(filePath);
    throw new Error('Menu item not found');
  }

  // Delete old image if exists
  if (item.imageUrl) {
    const oldImagePath = path.join(process.cwd(), item.imageUrl.replace(/^\//, ''));
    deleteFile(oldImagePath);
  }

  const newImageUrl = `/uploads/menu-images/${file.filename}`;

  return prisma.menuItem.update({
    where: { id },
    data: { imageUrl: newImageUrl },
    include: { category: true },
  });
};

// DELETE: Delete menu item
export const deleteMenuItem = async (id: string) => {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    throw new Error('Menu item not found');
  }

  await prisma.menuItem.delete({ where: { id } });

  // Delete image file if exists
  if (item.imageUrl) {
    const imagePath = path.join(process.cwd(), item.imageUrl.replace(/^\//, ''));
    deleteFile(imagePath);
  }
};

// POST: Toggle availability
export const toggleAvailability = async (id: string) => {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    throw new Error('Menu item not found');
  }

  return prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable },
    include: { category: true },
  });
};

// POST: Toggle featured
export const toggleFeatured = async (id: string) => {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    throw new Error('Menu item not found');
  }

  return prisma.menuItem.update({
    where: { id },
    data: { isFeatured: !item.isFeatured },
    include: { category: true },
  });
};
