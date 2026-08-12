import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    category: {
      type: String,
      enum: ['flooring', 'marble', 'tiles', 'fixtures', 'other'],
      required: true,
    },
    subcategory: { type: String, default: '' },
    description: { type: String, default: '' },
    images: [{ type: String }],
    specifications: {
      type: Object,
      default: {},
    },
    pricePerUnit: { type: Number, default: 0 },
    unit: { type: String, default: 'sqm' },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

materialSchema.index({ category: 1, isActive: 1 });

export const Material = mongoose.model('Material', materialSchema);
