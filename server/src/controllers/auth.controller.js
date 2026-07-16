/**
 * Auth Controller
 * ─────────────────────────────────────────────
 * Handles owner registration and login.
 * Returns a signed JWT on success.
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

// ── Sign JWT ──────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ── REGISTER ──────────────────────────────────────────
// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone, role: 'owner' });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Owner account created',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ── LOGIN ─────────────────────────────────────────────
// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ── GET PROFILE ───────────────────────────────────────
// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
