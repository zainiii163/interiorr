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
  return uploadBuffer(buffer, { folder, filename, resourceType: 'image' });
}

export async function uploadBuffer(buffer, { folder = 'interior', filename, resourceType = 'image' } = {}) {
  if (!ensureConfigured()) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
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

export async function uploadRawBuffer(buffer, { folder = 'interior/resumes', filename, mimetype } = {}) {
  if (!ensureConfigured()) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'raw',
        public_id: filename ? filename.replace(/\.[^.]+$/, '') : undefined,
        format: mimetype === 'application/pdf' ? 'pdf' : undefined,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function saveResumeLocally(file) {
  const fs = await import('fs/promises');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dir = path.join(__dirname, '..', '..', 'uploads', 'resumes');
  await fs.mkdir(dir, { recursive: true });
  const safe = `${Date.now()}-${(file.originalname || 'resume').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const full = path.join(dir, safe);
  await fs.writeFile(full, file.buffer);
  return `/uploads/resumes/${safe}`;
}

export async function saveMediaLocally(file) {
  const fs = await import('fs/promises');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dir = path.join(__dirname, '..', '..', 'uploads', 'media');
  await fs.mkdir(dir, { recursive: true });
  const safe = `${Date.now()}-${(file.originalname || 'media').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const full = path.join(dir, safe);
  await fs.writeFile(full, file.buffer);
  return `/uploads/media/${safe}`;
}

export function getUploadMode() {
  return isCloudinaryConfigured() ? 'cloudinary' : 'local';
}
