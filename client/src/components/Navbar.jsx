import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-semibold transition-colors ${
        isActive(to)
          ? 'text-brand-600'
          : 'text-slate-600 hover:text-brand-600'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-lg">🏠</span>
            </div>
            <span className="font-extrabold text-xl text-slate-900">
              PG<span className="gradient-text">Finder</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLink('/', 'Home')}
            {navLink('/pgs', 'Browse PGs')}
            {user && navLink('/owner/my-pgs', 'My PGs')}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/owner/register-pg" className="btn btn-primary btn-sm">
                  + Register PG
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-xl border border-brand-100">
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Owner Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span className={`block h-0.5 bg-slate-700 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-slate-700 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-slate-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-100 flex flex-col gap-4 animate-fade-in-up">
            {navLink('/', 'Home')}
            {navLink('/pgs', 'Browse PGs')}
            {user && navLink('/owner/my-pgs', 'My PGs')}
            {user ? (
              <>
                <Link to="/owner/register-pg" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">
                  + Register PG
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost w-full text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">
                Owner Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
