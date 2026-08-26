import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const DEFAULT_ACCESS = 'dev_access_secret_change_me';
const DEFAULT_REFRESH = 'dev_refresh_secret_change_me';

function generateSecureSecret() {
  return crypto.randomBytes(48).toString('base64');
}

function isWeakSecret(secret) {
  if (!secret) return true;
  if (secret === DEFAULT_ACCESS || secret === DEFAULT_REFRESH) return true;
  if (secret.length < 32) return true;
  const lower = secret.toLowerCase();
  const weak = ['password', 'secret', 'test', 'demo', 'example', 'changeme', 'default', '12345'];
  return weak.some((w) => lower.includes(w));
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/interior_platform',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || DEFAULT_ACCESS,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || DEFAULT_REFRESH,
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
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
  if (env.nodeEnv !== 'production') {
    if (isWeakSecret(env.jwtAccessSecret) || isWeakSecret(env.jwtRefreshSecret)) {
      console.warn('\n[SECURITY] JWT secrets are weak/missing. Auto-generating secure secrets for this session.');
      console.warn('[SECURITY] Set strong JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in backend/.env\n');
      if (isWeakSecret(env.jwtAccessSecret)) env.jwtAccessSecret = generateSecureSecret();
      if (isWeakSecret(env.jwtRefreshSecret)) env.jwtRefreshSecret = generateSecureSecret();
    }
    return;
  }

  if (isWeakSecret(env.jwtAccessSecret) || isWeakSecret(env.jwtRefreshSecret)) {
    throw new Error(
      'Production requires strong JWT_ACCESS_SECRET and JWT_REFRESH_SECRET (min 32 chars, no common words). ' +
      'Run: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64\'))"'
    );
  }

  if (env.frontendUrl === 'http://localhost:5173') {
    console.warn('[SECURITY] FRONTEND_URL is still localhost in production. Set it to your deployed URL.');
  }

  if (!env.smtp.user || !env.smtp.pass) {
    console.warn('[CONFIG] SMTP not configured — email notifications will be skipped.');
  }

  if (!env.stripe.secretKey) {
    console.warn('[CONFIG] Stripe not configured — payments will run in sandbox mode.');
  }

  if (!env.cloudinary.cloudName) {
    console.warn('[CONFIG] Cloudinary not configured — uploads will use local storage.');
  }
}
