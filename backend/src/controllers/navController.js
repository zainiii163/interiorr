import { NavItem } from '../models/NavItem.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listNavItems = asyncHandler(async (req, res) => {
  const filter = {};
  if (!req.user) filter.isActive = true;
  if (req.query.placement) filter.placement = req.query.placement;

  const items = await NavItem.find(filter).sort({ order: 1, createdAt: 1 });
  res.status(200).json(new ApiResponse(200, items));
});

export const createNavItem = asyncHandler(async (req, res) => {
  const item = await NavItem.create(req.body);
  res.status(201).json(new ApiResponse(201, item, 'Navigation link created'));
});

export const updateNavItem = asyncHandler(async (req, res) => {
  const item = await NavItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new ApiError(404, 'Navigation link not found');
  res.status(200).json(new ApiResponse(200, item, 'Navigation link updated'));
});

export const deleteNavItem = asyncHandler(async (req, res) => {
  const item = await NavItem.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Navigation link not found');
  res.status(200).json(new ApiResponse(200, null, 'Navigation link deleted'));
});
