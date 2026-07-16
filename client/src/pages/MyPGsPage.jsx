import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import toast from 'react-hot-toast'

const FURNISHING_BADGE = {
  'Fully Furnished':  'badge-green',
  'Semi Furnished':   'badge-blue',
  'Unfurnished':      'badge-slate',
}

/**
 * MyPGsPage — Owner dashboard to list, edit, and delete their PG listings.
 * Route: /owner/my-pgs
 */
export default function MyPGsPage() {
  const navigate = useNavigate()
  const [pgs, setPGs]         = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const fetchMyPGs = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/pg/my/listings')
      setPGs(data.data || [])
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load PGs'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMyPGs() }, [fetchMyPGs])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return
    setDeletingId(id)
    try {
      await api.delete(`/pg/${id}`)
      toast.success('🗑️ PG deleted successfully')
      setPGs((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Stats ──────────────────────────────────────────
  const totalBeds     = pgs.reduce((s, p) => s + (p.totalBeds || 0), 0)
  const totalAvail    = pgs.reduce((s, p) => s + (p.availability || 0), 0)
  const avgRent       = pgs.length ? Math.round(pgs.reduce((s, p) => s + p.rent, 0) / pgs.length) : 0

  return (
    <div className="container-max py-8 animate-fade-in-up">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My PG Listings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all your registered PG properties</p>
        </div>
        <Link to="/owner/register-pg" className="btn btn-primary">
          + Register New PG
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total PGs',     value: pgs.length,    emoji: '🏘️', color: 'bg-blue-50  border-blue-100  text-blue-700'  },
          { label: 'Total Beds',    value: totalBeds,     emoji: '🛏️', color: 'bg-purple-50 border-purple-100 text-purple-700' },
          { label: 'Available',     value: totalAvail,    emoji: '✅', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
          { label: 'Avg Rent/bed',  value: `₹${avgRent.toLocaleString('en-IN')}`, emoji: '💰', color: 'bg-brand-50 border-brand-100 text-brand-700' },
        ].map((s) => (
          <div key={s.label} className={`card border-2 p-4 text-center ${s.color}`}>
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton aspect-video" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-8 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : pgs.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">🏘️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No PGs Listed Yet</h2>
          <p className="text-slate-500 text-sm mb-6">Start by registering your first PG property.</p>
          <Link to="/owner/register-pg" className="btn btn-primary btn-lg">
            🚀 Register Your First PG
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {pgs.map((pg) => (
            <div key={pg._id} className="card flex flex-col group">

              {/* Image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={pg.mainPhoto || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'}
                  alt={pg.pgName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-white font-bold text-sm drop-shadow">{pg.roomType}</span>
                  <span className={`badge ${FURNISHING_BADGE[pg.furnishingType] || 'badge-slate'} text-xs`}>
                    {pg.furnishingType?.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{pg.pgName}</h3>
                <p className="text-xs text-slate-500 mb-3">📍 {pg.area}, {pg.city}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-base font-black text-brand-600">₹{pg.rent.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-slate-400">Rent/bed</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-base font-black text-slate-800">{pg.totalBeds || 0}</div>
                    <div className="text-xs text-slate-400">Beds</div>
                  </div>
                  <div className={`rounded-xl p-2 ${pg.availability > 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <div className={`text-base font-black ${pg.availability > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {pg.availability || 0}
                    </div>
                    <div className="text-xs text-slate-400">Available</div>
                  </div>
                </div>

                {/* Amenity chips */}
                {pg.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {pg.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-xs bg-slate-100 text-slate-600 rounded-lg px-2 py-0.5">{a}</span>
                    ))}
                    {pg.amenities.length > 3 && (
                      <span className="text-xs text-slate-400">+{pg.amenities.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    to={`/pg/${pg._id}`}
                    className="btn btn-ghost btn-sm flex-1 border border-slate-200"
                  >
                    👁 View
                  </Link>
                  <Link
                    to={`/owner/edit-pg/${pg._id}`}
                    className="btn btn-secondary btn-sm flex-1"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(pg._id, pg.pgName)}
                    disabled={deletingId === pg._id}
                    className="btn btn-danger btn-sm flex-1"
                  >
                    {deletingId === pg._id ? <span className="spinner w-3 h-3" /> : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
