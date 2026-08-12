import { Router } from 'express';
import * as c from '../controllers/contentController.js';
import { syncGoogleReviews, getGoogleReviewsStats } from '../controllers/googleReviewsController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Reviews
router.get('/reviews', optionalProtect, c.listReviews);
router.post('/reviews/sync-google', protect, syncGoogleReviews);
router.get('/reviews/google-stats', getGoogleReviewsStats);
router.post('/reviews', protect, c.createReview);
router.put('/reviews/:id', protect, c.updateReview);
router.delete('/reviews/:id', protect, authorize('admin'), c.deleteReview);

// Partners
router.get('/partners', optionalProtect, c.listPartners);
router.post('/partners', protect, c.createPartner);
router.put('/partners/:id', protect, c.updatePartner);
router.delete('/partners/:id', protect, authorize('admin'), c.deletePartner);

// Design styles
router.get('/design-styles', optionalProtect, c.listDesignStyles);
router.get('/design-styles/:slug', optionalProtect, c.getDesignStyleBySlug);
router.post('/design-styles', protect, c.createDesignStyle);
router.put('/design-styles/:id', protect, c.updateDesignStyle);
router.delete('/design-styles/:id', protect, authorize('admin'), c.deleteDesignStyle);

// Trust pillars
router.get('/trust-pillars', c.listTrustPillars);
router.post('/trust-pillars', protect, c.createTrustPillar);
router.put('/trust-pillars/:id', protect, c.updateTrustPillar);
router.delete('/trust-pillars/:id', protect, authorize('admin'), c.deleteTrustPillar);

// Settings
router.get('/settings', c.getSettings);
router.put('/settings', protect, authorize('admin'), c.updateSettings);

// Quotes
router.get('/quotes', protect, c.listQuotes);
router.post('/quotes', protect, c.createQuote);
router.put('/quotes/:id', protect, c.updateQuote);
router.put('/quotes/:id/status', protect, c.updateQuoteStatus);
router.delete('/quotes/:id', protect, authorize('admin'), c.deleteQuote);
router.get('/quotes/:id/pdf', protect, c.exportQuotePDF);

// Media
router.get('/media', c.listMedia);
router.post('/media', protect, c.createMedia);
router.delete('/media/:id', protect, authorize('admin'), c.deleteMedia);

// Materials
router.get('/materials', c.listMaterials);
router.get('/materials/:slug', c.getMaterialBySlug);
router.post('/materials', protect, c.createMaterial);
router.put('/materials/:id', protect, c.updateMaterial);
router.delete('/materials/:id', protect, authorize('admin'), c.deleteMaterial);

// Uploads
router.post('/uploads/image', protect, upload.single('image'), c.uploadImage);

// Dashboard
router.get('/dashboard/stats', protect, c.getDashboardStats);

export default router;