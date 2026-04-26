import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

export const createUploader = (subDir: string): multer.Multer => {
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads', subDir);

  // Ensure directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage: StorageEngine = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const ext = path.extname(file.originalname);
      const filename = `${timestamp}-${random}${ext}`;
      cb(null, filename);
    }
  });

  const fileFilter = (_req: any, file: any, cb: any) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  });
};

export const menuUpload = createUploader('menu-images');
export const galleryUpload = createUploader('gallery-images');
