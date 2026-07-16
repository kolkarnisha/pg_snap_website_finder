import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

// ── Constants ──────────────────────────────────────────────────
const ROOM_TYPES = ['Single', 'Double', 'Triple', '4 Sharing', 'Dorm']
const FURNISHING_TYPES = ['Fully Furnished', 'Semi Furnished', 'Unfurnished']
const ALL_AMENITIES = [
  'WiFi', 'AC', 'Geyser', 'CCTV', 'Parking', 'Gym', 'Laundry',
  'Food', 'Lift', 'Generator', 'Hot Water', 'Study Room',
  'Power Backup', 'Security Guard', 'Housekeeping',
]
const STEPS = [
  { id: 1, label: 'Basic Details',    emoji: '📋' },
  { id: 2, label: 'Pricing',          emoji: '💰' },
  { id: 3, label: 'Capacity & Type',  emoji: '🛏️' },
  { id: 4, label: 'Rules & Policies', emoji: '📜' },
  { id: 5, label: 'Media',            emoji: '📸' },
]

// ── Initial form state ─────────────────────────────────────────
const INIT = {
  pgName: '', location: '', area: '', city: '', state: '', pincode: '', googleMapsLink: '',
  rent: '', startingPrice: '', endingPrice: '', totalCost: '', maintenanceCharges: '',
  totalBeds: '', availability: '', roomType: 'Double', furnishingType: 'Semi Furnished',
  smokingAllowed: false, drinkingAllowed: false, petsAllowed: false, noticePeriodToVacate: '30',
  description: '', amenities: [],
}

// ── Step Progress Bar ──────────────────────────────────────────
function StepBar({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2 flex-1 last:flex-none">
          <div className={`step-circle ${
            current > step.id ? 'step-done' : current === step.id ? 'step-active' : 'step-inactive'
          }`}>
            {current > step.id ? '✓' : step.id}
          </div>
          <div className="hidden sm:block">
            <div className={`text-xs font-bold ${current === step.id ? 'text-brand-600' : current > step.id ? 'text-emerald-600' : 'text-slate-400'}`}>
              {step.emoji} {step.label}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 rounded-full ${current > step.id ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * RegisterPGPage — 5-step multi-step form to register or edit a PG.
 * Route: /owner/register-pg  (create)
 *        /owner/edit-pg/:id  (edit)
 */
export default function RegisterPGPage() {
  const { id: editId } = useParams()
  const isEdit = Boolean(editId)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [step, setStep]       = useState(1)
  const [form, setForm]       = useState(INIT)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  // ── Main photo state ──────────────────────────────
  const [mainPhotoFile, setMainPhotoFile] = useState(null)
  const [mainPhotoPreview, setMainPhotoPreview] = useState(null)
  const [galleryFiles, setGalleryFiles]   = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])

  // ── Load existing PG data if editing ──────────────
  useEffect(() => {
    if (!isEdit) return
    const fetchPG = async () => {
      try {
        const { data } = await api.get(`/pg/${editId}`)
        if (data.success) {
          const pg = data.data
          setForm({
            pgName: pg.pgName || '', location: pg.location || '',
            area: pg.area || '', city: pg.city || '',
            state: pg.state || '', pincode: pg.pincode || '',
            googleMapsLink: pg.googleMapsLink || '',
            rent: pg.rent || '', startingPrice: pg.startingPrice || '',
            endingPrice: pg.endingPrice || '', totalCost: pg.totalCost || '',
            maintenanceCharges: pg.maintenanceCharges || '',
            totalBeds: pg.totalBeds || '', availability: pg.availability || '',
            roomType: pg.roomType || 'Double',
            furnishingType: pg.furnishingType || 'Semi Furnished',
            smokingAllowed: pg.smokingAllowed || false,
            drinkingAllowed: pg.drinkingAllowed || false,
            petsAllowed: pg.petsAllowed || false,
            noticePeriodToVacate: pg.noticePeriodToVacate || '30',
            description: pg.description || '',
            amenities: pg.amenities || [],
          })
          if (pg.mainPhoto) setMainPhotoPreview(pg.mainPhoto)
          if (pg.galleryPhotos) setGalleryPreviews(pg.galleryPhotos)
        }
      } catch {
        toast.error('Failed to load PG data')
      } finally {
        setFetching(false)
      }
    }
    fetchPG()
  }, [editId, isEdit])

  // ── Helpers ────────────────────────────────────────
  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }))
  }

  const handleMainPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMainPhotoFile(file)
    setMainPhotoPreview(URL.createObjectURL(file))
    setErrors((e) => ({ ...e, mainPhoto: '' }))
  }

  const handleGallery = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 8)
    setGalleryFiles(files)
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  // ── Step validation ────────────────────────────────
  const validateStep = () => {
    const errs = {}
    if (step === 1) {
      if (!form.pgName.trim())   errs.pgName   = 'PG name is required'
      if (!form.location.trim()) errs.location = 'Location is required'
      if (!form.area.trim())     errs.area     = 'Area is required'
      if (!form.city.trim())     errs.city     = 'City is required'
    }
    if (step === 2) {
      if (!form.rent || Number(form.rent) <= 0) errs.rent = 'Valid rent is required'
    }
    if (step === 3) {
      if (!form.roomType)       errs.roomType       = 'Room type is required'
      if (!form.furnishingType) errs.furnishingType = 'Furnishing type is required'
    }
    if (step === 5) {
      if (!mainPhotoFile && !mainPhotoPreview) errs.mainPhoto = 'Main photo is required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(5, s + 1)) }
  const prevStep = () => setStep((s) => Math.max(1, s - 1))

  // ── Submit ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    try {
      const fd = new FormData()

      // Append all text fields
      const textFields = [
        'pgName','location','area','city','state','pincode','googleMapsLink',
        'rent','startingPrice','endingPrice','totalCost','maintenanceCharges',
        'totalBeds','availability','roomType','furnishingType',
        'smokingAllowed','drinkingAllowed','petsAllowed','noticePeriodToVacate',
        'description',
      ]
      textFields.forEach((key) => fd.append(key, String(form[key])))
      fd.append('amenities', JSON.stringify(form.amenities))

      // Append media
      if (mainPhotoFile) {
        fd.append('mainPhoto', mainPhotoFile)
      } else if (mainPhotoPreview && isEdit) {
        fd.append('mainPhoto', mainPhotoPreview) // keep existing URL
      }

      galleryFiles.forEach((f) => fd.append('galleryPhotos', f))

      let result
      if (isEdit) {
        result = await api.put(`/pg/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        result = await api.post('/pg', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }

      if (result.data.success) {
        toast.success(isEdit ? '✅ PG updated successfully!' : '🎉 PG registered successfully!')
        navigate('/owner/my-pgs')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving PG'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <span className="spinner text-brand-500 w-10 h-10" />
    </div>
  )

  // ── Render each step ───────────────────────────────
  const renderStep = () => {
    const field = (id, label, type = 'text', placeholder = '', key, required = false) => (
      <div className="form-group">
        <label className="form-label" htmlFor={id}>{label}{required && ' *'}</label>
        <input
          id={id}
          type={type}
          className={`form-input ${errors[key] ? 'border-red-400' : ''}`}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => update(key, e.target.value)}
        />
        {errors[key] && <span className="form-error">{errors[key]}</span>}
      </div>
    )

    switch (step) {
      case 1: return (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 mb-4">📋 Basic PG Information</h2>
          {field('pg-name', 'PG Name', 'text', 'e.g. Sunshine PG for Ladies', 'pgName', true)}
          {field('pg-location', 'Full Address / Location', 'text', '123 Main Street, Near Metro...', 'location', true)}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('pg-area', 'Area / Locality', 'text', 'Marathahalli', 'area', true)}
            {field('pg-city', 'City', 'text', 'Bangalore', 'city', true)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('pg-state', 'State', 'text', 'Karnataka', 'state')}
            {field('pg-pincode', 'Pincode', 'text', '560037', 'pincode')}
          </div>
          {field('pg-maps', 'Google Maps Link', 'url', 'https://maps.google.com/...', 'googleMapsLink')}
        </div>
      )

      case 2: return (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 mb-4">💰 Pricing Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="pg-rent">Rent per Bed / Month (₹) *</label>
              <input id="pg-rent" type="number" min="0" className={`form-input ${errors.rent ? 'border-red-400' : ''}`}
                placeholder="8000" value={form.rent} onChange={(e) => update('rent', e.target.value)} />
              {errors.rent && <span className="form-error">{errors.rent}</span>}
            </div>
            {field('pg-maintenance', 'Maintenance Charges (₹/mo)', 'number', '500', 'maintenanceCharges')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('pg-start-price', 'Starting Price (₹)', 'number', '7000', 'startingPrice')}
            {field('pg-end-price', 'Ending Price (₹)', 'number', '12000', 'endingPrice')}
          </div>
          {field('pg-deposit', 'Security Deposit / Total Cost (₹)', 'number', '16000', 'totalCost')}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm text-brand-700">
            💡 <strong>Tip:</strong> Starting/Ending prices help tenants filter by budget range. Rent is the primary price shown.
          </div>
        </div>
      )

      case 3: return (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 mb-4">🛏️ Capacity & Room Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('pg-total-beds', 'Total Beds', 'number', '20', 'totalBeds')}
            {field('pg-avail', 'Currently Available Beds', 'number', '5', 'availability')}
          </div>

          <div className="form-group">
            <label className="form-label">Room Type *</label>
            <div className="flex flex-wrap gap-2">
              {ROOM_TYPES.map((rt) => (
                <button
                  key={rt} type="button"
                  onClick={() => update('roomType', rt)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.roomType === rt
                      ? 'bg-brand-500 border-brand-500 text-white shadow'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'
                  }`}
                >
                  {rt}
                </button>
              ))}
            </div>
            {errors.roomType && <span className="form-error">{errors.roomType}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Furnishing Type *</label>
            <div className="flex flex-wrap gap-2">
              {FURNISHING_TYPES.map((ft) => (
                <button
                  key={ft} type="button"
                  onClick={() => update('furnishingType', ft)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.furnishingType === ft
                      ? 'bg-brand-500 border-brand-500 text-white shadow'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>
            {errors.furnishingType && <span className="form-error">{errors.furnishingType}</span>}
          </div>
        </div>
      )

      case 4: return (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-slate-800 mb-4">📜 Rules & Policies</h2>

          <div className="card p-4 space-y-3">
            {[
              { key: 'smokingAllowed',  label: '🚬 Smoking Allowed',  desc: 'Allow tenants to smoke on premises' },
              { key: 'drinkingAllowed', label: '🍺 Drinking Allowed', desc: 'Allow alcohol on premises' },
              { key: 'petsAllowed',     label: '🐾 Pets Allowed',     desc: 'Allow tenants to keep pets' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 cursor-pointer transition group">
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{label}</div>
                  <div className="text-xs text-slate-400">{desc}</div>
                </div>
                <div
                  onClick={() => update(key, !form[key])}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${form[key] ? 'bg-brand-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form[key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </div>
              </label>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pg-notice">Notice Period to Vacate (days)</label>
            <input id="pg-notice" type="number" min="0" max="365" className="form-input"
              placeholder="30" value={form.noticePeriodToVacate}
              onChange={(e) => update('noticePeriodToVacate', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pg-desc">Description</label>
            <textarea id="pg-desc" className="form-textarea" rows="4"
              placeholder="Describe your PG — nearby facilities, rules, atmosphere..."
              value={form.description} onChange={(e) => update('description', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amenities Available</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {ALL_AMENITIES.map((a) => {
                const checked = form.amenities.includes(a)
                return (
                  <label key={a} className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                    checked ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200'
                  }`}>
                    <input type="checkbox" className="accent-brand-500" checked={checked} onChange={() => toggleAmenity(a)} />
                    <span className="text-sm font-medium text-slate-700">{a}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      )

      case 5: return (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">📸 Photos & Media</h2>

          {/* Main Photo */}
          <div className="form-group">
            <label className="form-label" htmlFor="pg-main-photo">Main Cover Photo *</label>
            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
              errors.mainPhoto ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50'
            }`}>
              {mainPhotoPreview ? (
                <div className="relative inline-block">
                  <img src={mainPhotoPreview} alt="Main photo preview" className="max-h-48 rounded-xl mx-auto shadow" />
                  <button
                    type="button"
                    onClick={() => { setMainPhotoFile(null); setMainPhotoPreview(null) }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-slate-500 mb-2">Click to upload your main cover photo</p>
                  <p className="text-xs text-slate-400">JPG, PNG, WebP · Max 5MB</p>
                </div>
              )}
              <input
                id="pg-main-photo"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                style={{ position: mainPhotoPreview ? 'absolute' : 'relative' }}
                onChange={handleMainPhoto}
              />
              {!mainPhotoPreview && (
                <label htmlFor="pg-main-photo" className="btn btn-secondary btn-sm mt-3 cursor-pointer">
                  📁 Choose Photo
                </label>
              )}
            </div>
            {errors.mainPhoto && <span className="form-error">{errors.mainPhoto}</span>}
          </div>

          {/* Gallery */}
          <div className="form-group">
            <label className="form-label" htmlFor="pg-gallery">Gallery Photos (up to 8)</label>
            <input
              id="pg-gallery"
              type="file"
              accept="image/*"
              multiple
              className="form-input py-2"
              onChange={handleGallery}
            />
            {galleryPreviews.length > 0 && (
              <div className="gallery-grid mt-3">
                {galleryPreviews.map((src, i) => (
                  <img key={i} src={src} alt={`Gallery ${i + 1}`} className="gallery-img" />
                ))}
              </div>
            )}
          </div>
        </div>
      )

      default: return null
    }
  }

  return (
    <div className="container-max py-10">
      <div className="max-w-3xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isEdit ? '✏️ Edit PG Listing' : '🏠 Register Your PG'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {isEdit ? 'Update your PG details below' : 'Fill in the details to list your PG on PGFinder'}
          </p>
        </div>

        {/* Step Bar */}
        <StepBar current={step} total={5} />

        {/* Form Card */}
        <div className="card p-6 sm:p-8 shadow-md">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="btn btn-ghost disabled:opacity-0"
            >
              ← Back
            </button>

            <div className="text-xs text-slate-400 font-medium">
              Step {step} of {STEPS.length}
            </div>

            {step < 5 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary">
                Next → {STEPS[step]?.emoji}
              </button>
            ) : (
              <button
                id="submit-pg-btn"
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary btn-lg"
              >
                {loading ? (
                  <><span className="spinner" />{isEdit ? 'Updating…' : 'Registering…'}</>
                ) : (
                  isEdit ? '💾 Update PG' : '🚀 Register PG'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
