/**
 * PG Finder — Express Server Entry Point
 * ----------------------------------------
 * Bootstraps the Express app, connects to MongoDB,
 * registers middleware, and mounts all API routes.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import pgRoutes from './routes/pg.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health check ────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/pg', pgRoutes);

// ── 404 handler ─────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ── Start ────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 PG Finder server running on http://localhost:${PORT}`);
  });
});
