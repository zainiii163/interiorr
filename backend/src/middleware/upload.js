import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const mediaTypes = [...imageTypes, 'video/mp4', 'video/webm'];

function makeFilter(allowed) {
  return (req, file, cb) => {
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Invalid file type'), false);
    }
  };
}

export const upload = multer({
  storage,
  fileFilter: makeFilter(mediaTypes),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/** Image-only uploads (POST /uploads/image) */
export const uploadImage = multer({
  storage,
  fileFilter: makeFilter(imageTypes),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Resume / CV uploads (PDF / DOC / DOCX) */
export const uploadResume = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new ApiError(400, 'Resume must be PDF or Word document'), false);
  },
  limits: { fileSize: 8 * 1024 * 1024 },
});
