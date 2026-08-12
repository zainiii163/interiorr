import { Service } from '../models/Service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';
import { formatService, parseServiceInput } from '../utils/legacyFormat.js';

export const listServices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.featured === 'true') filter.isFeatured = true;
  if (req.query.category) filter.category = req.query.category.toLowerCase();
  if (!req.user) filter.isActive = true;

  const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
  res.status(200).json(new ApiResponse(200, services.map(formatService)));
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true });
  if (!service) throw new ApiError(404, 'Service not found');
  res.status(200).json(new ApiResponse(200, formatService(service)));
});

export const createService = asyncHandler(async (req, res) => {
  const payload = parseServiceInput(req.body);
  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
  const service = await Service.create(payload);
  res.status(201).json(new ApiResponse(201, formatService(service), 'Service created'));
});

export const updateService = asyncHandler(async (req, res) => {
  const payload = parseServiceInput(req.body);
  if (payload.title && !payload.slug) payload.slug = slugify(payload.title);
  const service = await Service.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!service) throw new ApiError(404, 'Service not found');
  res.status(200).json(new ApiResponse(200, formatService(service), 'Service updated'));
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  res.status(200).json(new ApiResponse(200, null, 'Service deleted'));
});

export const reorderServices = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) throw new ApiError(400, 'items array required');
  await Promise.all(items.map((item) => Service.findByIdAndUpdate(item.id, { order: item.order })));
  res.status(200).json(new ApiResponse(200, null, 'Services reordered'));
});
