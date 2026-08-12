import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, default: '' },
    fullDescription: { type: String, default: '' },
    icon: { type: String, default: 'Hammer' },
    image: { type: String, default: '' },
    category: {
      type: String,
      enum: ['fitout', 'joinery', 'renovation', 'inspection', 'specialty'],
      default: 'renovation',
    },
    features: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model('Service', serviceSchema);