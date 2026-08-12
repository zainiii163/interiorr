import { Router } from 'express';
import * as nav from '../controllers/navController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalProtect, nav.listNavItems);
router.post('/', protect, nav.createNavItem);
router.put('/:id', protect, nav.updateNavItem);
router.delete('/:id', protect, authorize('admin'), nav.deleteNavItem);

export default router;
