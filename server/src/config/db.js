/**
 * MongoDB connection via Mongoose.
 * Uses MONGO_URI from .env
 */
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern Mongoose doesn't need these flags, but explicit for clarity
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
