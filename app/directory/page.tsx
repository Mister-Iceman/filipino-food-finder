'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

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
    
    // CRITICAL: Must include 'slug' in the select
    const { data, error } = await supabase
      .from('listings')
      .select('id, name, city, state, zip, address_street, phone, website, google_maps_url, category_primary, category_secondary, google_rating, google_reviews_count, hours, slug')
      .order('name', { ascending: true })

    if (data) {
      setListings(data)
      // Debug: Check if first item has slug
      console.log('✅ Loaded listings:', data.length)
      console.log('✅ First listing slug:', data[0]?.slug)
    }
    
    if (error) {
      console.error('❌ Error loading listings:', error)
    }
    
    setLoading(false)
  }

  const filterListings = () => {
    let filtered = [...listings]

    // Search filter
    if (searchQuery) {
      const cleanQuery = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(listing =>
        listing.name?.toLowerCase().includes(cleanQuery) ||
        listing.city?.toLowerCase().includes(cleanQuery) ||
        listing.state?.toLowerCase().includes(cleanQuery) ||
        listing.zip?.toLowerCase().includes(cleanQuery) ||
        listing.address_street?.toLowerCase().includes(cleanQuery)
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
      filtered = filtered.filter(listing =>
        listing.state === stateFilter
      )
    }

    setFilteredListings(filtered)
  }

  const categories = [
    'Restaurant',
    'Supermarket & Grocery',
    'Bakery, Dessert & Cafe',
    'Quick Bites & Turo-Turo',
    'Food Truck & Pop-Up'
  ]

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Restaurant Directory</h1>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name, city, state, or zip code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredListings.length} of {listings.length} restaurants
          </p>
        </div>

        {/* Loading State */}
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
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && filteredListings.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  {/* RESTAURANT NAME - CLICKABLE LINK */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {listing.slug ? (
                      <Link 
                        href={`/restaurant/${listing.slug}`}
                        className="hover:text-blue-600 hover:underline transition-colors"
                      >
                        {listing.name}
                      </Link>
                    ) : (
                      <span>{listing.name}</span>
                    )}
                  </h2>
                  
                  <p className="text-gray-600">
                    {listing.category_primary}
                    {listing.category_secondary && ` • ${listing.category_secondary}`}
                  </p>
                </div>

                {/* Rating */}
                {listing.google_rating && (
                  <div className="bg-yellow-50 px-3 py-2 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xl">★</span>
                      <span className="font-bold text-lg">{listing.google_rating}</span>
                      <span className="text-gray-500 text-sm">
                        ({listing.google_reviews_count} reviews)
                      </span>
                    </div>
                  </div>
                )}

                {/* Address & Contact */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400">📍</span>
                    <span>
                      {listing.address_street}<br />
                      {listing.city}, {listing.state} {listing.zip}
                    </span>
                  </p>

                  {listing.phone && (
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">📞</span>
                      <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline">
                        {listing.phone}
                      </a>
                    </p>
                  )}

                  {listing.hours && (
                    <p className="flex items-start gap-2">
                      <span className="text-gray-400">🕐</span>
                      <span className="whitespace-pre-line text-xs">{listing.hours}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {listing.google_maps_url && (
                    
                      href={listing.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center font-medium text-sm"
                    >
                      Maps
                    </a>
                  )}

                  {listing.website && (
                    
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center font-medium text-sm"
                    >
                      Website
                    </a>
                  )}

                  {listing.slug && (
                    <Link
                      href={`/restaurant/${listing.slug}`}
                      className="flex-1 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-center font-medium text-sm"
                    >
                      Details
                    </Link>
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