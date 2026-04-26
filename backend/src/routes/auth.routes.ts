import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

interface LoginRequest {
  email?: string;
  password?: string;
}

interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

// POST /login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find admin by email
    const admin = await prisma.user.findUnique({
      where: { email },
    });

    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
  { id: admin.id, email: admin.email },
  process.env.JWT_SECRET as string,
  { expiresIn: (process.env.JWT_EXPIRY || '7d') as jwt.SignOptions['expiresIn'] }
);
    // Return token and admin data (without password)
    res.status(200).json({
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /me (Protected)
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Fetch admin from database
    const admin = await prisma.user.findUnique({
      where: { id: req.adminId },
    });

    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    // Return admin data without password
    res.status(200).json({
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /change-password (Protected)
router.post(
  '/change-password',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body as ChangePasswordRequest;

      if (!req.adminId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Validate required fields
      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Current password and new password are required' });
        return;
      }

      // Validate new password length
      if (newPassword.length < 8) {
        res.status(400).json({ error: 'New password must be at least 8 characters long' });
        return;
      }

      // Fetch admin
      const admin = await prisma.user.findUnique({
        where: { id: req.adminId },
      });

      if (!admin) {
        res.status(404).json({ error: 'Admin not found' });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);

      if (!isCurrentPasswordValid) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in database
      await prisma.user.update({
        where: { id: req.adminId },
        data: { password: hashedPassword },
      });

      res.status(200).json({ data: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
