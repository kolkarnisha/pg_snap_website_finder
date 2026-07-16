/**
 * Multer + Cloudinary Upload Middleware
 * ----------------------------------------
 * Provides two multer instances:
 *  - uploadSingle : for mainPhoto (single file)
 *  - uploadGallery: for galleryPhotos (up to 8 files)
 *
 * Files are uploaded directly to Cloudinary via
 * multer-storage-cloudinary and the resulting URL
 * is attached to req.file.path (or req.files[].path).
 */
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// ── Cloudinary storage for main photo ────────────────
const mainPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pg-finder/main-photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

// ── Cloudinary storage for gallery photos ────────────
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pg-finder/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

// ── File filter — images only ─────────────────────────
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const uploadSingle = multer({
  storage: mainPhotoStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('mainPhoto');

export const uploadGallery = multer({
  storage: galleryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('galleryPhotos', 8);

/**
 * Combined middleware — handles both uploads in one form submission.
 * Wraps each multer instance in a promise to allow sequential async.
 */
export const uploadPGMedia = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) return next(err);
    uploadGallery(req, res, (err2) => {
      if (err2) return next(err2);
      next();
    });
  });
};
