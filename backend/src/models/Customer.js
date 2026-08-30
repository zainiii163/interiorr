import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    isActive: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    verifyToken: { type: String, select: false },
    verifyTokenExpires: { type: Date, select: false },
    membership: {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', default: null },
      status: {
        type: String,
        enum: ['none', 'active', 'expired', 'cancelled'],
        default: 'none',
      },
      startedAt: { type: Date },
      expiresAt: { type: Date },
    },
    refreshToken: { type: String, select: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

customerSchema.pre('save', async function hashPassword(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

customerSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const Customer = mongoose.model('Customer', customerSchema);
