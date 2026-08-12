import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as app from '../controllers/jobApplicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many applications. Try again later.' },
});

router.post('/', applyLimiter, app.createApplication);
router.get('/', protect, app.listApplications);
router.get('/:id', protect, app.getApplication);
router.patch('/:id', protect, app.updateApplication);
router.delete('/:id', protect, authorize('admin'), app.deleteApplication);

export default router;
