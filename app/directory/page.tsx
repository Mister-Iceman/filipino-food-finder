import { createClient } from '@/lib/supabase/server'

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const searchQuery = params.search as string || ''
  const categoryFilter = params.category as string || ''
  const stateFilter = params.state as string || ''

  const supabase = await createClient()
  
  let query = supabase
    .from('listings')
    .select('*')
    .order('name')

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,state.ilike.%${searchQuery}%,zip.ilike.%${searchQuery}%`)
  }

  if (categoryFilter) {
    query = query.eq('category_primary', categoryFilter)
  }

  if (stateFilter) {
    query = query.eq('state', stateFilter)
  }

  const { data: listings, error } = await query
  
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error loading restaurants</h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    )
  }

  const { data: allListings } = await supabase
    .from('listings')
    .select('state')
  
  const uniqueStates = [...new Set(allListings?.map(l => l.state))].sort()

  const categories: Record<string, typeof listings> = {
    'Restaurant': listings?.filter(l => l.category_primary === 'Restaurant') || [],
    'Supermarket & Grocery': listings?.filter(l => l.category_primary === 'Supermarket & Grocery') || [],
    'Bakery, Dessert & Cafe': listings?.filter(l => l.category_primary === 'Bakery, Dessert & Cafe') || [],
    'Quick Bites & Turo-Turo': listings?.filter(l => l.category_primary === 'Quick Bites & Turo-Turo') || [],
    'Food Truck & Pop-Up': listings?.filter(l => l.category_primary === 'Food Truck & Pop-Up') || [],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header role="banner" className="bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">Filipino Food Directory</h1>
          
          <form method="GET" className="space-y-4" role="search">
            <div className="flex gap-4 flex-wrap">
              <label htmlFor="search-input" className="sr-only">Search by name, city, state, or zip code</label>
              <input
                id="search-input"
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search by name, city, state, or zip code..."
                className="flex-1 min-w-[300px] px-4 py-3 rounded-lg text-gray-900 shadow-md focus:ring-4 focus:ring-yellow-400 outline-none"
                aria-label="Search for Filipino restaurants by name, city, state, or zip code"
              />
              
              <label htmlFor="category-filter" className="sr-only">Filter by category</label>
              <select
                id="category-filter"
                name="category"
                defaultValue={categoryFilter}
                className="px-4 py-3 rounded-lg text-gray-900 shadow-md focus:ring-4 focus:ring-yellow-400 outline-none"
                aria-label="Filter restaurants by category"
              >
                <option value="">All Categories</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Supermarket & Grocery">Supermarket & Grocery</option>
                <option value="Bakery, Dessert & Cafe">Bakery, Dessert & Cafe</option>
                <option value="Quick Bites & Turo-Turo">Quick Bites & Turo-Turo</option>
                <option value="Food Truck & Pop-Up">Food Truck & Pop-Up</option>
              </select>

              <label htmlFor="state-filter" className="sr-only">Filter by state</label>
              <select
                id="state-filter"
                name="state"
                defaultValue={stateFilter}
                className="px-4 py-3 rounded-lg text-gray-900 shadow-md focus:ring-4 focus:ring-yellow-400 outline-none"
                aria-label="Filter restaurants by state"
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <button
                type="submit"
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md transition-all hover:scale-105"
                aria-label="Search for restaurants"
              >
                Search
              </button>
            </div>
          </form>

          <p className="text-white/90 mt-4" role="status" aria-live="polite">
            Showing {listings?.length || 0} results
            {searchQuery && ` for "${searchQuery}"`}
            {categoryFilter && ` in ${categoryFilter}`}
            {stateFilter && ` in ${stateFilter}`}
          </p>
        </div>
      </header>

      <main role="main" className="max-w-7xl mx-auto px-4 py-8">
        {listings && listings.length === 0 ? (
          <div className="text-center py-16" role="alert">
            <p className="text-2xl text-gray-600">No restaurants found. Try adjusting your filters.</p>
          </div>
        ) : (
          Object.entries(categories).map(([category, items]) => {
            if (items.length === 0) return null
            
            return (
              <section key={category} className="mb-12" aria-labelledby={`category-${category.replace(/\s+/g, '-')}`}>
                <h2 id={`category-${category.replace(/\s+/g, '-')}`} className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-4 border-red-600">
                  {category} ({items.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((listing: any) => (
                    <article 
                      key={listing.id} 
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 hover:scale-105 border-l-4 border-blue-600"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {listing.name}
                      </h3>
                      
                      <address className="text-gray-600 space-y-2 mb-4 not-italic">
                        <p className="flex items-start gap-2">
                          <span className="text-red-600" aria-hidden="true">📍</span>
                          <span>
                            {listing.address_street}<br/>
                            {listing.city}, {listing.state} {listing.zip}
                          </span>
                        </p>
                        {listing.phone && (
                          <p className="flex items-center gap-2 text-blue-600">
                            <span aria-hidden="true">📞</span>
                            <a href={`tel:${listing.phone}`} className="hover:underline">
                              {listing.phone}
                            </a>
                          </p>
                        )}
                      </address>

                      {listing.google_rating && (
                        <div className="bg-yellow-50 px-3 py-2 rounded-lg mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500 text-xl" aria-hidden="true">★</span>
                            <span className="font-bold text-lg">{listing.google_rating}</span>
                            <span className="text-gray-500 text-sm">
                              ({listing.google_reviews_count} Google reviews)
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Rating from Google Maps
                          </p>
                        </div>
                      )}

                      {listing.hours && (
                        <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                          <span aria-hidden="true">⏰</span> {listing.hours}
                        </p>
                      )}

                      <div className="flex gap-3 flex-wrap pt-4 border-t">
                        {listing.google_maps_url && (
                          <a 
                            href={listing.google_maps_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            aria-label={`View ${listing.name} on Google Maps`}
                          >
                            Google Maps
                          </a>
                        )}
                        {listing.website && (
                          <a 
                            href={listing.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1 text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                            aria-label={`Visit ${listing.name} website`}
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })
        )}
      </main>
    </div>
  )
}