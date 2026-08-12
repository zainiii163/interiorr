import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as auth from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts. Try again later.' },
});

router.post('/login', authLimiter, auth.login);
router.post('/refresh', authLimiter, auth.refresh);
router.post('/logout', protect, auth.logout);
router.get('/me', protect, auth.me);

export default router;
