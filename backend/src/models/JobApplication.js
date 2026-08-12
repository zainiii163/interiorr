import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    experience: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    coverLetter: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'interview', 'rejected', 'hired'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);