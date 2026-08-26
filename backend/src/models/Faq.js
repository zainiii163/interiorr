import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    page: {
      type: String,
      enum: ['commercial', 'home', 'consultation', 'general'],
      default: 'general',
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

faqSchema.index({ page: 1, order: 1 });

export const Faq = mongoose.model('Faq', faqSchema);
