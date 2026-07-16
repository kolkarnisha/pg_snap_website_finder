/**
 * PG Mongoose Schema & Model
 * ---------------------------
 * Covers all fields specified in requirements:
 * Basic Details, Pricing, Capacity & Type,
 * Rules & Policies, Media & Description
 */
import mongoose from 'mongoose';

const pgSchema = new mongoose.Schema(
  {
    // ── Ownership ───────────────────────────────────
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true,
    },

    // ── A. Basic Details ────────────────────────────
    pgName: {
      type: String,
      required: [true, 'PG name is required'],
      trim: true,
      maxlength: [100, 'PG name must be at most 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location / full address is required'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Area / locality is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    googleMapsLink: { type: String, trim: true, default: '' },

    // ── B. Pricing ──────────────────────────────────
    rent: {
      type: Number,
      required: [true, 'Rent per month per bed is required'],
      min: [0, 'Rent cannot be negative'],
    },
    startingPrice: { type: Number, default: 0 },
    endingPrice: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },          // deposit / security
    maintenanceCharges: { type: Number, default: 0 }, // per month

    // ── C. Capacity & Type ──────────────────────────
    totalBeds: { type: Number, default: 0 },
    availability: {
      type: Number,
      default: 0,
      min: [0, 'Availability cannot be negative'],
      index: true,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', '4 Sharing', 'Dorm'],
      required: [true, 'Room type is required'],
    },
    furnishingType: {
      type: String,
      enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'],
      required: [true, 'Furnishing type is required'],
    },

    // ── D. Rules & Policies ─────────────────────────
    smokingAllowed:      { type: Boolean, default: false },
    drinkingAllowed:     { type: Boolean, default: false },
    petsAllowed:         { type: Boolean, default: false },
    noticePeriodToVacate: { type: Number, default: 30 }, // days

    // ── E. Media & Description ──────────────────────
    mainPhoto: {
      type: String,
      required: [true, 'Main photo (Cloudinary URL) is required'],
    },
    galleryPhotos: [{ type: String }],
    description: { type: String, default: '' },
    amenities: [{ type: String }],   // e.g. ["WiFi", "AC", "CCTV"]
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    versionKey: false,
  }
);

// Text index for full-text search on name / location / area
pgSchema.index({ pgName: 'text', location: 'text', area: 'text', city: 'text' });
// Compound index for common search queries
pgSchema.index({ city: 1, rent: 1, availability: 1 });

const PG = mongoose.model('PG', pgSchema);
export default PG;
