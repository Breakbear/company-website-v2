import { Router, Request, Response } from 'express';
import {
  login,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', (_req: Request, res: Response): void => {
  res.status(403).json({ success: false, message: 'Self-registration is disabled' });
});
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;
