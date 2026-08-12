import { Router } from 'express';
import * as user from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Lightweight assignee list for CRM (managers + admins)
router.get('/directory', protect, authorize('admin', 'manager'), user.listDirectory);

router.use(protect, authorize('admin'));

router.get('/', user.listUsers);
router.post('/', user.createUser);
router.put('/:id', user.updateUser);
router.delete('/:id', user.deleteUser);

export default router;
