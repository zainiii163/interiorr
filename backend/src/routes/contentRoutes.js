import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as c from '../controllers/contentController.js';
import { syncGoogleReviews, getGoogleReviewsStats } from '../controllers/googleReviewsController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { uploadImage, upload } from '../middleware/upload.js';
import { validateQuote, validateReview, validateDesignStyle, validateService, validateProject } from '../middleware/validate.js';

const router = Router();

// Rate limiter for write operations (admin panel)
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many write requests. Please slow down.' },
});

// Reviews
router.get('/reviews', optionalProtect, c.listReviews);
router.post('/reviews/sync-google', protect, writeLimiter, syncGoogleReviews);
router.get('/reviews/google-stats', getGoogleReviewsStats);
router.post('/reviews', protect, writeLimiter, validateReview, c.createReview);
router.put('/reviews/:id', protect, writeLimiter, c.updateReview);
router.delete('/reviews/:id', protect, authorize('admin'), c.deleteReview);

// Partners
router.get('/partners', optionalProtect, c.listPartners);
router.patch('/partners/reorder', protect, writeLimiter, c.reorderPartners);
router.post('/partners', protect, writeLimiter, c.createPartner);
router.put('/partners/:id', protect, writeLimiter, c.updatePartner);
router.delete('/partners/:id', protect, authorize('admin'), c.deletePartner);

// Design styles
router.get('/design-styles', optionalProtect, c.listDesignStyles);
router.get('/design-styles/:slug', optionalProtect, c.getDesignStyleBySlug);
router.patch('/design-styles/reorder', protect, writeLimiter, c.reorderDesignStyles);
router.post('/design-styles', protect, writeLimiter, validateDesignStyle, c.createDesignStyle);
router.put('/design-styles/:id', protect, writeLimiter, c.updateDesignStyle);
router.delete('/design-styles/:id', protect, authorize('admin'), c.deleteDesignStyle);

// Trust pillars
router.get('/trust-pillars', c.listTrustPillars);
router.patch('/trust-pillars/reorder', protect, writeLimiter, c.reorderTrustPillars);
router.post('/trust-pillars', protect, writeLimiter, c.createTrustPillar);
router.put('/trust-pillars/:id', protect, writeLimiter, c.updateTrustPillar);
router.delete('/trust-pillars/:id', protect, authorize('admin'), c.deleteTrustPillar);

// FAQs
router.get('/faqs', optionalProtect, c.listFaqs);
router.patch('/faqs/reorder', protect, writeLimiter, c.reorderFaqs);
router.post('/faqs', protect, writeLimiter, c.createFaq);
router.put('/faqs/:id', protect, writeLimiter, c.updateFaq);
router.delete('/faqs/:id', protect, authorize('admin'), c.deleteFaq);

// Settings
router.get('/settings', c.getSettings);
router.put('/settings', protect, authorize('admin'), writeLimiter, c.updateSettings);
router.put('/page-copy', protect, authorize('admin', 'editor'), writeLimiter, c.updatePageCopy);

// Quotes (CRM — admin & manager)
router.get('/quotes', protect, authorize('admin', 'manager'), c.listQuotes);
router.post('/quotes', protect, authorize('admin', 'manager'), writeLimiter, validateQuote, c.createQuote);
router.put('/quotes/:id', protect, authorize('admin', 'manager'), writeLimiter, c.updateQuote);
router.put('/quotes/:id/status', protect, authorize('admin', 'manager'), writeLimiter, c.updateQuoteStatus);
router.delete('/quotes/:id', protect, authorize('admin'), c.deleteQuote);
router.get('/quotes/:id/pdf', optionalProtect, c.exportQuotePDF);
router.post('/quotes/:id/email', protect, authorize('admin', 'manager'), writeLimiter, c.emailQuoteToClient);

// Media
router.get('/media', c.listMedia);
router.patch('/media/reorder', protect, writeLimiter, c.reorderMedia);
router.post('/media', protect, writeLimiter, c.createMedia);
router.put('/media/:id', protect, writeLimiter, c.updateMedia);
router.delete('/media/:id', protect, authorize('admin'), c.deleteMedia);

// Materials
router.get('/materials', c.listMaterials);
router.get('/materials/:slug', c.getMaterialBySlug);
router.patch('/materials/reorder', protect, writeLimiter, c.reorderMaterials);
router.post('/materials', protect, writeLimiter, c.createMaterial);
router.put('/materials/:id', protect, writeLimiter, c.updateMaterial);
router.delete('/materials/:id', protect, authorize('admin'), c.deleteMaterial);

// Uploads
router.post('/uploads/image', protect, writeLimiter, uploadImage.single('image'), c.uploadImage);
router.post('/uploads/media', protect, writeLimiter, upload.single('file'), c.uploadMedia);

// Dashboard
router.get('/dashboard/stats', protect, c.getDashboardStats);

export default router;
