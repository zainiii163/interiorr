import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as service from '../controllers/serviceController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { validateService } from '../middleware/validate.js';

const router = Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', optionalProtect, service.listServices);
router.patch('/reorder', protect, writeLimiter, service.reorderServices);
router.get('/:slug', service.getServiceBySlug);
router.post('/', protect, writeLimiter, validateService, service.createService);
router.put('/:id', protect, writeLimiter, service.updateService);
router.delete('/:id', protect, authorize('admin'), service.deleteService);

export default router;
