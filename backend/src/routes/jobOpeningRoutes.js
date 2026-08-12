import { Router } from 'express';
import * as opening from '../controllers/jobOpeningController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalProtect, opening.listOpenings);
router.post('/', protect, opening.createOpening);
router.put('/:id', protect, opening.updateOpening);
router.delete('/:id', protect, authorize('admin'), opening.deleteOpening);

export default router;
