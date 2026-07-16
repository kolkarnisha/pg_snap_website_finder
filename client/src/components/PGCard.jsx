import { Link } from 'react-router-dom'

const AMENITY_ICONS = {
  WiFi: '📶', AC: '❄️', Geyser: '🚿', CCTV: '📹',
  Parking: '🚗', Gym: '💪', Laundry: '👕', Food: '🍽️',
  Lift: '🛗', Generator: '⚡', 'Hot Water': '♨️', 'Study Room': '📚',
}

const FURNISHING_BADGE = {
  'Fully Furnished':  'badge-green',
  'Semi Furnished':   'badge-blue',
  'Unfurnished':      'badge-slate',
}

/**
 * PGCard — shows a summary of a single PG listing.
 * Used in search results and the homepage grid.
 */
export default function PGCard({ pg }) {
  const {
    _id, pgName, area, city, rent, availability,
    furnishingType, roomType, mainPhoto, amenities = [], smokingAllowed, petsAllowed,
  } = pg

  return (
    <Link to={`/pg/${_id}`} className="block group">
      <article className="card-hover h-full flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={mainPhoto || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'}
            alt={`${pgName} — ${area}, ${city}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Availability badge */}
          <div className="absolute top-3 left-3">
            {availability > 0 ? (
              <span className="badge badge-green shadow">
                ✅ {availability} bed{availability > 1 ? 's' : ''} free
              </span>
            ) : (
              <span className="badge badge-red shadow">❌ Full</span>
            )}
          </div>
          {/* Furnishing badge */}
          <div className="absolute top-3 right-3">
            <span className={`badge shadow ${FURNISHING_BADGE[furnishingType] || 'badge-slate'}`}>
              {furnishingType?.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">

          {/* Name + location */}
          <h3 className="font-bold text-base text-slate-900 mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {pgName}
          </h3>
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
            📍 {area}, {city}
          </p>

          {/* Rent */}
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-extrabold text-brand-600">
              ₹{rent.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400">/month/bed</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="badge badge-orange">{roomType}</span>
            {smokingAllowed && <span className="badge badge-slate">🚬 Smoking OK</span>}
            {petsAllowed    && <span className="badge badge-slate">🐾 Pets OK</span>}
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-slate-100">
              {amenities.slice(0, 4).map((a) => (
                <span key={a} className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5">
                  {AMENITY_ICONS[a] || '•'} {a}
                </span>
              ))}
              {amenities.length > 4 && (
                <span className="text-xs text-slate-400 self-center">
                  +{amenities.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
