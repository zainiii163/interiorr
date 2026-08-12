import { Router } from 'express';
import * as service from '../controllers/serviceController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalProtect, service.listServices);
router.patch('/reorder', protect, service.reorderServices);
router.get('/:slug', service.getServiceBySlug);
router.post('/', protect, service.createService);
router.put('/:id', protect, service.updateService);
router.delete('/:id', protect, authorize('admin'), service.deleteService);

export default router;
