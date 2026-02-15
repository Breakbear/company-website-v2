import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', protect, upload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  res.json({
    success: true,
    data: {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    },
  });
});

router.post('/multiple', protect, upload.array('images', 10), (req: Request, res: Response): void => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    res.status(400).json({ success: false, message: 'No files uploaded' });
    return;
  }

  const files = (req.files as Express.Multer.File[]).map((file) => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
  }));

  res.json({ success: true, data: files });
});

export default router;
