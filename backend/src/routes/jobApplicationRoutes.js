import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as app from '../controllers/jobApplicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';

const router = Router();

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many applications. Try again later.' },
});

router.post('/', applyLimiter, uploadResume.single('resume'), app.createApplication);
router.get('/', protect, authorize('admin', 'manager'), app.listApplications);
router.get('/:id', protect, authorize('admin', 'manager'), app.getApplication);
router.patch('/:id', protect, authorize('admin', 'manager'), app.updateApplication);
router.delete('/:id', protect, authorize('admin'), app.deleteApplication);

export default router;
