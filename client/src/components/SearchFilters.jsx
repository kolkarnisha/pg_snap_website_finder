import { useState } from 'react'

const ROOM_TYPES = ['Single', 'Double', 'Triple', '4 Sharing', 'Dorm']
const FURNISHING_TYPES = ['Fully Furnished', 'Semi Furnished', 'Unfurnished']
const SORT_OPTIONS = [
  { value: 'rent_asc',   label: '💸 Price: Low to High' },
  { value: 'rent_desc',  label: '💰 Price: High to Low' },
  { value: 'newest',     label: '🆕 Newest First' },
  { value: 'avail_desc', label: '🛏️ Most Availability' },
]

/**
 * SearchFilters — sidebar/top filter panel for PG search.
 * Calls onChange with updated filter values.
 */
export default function SearchFilters({ filters, onChange }) {
  const [localFilters, setLocalFilters] = useState(filters)

  const update = (key, value) => {
    const updated = { ...localFilters, [key]: value }
    setLocalFilters(updated)
    onChange(updated)
  }

  const reset = () => {
    const empty = {
      location: '', area: '', city: '',
      minPrice: '', maxPrice: '',
      roomType: '', furnishingType: '',
      smokingAllowed: '', petsAllowed: '',
      sort: 'rent_asc',
    }
    setLocalFilters(empty)
    onChange(empty)
  }

  return (
    <aside className="card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Filters</h2>
        <button onClick={reset} className="text-xs text-brand-500 font-semibold hover:underline">
          Reset All
        </button>
      </div>

      {/* Location */}
      <div className="form-group">
        <label className="form-label">City</label>
        <input
          id="filter-city"
          type="text"
          className="form-input"
          placeholder="e.g. Bangalore"
          value={localFilters.city || ''}
          onChange={(e) => update('city', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Area / Locality</label>
        <input
          id="filter-area"
          type="text"
          className="form-input"
          placeholder="e.g. Marathahalli"
          value={localFilters.area || ''}
          onChange={(e) => update('area', e.target.value)}
        />
      </div>

      {/* Price Range */}
      <div className="form-group">
        <label className="form-label">Price Range (₹/month)</label>
        <div className="flex gap-2">
          <input
            id="filter-min-price"
            type="number"
            className="form-input"
            placeholder="Min"
            value={localFilters.minPrice || ''}
            onChange={(e) => update('minPrice', e.target.value)}
          />
          <input
            id="filter-max-price"
            type="number"
            className="form-input"
            placeholder="Max"
            value={localFilters.maxPrice || ''}
            onChange={(e) => update('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Room Type */}
      <div className="form-group">
        <label className="form-label">Room Type</label>
        <div className="flex flex-wrap gap-1.5">
          {ROOM_TYPES.map((rt) => (
            <button
              key={rt}
              type="button"
              onClick={() => update('roomType', localFilters.roomType === rt ? '' : rt)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                localFilters.roomType === rt
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
              }`}
            >
              {rt}
            </button>
          ))}
        </div>
      </div>

      {/* Furnishing Type */}
      <div className="form-group">
        <label className="form-label">Furnishing</label>
        <select
          id="filter-furnishing"
          className="form-select"
          value={localFilters.furnishingType || ''}
          onChange={(e) => update('furnishingType', e.target.value)}
        >
          <option value="">Any</option>
          {FURNISHING_TYPES.map((ft) => (
            <option key={ft} value={ft}>{ft}</option>
          ))}
        </select>
      </div>

      {/* Policies */}
      <div className="form-group">
        <label className="form-label">Policies</label>
        <div className="flex flex-col gap-2">
          <label className="toggle-label">
            <input
              id="filter-smoking"
              type="checkbox"
              checked={localFilters.smokingAllowed === 'true'}
              onChange={(e) => update('smokingAllowed', e.target.checked ? 'true' : '')}
            />
            <span className="text-sm text-slate-700">🚬 Smoking Allowed</span>
          </label>
          <label className="toggle-label">
            <input
              id="filter-pets"
              type="checkbox"
              checked={localFilters.petsAllowed === 'true'}
              onChange={(e) => update('petsAllowed', e.target.checked ? 'true' : '')}
            />
            <span className="text-sm text-slate-700">🐾 Pets Allowed</span>
          </label>
        </div>
      </div>

      {/* Sort */}
      <div className="form-group">
        <label className="form-label">Sort By</label>
        <select
          id="filter-sort"
          className="form-select"
          value={localFilters.sort || 'rent_asc'}
          onChange={(e) => update('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </aside>
  )
}
