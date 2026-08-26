/**
 * Frontend security utilities
 * XSS prevention, input sanitization, and safe rendering
 */

/**
 * Escape HTML entities to prevent XSS when rendering user content
 */
export function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Sanitize a URL to prevent javascript: and data: URI attacks
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
  return trimmed;
}

/**
 * Sanitize user input for display - strip potential XSS
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone format (international)
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return /^\+?[\d\s\-()]{7,20}$/.test(phone);
}

/**
 * Truncate text safely
 */
export function truncate(str, maxLen = 100) {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + '...';
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
