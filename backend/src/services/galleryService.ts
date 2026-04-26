import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Helper: Convert string boolean to actual boolean
const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
};

// Helper: Delete file safely
const deleteFile = (filePath: string): void => {
  fs.unlink(filePath, err => {
    if (err) console.error('Error deleting file:', err);
  });
};

// GET: Fetch all gallery images
export const getAllImages = async (featured?: string) => {
  const whereClause: any = {};

  if (featured === 'true') {
    whereClause.isFeatured = true;
  }

  return prisma.galleryImage.findMany({
    where: whereClause,
    orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
  });
};

// GET: Fetch single image
export const getImageById = async (id: string) => {
  if (!id || id.length === 0) {
    throw new Error('Image ID is required');
  }

  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) {
    throw new Error('Gallery image not found');
  }

  return image;
};

// POST: Upload new image
export const uploadImage = async (
  file: Express.Multer.File,
  caption?: string,
  isFeatured?: any,
  displayOrder?: number
) => {
  if (!file) {
    throw new Error('Image file is required');
  }

  const imageUrl = `/uploads/gallery-images/${file.filename}`;

  // Auto-generate display order
  let order = displayOrder;
  if (order === undefined) {
    const lastImage = await prisma.galleryImage.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    order = (lastImage?.displayOrder || 0) + 1;
  }

  return prisma.galleryImage.create({
    data: {
      imageUrl,
      caption: caption?.trim() || '',
      isFeatured: toBoolean(isFeatured),
      displayOrder: order,
    },
  });
};

// PUT: Update image metadata
export const updateImageMetadata = async (
  id: string,
  caption?: string,
  isFeatured?: any,
  displayOrder?: number
) => {
  if (caption === undefined && isFeatured === undefined && displayOrder === undefined) {
    throw new Error('At least one field (caption, isFeatured, displayOrder) is required');
  }

  const existingImage = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existingImage) {
    throw new Error('Gallery image not found');
  }

  return prisma.galleryImage.update({
    where: { id },
    data: {
      ...(caption !== undefined && { caption: caption.trim() }),
      ...(isFeatured !== undefined && { isFeatured: toBoolean(isFeatured) }),
      ...(displayOrder !== undefined && { displayOrder }),
    },
  });
};

// PUT: Replace image file
export const replaceImageFile = async (id: string, file: Express.Multer.File) => {
  if (!file) {
    throw new Error('Image file is required');
  }

  const existingImage = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existingImage) {
    // Clean up uploaded file
    const filePath = path.join(process.cwd(), 'uploads/gallery-images', file.filename);
    deleteFile(filePath);
    throw new Error('Gallery image not found');
  }

  // Delete old image file
  const oldImagePath = path.join(process.cwd(), existingImage.imageUrl.replace(/^\//, ''));
  deleteFile(oldImagePath);

  const newImageUrl = `/uploads/gallery-images/${file.filename}`;

  return prisma.galleryImage.update({
    where: { id },
    data: { imageUrl: newImageUrl },
  });
};

// DELETE: Delete image
export const deleteImage = async (id: string) => {
  const existingImage = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existingImage) {
    throw new Error('Gallery image not found');
  }

  await prisma.galleryImage.delete({ where: { id } });

  // Delete image file from disk
  const imagePath = path.join(process.cwd(), existingImage.imageUrl.replace(/^\//, ''));
  deleteFile(imagePath);
};

// POST: Toggle featured status
export const toggleFeatured = async (id: string) => {
  const existingImage = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existingImage) {
    throw new Error('Gallery image not found');
  }

  return prisma.galleryImage.update({
    where: { id },
    data: { isFeatured: !existingImage.isFeatured },
  });
};
