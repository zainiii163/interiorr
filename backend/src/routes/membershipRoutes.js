import { Router } from 'express';
import * as c from '../controllers/membershipController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', c.listMemberships);
router.get('/:id', c.getMembership);

// Admin CRUD
router.post('/', protect, authorize('admin', 'manager'), c.createMembership);
router.put('/:id', protect, authorize('admin', 'manager'), c.updateMembership);
router.delete('/:id', protect, authorize('admin', 'manager'), c.deleteMembership);

export default router;
