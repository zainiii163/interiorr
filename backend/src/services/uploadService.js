import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig, isCloudinaryConfigured } from '../config/cloudinary.js';

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
  if (!ensureConfigured()) {
    return null;
  }

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
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}
