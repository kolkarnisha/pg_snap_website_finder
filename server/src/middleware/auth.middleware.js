/**
 * JWT Authentication Middleware
 * --------------------------------
 * Verifies the Bearer token from the Authorization header.
 * On success, populates req.user with the decoded payload.
 * Usage: add `protect` to any route that requires auth.
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorised — no token' });
    }
    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user (minus password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    // 4. Attach to request — controllers use req.user._id as ownerId
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired — please log in again' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
