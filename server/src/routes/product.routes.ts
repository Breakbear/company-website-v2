import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', protect, authorize('admin', 'editor'), createProduct);
router.put('/:id', protect, authorize('admin', 'editor'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
