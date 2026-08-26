import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { handleStripeWebhook } from './controllers/paymentController.js';
import { sanitizeBody, deepSanitize } from './middleware/validate.js';
import { requestId, cspHeaders, blockSuspicious, requestLogger } from './middleware/security.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Trust proxy (needed behind Vercel/proxies for real client IPs)
app.set('trust proxy', 1);

// Request ID and logging
app.use(requestId);
app.use(requestLogger);

// Block known attack patterns
app.use(blockSuspicious);

// Helmet — strict CSP + security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // We handle CSP ourselves
    crossOriginEmbedderPolicy: false, // Needed for cross-origin assets
  })
);

// Custom CSP and extra security headers
app.use(cspHeaders);

// CORS — strict origin validation
const allowedOrigins = env.frontendUrl === 'same-origin'
  ? []
  : [env.frontendUrl, 'http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.frontendUrl === 'same-origin') return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Access-Code', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86400,
  })
);

// Stripe webhook needs raw body — must be registered before express.json()
app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json', limit: '1mb' }),
  handleStripeWebhook
);

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Cookie parser
app.use(cookieParser());

// NoSQL injection protection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[SECURITY] Blocked NoSQL injection attempt on ${req.method} ${req.originalUrl}: ${key}`);
    }
  },
}));

// Sanitize all request bodies
app.use(sanitizeBody);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: '1d',
  etag: true,
}));

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
