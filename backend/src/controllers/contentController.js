import crypto from 'crypto';
import { Review } from '../models/Review.js';
import { Partner } from '../models/Partner.js';
import { DesignStyle } from '../models/DesignStyle.js';
import { TrustPillar } from '../models/TrustPillar.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { Quote } from '../models/Quote.js';
import { Media } from '../models/Media.js';
import { Lead } from '../models/Lead.js';
import { Customer } from '../models/Customer.js';
import { Project } from '../models/Project.js';
import { JobApplication } from '../models/JobApplication.js';
import { Material } from '../models/Material.js';
import { Service } from '../models/Service.js';
import { Faq } from '../models/Faq.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';
import { uploadImageBuffer, uploadBuffer, toDataUrl, saveMediaLocally } from '../services/uploadService.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';
import { generateQuotePDF } from '../services/pdfService.js';
import { applyReorder } from '../utils/reorder.js';
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
  const parsed = parseReviewInput(req.body);
  if (!parsed.authorName) throw new ApiError(400, 'Author name is required');
  if (!parsed.rating || parsed.rating < 1 || parsed.rating > 5) throw new ApiError(400, 'Rating must be between 1 and 5');
  if (parsed.authorName && parsed.authorName.length > 100) throw new ApiError(400, 'Author name is too long');
  if (parsed.content && parsed.content.length > 2000) throw new ApiError(400, 'Review content is too long');
  const review = await Review.create(parsed);
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
  if (!req.body.name) throw new ApiError(400, 'Partner name is required');
  if (req.body.name.length > 200) throw new ApiError(400, 'Partner name is too long');
  if (req.body.website && req.body.website.length > 2048) throw new ApiError(400, 'Website URL is too long');
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

export const reorderPartners = asyncHandler(async (req, res) => {
  await applyReorder(Partner, req.body.items);
  res.status(200).json(new ApiResponse(200, null, 'Partners reordered'));
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
    'title slug coverImage category location'
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

export const reorderDesignStyles = asyncHandler(async (req, res) => {
  await applyReorder(DesignStyle, req.body.items);
  res.status(200).json(new ApiResponse(200, null, 'Design styles reordered'));
});

// Trust pillars
export const listTrustPillars = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.section) filter.section = req.query.section;
  const pillars = await TrustPillar.find(filter).sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, pillars));
});

export const createTrustPillar = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new ApiError(400, 'Trust pillar title is required');
  if (req.body.title.length > 200) throw new ApiError(400, 'Title is too long');
  if (req.body.description && req.body.description.length > 1000) throw new ApiError(400, 'Description is too long');
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

export const reorderTrustPillars = asyncHandler(async (req, res) => {
  await applyReorder(TrustPillar, req.body.items);
  res.status(200).json(new ApiResponse(200, null, 'Trust pillars reordered'));
});

// FAQs
export const listFaqs = asyncHandler(async (req, res) => {
  const filter = req.user ? {} : { isActive: true };
  if (req.query.page) filter.page = req.query.page;
  const faqs = await Faq.find(filter).sort({ order: 1, createdAt: 1 });
  res.status(200).json(new ApiResponse(200, faqs));
});

export const createFaq = asyncHandler(async (req, res) => {
  if (!req.body.question) throw new ApiError(400, 'FAQ question is required');
  if (!req.body.answer) throw new ApiError(400, 'FAQ answer is required');
  if (req.body.question.length > 500) throw new ApiError(400, 'Question is too long');
  if (req.body.answer.length > 2000) throw new ApiError(400, 'Answer is too long');
  const faq = await Faq.create(req.body);
  res.status(201).json(new ApiResponse(201, faq, 'FAQ created'));
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!faq) throw new ApiError(404, 'FAQ not found');
  res.status(200).json(new ApiResponse(200, faq, 'FAQ updated'));
});

export const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findByIdAndDelete(req.params.id);
  if (!faq) throw new ApiError(404, 'FAQ not found');
  res.status(200).json(new ApiResponse(200, null, 'FAQ deleted'));
});

export const reorderFaqs = asyncHandler(async (req, res) => {
  await applyReorder(Faq, req.body.items);
  res.status(200).json(new ApiResponse(200, null, 'FAQs reordered'));
});

// Settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSetting.findOne();
  if (!settings) settings = await SiteSetting.create({});
  res.status(200).json(new ApiResponse(200, formatSettings(settings)));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const payload = parseSettingsInput(req.body);

  if (payload.companyName && payload.companyName.length > 200) throw new ApiError(400, 'Company name is too long');
  if (payload.tagline && payload.tagline.length > 300) throw new ApiError(400, 'Tagline is too long');
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) throw new ApiError(400, 'Invalid email format');
  if (payload.phone && payload.phone.length > 20) throw new ApiError(400, 'Phone number is too long');
  if (payload.address && payload.address.length > 500) throw new ApiError(400, 'Address is too long');

  let settings = await SiteSetting.findOne();
  if (!settings) settings = await SiteSetting.create(payload);
  else {
    const allowedKeys = Object.keys(settings.toObject()).filter(
      (k) => !['_id', 'createdAt', 'updatedAt', '__v'].includes(k)
    );
    for (const key of Object.keys(payload)) {
      if (allowedKeys.includes(key)) {
        settings[key] = payload[key];
      }
    }
    await settings.save();
  }
  res.status(200).json(new ApiResponse(200, formatSettings(settings), 'Settings updated'));
});

export const updatePageCopy = asyncHandler(async (req, res) => {
  const incoming =
    req.body?.pageCopy && typeof req.body.pageCopy === 'object' ? req.body.pageCopy : req.body;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    throw new ApiError(400, 'Page copy payload is required');
  }
  let settings = await SiteSetting.findOne();
  if (!settings) settings = await SiteSetting.create({});
  settings.pageCopy = { ...(settings.pageCopy || {}), ...incoming };
  settings.markModified('pageCopy');
  await settings.save();
  res.status(200).json(new ApiResponse(200, formatSettings(settings), 'Page copy updated'));
});

// Quotes
export const listQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find().populate('lead', 'fullName email').sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, quotes.map(formatQuote)));
});

export const createQuote = asyncHandler(async (req, res) => {
  const parsed = parseQuoteInput(req.body);
  if (!parsed.lead && !parsed.leadName) throw new ApiError(400, 'A lead or client name is required');

  const year = new Date().getFullYear();
  const count = await Quote.countDocuments();
  const quoteNumber = `Q-${year}-${String(count + 1).padStart(4, '0')}`;

  const lineItems = (parsed.lineItems || []).map((item) => ({
    ...item,
    total: (item.quantity || 1) * (item.unitPrice || 0),
  }));
  const subtotal = lineItems.reduce((s, i) => s + i.total, 0);
  const discount = parsed.discount || 0;
  const taxableBase = Math.max(0, subtotal - discount);
  const tax = parsed.tax ?? taxableBase * 0.05;
  const grandTotal = taxableBase + tax;

  // Link to a registered customer by email, if one exists.
  let customerId = null;
  let clientEmail = parsed.leadEmail;
  if (parsed.lead) {
    const lead = await Lead.findById(parsed.lead).select('email');
    if (lead?.email) clientEmail = lead.email;
  }
  if (clientEmail) {
    const match = await Customer.findOne({ email: String(clientEmail).toLowerCase().trim() }).select('_id');
    if (match) customerId = match._id;
  }

  const quote = await Quote.create({
    ...parsed,
    quoteNumber,
    validUntil: parsed.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    accessCode: 'P-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
    lineItems,
    subtotal,
    tax,
    discount,
    grandTotal,
    customer: customerId,
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
  quote.grandTotal = Math.max(0, quote.subtotal - quote.discount) + quote.tax;
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

export const exportQuotePDF = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id).populate('lead', 'fullName email phone');
  if (!quote) throw new ApiError(404, 'Quote not found');

  // Staff with Bearer token, or client with matching accessCode
  if (!req.user) {
    const accessCode = req.query.accessCode || req.headers['x-access-code'];
    if (!accessCode || String(accessCode).trim() !== String(quote.accessCode || '').trim()) {
      throw new ApiError(403, 'Valid client access code or admin login is required');
    }
  }

  const settings = await SiteSetting.findOne();
  const quoteData = {
    quoteNumber: quote.quoteNumber,
    leadName: quote.lead?.fullName || 'Client',
    leadEmail: quote.lead?.email || '',
    leadPhone: quote.lead?.phone || '',
    lineItems: quote.lineItems,
    subtotal: quote.subtotal,
    discount: quote.discount,
    tax: quote.tax,
    grandTotal: quote.grandTotal,
    currency: quote.currency,
    createdAt: quote.createdAt,
    validUntil: quote.validUntil,
    notes: quote.notes,
    companyName: settings?.companyName || 'Hulul Al Madina Interiors',
    companyAddress: settings?.address || 'Dubai, United Arab Emirates',
    companyEmail: settings?.email || '',
    companyPhone: settings?.phone || '',
  };

  const pdfBuffer = await generateQuotePDF(quoteData);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Quote-${quote.quoteNumber}.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);
  
  res.send(pdfBuffer);
});

export const emailQuoteToClient = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id).populate('lead', 'fullName email phone');
  if (!quote) throw new ApiError(404, 'Quote not found');
  const clientEmail = quote.lead?.email || quote.leadEmail;
  if (!clientEmail) throw new ApiError(400, 'Client has no email address');

  if (!quote.accessCode) {
    quote.accessCode = 'P-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    await quote.save();
  }

  const settings = await SiteSetting.findOne();
  const origin =
    req.body?.frontendOrigin ||
    req.headers.origin ||
    'http://localhost:5173';
  const portalUrl = `${origin}/portal/${quote.accessCode}`;

  const leadInfo = quote.lead
    ? { fullName: quote.lead.fullName, email: quote.lead.email, phone: quote.lead.phone }
    : { fullName: quote.leadName, email: quote.leadEmail, phone: '' };

  const { sendQuoteToClient } = await import('../services/emailService.js');
  const sent = await sendQuoteToClient({
    quote,
    lead: leadInfo,
    portalUrl,
    companyName: settings?.companyName || 'AURA Interiors',
  });

  if (quote.status === 'draft') {
    quote.status = 'sent';
    await quote.save();
  }

  res.status(200).json(
    new ApiResponse(
      200,
      { sent, portalUrl, accessCode: quote.accessCode, quote: formatQuote(quote) },
      sent
        ? 'Quote emailed to client'
        : 'SMTP not configured — portal link generated; email was skipped'
    )
  );
});

// Media
export const listMedia = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.placement) filter.placement = req.query.placement;
  if (req.query.type) filter.type = req.query.type;
  const media = await Media.find(filter).sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, media));
});

export const createMedia = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new ApiError(400, 'Media title is required');
  if (!req.body.url) throw new ApiError(400, 'Media URL is required');
  if (req.body.title.length > 200) throw new ApiError(400, 'Title is too long');
  if (req.body.url.length > 2048) throw new ApiError(400, 'URL is too long');
  const media = await Media.create(req.body);
  res.status(201).json(new ApiResponse(201, media, 'Media created'));
});

export const updateMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!media) throw new ApiError(404, 'Media not found');
  res.status(200).json(new ApiResponse(200, media, 'Media updated'));
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByIdAndDelete(req.params.id);
  if (!media) throw new ApiError(404, 'Media not found');
  res.status(200).json(new ApiResponse(200, null, 'Media deleted'));
});

export const reorderMedia = asyncHandler(async (req, res) => {
  await applyReorder(Media, req.body.items);
  res.status(200).json(new ApiResponse(200, null, 'Media reordered'));
});

// Materials
export const listMaterials = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true';
  const filter = includeInactive ? {} : { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === 'true') filter.isFeatured = true;
  
  const materials = await Material.find(filter)
    .sort({ order: 1, createdAt: -1 });
  
  res.status(200).json(new ApiResponse(200, materials));
});

export const getMaterialBySlug = asyncHandler(async (req, res) => {
  const material = await Material.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  });
  
  if (!material) throw new ApiError(404, 'Material not found');
  res.status(200).json(new ApiResponse(200, material));
});

export const createMaterial = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data.name) throw new ApiError(400, 'Material name is required');
  if (data.name.length > 200) throw new ApiError(400, 'Name is too long');
  
  // Generate slug if not provided
  if (!data.slug && data.name) {
    data.slug = slugify(data.name);
  }
  
  const material = await Material.create(data);
  res.status(201).json(new ApiResponse(201, material, 'Material created'));
});

export const updateMaterial = asyncHandler(async (req, res) => {
  const data = req.body;
  
  // Update slug if name changed and slug not provided
  if (data.name && !data.slug) {
    data.slug = slugify(data.name);
  }
  
  const material = await Material.findByIdAndUpdate(
    req.params.id,
    data,
    { new: true, runValidators: true }
  );
  
  if (!material) throw new ApiError(404, 'Material not found');
  res.status(200).json(new ApiResponse(200, material, 'Material updated'));
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findByIdAndDelete(req.params.id);
  if (!material) throw new ApiError(404, 'Material not found');
  res.status(200).json(new ApiResponse(200, null, 'Material deleted'));
});

export const reorderMaterials = asyncHandler(async (req, res) => {
  await applyReorder(Material, req.body.items);
  res.status(200).json(new ApiResponse(200, null, 'Materials reordered'));
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
      provider: 'local',
      warning: 'Cloudinary not configured — image stored as data URL. Set CLOUDINARY_* env vars for production.',
    }, 'Image uploaded (local mode)')
  );
});

// Upload image OR video (Cloudinary when configured, otherwise local storage)
export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const isVideo = String(req.file.mimetype || '').startsWith('video/');

  if (isCloudinaryConfigured()) {
    const result = await uploadBuffer(req.file.buffer, {
      folder: 'interior',
      filename: req.file.originalname,
      resourceType: isVideo ? 'video' : 'image',
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

  if (isVideo) {
    const url = await saveMediaLocally(req.file);
    res.status(200).json(
      new ApiResponse(200, {
        url,
        provider: 'local',
        warning: 'Cloudinary not configured — video saved to local storage.',
      }, 'Video uploaded (local mode)')
    );
    return;
  }

  const base64 = toDataUrl(req.file);
  res.status(200).json(
    new ApiResponse(200, {
      url: base64,
      provider: 'local',
      warning: 'Cloudinary not configured — image stored as data URL. Set CLOUDINARY_* env vars for production.',
    }, 'Image uploaded (local mode)')
  );
});

// Dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const role = req.user?.role || 'editor';

  if (role === 'editor') {
    const [servicesActive, projectsPublished, projectsDraft, mediaCount, reviewsCount, materialsCount] =
      await Promise.all([
        Service.countDocuments({ isActive: true }),
        Project.countDocuments({ isPublished: true }),
        Project.countDocuments({ isPublished: false }),
        Media.countDocuments(),
        Review.countDocuments(),
        Material.countDocuments({ isActive: { $ne: false } }),
      ]);

    res.status(200).json(
      new ApiResponse(200, {
        role: 'editor',
        dashboardType: 'content',
        servicesActive,
        projectsPublished,
        projectsDraft,
        mediaCount,
        reviewsCount,
        materialsCount,
        recentLeads: [],
      })
    );
    return;
  }

  const leadFilter = {};
  // Managers see full pipeline; optional future: filter by assignedTo only

  const [leadsToday, openLeads, totalProjects, quotesCount, applicationsNew, recentLeads, myLeads] =
    await Promise.all([
      Lead.countDocuments({ ...leadFilter, createdAt: { $gte: startOfDay } }),
      Lead.countDocuments({ ...leadFilter, status: { $in: ['new', 'contacted', 'quoted'] } }),
      Project.countDocuments({ isPublished: true }),
      Quote.countDocuments(),
      JobApplication.countDocuments({ status: 'new' }),
      Lead.find(leadFilter).sort({ createdAt: -1 }).limit(5).populate('service', 'title'),
      Lead.countDocuments({ assignedTo: req.user._id, status: { $in: ['new', 'contacted', 'quoted'] } }),
    ]);

  res.status(200).json(
    new ApiResponse(200, {
      role,
      dashboardType: 'crm',
      leadsToday,
      openLeads,
      myOpenLeads: myLeads,
      totalProjects,
      quotesCount,
      applicationsNew,
      recentLeads: recentLeads.map(formatLead),
    })
  );
});
