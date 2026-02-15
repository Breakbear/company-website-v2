import { Router } from 'express';
import {
  getNewsList,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  getLatestNews,
} from '../controllers/news.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/latest', getLatestNews);
router.get('/', getNewsList);
router.get('/:id', getNews);

router.post('/', protect, authorize('admin', 'editor'), createNews);
router.put('/:id', protect, authorize('admin', 'editor'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

export default router;
