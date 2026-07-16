import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios.js'

const AMENITY_ICONS = {
  WiFi: '📶', AC: '❄️', Geyser: '🚿', CCTV: '📹',
  Parking: '🚗', Gym: '💪', Laundry: '👕', Food: '🍽️',
  Lift: '🛗', Generator: '⚡', 'Hot Water': '♨️', 'Study Room': '📚',
}

function PolicyPill({ allowed, label }) {
  return (
    <span className={`badge ${allowed ? 'badge-green' : 'badge-red'}`}>
      {allowed ? '✅' : '❌'} {label}
    </span>
  )
}

/**
 * PGDetailPage — full detail view for a single PG listing.
 * Route: /pg/:id
 */
export default function PGDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pg, setPG]           = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [activeImg, setActiveImg] = useState(null)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const fetchPG = async () => {
      try {
        const { data } = await api.get(`/pg/${id}`)
        if (data.success) {
          setPG(data.data)
          setActiveImg(data.data.mainPhoto)
        }
      } catch {
        setError('PG not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchPG()
  }, [id])

  if (loading) return (
    <div className="container-max py-16 text-center">
      <div className="spinner text-brand-500 w-10 h-10 mx-auto mb-4" />
      <p className="text-slate-500">Loading PG details…</p>
    </div>
  )

  if (error || !pg) return (
    <div className="container-max py-16 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-xl font-bold mb-2">PG Not Found</h2>
      <button onClick={() => navigate('/pgs')} className="btn btn-primary mt-4">
        ← Back to Search
      </button>
    </div>
  )

  const allPhotos = [pg.mainPhoto, ...(pg.galleryPhotos || [])].filter(Boolean)

  return (
    <div className="container-max py-8 animate-fade-in-up">

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-500">Home</Link>
        <span>›</span>
        <Link to="/pgs" className="hover:text-brand-500">Browse PGs</Link>
        <span>›</span>
        <span className="text-slate-700 font-medium">{pg.pgName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left — Photos + Details ─────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main Photo */}
          <div className="card overflow-hidden">
            <img
              src={activeImg || pg.mainPhoto}
              alt={`${pg.pgName} main photo`}
              className="w-full aspect-video object-cover"
            />
          </div>

          {/* Gallery Thumbnails */}
          {allPhotos.length > 1 && (
            <div className="gallery-grid">
              {allPhotos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`${pg.pgName} photo ${i + 1}`}
                  className={`gallery-img ${activeImg === photo ? 'ring-2 ring-brand-500' : ''}`}
                  onClick={() => setActiveImg(photo)}
                />
              ))}
            </div>
          )}

          {/* Description */}
          {pg.description && (
            <div className="card p-6">
              <h2 className="font-bold text-lg text-slate-900 mb-3">About This PG</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{pg.description}</p>
            </div>
          )}

          {/* Amenities */}
          {pg.amenities?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-bold text-lg text-slate-900 mb-4">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pg.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xl">{AMENITY_ICONS[a] || '✓'}</span>
                    <span className="text-sm font-medium text-slate-700">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Policies */}
          <div className="card p-6">
            <h2 className="font-bold text-lg text-slate-900 mb-4">House Rules & Policies</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <PolicyPill allowed={pg.smokingAllowed}  label="Smoking" />
              <PolicyPill allowed={pg.drinkingAllowed} label="Drinking" />
              <PolicyPill allowed={pg.petsAllowed}     label="Pets" />
            </div>
            <p className="text-sm text-slate-500">
              📅 Notice period to vacate: <strong className="text-slate-700">{pg.noticePeriodToVacate || 30} days</strong>
            </p>
          </div>

          {/* Location */}
          <div className="card p-6">
            <h2 className="font-bold text-lg text-slate-900 mb-3">Location</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p>📍 <strong>Full Address:</strong> {pg.location}</p>
              <p>🏘️ <strong>Area:</strong> {pg.area}</p>
              <p>🌆 <strong>City:</strong> {pg.city}{pg.state ? `, ${pg.state}` : ''}</p>
              {pg.pincode && <p>📮 <strong>Pincode:</strong> {pg.pincode}</p>}
            </div>
            {pg.googleMapsLink && (
              <a
                href={pg.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary mt-4 text-xs"
              >
                🗺️ Open in Google Maps
              </a>
            )}
          </div>
        </div>

        {/* ── Right — Booking card ────────────────── */}
        <div className="space-y-4">
          <div className="card p-6 sticky top-24">

            {/* PG Name */}
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{pg.pgName}</h1>
            <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
              📍 {pg.area}, {pg.city}
            </p>

            {/* Rent */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 mb-4 text-center">
              <div className="text-sm text-slate-500 mb-1">Rent per month</div>
              <div className="text-4xl font-black gradient-text">
                ₹{pg.rent.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-400 mt-1">per bed / month</div>
            </div>

            {/* Key Info */}
            <div className="space-y-2 mb-5">
              {[
                { label: 'Room Type', value: pg.roomType },
                { label: 'Furnishing', value: pg.furnishingType },
                { label: 'Total Beds', value: pg.totalBeds || '—' },
                { label: 'Availability', value: `${pg.availability} bed${pg.availability !== 1 ? 's' : ''} vacant` },
                pg.startingPrice ? { label: 'Price Range', value: `₹${pg.startingPrice.toLocaleString()} – ₹${pg.endingPrice?.toLocaleString() || ''}` } : null,
                pg.totalCost ? { label: 'Deposit / Security', value: `₹${pg.totalCost.toLocaleString('en-IN')}` } : null,
                pg.maintenanceCharges ? { label: 'Maintenance', value: `₹${pg.maintenanceCharges.toLocaleString('en-IN')}/mo` } : null,
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs text-slate-500 font-medium">{label}</span>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>

            {/* Availability badge */}
            <div className="flex justify-center mb-4">
              {pg.availability > 0 ? (
                <span className="badge badge-green text-base px-4 py-2">
                  ✅ {pg.availability} Bed{pg.availability > 1 ? 's' : ''} Available
                </span>
              ) : (
                <span className="badge badge-red text-base px-4 py-2">❌ Currently Full</span>
              )}
            </div>

            {/* Contact Button */}
            <button
              id="contact-owner-btn"
              onClick={() => setContactOpen(!contactOpen)}
              className="btn btn-primary w-full btn-lg"
              disabled={pg.availability === 0}
            >
              📞 Contact Owner
            </button>

            {/* Contact Info Reveal */}
            {contactOpen && pg.ownerId && (
              <div className="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-xl animate-fade-in-up">
                <p className="text-sm font-bold text-slate-800 mb-1">👤 {pg.ownerId.name || 'Owner'}</p>
                {pg.ownerId.email && (
                  <a href={`mailto:${pg.ownerId.email}`} className="text-sm text-brand-600 hover:underline flex items-center gap-1">
                    ✉️ {pg.ownerId.email}
                  </a>
                )}
                {pg.ownerId.phone && (
                  <a href={`tel:${pg.ownerId.phone}`} className="text-sm text-brand-600 hover:underline flex items-center gap-1 mt-1">
                    📱 {pg.ownerId.phone}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
