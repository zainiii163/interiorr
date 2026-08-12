import mongoose from 'mongoose';
import { env } from './env.js';

function maskUri(uri) {
  return uri.replace(/:([^@/]+)@/, ':****@');
}

export async function connectDB() {
  mongoose.set('strictQuery', true);

  const isLocalhost = /localhost|127\.0\.0\.1/.test(env.mongoUri);

  if (isLocalhost && env.nodeEnv === 'production') {
    throw new Error(
      'MONGODB_URI points to localhost in production. Set a MongoDB Atlas connection string in backend/.env'
    );
  }

  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log(`MongoDB connected: ${maskUri(env.mongoUri)}`);
  } catch (err) {
    if (isLocalhost) {
      console.error('\n--- MongoDB connection failed ---');
      console.error('Local MongoDB is not running on port 27017.');
      console.error('Fix: set MONGODB_URI in backend/.env to your MongoDB Atlas URI.');
      console.error('Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/interior_platform\n');
    }
    throw err;
  }

  try {
    const { User } = await import('../models/User.js');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty — running automatic seed...');
      const { seedData } = await import('../seed/seedHelper.js');
      await seedData();
    }
  } catch (seedErr) {
    console.warn('Auto-seed check failed:', seedErr.message);
  }
}
