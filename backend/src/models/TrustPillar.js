import mongoose from 'mongoose';

const trustPillarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Shield' },
    section: { type: String, enum: ['expertise', 'promise'], default: 'promise' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TrustPillar = mongoose.model('TrustPillar', trustPillarSchema);