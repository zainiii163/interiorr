import { ApiError } from '../utils/ApiError.js';

/**
 * Input validation & sanitization middleware
 * Validates and cleans request bodies to prevent injection, XSS, and malformed data.
 */

// Maximum string lengths for common fields
const LIMITS = {
  name: 100,
  email: 254,
  phone: 20,
  password: 128,
  title: 200,
  description: 5000,
  message: 2000,
  url: 2048,
  slug: 200,
  shortText: 500,
  code: 50,
};

// Allowed enum values
const ENUMS = {
  propertyType: ['villa', 'apartment', 'penthouse', 'office', 'commercial', 'warehouse', 'retail', 'other'],
  leadStatus: ['new', 'contacted', 'quoted', 'won', 'lost'],
  quoteStatus: ['draft', 'sent', 'accepted', 'rejected'],
  paymentStatus: ['unpaid', 'pending', 'paid', 'failed'],
  preferredContact: ['whatsapp', 'phone', 'email'],
  role: ['admin', 'manager', 'editor'],
  userStatus: ['active', 'inactive'],
  materialCategory: ['flooring', 'marble', 'tiles', 'fixtures', 'other'],
  mediaType: ['video', 'image'],
  mediaPlacement: ['home', 'about', 'global'],
  jobType: ['full-time', 'part-time', 'contract'],
  appStatus: ['new', 'reviewing', 'interview', 'rejected', 'hired'],
};

/**
 * Strip dangerous HTML/script tags from strings
 */
function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, true)
    .replace(/<embed\b[^<]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Escape regex special characters to prevent ReDoS
 */
function escapeRegex(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone format (international)
 */
function isValidPhone(phone) {
  return /^\+?[\d\s\-()]{7,20}$/.test(phone);
}

/**
 * Validate URL format
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate ObjectId format
 */
function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (password.length > 128) errors.push('Maximum 128 characters');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/\d/.test(password)) errors.push('At least one number');
  return errors;
}

/**
 * Deep sanitize an object - strip HTML, trim strings, limit lengths
 */
function deepSanitize(obj, maxDepth = 5) {
  if (maxDepth <= 0) return obj;
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return stripHtml(obj).substring(0, 10000);
  }

  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.slice(0, 100).map((item) => deepSanitize(item, maxDepth - 1));
  }

  const clean = {};
  const keys = Object.keys(obj).slice(0, 50);
  for (const key of keys) {
    if (key.startsWith('$') || key.startsWith('_')) continue;
    clean[key] = deepSanitize(obj[key], maxDepth - 1);
  }
  return clean;
}

/**
 * Middleware: Sanitize body - strip HTML, remove dangerous keys
 */
export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }
  next();
}

/**
 * Middleware: Validate required fields in body
 */
export function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => {
      const val = req.body[f];
      return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
    });
    if (missing.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
    }
    next();
  };
}

/**
 * Middleware factory: Validate specific fields with rules
 */
export function validate(rules) {
  return (req, res, next) => {
    const errors = [];
    const body = req.body || {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = body[field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value === undefined || value === null || value === '') continue;

      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`);
        continue;
      }

      if (rule.type === 'number' && typeof value !== 'number' && isNaN(Number(value))) {
        errors.push(`${field} must be a number`);
        continue;
      }

      if (rule.type === 'email' && !isValidEmail(String(value))) {
        errors.push(`${field} must be a valid email`);
      }

      if (rule.type === 'phone' && !isValidPhone(String(value))) {
        errors.push(`${field} must be a valid phone number`);
      }

      if (rule.type === 'url' && !isValidUrl(String(value))) {
        errors.push(`${field} must be a valid URL`);
      }

      if (rule.type === 'objectId' && !isValidObjectId(String(value))) {
        errors.push(`${field} must be a valid ID`);
      }

      if (rule.minLength && String(value).length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }

      if (rule.maxLength && String(value).length > rule.maxLength) {
        errors.push(`${field} must be at most ${rule.maxLength} characters`);
      }

      if (rule.enum && !rule.enum.includes(String(value).toLowerCase())) {
        errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
      }

      if (rule.isArray && !Array.isArray(value)) {
        errors.push(`${field} must be an array`);
      }
    }

    if (errors.length > 0) {
      throw new ApiError(400, errors.join('; '));
    }
    next();
  };
}

/**
 * Predefined validation sets for common endpoints
 */
export const validateLead = validate({
  fullName: { required: true, type: 'string', maxLength: LIMITS.name },
  email: { required: true, type: 'email', maxLength: LIMITS.email },
  phone: { required: true, type: 'phone', maxLength: LIMITS.phone },
  propertyType: { type: 'enum', enum: ENUMS.propertyType },
  message: { type: 'string', maxLength: LIMITS.message },
  location: { type: 'string', maxLength: LIMITS.shortText },
  preferredContact: { type: 'enum', enum: ENUMS.preferredContact },
  source: { type: 'string', maxLength: LIMITS.shortText },
});

export const validateLogin = validate({
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 1 },
});

export const validateUserCreate = validate({
  name: { required: true, type: 'string', maxLength: LIMITS.name },
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 8, maxLength: LIMITS.password },
  role: { type: 'enum', enum: ENUMS.role },
});

export const validateQuote = validate({
  lead: { required: true, type: 'objectId' },
  lineItems: { type: 'isArray' },
  tax: { type: 'number' },
  discount: { type: 'number' },
});

export const validateJobApplication = validate({
  fullName: { required: true, type: 'string', maxLength: LIMITS.name },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'phone' },
  position: { required: true, type: 'string', maxLength: LIMITS.title },
});

export const validateReview = validate({
  authorName: { required: true, type: 'string', maxLength: LIMITS.name },
  rating: { required: true, type: 'number' },
  content: { type: 'string', maxLength: LIMITS.description },
});

export const validateDesignStyle = validate({
  name: { required: true, type: 'string', maxLength: LIMITS.title },
});

export const validateService = validate({
  title: { required: true, type: 'string', maxLength: LIMITS.title },
  shortDescription: { type: 'string', maxLength: LIMITS.description },
  fullDescription: { type: 'string', maxLength: 10000 },
});

export const validateProject = validate({
  title: { required: true, type: 'string', maxLength: LIMITS.title },
  category: { type: 'string', maxLength: 50 },
});

export const validatePayment = validate({
  quoteId: { required: true, type: 'objectId' },
  accessCode: { type: 'string', maxLength: LIMITS.code },
});

export const validatePortalAccess = validate({
  accessCode: { required: true, type: 'string', minLength: 4, maxLength: LIMITS.code },
});

export {
  LIMITS,
  ENUMS,
  stripHtml,
  escapeRegex,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidObjectId,
  validatePasswordStrength,
  deepSanitize,
};
