import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as lead from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many submissions. Try again later.' },
});

router.post('/', leadLimiter, lead.createLead);
router.get('/', protect, lead.listLeads);
router.get('/:id', protect, lead.getLead);
router.patch('/:id', protect, lead.updateLead);
router.put('/:id', protect, lead.updateLead);
router.post('/:id/notes', protect, lead.addLeadNote);
router.delete('/:id', protect, authorize('admin'), lead.deleteLead);

export default router;