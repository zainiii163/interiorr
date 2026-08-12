import { JobApplication } from '../models/JobApplication.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendJobApplicationAlert } from '../services/emailService.js';

const STATUS_TO_FRONTEND = {
  new: 'New',
  reviewing: 'Reviewing',
  interview: 'Interview',
  rejected: 'Rejected',
  hired: 'Hired',
};

const STATUS_FROM_FRONTEND = Object.fromEntries(
  Object.entries(STATUS_TO_FRONTEND).map(([k, v]) => [v, k])
);

function formatApplication(app) {
  const obj = app.toObject ? app.toObject() : { ...app };
  return { ...obj, status: STATUS_TO_FRONTEND[obj.status] || obj.status };
}

export const createApplication = asyncHandler(async (req, res) => {
  const { fullName, email, phone, position, experience, resumeUrl, coverLetter } = req.body;

  if (!fullName || !email || !phone || !position) {
    throw new ApiError(400, 'Full name, email, phone, and position are required');
  }

  const application = await JobApplication.create({
    fullName,
    email,
    phone,
    position,
    experience,
    resumeUrl,
    coverLetter,
  });

  sendJobApplicationAlert(application).catch(console.error);

  res.status(201).json(new ApiResponse(201, formatApplication(application), 'Application submitted'));
});

export const listApplications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) {
    filter.status = STATUS_FROM_FRONTEND[req.query.status] || req.query.status.toLowerCase();
  }
  const applications = await JobApplication.find(filter).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, applications.map(formatApplication)));
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  res.status(200).json(new ApiResponse(200, formatApplication(application)));
});

export const updateApplication = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.status && STATUS_FROM_FRONTEND[payload.status]) {
    payload.status = STATUS_FROM_FRONTEND[payload.status];
  }
  const application = await JobApplication.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!application) throw new ApiError(404, 'Application not found');
  res.status(200).json(new ApiResponse(200, formatApplication(application), 'Application updated'));
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await JobApplication.findByIdAndDelete(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  res.status(200).json(new ApiResponse(200, null, 'Application deleted'));
});
