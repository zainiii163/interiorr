import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB connected: ${env.mongoUri}`);
  } catch (err) {
    console.warn(`Local MongoDB not reachable. Starting in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri('interior_platform');
      await mongoose.connect(uri);
      console.log(`In-memory MongoDB ready & connected: ${uri}`);
    } catch (memErr) {
      console.error('Failed to connect to MongoMemoryServer fallback:', memErr);
      throw err;
    }
  }

  // Auto-seed demo data if database is empty
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