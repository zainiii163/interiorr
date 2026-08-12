import { env } from './env.js';

/**
 * Cloudinary integration — configure env vars to enable.
 * Upload flow: controller → uploadService → Cloudinary → return secure_url
 */
export function isCloudinaryConfigured() {
  return Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);
}

export const cloudinaryConfig = env.cloudinary;