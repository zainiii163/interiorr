import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as lead from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateLead } from '../middleware/validate.js';

const router = Router();

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again in 1 hour.' },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

router.post('/', leadLimiter, validateLead, lead.createLead);
router.get('/', protect, authorize('admin', 'manager'), adminLimiter, lead.listLeads);
router.get('/:id', protect, authorize('admin', 'manager'), lead.getLead);
router.patch('/:id', protect, authorize('admin', 'manager'), adminLimiter, lead.updateLead);
router.put('/:id', protect, authorize('admin', 'manager'), adminLimiter, lead.updateLead);
router.post('/:id/notes', protect, authorize('admin', 'manager'), adminLimiter, lead.addLeadNote);
router.delete('/:id', protect, authorize('admin'), lead.deleteLead);

export default router;
