import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as c from '../controllers/paymentController.js';
import { validatePayment } from '../middleware/validate.js';

const router = Router();

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment requests. Please try again later.' },
});

router.post('/create-checkout-session', paymentLimiter, validatePayment, c.createCheckoutSession);
router.post('/confirm-payment', paymentLimiter, validatePayment, c.confirmPayment);

export default router;
