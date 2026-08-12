import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    category: { type: String, default: 'labour' },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'unit' },
    unitPrice: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const quoteSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    quoteNumber: { type: String, unique: true },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    currency: { type: String, default: 'AED' },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected'],
      default: 'draft',
    },
    validUntil: { type: Date },
    notes: { type: String, default: '' },
    accessCode: { type: String, unique: true, sparse: true },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending', 'paid', 'failed'],
      default: 'unpaid',
    },
    stripeCheckoutSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    acceptedAt: { type: Date },
    paidAt: { type: Date },
    rejectionReason: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Quote = mongoose.model('Quote', quoteSchema);