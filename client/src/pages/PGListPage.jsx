import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios.js'
import PGCard from '../components/PGCard.jsx'
import SearchFilters from '../components/SearchFilters.jsx'

/**
 * PGListPage — full search results with sidebar filters + pagination.
 * Route: /pgs
 */
export default function PGListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    city:            searchParams.get('city')    || '',
    area:            searchParams.get('area')    || '',
    location:        searchParams.get('location')|| '',
    minPrice:        searchParams.get('minPrice')|| '',
    maxPrice:        searchParams.get('maxPrice')|| '',
    roomType:        searchParams.get('roomType')|| '',
    furnishingType:  searchParams.get('furnishingType') || '',
    smokingAllowed:  searchParams.get('smokingAllowed') || '',
    petsAllowed:     searchParams.get('petsAllowed')    || '',
    sort:            searchParams.get('sort')    || 'rent_asc',
  })

  const [results,    setResults]    = useState([])
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1 })
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const fetchPGs = useCallback(async (f, p) => {
    setLoading(true)
    try {
      // Build query params — skip empty values
      const params = new URLSearchParams({ page: p, limit: 9, sort: f.sort || 'rent_asc' })
      const stringFields = ['city', 'area', 'location', 'minPrice', 'maxPrice', 'roomType', 'furnishingType']
      stringFields.forEach((key) => { if (f[key]) params.set(key, f[key]) })
      if (f.smokingAllowed) params.set('smokingAllowed', 'true')
      if (f.petsAllowed)    params.set('petsAllowed',    'true')

      const { data } = await api.get(`/pg/search?${params.toString()}`)
      setResults(data.data   || [])
      setPagination(data.pagination || { total: 0, pages: 0, page: 1 })
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Re-fetch when filters or page changes
  useEffect(() => {
    fetchPGs(filters, page)
  }, [filters, page, fetchPGs])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
    // Sync to URL
    const params = {}
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params)
    setShowMobileFilters(false)
  }

  return (
    <div className="container-max py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {filters.city ? `PGs in ${filters.city}` : 'All PG Listings'}
            {loading ? '' : ` (${pagination.total})`}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Available beds only</p>
        </div>
        <button
          id="mobile-filter-btn"
          className="lg:hidden btn btn-secondary btn-sm"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          🔧 Filters {showMobileFilters ? '▲' : '▼'}
        </button>
      </div>

      <div className="flex gap-6 items-start">

        {/* Sidebar Filters — desktop */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <SearchFilters filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="relative ml-auto w-80 max-w-full h-full bg-white overflow-y-auto p-5 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-2xl text-slate-400">×</button>
              </div>
              <SearchFilters filters={filters} onChange={handleFilterChange} />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-7 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">No PGs Found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or searching a different area.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((pg) => (
                  <PGCard key={pg._id} pg={pg} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-secondary btn-sm disabled:opacity-30"
                  >
                    ← Prev
                  </button>

                  {[...Array(pagination.pages)].map((_, i) => {
                    const p = i + 1
                    if (p === 1 || p === pagination.pages || Math.abs(p - page) <= 1) {
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                            p === page
                              ? 'bg-brand-500 text-white shadow'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    }
                    if (Math.abs(p - page) === 2) return <span key={p} className="text-slate-400 text-sm">…</span>
                    return null
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="btn btn-secondary btn-sm disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
