import { Lead } from '../models/Lead.js';
import { Service } from '../models/Service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendAdminLeadAlert, sendClientConfirmation } from '../services/emailService.js';
import { escapeRegex } from '../middleware/validate.js';
import {
  formatLead,
  parseLeadInput,
  normalizeLeadStatusFilter,
} from '../utils/legacyFormat.js';

async function resolveServiceRef(serviceValue) {
  if (!serviceValue) return undefined;
  if (typeof serviceValue === 'string' && !/^[a-f\d]{24}$/i.test(serviceValue)) {
    const safe = escapeRegex(serviceValue);
    const match = await Service.findOne({ title: new RegExp(`^${safe}$`, 'i') });
    return match?._id;
  }
  return serviceValue;
}

export const createLead = asyncHandler(async (req, res) => {
  const parsed = parseLeadInput(req.body);
  const { fullName, email, phone, propertyType, service, location, message, preferredContact, source } =
    parsed;

  if (!fullName || !email || !phone) {
    throw new ApiError(400, 'Full name, email, and phone are required');
  }

  if (fullName.length > 100) throw new ApiError(400, 'Name is too long');
  if (email.length > 254) throw new ApiError(400, 'Email is too long');
  if (phone.length > 20) throw new ApiError(400, 'Phone number is too long');
  if (message && message.length > 2000) throw new ApiError(400, 'Message is too long');
  if (location && location.length > 500) throw new ApiError(400, 'Location is too long');

  const serviceName = typeof req.body.service === 'string' ? req.body.service : undefined;
  const serviceId = await resolveServiceRef(service);

  const leadType =
    parsed.leadType ||
    (String(parsed.source || '').toLowerCase().includes('contact') ? 'contact' : 'consultation');

  const lead = await Lead.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    propertyType,
    service: serviceId,
    location: location?.trim(),
    message: serviceName && !serviceId ? `[Inquiry: ${serviceName}] ${message || ''}`.trim() : message?.trim(),
    preferredContact,
    source: source?.trim() || req.headers.referer || 'website',
    leadType,
    utmSource: parsed.utmSource || '',
    utmMedium: parsed.utmMedium || '',
    utmCampaign: parsed.utmCampaign || '',
  });

  sendAdminLeadAlert(lead).catch(console.error);
  sendClientConfirmation(lead).catch(console.error);

  await lead.populate('service', 'title');
  const formatted = formatLead(lead);
  if (serviceName && !formatted.service) formatted.service = serviceName;

  console.log(`[LEAD] New ${leadType}: ${fullName} (${email})`);
  res.status(201).json(new ApiResponse(201, formatted, 'Consultation request submitted'));
});

export const listLeads = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const filter = {};

  if (req.query.status) filter.status = normalizeLeadStatusFilter(req.query.status);
  if (req.query.service) filter.service = req.query.service;
  if (req.query.leadType) filter.leadType = req.query.leadType;

  if (req.query.search) {
    const term = escapeRegex(req.query.search.trim().substring(0, 100));
    filter.$or = [
      { fullName: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { phone: { $regex: term, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    Lead.find(filter)
      .populate('service', 'title')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, items.map(formatLead), 'Leads fetched', {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    })
  );
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id)
    .populate('service', 'title slug')
    .populate('assignedTo', 'name email')
    .populate('notes.author', 'name');
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.status(200).json(new ApiResponse(200, formatLead(lead)));
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new ApiError(404, 'Lead not found');

  const parsed = parseLeadInput(req.body);
  const { status, assignedTo, note, content } = parsed;
  const noteText = note || content;

  if (status) lead.status = status;
  if (assignedTo !== undefined) lead.assignedTo = assignedTo || null;
  if (noteText) {
    lead.notes.push({ text: noteText.substring(0, 2000), author: req.user._id });
  }

  await lead.save();
  await lead.populate([
    { path: 'service', select: 'title slug' },
    { path: 'assignedTo', select: 'name email' },
    { path: 'notes.author', select: 'name' },
  ]);
  res.status(200).json(new ApiResponse(200, formatLead(lead), 'Lead updated'));
});

export const addLeadNote = asyncHandler(async (req, res) => {
  req.body.note = req.body.content || req.body.note;
  return updateLead(req, res);
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.status(200).json(new ApiResponse(200, null, 'Lead deleted'));
});
