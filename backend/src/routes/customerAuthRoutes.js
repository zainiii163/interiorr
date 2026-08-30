import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as auth from '../controllers/customerAuthController.js';
import { protectCustomer } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const customerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

const customerRefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many token refresh attempts. Please try again later.' },
});

const validateCustomerSignup = validate({
  name: { required: true, type: 'string', maxLength: 100 },
  email: { required: true, type: 'email', maxLength: 254 },
  phone: { type: 'string', maxLength: 20 },
  password: { required: true, type: 'string', minLength: 8, maxLength: 128 },
});

const validateCustomerLogin = validate({
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 1 },
});

router.post('/signup', customerLimiter, validateCustomerSignup, auth.signup);
router.post('/verify', customerRefreshLimiter, auth.verifyEmail);
router.post('/login', customerLimiter, validateCustomerLogin, auth.login);
router.post('/refresh', customerRefreshLimiter, auth.refresh);
router.post('/logout', protectCustomer, auth.logout);
router.get('/me', protectCustomer, auth.me);
router.get('/me/quotes', protectCustomer, auth.myQuotes);

export default router;
