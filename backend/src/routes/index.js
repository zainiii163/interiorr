import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './authRoutes.js';
import customerAuthRoutes from './customerAuthRoutes.js';
import membershipRoutes from './membershipRoutes.js';
import leadRoutes from './leadRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import projectRoutes from './projectRoutes.js';
import contentRoutes from './contentRoutes.js';
import userRoutes from './userRoutes.js';
import jobApplicationRoutes from './jobApplicationRoutes.js';
import jobOpeningRoutes from './jobOpeningRoutes.js';
import navRoutes from './navRoutes.js';
import clientPortalRoutes from './clientPortalRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import { getIntegrationStatus } from '../config/integrations.js';

const router = Router();

// Global rate limiter — 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown',
});

// Strict limiter for public endpoints
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

router.use(globalLimiter);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API OK', timestamp: new Date().toISOString() });
});

router.get('/integrations/status', (req, res) => {
  res.json({ success: true, data: getIntegrationStatus() });
});

router.use('/auth', authRoutes);
router.use('/customers/auth', customerAuthRoutes);
router.use('/memberships', membershipRoutes);
router.use('/leads', leadRoutes);
router.use('/services', serviceRoutes);
router.use('/projects', projectRoutes);
router.use('/users', userRoutes);
router.use('/job-applications', jobApplicationRoutes);
router.use('/job-openings', jobOpeningRoutes);
router.use('/navigation', navRoutes);
router.use('/client', clientPortalRoutes);
router.use('/payments', paymentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/', contentRoutes);

export default router;
