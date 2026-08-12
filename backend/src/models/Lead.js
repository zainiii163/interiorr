import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const leadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      enum: ['villa', 'apartment', 'office', 'commercial', 'retail', 'other'],
      default: 'villa',
    },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    location: { type: String, trim: true },
    message: { type: String, trim: true },
    preferredContact: {
      type: String,
      enum: ['phone', 'email', 'whatsapp'],
      default: 'whatsapp',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'won', 'lost'],
      default: 'new',
    },
    source: { type: String, default: 'website' },
    leadType: {
      type: String,
      enum: ['contact', 'consultation'],
      default: 'consultation',
    },
    utmSource: { type: String, default: '' },
    utmMedium: { type: String, default: '' },
    utmCampaign: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: [noteSchema],
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);