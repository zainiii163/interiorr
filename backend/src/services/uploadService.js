import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig, isCloudinaryConfigured } from '../config/cloudinary.js';

const MAX_STUB_SIZE = 500 * 1024; // 500 KB — data URLs bloat the database

function ensureConfigured() {
  if (!isCloudinaryConfigured()) return false;
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
  });
  return true;
}

export async function uploadImageBuffer(buffer, { folder = 'interior', filename } = {}) {
  if (!ensureConfigured()) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        public_id: filename ? filename.replace(/\.[^.]+$/, '') : undefined,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export function toDataUrl(file) {
  if (file.buffer.length > MAX_STUB_SIZE) {
    throw new Error(
      `Image is too large (${Math.round(file.buffer.length / 1024)}KB) for local storage. ` +
      'Configure Cloudinary in backend/.env to upload larger images.'
    );
  }
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

export function getUploadMode() {
  return isCloudinaryConfigured() ? 'cloudinary' : 'local';
}
