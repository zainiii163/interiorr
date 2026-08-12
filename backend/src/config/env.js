import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const DEFAULT_ACCESS = 'dev_access_secret_change_me';
const DEFAULT_REFRESH = 'dev_refresh_secret_change_me';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/interior_platform',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || DEFAULT_ACCESS,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || DEFAULT_REFRESH,
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  // Use FRONTEND_URL=same-origin when API and SPA share one Vercel deployment
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@interior.com',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  google: {
    placesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
    placeId: process.env.GOOGLE_PLACE_ID || '',
  },
};

export function assertProductionSecrets() {
  if (env.nodeEnv !== 'production') return;
  if (
    env.jwtAccessSecret === DEFAULT_ACCESS ||
    env.jwtRefreshSecret === DEFAULT_REFRESH ||
    env.jwtAccessSecret.length < 32 ||
    env.jwtRefreshSecret.length < 32
  ) {
    throw new Error(
      'Production requires strong JWT_ACCESS_SECRET and JWT_REFRESH_SECRET (min 32 chars, not defaults)'
    );
  }
}
