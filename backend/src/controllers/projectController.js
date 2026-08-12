import { Project } from '../models/Project.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';
import { formatProject, parseProjectInput } from '../utils/legacyFormat.js';

export const listProjects = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 12);
  const filter = {};

  if (!req.user) filter.isPublished = true;
  if (req.query.category && req.query.category !== 'all') {
    filter.category = req.query.category.toLowerCase();
  }
  if (req.query.featured === 'true') filter.isFeatured = true;

  const [items, total] = await Promise.all([
    Project.find(filter)
      .populate('designStyle', 'name slug')
      .sort({ completedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, items.map(formatProject), 'Projects fetched', { page, limit, total })
  );
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const filter = { slug: req.params.slug };
  if (!req.user) filter.isPublished = true;
  const project = await Project.findOne(filter)
    .populate('serviceTypes', 'title slug')
    .populate('designStyle', 'name slug');
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json(new ApiResponse(200, formatProject(project)));
});

export const createProject = asyncHandler(async (req, res) => {
  const payload = parseProjectInput(req.body);
  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
  const project = await Project.create(payload);
  res.status(201).json(new ApiResponse(201, formatProject(project), 'Project created'));
});

export const updateProject = asyncHandler(async (req, res) => {
  const payload = parseProjectInput(req.body);
  if (payload.title && !payload.slug) payload.slug = slugify(payload.title);
  const project = await Project.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json(new ApiResponse(200, formatProject(project), 'Project updated'));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json(new ApiResponse(200, null, 'Project deleted'));
});
