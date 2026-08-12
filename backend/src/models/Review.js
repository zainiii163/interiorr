import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true, trim: true },
    authorTitle: { type: String, default: 'Client' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    source: { type: String, enum: ['google', 'direct'], default: 'google' },
    externalUrl: { type: String, default: '' },
    googleReviewId: { type: String, sparse: true },
    authorPhoto: { type: String, default: '' },
    relativeTimeDescription: { type: String, default: '' },
    syncedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ isPublished: 1, isFeatured: 1 });

export const Review = mongoose.model('Review', reviewSchema);