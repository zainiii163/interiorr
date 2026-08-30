import { Membership } from '../models/Membership.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listMemberships = asyncHandler(async (req, res) => {
  const memberships = await Membership.find({ isActive: true }).sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, memberships));
});

export const getMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.findById(req.params.id);
  if (!membership) throw new ApiError(404, 'Membership not found');
  res.status(200).json(new ApiResponse(200, membership));
});

export const createMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.create(req.body);
  res.status(201).json(new ApiResponse(201, membership, 'Membership created'));
});

export const updateMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!membership) throw new ApiError(404, 'Membership not found');
  res.status(200).json(new ApiResponse(200, membership, 'Membership updated'));
});

export const deleteMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.findByIdAndDelete(req.params.id);
  if (!membership) throw new ApiError(404, 'Membership not found');
  res.status(200).json(new ApiResponse(200, null, 'Membership deleted'));
});
