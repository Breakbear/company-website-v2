import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import './config/database';
import { env } from './config/env';

import productRoutes from './routes/product.routes';
import newsRoutes from './routes/news.routes';
import contactRoutes from './routes/contact.routes';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import settingsRoutes from './routes/settings.routes';

const app: Express = express();
const allowedOrigins = new Set(env.CORS_ORIGIN);
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication requests, please try again later.' },
});
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/products', productRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contacts', writeLimiter, contactRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/upload', writeLimiter, uploadRoutes);
app.use('/api/settings', settingsRoutes);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const response =
    env.NODE_ENV === 'production'
      ? { success: false, message: 'Something went wrong!' }
      : { success: false, message: 'Something went wrong!', error: err.message };
  res.status(500).json(response);
});

export default app;
