/**
 * PG Controller
 * ─────────────────────────────────────────────────────
 * Handles all CRUD operations + public search for PGs.
 *
 * Routes overview:
 *  POST   /api/pg            → registerPG   (protected)
 *  GET    /api/pg/search     → searchPGs    (public)
 *  GET    /api/pg/my         → getMyPGs     (protected)
 *  GET    /api/pg/:id        → getPGById    (public)
 *  PUT    /api/pg/:id        → updatePG     (protected, owner only)
 *  DELETE /api/pg/:id        → deletePG     (protected, owner only)
 */
import PG from '../models/PG.model.js';

// ──────────────────────────────────────────────────────
// HELPER — build field-level validation errors
// ──────────────────────────────────────────────────────
const validationError = (res, message) =>
  res.status(400).json({ success: false, message });

// ──────────────────────────────────────────────────────
// REGISTER PG
// POST /api/pg
// Access: Protected (owner)
// ──────────────────────────────────────────────────────
export const registerPG = async (req, res) => {
  try {
    const {
      pgName, location, area, city, state, pincode, googleMapsLink,
      rent, startingPrice, endingPrice, totalCost, maintenanceCharges,
      totalBeds, availability, roomType, furnishingType,
      smokingAllowed, drinkingAllowed, petsAllowed, noticePeriodToVacate,
      description, amenities,
      // galleryPhotos can come as JSON string array in multipart form
      galleryPhotos: galleryPhotosRaw,
    } = req.body;

    // ── Required field checks ──────────────────────────
    if (!pgName) return validationError(res, 'PG Name is required');
    if (!location) return validationError(res, 'Location is required');
    if (!area) return validationError(res, 'Area is required');
    if (!city) return validationError(res, 'City is required');
    if (!rent) return validationError(res, 'Rent is required');
    if (!roomType) return validationError(res, 'Room type is required');
    if (!furnishingType) return validationError(res, 'Furnishing type is required');

    // ── Main photo (from Cloudinary via multer) ─────────
    const mainPhoto = req.file ? req.file.path : req.body.mainPhoto;
    if (!mainPhoto) return validationError(res, 'Main photo is required');

    // ── Gallery photos ────────────────────────────────
    let galleryPhotos = [];
    if (req.files && req.files.length > 0) {
      galleryPhotos = req.files.map((f) => f.path);
    } else if (galleryPhotosRaw) {
      // Support JSON string sent from frontend
      try {
        galleryPhotos = JSON.parse(galleryPhotosRaw);
      } catch {
        galleryPhotos = Array.isArray(galleryPhotosRaw) ? galleryPhotosRaw : [galleryPhotosRaw];
      }
    }

    // ── Parse amenities ──────────────────────────────
    let parsedAmenities = [];
    if (amenities) {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch {
        parsedAmenities = Array.isArray(amenities) ? amenities : [amenities];
      }
    }

    const pg = await PG.create({
      ownerId: req.user._id,
      pgName: pgName.trim(),
      location: location.trim(),
      area: area.trim(),
      city: city.trim(),
      state: state?.trim() || '',
      pincode: pincode?.trim() || '',
      googleMapsLink: googleMapsLink?.trim() || '',
      rent: Number(rent),
      startingPrice: Number(startingPrice) || 0,
      endingPrice:   Number(endingPrice)   || 0,
      totalCost:     Number(totalCost)     || 0,
      maintenanceCharges: Number(maintenanceCharges) || 0,
      totalBeds:    Number(totalBeds)    || 0,
      availability: Number(availability) || 0,
      roomType,
      furnishingType,
      smokingAllowed:       smokingAllowed === 'true' || smokingAllowed === true,
      drinkingAllowed:      drinkingAllowed === 'true' || drinkingAllowed === true,
      petsAllowed:          petsAllowed === 'true' || petsAllowed === true,
      noticePeriodToVacate: Number(noticePeriodToVacate) || 30,
      mainPhoto,
      galleryPhotos,
      description: description?.trim() || '',
      amenities: parsedAmenities,
    });

    res.status(201).json({ success: true, message: 'PG registered successfully', data: pg });
  } catch (err) {
    console.error('registerPG error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: 'Server error while registering PG' });
  }
};

// ──────────────────────────────────────────────────────
// SEARCH PGs
// GET /api/pg/search
// Access: Public
// Query params: location, area, city, minPrice, maxPrice,
//   roomType, furnishingType, smokingAllowed, petsAllowed,
//   availability, page, limit, sort
// ──────────────────────────────────────────────────────
export const searchPGs = async (req, res) => {
  try {
    const {
      location, area, city,
      minPrice, maxPrice,
      roomType, furnishingType,
      smokingAllowed, petsAllowed,
      page = 1, limit = 9,
      sort = 'rent_asc',
    } = req.query;

    // ── Build filter object ─────────────────────────
    const filter = { availability: { $gt: 0 } }; // only show PGs with vacant beds

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (area)     filter.area     = { $regex: area, $options: 'i' };
    if (city)     filter.city     = { $regex: city, $options: 'i' };

    // Rent range
    if (minPrice || maxPrice) {
      filter.rent = {};
      if (minPrice) filter.rent.$gte = Number(minPrice);
      if (maxPrice) filter.rent.$lte = Number(maxPrice);
    }

    if (roomType)       filter.roomType       = roomType;
    if (furnishingType) filter.furnishingType = furnishingType;

    // Boolean filters (sent as string from query)
    if (smokingAllowed !== undefined) filter.smokingAllowed = smokingAllowed === 'true';
    if (petsAllowed    !== undefined) filter.petsAllowed    = petsAllowed    === 'true';

    // ── Sorting ────────────────────────────────────
    let sortObj = {};
    switch (sort) {
      case 'rent_asc':   sortObj = { rent: 1 };        break;
      case 'rent_desc':  sortObj = { rent: -1 };       break;
      case 'newest':     sortObj = { createdAt: -1 };  break;
      case 'avail_desc': sortObj = { availability: -1 }; break;
      default:           sortObj = { rent: 1 };
    }

    // ── Pagination ─────────────────────────────────
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [pgs, total] = await Promise.all([
      PG.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .select('-galleryPhotos -description -__v'), // lean list view
      PG.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: pgs,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error('searchPGs error:', err);
    res.status(500).json({ success: false, message: 'Server error during search' });
  }
};

// ──────────────────────────────────────────────────────
// GET ALL PGs FOR THE LOGGED-IN OWNER
// GET /api/pg/my
// Access: Protected
// ──────────────────────────────────────────────────────
export const getMyPGs = async (req, res) => {
  try {
    const pgs = await PG.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: pgs, total: pgs.length });
  } catch (err) {
    console.error('getMyPGs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────
// GET SINGLE PG BY ID
// GET /api/pg/:id
// Access: Public
// ──────────────────────────────────────────────────────
export const getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id).populate('ownerId', 'name email phone');
    if (!pg) return res.status(404).json({ success: false, message: 'PG not found' });
    res.json({ success: true, data: pg });
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ success: false, message: 'PG not found' });
    console.error('getPGById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────
// UPDATE PG
// PUT /api/pg/:id
// Access: Protected — owner only
// ──────────────────────────────────────────────────────
export const updatePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ success: false, message: 'PG not found' });

    // Ownership check
    if (pg.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to edit this PG' });
    }

    // ── Handle new image uploads ───────────────────
    const updateData = { ...req.body };

    // Convert boolean strings
    ['smokingAllowed', 'drinkingAllowed', 'petsAllowed'].forEach((key) => {
      if (updateData[key] !== undefined) {
        updateData[key] = updateData[key] === 'true' || updateData[key] === true;
      }
    });

    // Number fields
    ['rent','startingPrice','endingPrice','totalCost','maintenanceCharges',
     'totalBeds','availability','noticePeriodToVacate'].forEach((key) => {
      if (updateData[key] !== undefined) updateData[key] = Number(updateData[key]);
    });

    if (req.file) updateData.mainPhoto = req.file.path;

    if (req.files && req.files.length > 0) {
      updateData.galleryPhotos = req.files.map((f) => f.path);
    }

    if (updateData.amenities && typeof updateData.amenities === 'string') {
      try { updateData.amenities = JSON.parse(updateData.amenities); } catch { /* leave as is */ }
    }

    const updated = await PG.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'PG updated successfully', data: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ success: false, message: messages });
    }
    console.error('updatePG error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────
// DELETE PG
// DELETE /api/pg/:id
// Access: Protected — owner only
// ──────────────────────────────────────────────────────
export const deletePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ success: false, message: 'PG not found' });

    if (pg.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to delete this PG' });
    }

    await pg.deleteOne();
    res.json({ success: true, message: 'PG deleted successfully' });
  } catch (err) {
    console.error('deletePG error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
