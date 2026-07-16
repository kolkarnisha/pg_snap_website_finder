/**
 * Auth Routes
 * ─────────────────────────────────────────────
 * POST /api/auth/register → Create owner account
 * POST /api/auth/login    → Login + receive JWT
 * GET  /api/auth/me       → Get current user (protected)
 */
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { register, login, getMe } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);

export default router;
