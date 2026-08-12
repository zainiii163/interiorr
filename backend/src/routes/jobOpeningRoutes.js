import { Router } from 'express';
import * as opening from '../controllers/jobOpeningController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalProtect, opening.listOpenings);
router.patch('/reorder', protect, authorize('admin', 'manager'), opening.reorderOpenings);
router.post('/', protect, authorize('admin', 'manager'), opening.createOpening);
router.put('/:id', protect, authorize('admin', 'manager'), opening.updateOpening);
router.delete('/:id', protect, authorize('admin'), opening.deleteOpening);

export default router;
