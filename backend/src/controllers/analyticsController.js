import { Quote } from '../models/Quote.js';
import { Lead } from '../models/Lead.js';
import { Project } from '../models/Project.js';
import { Review } from '../models/Review.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { SiteSetting } from '../models/SiteSetting.js';

function inLastNMonths(date, monthsBack) {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);
  return d >= start && d <= now;
}

export const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const [quotes, leads, projects, reviews, settings] = await Promise.all([
    Quote.find().populate('lead', 'fullName email status'),
    Lead.find(),
    Project.find(),
    Review.find(),
    SiteSetting.findOne().select('googleApiKey googlePlaceId lastGoogleSyncAt autoSyncGoogleReviews'),
  ]);

  const totalPaidRevenue = quotes
    .filter((q) => q.paymentStatus === 'paid' || q.status === 'accepted')
    .reduce((acc, q) => acc + (q.grandTotal || 0), 0);

  const pendingPipelineValue = quotes
    .filter((q) => q.status === 'sent' || q.status === 'draft')
    .reduce((acc, q) => acc + (q.grandTotal || 0), 0);

  const averageQuoteValue =
    quotes.length > 0
      ? Math.round(quotes.reduce((acc, q) => acc + (q.grandTotal || 0), 0) / quotes.length)
      : 0;

  const funnel = {
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    quoted: leads.filter((l) => l.status === 'quoted').length,
    won: leads.filter((l) => l.status === 'won').length,
    lost: leads.filter((l) => l.status === 'lost').length,
    total: leads.length,
  };

  const winRate = funnel.total > 0 ? Math.round((funnel.won / funnel.total) * 100) : 0;
  const quoteToWinRate =
    funnel.quoted + funnel.won > 0
      ? Math.round((funnel.won / (funnel.quoted + funnel.won)) * 100)
      : 0;

  const propertyTypes = {};
  leads.forEach((l) => {
    const type = l.propertyType || 'villa';
    propertyTypes[type] = (propertyTypes[type] || 0) + 1;
  });

  const googleReviews = reviews.filter((r) => r.source === 'google');
  const directReviews = reviews.filter((r) => r.source === 'direct');
  const averageRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const monthlyData = [];

  for (let i = 5; i >= 0; i--) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const name = `${monthNames[month]} ${String(year).slice(2)}`;

    const inMonth = (d) => {
      const dt = new Date(d);
      return dt.getFullYear() === year && dt.getMonth() === month;
    };

    const monthLeads = leads.filter((l) => inMonth(l.createdAt)).length;
    const monthQuotes = quotes.filter((q) => inMonth(q.createdAt));
    const monthRevenue = monthQuotes
      .filter((q) => q.status === 'accepted' || q.paymentStatus === 'paid')
      .reduce((acc, q) => acc + (q.grandTotal || 0), 0);

    monthlyData.push({
      month: name,
      leadsCount: monthLeads,
      quotesCount: monthQuotes.length,
      revenueAED: monthRevenue,
    });
  }

  const quoteStatusCounts = {
    draft: quotes.filter((q) => q.status === 'draft').length,
    sent: quotes.filter((q) => q.status === 'sent').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length,
    rejected: quotes.filter((q) => q.status === 'rejected').length,
  };

  const hasGoogleKey = Boolean(
    (settings?.googleApiKey && String(settings.googleApiKey).trim()) ||
      env.google.placesApiKey
  );
  const hasPlaceId = Boolean(
    (settings?.googlePlaceId && String(settings.googlePlaceId).trim()) || env.google.placeId
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        revenue: {
          totalPaidAED: totalPaidRevenue,
          pendingPipelineAED: pendingPipelineValue,
          averageQuoteAED: averageQuoteValue,
          totalQuotes: quotes.length,
        },
        funnel: {
          ...funnel,
          winRate,
          quoteToWinRate,
        },
        propertyTypes,
        reviews: {
          totalReviews: reviews.length,
          googleCount: googleReviews.length,
          directCount: directReviews.length,
          averageRating,
        },
        quoteStatusCounts,
        monthlyData,
        projectsSummary: {
          published: projects.filter((p) => p.isPublished).length,
          total: projects.length,
        },
        integrations: {
          googleConfigured: hasGoogleKey && hasPlaceId,
          autoSyncEnabled: settings?.autoSyncGoogleReviews !== false,
          lastGoogleSyncAt: settings?.lastGoogleSyncAt || null,
          stripeConfigured: Boolean(env.stripe.secretKey),
        },
        rangeNote: 'Monthly series covers the last 6 calendar months (real counts only).',
        recentActivityWindow: {
          leadsLast6Months: leads.filter((l) => inLastNMonths(l.createdAt, 6)).length,
          quotesLast6Months: quotes.filter((q) => inLastNMonths(q.createdAt, 6)).length,
        },
      },
      'Analytics summary retrieved successfully'
    )
  );
});
