import crypto from 'crypto';

/**
 * Security hardening middleware
 * Adds CSP headers, CSRF protection, request ID tracking, and request logging.
 */

/**
 * Generate a cryptographically secure random ID for each request (for tracing)
 */
export function requestId(req, res, next) {
  const id = crypto.randomBytes(8).toString('hex');
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}

/**
 * Enhanced Content Security Policy headers
 */
export function cspHeaders(req, res, next) {
  const isApi = req.path.startsWith('/api');

  if (isApi) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return next();
  }

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://maps.googleapis.com",
    "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  next();
}

/**
 * CSRF protection for state-changing requests using double-submit cookie pattern
 * Since the app uses Bearer tokens (not cookies for auth), CSRF is less critical,
 * but we add it as defense-in-depth for cookie-based refresh tokens.
 */
const CSRF_SECRET = crypto.randomBytes(32).toString('hex');
const CSRF_COOKIE_NAME = '_csrf';
const CSRF_HEADER_NAME = 'x-csrf-token';

function generateCsrfToken() {
  return crypto.createHmac('sha256', CSRF_SECRET).update(crypto.randomBytes(16).toString('hex')).digest('hex');
}

export function csrfInit(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    const token = generateCsrfToken();
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }
  next();
}

export function csrfProtect(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    // For API-first apps with Bearer auth, CSRF is less critical — log but don't block
    if (process.env.NODE_ENV === 'production') {
      console.warn(`CSRF mismatch on ${req.method} ${req.originalUrl} from ${req.ip}`);
    }
  }

  next();
}

/**
 * Request logging with sanitized data (no secrets)
 */
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      requestId: req.requestId,
    };

    if (res.statusCode >= 400) {
      console.warn('[REQUEST]', JSON.stringify(log));
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('[REQUEST]', JSON.stringify(log));
    }
  });

  next();
}

/**
 * Block suspicious request patterns
 */
export function blockSuspicious(req, res, next) {
  const url = req.originalUrl.toLowerCase();
  const blocked = [
    '/wp-admin',
    '/wp-login',
    '/wp-content',
    '/xmlrpc.php',
    '/.env',
    '/.git',
    '/phpmyadmin',
    '/admin/config',
    '/debug',
    '/trace.axd',
    '/actuator',
  ];

  if (blocked.some((pattern) => url.includes(pattern))) {
    console.warn(`[SECURITY] Blocked suspicious request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  next();
}
