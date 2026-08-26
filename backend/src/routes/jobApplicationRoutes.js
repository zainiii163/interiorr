import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as app from '../controllers/jobApplicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';
import { validateJobApplication } from '../middleware/validate.js';

const router = Router();

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many applications. Please try again in 1 hour.' },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', applyLimiter, uploadResume.single('resume'), validateJobApplication, app.createApplication);
router.get('/', protect, authorize('admin', 'manager'), adminLimiter, app.listApplications);
router.get('/:id', protect, authorize('admin', 'manager'), app.getApplication);
router.patch('/:id', protect, authorize('admin', 'manager'), adminLimiter, app.updateApplication);
router.delete('/:id', protect, authorize('admin'), app.deleteApplication);

export default router;
