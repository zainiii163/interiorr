import { Router } from 'express';
import authRoutes from './authRoutes.js';
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

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API OK', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
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