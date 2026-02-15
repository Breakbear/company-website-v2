import { Router } from 'express';
import {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contact.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/', createContact);

router.get('/', protect, authorize('admin', 'editor'), getContacts);
router.put('/:id', protect, authorize('admin', 'editor'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

export default router;
