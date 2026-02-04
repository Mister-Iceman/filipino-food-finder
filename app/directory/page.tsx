'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DirectoryPage() {
  const [listings, setListings] = useState<any[]>([])
  const [filteredListings, setFilteredListings] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [listings, searchQuery, categoryFilter, stateFilter])

  const loadListings = async () => {
    setLoading(true)
    
    // IMPORTANT: Must explicitly list ALL columns including social media
    const { data, error } = await supabase
      .from('listings')
      .select('id, name, city, state, zip, address_street, phone, website, google_maps_url, category_primary, category_secondary, google_rating, google_reviews_count, hours, instagram_url, facebook_url, tiktok_url, x_url')
      .order('name', { ascending: true })
    
    if (data) {
      setListings(data)
      console.log('✅ Loaded', data.length, 'restaurants')
      console.log('✅ First restaurant social:', data[0]?.instagram_url)
    }
    if (error) console.error('❌ Error:', error)
    
    setLoading(false)
  }

  const filterListings = () => {
    let filtered = [...listings]

    // Search filter - only apply if there's a search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(listing =>
        listing.name?.toLowerCase().includes(q) ||
        listing.city?.toLowerCase().includes(q) ||
        listing.state?.toLowerCase().includes(q) ||
        listing.zip?.toLowerCase().includes(q) ||
        listing.address_street?.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(listing =>
        listing.category_primary === categoryFilter ||
        listing.category_secondary === categoryFilter
      )
    }

    // State filter
    if (stateFilter) {
      filtered = filtered.filter(listing => listing.state === stateFilter)
    }

    setFilteredListings(filtered)
  }

  const categories = ['Restaurant', 'Supermarket & Grocery', 'Bakery, Dessert & Cafe', 'Quick Bites & Turo-Turo', 'Food Truck & Pop-Up']
  const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Restaurant Directory</h1>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={(e) => { e.preventDefault(); filterListings(); }} className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="search-input" className="sr-only">Search restaurants</label>
                <input
                  id="search-input"
                  type="search"
                  placeholder="Search by name, city, state, or zip..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  aria-label="Search for Filipino restaurants by name, city, state, or zip code"
                />
              </div>

              <div>
                <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  aria-label="Filter restaurants by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="state-filter" className="sr-only">Filter by state</label>
                <select
                  id="state-filter"
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  aria-label="Filter restaurants by state"
                >
                  <option value="">All States</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
                aria-label="Search restaurants"
              >
                Search
              </button>
              
              {(searchQuery || categoryFilter || stateFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('')
                    setStateFilter('')
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  aria-label="Clear all filters"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </form>
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name, city, state, or zip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All States</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredListings.length} of {listings.length} restaurants
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading restaurants...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredListings.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-2xl text-gray-600 mb-4">No restaurants found</p>
            <p className="text-gray-500">
              {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && filteredListings.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{listing.name}</h2>
                <p className="text-gray-600 mb-4">
                  {listing.category_primary}
                  {listing.category_secondary && ` • ${listing.category_secondary}`}
                </p>

                {/* Rating */}
                {listing.google_rating && (
                  <div className="bg-yellow-50 px-3 py-2 rounded-lg mb-4">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="font-bold text-lg ml-1">{listing.google_rating}</span>
                    <span className="text-gray-500 text-sm ml-2">({listing.google_reviews_count})</span>
                  </div>
                )}

                {/* Address & Contact */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>📍 {listing.address_street}, {listing.city}, {listing.state} {listing.zip}</p>
                  {listing.phone && (
                    <p>📞 <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline">{listing.phone}</a></p>
                  )}
                  {listing.hours && <p className="text-xs">🕐 {listing.hours}</p>}
                </div>

                {/* Social Media - FIXED */}
                {(listing.instagram_url || listing.facebook_url || listing.tiktok_url || listing.x_url) && (
                  <div className="border-t pt-3 mb-4">
                    <p className="text-xs text-gray-500 mb-2">Follow us:</p>
                    <div className="flex gap-3">
                      {listing.instagram_url && (
                        
                          href={listing.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700"
                          title="Instagram"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}

                      {listing.facebook_url && (
                        
                          href={listing.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                          title="Facebook"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}

                      {listing.tiktok_url && (
                        
                          href={listing.tiktok_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 hover:text-gray-700"
                          title="TikTok"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        </a>
                      )}

                      {listing.x_url && (
                        
                          href={listing.x_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 hover:text-gray-700"
                          title="X (Twitter)"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {listing.google_maps_url && (
                    
                      href={listing.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center text-sm font-medium"
                    >
                      Maps
                    </a>
                  )}
                  {listing.website && (
                    
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center text-sm font-medium"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}