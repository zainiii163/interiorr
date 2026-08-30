import { Quote } from '../models/Quote.js';
import { Project } from '../models/Project.js';
import { Lead } from '../models/Lead.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatQuote } from '../utils/legacyFormat.js';
import crypto from 'crypto';

// Helper to ensure quote has an accessCode
export const ensureQuoteAccessCode = (quote) => {
  if (!quote.accessCode) {
    quote.accessCode = 'P-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  return quote;
};

// Default timeline milestones generator
const getDefaultTimeline = (quoteNumber) => [
  {
    title: 'Design Approval & Scope Lock',
    description: 'Finalizing interior layout, 3D renderings, material samples, and scope approval.',
    status: 'completed',
    progressPercentage: 100,
    completedDate: new Date(),
    notes: 'Approved by client upon quote confirmation.',
  },
  {
    title: 'Regulatory Approvals & Permits',
    description: 'Submitting plans to Dubai Municipality, DDA, or Civil Defence for permits.',
    status: 'in_progress',
    progressPercentage: 60,
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notes: 'Documentation submitted; awaiting final NOC.',
  },
  {
    title: 'Demolition & Civil Site Prep',
    description: 'Clearing site, partitions demolition, electrical cabling, and MEP rough-ins.',
    status: 'pending',
    progressPercentage: 0,
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    notes: 'Scheduled after permit issuance.',
  },
  {
    title: 'Custom Joinery & Fit-out',
    description: 'Factory manufacturing of custom cabinetry, wall panels, flooring & ceiling fit-out.',
    status: 'pending',
    progressPercentage: 0,
    targetDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    notes: 'Materials ordered from Italian partners.',
  },
  {
    title: 'Quality Audit & Snagging',
    description: 'Comprehensive inspection, deep cleaning, paint retouching, and snagging list.',
    status: 'pending',
    progressPercentage: 0,
    targetDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    notes: 'Internal snagging audit before client walkthrough.',
  },
  {
    title: 'Handover & Key Delivery',
    description: 'Final walkthrough with client, sign-off certification, and handover.',
    status: 'pending',
    progressPercentage: 0,
    targetDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    notes: 'Key delivery and warranty package.',
  },
];

// Get Client Portal data by access code only (never bare Mongo ObjectId)
export const getClientPortalData = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code || code.trim().length < 4) {
    throw new ApiError(400, 'Access code is required');
  }

  // Reject pure ObjectId lookups — portal links must use accessCode / quoteNumber
  if (/^[0-9a-fA-F]{24}$/.test(code)) {
    throw new ApiError(404, 'Quote not found or invalid client access link');
  }

  let quote = await Quote.findOne({
    $or: [{ accessCode: code }, { quoteNumber: code }],
  }).populate({
    path: 'lead',
    select: 'fullName email phone propertyType service location',
    populate: { path: 'service', select: 'title' },
  });

  if (!quote) {
    throw new ApiError(404, 'Quote not found or invalid client access link');
  }

  // Ensure access code exists
  if (!quote.accessCode) {
    ensureQuoteAccessCode(quote);
    await quote.save();
  }

  // Find or create project timeline
  let project = await Project.findOne({
    $or: [{ quote: quote._id }, { clientEmail: quote.lead?.email }],
  });

  if (!project) {
    // Create interactive project representation for portal view
    const title = quote.lead
      ? `${quote.lead.fullName}'s ${quote.lead.propertyType || 'Interior'} Renovation`
      : `Interior Project (${quote.quoteNumber})`;

    project = new Project({
      title,
      slug: `project-${quote.quoteNumber.toLowerCase()}`,
      category: quote.lead?.propertyType === 'office' || quote.lead?.propertyType === 'commercial' ? 'commercial' : 'residential',
      clientEmail: quote.lead?.email || '',
      quote: quote._id,
      timeline: getDefaultTimeline(quote.quoteNumber),
      isPublished: false,
    });
    await project.save();
  } else if (!project.timeline || project.timeline.length === 0) {
    project.timeline = getDefaultTimeline(quote.quoteNumber);
    await project.save();
  }

  // Calculate overall timeline progress
  const totalMilestones = project.timeline.length;
  const completedMilestones = project.timeline.filter((m) => m.status === 'completed').length;
  const overallProgress = totalMilestones > 0
    ? Math.round(
        project.timeline.reduce((acc, m) => acc + (m.progressPercentage || (m.status === 'completed' ? 100 : m.status === 'in_progress' ? 50 : 0)), 0) / totalMilestones
      )
    : 0;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        quote: formatQuote(quote),
        project: {
          id: project._id,
          title: project.title,
          category: project.category,
          timeline: project.timeline,
          overallProgress,
          completedMilestones,
          totalMilestones,
        },
      },
      'Client portal details retrieved successfully'
    )
  );
});

function requireAccessCode(quote, accessCode) {
  if (!accessCode || String(accessCode).trim() !== String(quote.accessCode || '').trim()) {
    throw new ApiError(403, 'Valid client access code is required');
  }
}

// Accept quote via Client Portal
export const acceptQuote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { accessCode } = req.body;

  const quote = await Quote.findById(id).populate('lead');
  if (!quote) throw new ApiError(404, 'Quote not found');
  requireAccessCode(quote, accessCode);

  quote.status = 'accepted';
  quote.acceptedAt = new Date();
  await quote.save();

  if (quote.lead) {
    await Lead.findByIdAndUpdate(quote.lead._id, { status: 'won' });
  }

  res.status(200).json(new ApiResponse(200, formatQuote(quote), 'Quote accepted successfully'));
});

// Reject quote via Client Portal
export const rejectQuote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason, accessCode } = req.body;

  const quote = await Quote.findById(id);
  if (!quote) throw new ApiError(404, 'Quote not found');
  requireAccessCode(quote, accessCode);

  quote.status = 'rejected';
  quote.rejectionReason = reason || 'Client opted not to proceed';
  await quote.save();

  res.status(200).json(new ApiResponse(200, formatQuote(quote), 'Quote rejection recorded'));
});

// Admin: Update project timeline
export const updateProjectTimeline = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { timeline } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');

  if (!Array.isArray(timeline)) throw new ApiError(400, 'timeline must be an array');
  project.timeline = timeline;
  await project.save();

  res.status(200).json(new ApiResponse(200, project.timeline, 'Project timeline updated successfully'));
});
