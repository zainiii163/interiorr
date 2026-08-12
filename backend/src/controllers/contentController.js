import { Review } from '../models/Review.js';
import { Partner } from '../models/Partner.js';
import { DesignStyle } from '../models/DesignStyle.js';
import { TrustPillar } from '../models/TrustPillar.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { Quote } from '../models/Quote.js';
import { Media } from '../models/Media.js';
import { Lead } from '../models/Lead.js';
import { Project } from '../models/Project.js';
import { JobApplication } from '../models/JobApplication.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';
import { uploadImageBuffer, toDataUrl } from '../services/uploadService.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';
import {
  formatReview,
  formatDesignStyle,
  formatSettings,
  formatQuote,
  formatLead,
  parseQuoteInput,
  parseSettingsInput,
  parseReviewInput,
  parseDesignStyleInput,
} from '../utils/legacyFormat.js';

// Reviews
export const listReviews = asyncHandler(async (req, res) => {
  const filter = req.user ? {} : { isPublished: true };
  if (req.query.featured === 'true') filter.isFeatured = true;
  const reviews = await Review.find(filter).sort({ createdAt: -1 });
  const avg =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;
  const formatted = reviews.map(formatReview);
  res.status(200).json(
    new ApiResponse(200, formatted, 'Reviews fetched', { averageRating: avg, count: formatted.length })
  );
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create(parseReviewInput(req.body));
  res.status(201).json(new ApiResponse(201, formatReview(review), 'Review created'));
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, parseReviewInput(req.body), {
    new: true,
    runValidators: true,
  });
  if (!review) throw new ApiError(404, 'Review not found');
  res.status(200).json(new ApiResponse(200, formatReview(review), 'Review updated'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  res.status(200).json(new ApiResponse(200, null, 'Review deleted'));
});

// Partners
export const listPartners = asyncHandler(async (req, res) => {
  const filter = req.user ? {} : { isActive: true };
  const partners = await Partner.find(filter).sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, partners));
});

export const createPartner = asyncHandler(async (req, res) => {
  const partner = await Partner.create(req.body);
  res.status(201).json(new ApiResponse(201, partner, 'Partner created'));
});

export const updatePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!partner) throw new ApiError(404, 'Partner not found');
  res.status(200).json(new ApiResponse(200, partner, 'Partner updated'));
});

export const deletePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);
  if (!partner) throw new ApiError(404, 'Partner not found');
  res.status(200).json(new ApiResponse(200, null, 'Partner deleted'));
});

// Design styles
export const listDesignStyles = asyncHandler(async (req, res) => {
  const filter = req.user ? {} : { isActive: true };
  const styles = await DesignStyle.find(filter).sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, styles.map(formatDesignStyle)));
});

export const getDesignStyleBySlug = asyncHandler(async (req, res) => {
  const style = await DesignStyle.findOne({ slug: req.params.slug, isActive: true }).populate(
    'relatedProjects',
    'title slug coverImage category'
  );
  if (!style) throw new ApiError(404, 'Design style not found');
  res.status(200).json(new ApiResponse(200, formatDesignStyle(style)));
});

export const createDesignStyle = asyncHandler(async (req, res) => {
  const payload = parseDesignStyleInput(req.body);
  if (!payload.slug && payload.name) payload.slug = slugify(payload.name);
  const style = await DesignStyle.create(payload);
  res.status(201).json(new ApiResponse(201, formatDesignStyle(style), 'Design style created'));
});

export const updateDesignStyle = asyncHandler(async (req, res) => {
  const payload = parseDesignStyleInput(req.body);
  if (payload.name && !payload.slug) payload.slug = slugify(payload.name);
  const style = await DesignStyle.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!style) throw new ApiError(404, 'Design style not found');
  res.status(200).json(new ApiResponse(200, formatDesignStyle(style), 'Design style updated'));
});

export const deleteDesignStyle = asyncHandler(async (req, res) => {
  const style = await DesignStyle.findByIdAndDelete(req.params.id);
  if (!style) throw new ApiError(404, 'Design style not found');
  res.status(200).json(new ApiResponse(200, null, 'Design style deleted'));
});

// Trust pillars
export const listTrustPillars = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.section) filter.section = req.query.section;
  const pillars = await TrustPillar.find(filter).sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, pillars));
});

export const createTrustPillar = asyncHandler(async (req, res) => {
  const pillar = await TrustPillar.create(req.body);
  res.status(201).json(new ApiResponse(201, pillar, 'Trust pillar created'));
});

export const updateTrustPillar = asyncHandler(async (req, res) => {
  const pillar = await TrustPillar.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!pillar) throw new ApiError(404, 'Trust pillar not found');
  res.status(200).json(new ApiResponse(200, pillar, 'Trust pillar updated'));
});

export const deleteTrustPillar = asyncHandler(async (req, res) => {
  const pillar = await TrustPillar.findByIdAndDelete(req.params.id);
  if (!pillar) throw new ApiError(404, 'Trust pillar not found');
  res.status(200).json(new ApiResponse(200, null, 'Trust pillar deleted'));
});

// Settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSetting.findOne();
  if (!settings) settings = await SiteSetting.create({});
  res.status(200).json(new ApiResponse(200, formatSettings(settings)));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const payload = parseSettingsInput(req.body);
  let settings = await SiteSetting.findOne();
  if (!settings) settings = await SiteSetting.create(payload);
  else {
    Object.assign(settings, payload);
    await settings.save();
  }
  res.status(200).json(new ApiResponse(200, formatSettings(settings), 'Settings updated'));
});

// Quotes
export const listQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find().populate('lead', 'fullName email').sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, quotes.map(formatQuote)));
});

export const createQuote = asyncHandler(async (req, res) => {
  const parsed = parseQuoteInput(req.body);
  if (!parsed.lead) throw new ApiError(400, 'Lead is required');

  const year = new Date().getFullYear();
  const count = await Quote.countDocuments();
  const quoteNumber = `Q-${year}-${String(count + 1).padStart(4, '0')}`;

  const lineItems = (parsed.lineItems || []).map((item) => ({
    ...item,
    total: (item.quantity || 1) * (item.unitPrice || 0),
  }));
  const subtotal = lineItems.reduce((s, i) => s + i.total, 0);
  const tax = parsed.tax ?? subtotal * 0.05;
  const discount = parsed.discount || 0;
  const grandTotal = subtotal + tax - discount;

  const quote = await Quote.create({
    ...parsed,
    quoteNumber,
    lineItems,
    subtotal,
    tax,
    discount,
    grandTotal,
    createdBy: req.user._id,
  });

  await quote.populate('lead', 'fullName email');
  res.status(201).json(new ApiResponse(201, formatQuote(quote), 'Quote created'));
});

export const updateQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) throw new ApiError(404, 'Quote not found');

  const parsed = parseQuoteInput(req.body);

  if (parsed.lineItems) {
    quote.lineItems = parsed.lineItems.map((item) => ({
      ...item,
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }));
    quote.subtotal = quote.lineItems.reduce((s, i) => s + i.total, 0);
  }
  if (parsed.tax !== undefined) quote.tax = parsed.tax;
  if (parsed.discount !== undefined) quote.discount = parsed.discount;
  quote.grandTotal = quote.subtotal + quote.tax - quote.discount;
  if (parsed.status) quote.status = parsed.status;
  if (parsed.notes !== undefined) quote.notes = parsed.notes;
  if (parsed.validUntil) quote.validUntil = parsed.validUntil;

  await quote.save();
  await quote.populate('lead', 'fullName email');
  res.status(200).json(new ApiResponse(200, formatQuote(quote), 'Quote updated'));
});

export const updateQuoteStatus = asyncHandler(async (req, res) => {
  req.body = { status: req.body.status };
  return updateQuote(req, res);
});

export const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findByIdAndDelete(req.params.id);
  if (!quote) throw new ApiError(404, 'Quote not found');
  res.status(200).json(new ApiResponse(200, null, 'Quote deleted'));
});

// Media
export const listMedia = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.placement) filter.placement = req.query.placement;
  const media = await Media.find(filter).sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, media));
});

export const createMedia = asyncHandler(async (req, res) => {
  const media = await Media.create(req.body);
  res.status(201).json(new ApiResponse(201, media, 'Media created'));
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByIdAndDelete(req.params.id);
  if (!media) throw new ApiError(404, 'Media not found');
  res.status(200).json(new ApiResponse(200, null, 'Media deleted'));
});

// Upload image (Cloudinary when configured, otherwise data URL stub)
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  if (isCloudinaryConfigured()) {
    const result = await uploadImageBuffer(req.file.buffer, {
      folder: 'interior',
      filename: req.file.originalname,
    });
    res.status(200).json(
      new ApiResponse(200, {
        url: result.secure_url,
        publicId: result.public_id,
        provider: 'cloudinary',
      })
    );
    return;
  }

  const base64 = toDataUrl(req.file);
  res.status(200).json(
    new ApiResponse(200, {
      url: base64,
      provider: 'stub',
      message: 'Cloudinary not configured — returned inline preview. Set CLOUDINARY_* env vars for production.',
    })
  );
});

// Dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [leadsToday, openLeads, totalProjects, quotesCount, applicationsNew, recentLeads] =
    await Promise.all([
      Lead.countDocuments({ createdAt: { $gte: startOfDay } }),
      Lead.countDocuments({ status: { $in: ['new', 'contacted', 'quoted'] } }),
      Project.countDocuments({ isPublished: true }),
      Quote.countDocuments(),
      JobApplication.countDocuments({ status: 'new' }),
      Lead.find().sort({ createdAt: -1 }).limit(5).populate('service', 'title'),
    ]);

  res.status(200).json(
    new ApiResponse(200, {
      leadsToday,
      openLeads,
      totalProjects,
      quotesCount,
      applicationsNew,
      recentLeads: recentLeads.map(formatLead),
    })
  );
});
