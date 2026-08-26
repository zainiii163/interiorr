import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as c from '../controllers/clientPortalController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Rate limiter for portal operations
const portalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many portal requests. Please try again later.' },
});

// Public client portal access (code or quoteId)
router.get('/portal/:code', portalLimiter, c.getClientPortalData);
router.post('/quote/:id/accept', portalLimiter, c.acceptQuote);
router.post('/quote/:id/reject', portalLimiter, c.rejectQuote);

// Admin timeline update
router.put('/projects/:projectId/timeline', protect, c.updateProjectTimeline);

export default router;
