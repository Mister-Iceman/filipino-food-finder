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
    const { data } = await supabase
      .from('listings')
      .select('id, name, city, state, zip, address_street, phone, website, google_maps_url, category_primary, category_secondary, google_rating, google_reviews_count, hours, instagram_url, facebook_url, tiktok_url, x_url')
      .order('name', { ascending: true })
    if (data) setListings(data)
    setLoading(false)
  }

  const filterListings = () => {
    let filtered = [...listings]
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
    if (categoryFilter) {
      filtered = filtered.filter(listing =>
        listing.category_primary === categoryFilter ||
        listing.category_secondary === categoryFilter
      )
    }
    if (stateFilter) {
      filtered = filtered.filter(listing => listing.state === stateFilter)
    }
    setFilteredListings(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterListings()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('')
    setStateFilter('')
  }

  const categories = ['Restaurant', 'Supermarket & Grocery', 'Bakery, Dessert & Cafe', 'Quick Bites & Turo-Turo', 'Food Truck & Pop-Up']
  const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Restaurant Directory</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch}>
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
                />
              </div>
              <div>
                <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                >
                  <option value="">All States</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-4 items-center mt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
              >
                Search
              </button>
              {(searchQuery || categoryFilter || stateFilter) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium"
                >
                  Clear Filters
                </button>
              )}
              <p className="text-sm text-gray-600">
                Showing {filteredListings.length} of {listings.length} restaurants
              </p>
            </div>
          </form>
        </div>

        {loading && <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}
        {!loading && filteredListings.length === 0 && <div className="bg-white rounded-xl shadow-lg p-12 text-center"><p className="text-2xl text-gray-600">No restaurants found</p></div>}

        {!loading && filteredListings.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{listing.name}</h2>
                <p className="text-gray-600 mb-4">{listing.category_primary}{listing.category_secondary && ` • ${listing.category_secondary}`}</p>
                
                {listing.google_rating && (
                  <div className="bg-yellow-50 px-3 py-2 rounded-lg mb-4">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="font-bold text-lg ml-1">{listing.google_rating}</span>
                    <span className="text-gray-500 text-sm ml-2">({listing.google_reviews_count})</span>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>📍 {listing.address_street}, {listing.city}, {listing.state} {listing.zip}</p>
                  {listing.phone && <p>📞 <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline">{listing.phone}</a></p>}
                  {listing.hours && <p className="text-xs">🕐 {listing.hours}</p>}
                </div>

                {(listing.instagram_url || listing.facebook_url || listing.tiktok_url || listing.x_url) && (
                  <div className="border-t pt-3 mb-4">
                    <p className="text-xs text-gray-500 mb-2">Follow us:</p>
                    <div className="flex gap-2">
                      {listing.instagram_url && <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-2xl">📷</a>}
                      {listing.facebook_url && <a href={listing.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-2xl">👍</a>}
                      {listing.tiktok_url && <a href={listing.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 text-2xl">🎵</a>}
                      {listing.x_url && <a href={listing.x_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 text-2xl">🔗</a>}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {listing.google_maps_url && <a href={listing.google_maps_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center text-sm">Maps</a>}
                  {listing.website && <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center text-sm">Website</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}