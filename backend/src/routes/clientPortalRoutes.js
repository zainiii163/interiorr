import { Router } from 'express';
import * as c from '../controllers/clientPortalController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public client portal access (code or quoteId)
router.get('/portal/:code', c.getClientPortalData);
router.post('/quote/:id/accept', c.acceptQuote);
router.post('/quote/:id/reject', c.rejectQuote);

// Admin timeline update
router.put('/projects/:projectId/timeline', protect, c.updateProjectTimeline);

export default router;
