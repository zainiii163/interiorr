import { Router } from 'express';
import * as c from '../controllers/contentController.js';
import { syncGoogleReviews, getGoogleReviewsStats } from '../controllers/googleReviewsController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

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
router.patch('/partners/reorder', protect, c.reorderPartners);
router.post('/partners', protect, c.createPartner);
router.put('/partners/:id', protect, c.updatePartner);
router.delete('/partners/:id', protect, authorize('admin'), c.deletePartner);

// Design styles
router.get('/design-styles', optionalProtect, c.listDesignStyles);
router.get('/design-styles/:slug', optionalProtect, c.getDesignStyleBySlug);
router.patch('/design-styles/reorder', protect, c.reorderDesignStyles);
router.post('/design-styles', protect, c.createDesignStyle);
router.put('/design-styles/:id', protect, c.updateDesignStyle);
router.delete('/design-styles/:id', protect, authorize('admin'), c.deleteDesignStyle);

// Trust pillars
router.get('/trust-pillars', c.listTrustPillars);
router.patch('/trust-pillars/reorder', protect, c.reorderTrustPillars);
router.post('/trust-pillars', protect, c.createTrustPillar);
router.put('/trust-pillars/:id', protect, c.updateTrustPillar);
router.delete('/trust-pillars/:id', protect, authorize('admin'), c.deleteTrustPillar);

// Settings
router.get('/settings', c.getSettings);
router.put('/settings', protect, authorize('admin'), c.updateSettings);

// Quotes (CRM — admin & manager)
router.get('/quotes', protect, authorize('admin', 'manager'), c.listQuotes);
router.post('/quotes', protect, authorize('admin', 'manager'), c.createQuote);
router.put('/quotes/:id', protect, authorize('admin', 'manager'), c.updateQuote);
router.put('/quotes/:id/status', protect, authorize('admin', 'manager'), c.updateQuoteStatus);
router.delete('/quotes/:id', protect, authorize('admin'), c.deleteQuote);
router.get('/quotes/:id/pdf', optionalProtect, c.exportQuotePDF);
router.post('/quotes/:id/email', protect, authorize('admin', 'manager'), c.emailQuoteToClient);

// Media
router.get('/media', c.listMedia);
router.patch('/media/reorder', protect, c.reorderMedia);
router.post('/media', protect, c.createMedia);
router.put('/media/:id', protect, c.updateMedia);
router.delete('/media/:id', protect, authorize('admin'), c.deleteMedia);

// Materials
router.get('/materials', c.listMaterials);
router.get('/materials/:slug', c.getMaterialBySlug);
router.patch('/materials/reorder', protect, c.reorderMaterials);
router.post('/materials', protect, c.createMaterial);
router.put('/materials/:id', protect, c.updateMaterial);
router.delete('/materials/:id', protect, authorize('admin'), c.deleteMaterial);

// Uploads
router.post('/uploads/image', protect, uploadImage.single('image'), c.uploadImage);

// Dashboard
router.get('/dashboard/stats', protect, c.getDashboardStats);

export default router;