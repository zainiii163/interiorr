import mongoose from 'mongoose';

const trustPillarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    highlights: [{ type: String }],
    icon: { type: String, default: 'Shield' },
    section: { type: String, enum: ['expertise', 'promise', 'process'], default: 'promise' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TrustPillar = mongoose.model('TrustPillar', trustPillarSchema);