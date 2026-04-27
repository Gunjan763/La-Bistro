import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth.routes';
import menuRoutes from './routes/menu.routes';
import categoryRoutes from './routes/category.routes';
import reservationRoutes from './routes/reservation.routes';
import galleryRoutes from './routes/gallery.routes';
import contentRoutes from './routes/content.routes';
import restaurantRoutes from './routes/restaurant.routes';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || '')
      .split(',')
      .map(o => o.trim().replace(/\/$/, '')); // remove trailing slash

    // allow requests without origin (Postman, mobile apps, server calls)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    console.log('Blocked by CORS:', origin);
    return callback(null, false); // 👈 don't throw error
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const menuImagesDir = path.join(uploadsDir, 'menu-images');
const galleryImagesDir = path.join(uploadsDir, 'gallery-images');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(menuImagesDir)) {
  fs.mkdirSync(menuImagesDir, { recursive: true });
}
if (!fs.existsSync(galleryImagesDir)) {
  fs.mkdirSync(galleryImagesDir, { recursive: true });
}

// Serve uploads as static files
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/restaurant', restaurantRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, _req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 La Bistro server running on http://localhost:${PORT}`);
});
