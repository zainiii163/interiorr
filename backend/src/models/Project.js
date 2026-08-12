import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

const timelineMilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  },
  progressPercentage: { type: Number, default: 0 },
  targetDate: { type: Date },
  completedDate: { type: Date },
  notes: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['residential', 'commercial', 'retail'],
      default: 'residential',
    },
    serviceTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    designStyle: { type: mongoose.Schema.Types.ObjectId, ref: 'DesignStyle' },
    location: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    gallery: [galleryItemSchema],
    beforeAfter: {
      before: { type: String, default: '' },
      after: { type: String, default: '' },
    },
    scope: { type: String, default: '' },
    duration: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    completedAt: { type: Date },
    isPublished: { type: Boolean, default: true },
    clientEmail: { type: String, lowercase: true, trim: true },
    quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
    timeline: [timelineMilestoneSchema],
  },
  { timestamps: true }
);

projectSchema.index({ category: 1, isPublished: 1 });

export const Project = mongoose.model('Project', projectSchema);