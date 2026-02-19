'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdSlot from '../components/AdSlot'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CommunityInsight {
  listing_id: number
  rating_count: number
  taste_style?: string
  avg_price?: number
  avg_portion_size?: number
  top_good_for?: string[]
  parking?: string
}

const ITEMS_PER_PAGE = 24

const DISH_TAGS = [
  { label: 'Sisig', emoji: '🍳' },
  { label: 'Lechon', emoji: '🐷' },
  { label: 'Lumpia', emoji: '🥢' },
  { label: 'Pancit', emoji: '🍜' },
  { label: 'Halo-Halo', emoji: '🍧' },
  { label: 'Adobo', emoji: '🍖' },
  { label: 'Ube', emoji: '💜' },
  { label: 'Kare-Kare', emoji: '🥜' },
  { label: 'Bangus', emoji: '🐟' },
  { label: 'Longganisa', emoji: '🌭' },
]

export default function DirectoryContent() {
  const searchParams = useSearchParams()

  const [listings, setListings] = useState<any[]>([])
  const [filteredListings, setFilteredListings] = useState<any[]>([])
  const [communityInsights, setCommunityInsights] = useState<Map<number, CommunityInsight>>(new Map())
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [sortOption, setSortOption] = useState('az')
  const [activeDishTag, setActiveDishTag] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    const stateParam = searchParams.get('state')
    const cityParam = searchParams.get('city')

    if (categoryParam) setCategoryFilter(decodeURIComponent(categoryParam))
    if (searchParam) setSearchQuery(decodeURIComponent(searchParam))
    if (stateParam) setStateFilter(decodeURIComponent(stateParam))
    if (cityParam) setCityFilter(decodeURIComponent(cityParam))
  }, [searchParams])

  useEffect(() => {
    loadListings()
    loadCommunityInsights()
  }, [])

  useEffect(() => {
    filterAndSortListings()
  }, [listings, searchQuery, categoryFilter, stateFilter, cityFilter, sortOption, activeDishTag])

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, stateFilter, cityFilter, sortOption, activeDishTag])

  const loadListings = async () => {
    setLoading(true)
    let allData: any[] = []
    let from = 0
    const batchSize = 1000

    while (true) {
      const { data } = await supabase
        .from('listings')
        .select('id, name, slug, city, state, zip, address_street, phone, website, google_maps_url, category_primary, category_secondary, google_rating, google_reviews_count, hours, instagram_url, facebook_url, tiktok_url, x_url')
        .range(from, from + batchSize - 1)
        .order('name', { ascending: true })

      if (!data || data.length === 0) break
      allData = [...allData, ...data]
      if (data.length < batchSize) break
      from += batchSize
    }

    setListings(allData)
    setLoading(false)
  }

  const loadCommunityInsights = async () => {
    const { data: ratings } = await supabase
      .from('ratings')
      .select('listing_id, listing_category, taste_style, price, portion_size, good_for, parking')

    if (!ratings) return

    const insightsMap = new Map<number, CommunityInsight>()

    const grouped = ratings.reduce((acc: any, rating: any) => {
      if (!acc[rating.listing_id]) acc[rating.listing_id] = []
      acc[rating.listing_id].push(rating)
      return acc
    }, {})

    Object.keys(grouped).forEach((listingId) => {
      const listingRatings = grouped[listingId]
      const count = listingRatings.length
      const tasteStyles = listingRatings.filter((r: any) => r.taste_style).map((r: any) => r.taste_style)
      const prices = listingRatings.filter((r: any) => r.price).map((r: any) => r.price)
      const portions = listingRatings.filter((r: any) => r.portion_size).map((r: any) => r.portion_size)
      const parkingOptions = listingRatings.filter((r: any) => r.parking).map((r: any) => r.parking)

      insightsMap.set(parseInt(listingId), {
        listing_id: parseInt(listingId),
        rating_count: count,
        taste_style: getMostCommon(tasteStyles),
        avg_price: prices.length > 0 ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length) : undefined,
        avg_portion_size: portions.length > 0 ? Math.round(portions.reduce((a: number, b: number) => a + b, 0) / portions.length) : undefined,
        parking: getMostCommon(parkingOptions),
      })
    })

    setCommunityInsights(insightsMap)
  }

  const getMostCommon = (arr: string[]) => {
    if (arr.length === 0) return undefined
    const counts: any = {}
    arr.forEach(item => { counts[item] = (counts[item] || 0) + 1 })
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  }

  const filterAndSortListings = () => {
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

    if (cityFilter) {
      filtered = filtered.filter(listing =>
        listing.city?.toLowerCase() === cityFilter.toLowerCase()
      )
    }

    // Dish tag filter — matches against name and categories
    if (activeDishTag) {
      const tag = activeDishTag.toLowerCase()
      filtered = filtered.filter(listing =>
        listing.name?.toLowerCase().includes(tag) ||
        listing.category_primary?.toLowerCase().includes(tag) ||
        listing.category_secondary?.toLowerCase().includes(tag)
      )
    }

    // Sort
    if (sortOption === 'rating') {
      filtered = filtered.sort((a, b) => (b.google_rating || 0) - (a.google_rating || 0))
    } else if (sortOption === 'reviews') {
      filtered = filtered.sort((a, b) => (b.google_reviews_count || 0) - (a.google_reviews_count || 0))
    } else {
      // A-Z (default)
      filtered = filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }

    setFilteredListings(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterAndSortListings()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('')
    setStateFilter('')
    setCityFilter('')
    setSortOption('az')
    setActiveDishTag('')
  }

  const handleDishTag = (label: string) => {
    setActiveDishTag(prev => prev === label ? '' : label)
  }

  const getTasteLabel = (taste: string) => {
    const labels: any = { traditional: 'Traditional', fusion: 'Fusion', americanized: 'Americanized' }
    return labels[taste] || taste
  }

  const getPriceLabel = (price: number) => {
    if (price === 1) return 'Budget'
    if (price === 2) return 'Moderate'
    if (price === 3) return 'Premium'
    return ''
  }

  const categories = ['Restaurant', 'Supermarket & Grocery', 'Bakery, Dessert & Cafe', 'Quick Bites & Turo-Turo', 'Food Truck & Pop-Up']
  const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE)
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const hasActiveFilters = searchQuery || categoryFilter || stateFilter || cityFilter || activeDishTag || sortOption !== 'az'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Filipino Food Directory</h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover authentic Filipino restaurants, bakeries, grocery stores, and food trucks across America.
            From traditional turo-turo to modern Filipino fusion, find your next favorite spot.
          </p>

          {/* Category Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Link href="/directory?category=Restaurant" className="bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 text-center transition-all">
              <div className="text-3xl mb-2">🍽️</div>
              <div className="font-semibold text-gray-900">Restaurants</div>
            </Link>
            <Link href="/directory?category=Supermarket%20%26%20Grocery" className="bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 text-center transition-all">
              <div className="text-3xl mb-2">🛒</div>
              <div className="font-semibold text-gray-900">Grocery</div>
            </Link>
            <Link href="/directory?category=Bakery%2C%20Dessert%20%26%20Cafe" className="bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 text-center transition-all">
              <div className="text-3xl mb-2">🥐</div>
              <div className="font-semibold text-gray-900">Bakeries</div>
            </Link>
            <Link href="/directory?category=Quick%20Bites%20%26%20Turo-Turo" className="bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 text-center transition-all">
              <div className="text-3xl mb-2">🌮</div>
              <div className="font-semibold text-gray-900">Quick Bites</div>
            </Link>
            <Link href="/directory?category=Food%20Truck%20%26%20Pop-Up" className="bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 text-center transition-all">
              <div className="text-3xl mb-2">🚚</div>
              <div className="font-semibold text-gray-900">Food Trucks</div>
            </Link>
          </div>
        </div>

        {/* Search + Filter Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSearch}>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
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

            {/* Sort + Actions row */}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
              >
                Search
              </button>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-sm text-gray-600 font-medium whitespace-nowrap">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="az">A–Z</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium"
                >
                  Clear All
                </button>
              )}

              <p className="text-sm text-gray-600 ml-auto">
                Showing {filteredListings.length} of {listings.length} spots
                {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
          </form>

          {/* Dish Quick-Filter Tags */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filter by dish or specialty</p>
            <div className="flex flex-wrap gap-2">
              {DISH_TAGS.map(({ label, emoji }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleDishTag(label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activeDishTag === label
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && filteredListings.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-2xl text-gray-600 mb-2">No spots found</p>
            <p className="text-gray-500 mb-4">Try adjusting your search or clearing filters.</p>
            <button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Clear All Filters
            </button>
          </div>
        )}

        {!loading && paginatedListings.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedListings.map((listing, index) => {
                const insight = communityInsights.get(listing.id)

                return (
                  <div key={listing.id}>
                    {index > 0 && index % 6 === 0 && (
                      <div className="md:col-span-2 lg:col-span-3 mb-6">
                        <AdSlot
                          slot="1234567890"
                          format="horizontal"
                          className="my-4"
                        />
                      </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                      <Link href={`/listings/${listing.slug}`}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition">
                          {listing.name}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4">
                        {listing.category_primary}
                        {listing.category_secondary && ` • ${listing.category_secondary}`}
                      </p>

                      {listing.google_rating && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 px-3 py-2 rounded-lg mb-3">
                          <div className="flex items-start gap-2">
                            <span className="text-lg mt-0.5">🌐</span>
                            <div className="flex-1">
                              <p className="font-semibold text-yellow-900 text-sm mb-1">Google Rating</p>
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500 text-xl">★</span>
                                <span className="font-bold text-lg">{listing.google_rating}</span>
                                <span className="text-gray-500 text-sm">({listing.google_reviews_count} reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {insight ? (
                        <div className="bg-purple-50 border-l-4 border-purple-400 px-3 py-2 rounded-lg mb-4">
                          <div className="flex items-start gap-2">
                            <span className="text-lg mt-0.5" title="Community Insights">👥</span>
                            <div className="flex-1">
                              <p className="font-semibold text-purple-900 text-sm mb-1">
                                Community ({insight.rating_count} {insight.rating_count === 1 ? 'rating' : 'ratings'})
                              </p>
                              <div className="text-xs text-purple-800 space-y-0.5">
                                {insight.taste_style && <p>🇵🇭 {getTasteLabel(insight.taste_style)}</p>}
                                {insight.avg_price && <p>💵 {getPriceLabel(insight.avg_price)}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link href={`/listings/${listing.slug}`}>
                          <div className="bg-blue-50 border-l-4 border-blue-400 px-3 py-2 rounded-lg mb-4 cursor-pointer hover:bg-blue-100 transition">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">✨</span>
                              <p className="text-sm text-blue-800 font-medium">
                                No community ratings yet - Be the first!
                              </p>
                            </div>
                          </div>
                        </Link>
                      )}

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p>📍 {listing.address_street}, {listing.city}, {listing.state} {listing.zip}</p>
                        {listing.phone && (
                          <p>📞 <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline">{listing.phone}</a></p>
                        )}
                        {listing.hours && <p className="text-xs">🕐 {listing.hours}</p>}
                      </div>

                      {(listing.instagram_url || listing.facebook_url || listing.tiktok_url || listing.x_url) && (
                        <div className="border-t pt-3 mb-4">
                          <p className="text-xs text-gray-500 mb-2">Follow us:</p>
                          <div className="flex gap-3">
                            {listing.instagram_url && (
                              <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700" title="Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                              </a>
                            )}
                            {listing.facebook_url && (
                              <a href={listing.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" title="Facebook">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                              </a>
                            )}
                            {listing.tiktok_url && (
                              <a href={listing.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700" title="TikTok">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                              </a>
                            )}
                            {listing.x_url && (
                              <a href={listing.x_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700" title="X (Twitter)">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {listing.google_maps_url && (
                          <a href={listing.google_maps_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center text-sm">
                            Maps
                          </a>
                        )}
                        {listing.website && (
                          <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center text-sm">
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap justify-center items-center gap-2">
                <button
                  onClick={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  « First
                </button>
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ‹ Prev
                </button>

                {/* Page number pills */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2
                  )
                  .reduce((acc: (number | string)[], page, idx, arr) => {
                    if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                    acc.push(page)
                    return acc
                  }, [])
                  .map((item, idx) =>
                    item === '...'
                      ? <span key={`dots-${idx}`} className="px-2 text-gray-400">…</span>
                      : (
                        <button
                          key={item}
                          onClick={() => { setCurrentPage(item as number); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            currentPage === item
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {item}
                        </button>
                      )
                  )
                }

                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next ›
                </button>
                <button
                  onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Last »
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
