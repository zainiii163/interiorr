import mongoose from 'mongoose';

const jobOpeningSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, default: 'Full Time' },
    location: { type: String, default: 'Dubai, UAE' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const JobOpening = mongoose.model('JobOpening', jobOpeningSchema);
