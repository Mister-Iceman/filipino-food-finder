import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function CityPage({ params }: any) {
  const { state, city } = await params
  const slug = `${state}/${city}`
  
  const { data } = await supabase
    .from('city_pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center"><p>City guide coming soon</p></div>
  }

  const stateAbbr = data.state
  const cityName = data.city

  // Fetch actual restaurants from the listings table for this specific city
  const { data: restaurants } = await supabase
    .from('listings')
    .select('*')
    .eq('state', stateAbbr)
    .eq('city', cityName) // Changed from ilike to exact match
    .order('google_rating', { ascending: false })
    .limit(12)

  // For featured restaurants, find their actual listings to get slugs
  const featuredWithLinks = data.featured_restaurants ? await Promise.all(
    data.featured_restaurants.map(async (featured: any) => {
      const { data: listing } = await supabase
        .from('listings')
        .select('slug, google_rating, google_total_ratings')
        .eq('state', stateAbbr)
        .ilike('name', `%${featured.name}%`)
        .limit(1)
        .maybeSingle()
      
      return {
        ...featured,
        slug: listing?.slug,
        google_rating: listing?.google_rating,
        google_total_ratings: listing?.google_total_ratings
      }
    })
  ) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm mb-6 opacity-90">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="hover:underline">Guides</Link>
            <span className="mx-2">/</span>
            <span>{data.city}</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {data.city}, {data.state_full}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl opacity-95">
            {data.intro_tagline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Introduction */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {data.intro_paragraph_1}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {data.intro_paragraph_2}
                </p>
              </div>
            </section>

            {/* Community Places */}
            {data.community_places && data.community_places.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  🏘️ Where Community Gathers
                </h2>
                <div className="space-y-4">
                  {data.community_places.map((place: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
                      <p className="text-gray-600">{place.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Food Highlights */}
            {data.food_highlights && data.food_highlights.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  🍽️ What You'll Notice in the Food
                </h2>
                <ul className="space-y-3">
                  {data.food_highlights.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl">•</span>
                      <span className="text-gray-700">{typeof item === 'string' ? item : item.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Featured Restaurants - NOW CLICKABLE */}
            {featuredWithLinks.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  ⭐ Most Memorable Bites
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredWithLinks.map((restaurant: any, idx: number) => {
                    const CardContent = (
                      <>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {restaurant.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{restaurant.description}</p>
                        {restaurant.signature_dish && (
                          <p className="text-sm text-blue-600 mb-2">
                            <strong>Try:</strong> {restaurant.signature_dish}
                          </p>
                        )}
                        {restaurant.google_rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium text-sm">{restaurant.google_rating}</span>
                            {restaurant.google_total_ratings && (
                              <span className="text-gray-500 text-xs">({restaurant.google_total_ratings})</span>
                            )}
                          </div>
                        )}
                      </>
                    )

                    if (restaurant.slug) {
                      return (
                        <Link
                          key={idx}
                          href={`/listings/${restaurant.slug}`}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition-all"
                        >
                          {CardContent}
                        </Link>
                      )
                    } else {
                      return (
                        <div key={idx} className="border border-gray-200 rounded-lg p-6">
                          {CardContent}
                        </div>
                      )
                    }
                  })}
                </div>
              </section>
            )}

            {/* All Restaurants in City - CLICKABLE */}
            {restaurants && restaurants.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  📍 All Filipino Restaurants in {data.city}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {restaurants.map((restaurant: any) => (
                    <Link
                      key={restaurant.id}
                      href={`/listings/${restaurant.slug}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-500"
                    >
                      <h3 className="font-bold text-gray-900 hover:text-blue-600 mb-1">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{restaurant.category_primary}</p>
                      {restaurant.google_rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-sm">{restaurant.google_rating}</span>
                          {restaurant.google_total_ratings && (
                            <span className="text-gray-500 text-xs">({restaurant.google_total_ratings})</span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href={`/directory?city=${encodeURIComponent(cityName)}&state=${stateAbbr}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    View All {cityName} Restaurants →
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Filipino Population</p>
                    <p className="font-bold text-gray-900">{data.filipino_population}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Migration History</p>
                    <p className="text-gray-700">{data.migration_history}</p>
                  </div>
                  {data.cultural_tidbit && (
                    <div>
                      <p className="text-gray-600">Did You Know?</p>
                      <p className="text-gray-700">{data.cultural_tidbit}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6 text-center">
                <h3 className="font-bold text-lg text-gray-900 mb-3">
                  Know a great spot?
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Help us keep this guide complete and accurate.
                </p>
                <Link
                  href="/add-business"
                  className="block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold transition-colors"
                >
                  Add a Restaurant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}