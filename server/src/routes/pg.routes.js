/**
 * PG Routes
 * ───────────────────────────────────────────────
 * POST   /api/pg            → Register PG (protected)
 * GET    /api/pg/search     → Search PGs (public)
 * GET    /api/pg/my         → Owner's PGs (protected)
 * GET    /api/pg/:id        → Single PG detail (public)
 * PUT    /api/pg/:id        → Update PG (protected)
 * DELETE /api/pg/:id        → Delete PG (protected)
 */
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { uploadPGMedia, uploadSingle } from '../middleware/upload.middleware.js';
import {
  registerPG,
  searchPGs,
  getMyPGs,
  getPGById,
  updatePG,
  deletePG,
} from '../controllers/pg.controller.js';

const router = Router();

// Public routes
router.get('/search', searchPGs);
router.get('/:id', getPGById);

// Protected routes
router.use(protect);                          // all routes below require JWT
router.post('/', uploadPGMedia, registerPG);
router.get('/my/listings', getMyPGs);
router.put('/:id', uploadPGMedia, updatePG);
router.delete('/:id', deletePG);

export default router;
