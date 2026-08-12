import { JobOpening } from '../models/JobOpening.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listOpenings = asyncHandler(async (req, res) => {
  const filter = req.user ? {} : { isActive: true };
  const openings = await JobOpening.find(filter).sort({ order: 1, createdAt: -1 });
  res.status(200).json(new ApiResponse(200, openings));
});

export const createOpening = asyncHandler(async (req, res) => {
  const opening = await JobOpening.create(req.body);
  res.status(201).json(new ApiResponse(201, opening, 'Job opening created'));
});

export const updateOpening = asyncHandler(async (req, res) => {
  const opening = await JobOpening.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!opening) throw new ApiError(404, 'Job opening not found');
  res.status(200).json(new ApiResponse(200, opening, 'Job opening updated'));
});

export const deleteOpening = asyncHandler(async (req, res) => {
  const opening = await JobOpening.findByIdAndDelete(req.params.id);
  if (!opening) throw new ApiError(404, 'Job opening not found');
  res.status(200).json(new ApiResponse(200, null, 'Job opening deleted'));
});
