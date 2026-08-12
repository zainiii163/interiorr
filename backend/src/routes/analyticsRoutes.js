import { Router } from 'express';
import * as c from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/summary', protect, c.getAnalyticsSummary);

export default router;
