import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    tagline: { type: String, default: '' },
    price: { type: Number, required: true, default: 0 },
    billingInterval: {
      type: String,
      enum: ['one-time', 'monthly', 'yearly'],
      default: 'one-time',
    },
    features: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Membership = mongoose.model('Membership', membershipSchema);
