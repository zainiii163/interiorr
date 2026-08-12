import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

import mongoose from 'mongoose';
import app from '../backend/src/app.js';

let isConnected = false;

async function ensureConnection() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });
  isConnected = true;
}

export default async function handler(req, res) {
  try {
    await ensureConnection();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }

  return app(req, res);
}
