import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container-max py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🏠</span>
              </div>
              <span className="font-extrabold text-xl text-white">PGFinder</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover verified paying guest accommodations across India. Trusted by thousands of students and professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-400 transition">Home</Link></li>
              <li><Link to="/pgs" className="hover:text-brand-400 transition">Browse PGs</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition">Owner Login</Link></li>
            </ul>
          </div>

          {/* Owner Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Owners</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/owner/register-pg" className="hover:text-brand-400 transition">Register PG</Link></li>
              <li><Link to="/owner/my-pgs" className="hover:text-brand-400 transition">Manage PGs</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs">© {year} PG Finder. All rights reserved.</p>
          <p className="text-xs">Built with ❤️ for India's PG seekers</p>
        </div>
      </div>
    </footer>
  )
}
