import { Router } from 'express';
import * as c from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/summary', protect, authorize('admin', 'manager'), c.getAnalyticsSummary);

export default router;
