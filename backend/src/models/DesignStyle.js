import mongoose from 'mongoose';

const designStyleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    traits: [{ type: String }],
    relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DesignStyle = mongoose.model('DesignStyle', designStyleSchema);