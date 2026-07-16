import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import PGCard from '../components/PGCard.jsx'

const AMENITY_LIST = ['WiFi', 'AC', 'Geyser', 'CCTV', 'Parking', 'Gym', 'Laundry', 'Food', 'Lift', 'Generator', 'Hot Water', 'Study Room']

const CITY_SUGGESTIONS = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'
]

function HeroStat({ value, label, emoji }) {
  return (
    <div className="text-center px-6 py-4">
      <div className="text-3xl font-black gradient-text mb-1">{emoji} {value}</div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
    </div>
  )
}

/**
 * HomePage — hero banner, quick search, features, and popular PGs.
 */
export default function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredPGs, setFeaturedPGs] = useState([])
  const [loading, setLoading]         = useState(true)

  const loadFeatured = useCallback(async () => {
    try {
      const { data } = await api.get('/pg/search?sort=newest&limit=6')
      setFeaturedPGs(data.data || [])
    } catch {
      setFeaturedPGs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadFeatured() }, [loadFeatured])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/pgs?city=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="animate-fade-in-up">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-700/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-600/5 rounded-full blur-3xl" />
        </div>

        <div className="container-max relative z-10 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/30 rounded-full px-4 py-1.5 text-brand-300 text-xs font-semibold mb-6">
              ✨ India's #1 PG Discovery Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Find Your Perfect<br />
              <span className="gradient-text">Paying Guest</span> Home
            </h1>
            <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
              Discover verified, affordable PG accommodations near colleges, offices, and metro stations across India.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📍</span>
                <input
                  id="hero-search"
                  type="text"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl text-slate-900 text-base font-medium border-0 shadow-xl focus:ring-2 focus:ring-brand-400 outline-none"
                  placeholder="Enter city or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg rounded-2xl shadow-xl whitespace-nowrap">
                🔍 Search
              </button>
            </form>

            {/* City Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {CITY_SUGGESTIONS.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => navigate(`/pgs?city=${city}`)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container-max">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              <HeroStat value="500+" label="PGs Listed" emoji="🏘️" />
              <HeroStat value="20+" label="Cities Covered" emoji="🗺️" />
              <HeroStat value="10,000+" label="Happy Tenants" emoji="😊" />
              <HeroStat value="100%" label="Verified Listings" emoji="✅" />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="section-title">How PGFinder Works</h2>
            <p className="section-subtitle">Find your ideal PG in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', step: '01', title: 'Search', desc: 'Enter your city, area, and budget to see all available PGs instantly.' },
              { icon: '🏠', step: '02', title: 'Compare', desc: 'View photos, amenities, policies, and pricing to find your best match.' },
              { icon: '📞', step: '03', title: 'Connect', desc: 'Contact the owner directly and schedule a visit at your convenience.' },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 rounded-2xl text-4xl mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  {item.icon}
                </div>
                <div className="text-xs font-black text-brand-400 uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PGs ───────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container-max">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-1">Latest PG Listings</h2>
              <p className="text-slate-500 text-sm">Freshly added, verified accommodations</p>
            </div>
            <button
              onClick={() => navigate('/pgs')}
              className="btn btn-secondary hidden sm:flex"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-6 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredPGs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPGs.map((pg) => (
                <PGCard key={pg._id} pg={pg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🏘️</div>
              <p className="text-slate-500">No PGs listed yet. Be the first to register yours!</p>
              <button onClick={() => navigate('/login')} className="btn btn-primary mt-4">
                Register Your PG
              </button>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <button onClick={() => navigate('/pgs')} className="btn btn-secondary">
              View All PGs →
            </button>
          </div>
        </div>
      </section>

      {/* ── AMENITIES HIGHLIGHT ─────────────────────── */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="section-title">Amenities You Can Filter By</h2>
            <p className="section-subtitle">Find PGs with exactly what you need</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {AMENITY_LIST.map((a) => {
              const icons = { WiFi:'📶', AC:'❄️', Geyser:'🚿', CCTV:'📹', Parking:'🚗', Gym:'💪', Laundry:'👕', Food:'🍽️', Lift:'🛗', Generator:'⚡', 'Hot Water':'♨️', 'Study Room':'📚' }
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => navigate('/pgs')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all hover:scale-105"
                >
                  <span>{icons[a]}</span>{a}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── OWNER CTA ──────────────────────────────── */}
      <section className="section bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Own a PG? List it Free!</h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto text-base">
            Reach thousands of potential tenants searching for PGs in your area. Easy registration, instant listing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-brand-600 font-bold rounded-2xl text-base hover:bg-brand-50 transition shadow-xl hover:-translate-y-0.5"
            >
              🏠 Register Your PG Free
            </button>
            <button
              onClick={() => navigate('/pgs')}
              className="px-8 py-4 border-2 border-white/40 text-white font-bold rounded-2xl text-base hover:bg-white/10 transition"
            >
              Browse PGs
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
