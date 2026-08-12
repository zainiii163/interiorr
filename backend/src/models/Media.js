import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['video', 'image'], default: 'image' },
    title: { type: String, default: '' },
    url: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    placement: { type: String, enum: ['home', 'about', 'global'], default: 'global' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Media = mongoose.model('Media', mediaSchema);