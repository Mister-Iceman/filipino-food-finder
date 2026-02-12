import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CityPageProps {
  params: Promise<{ state: string; city: string }>
}

export default async function CityPage({ params }: CityPageProps) {
  const { state, city } = await params
  const slug = `${state}/${city}`

  const { data: cityPage } = await supabase
    .from('city_pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!cityPage) {
    notFound()
  }

  // Parse JSONB fields safely on server
  const communityPlaces = cityPage.community_places ? JSON.parse(JSON.stringify(cityPage.community_places)) : []
  const foodHighlights = cityPage.food_highlights ? JSON.parse(JSON.stringify(cityPage.food_highlights)) : []
  const featuredRestaurants = cityPage.featured_restaurants ? JSON.parse(JSON.stringify(cityPage.featured_restaurants)) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm mb-6 opacity-90">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="hover:underline">Guides</Link>
            <span className="mx-2">/</span>
            <span>{cityPage.city}</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {cityPage.city}, {cityPage.state_full}
          </h1>
          {cityPage.intro_tagline && (
            <p className="text-xl md:text-2xl max-w-3xl opacity-95">
              {cityPage.intro_tagline}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Introduction */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                {cityPage.intro_paragraph_1 && (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {cityPage.intro_paragraph_1}
                  </p>
                )}
                {cityPage.intro_paragraph_2 && (
                  <p className="text-gray-700 leading-relaxed">
                    {cityPage.intro_paragraph_2}
                  </p>
                )}
              </div>
            </section>

            {/* Community Places */}
            {communityPlaces.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  🏘️ Where Community Gathers
                </h2>
                <div className="space-y-4">
                  {communityPlaces.map((place: { name: string; description: string }, idx: number) => (
                    <div key={`place-${idx}`} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
                      <p className="text-gray-600">{place.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Food Highlights */}
            {foodHighlights.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  🍽️ What You&apos;ll Notice in the Food
                </h2>
                <ul className="space-y-3">
                  {foodHighlights.map((highlight: string, idx: number) => (
                    <li key={`food-${idx}`} className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl">•</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Featured Restaurants */}
            {featuredRestaurants.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  ⭐ Most Memorable Bites
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredRestaurants.map((restaurant: { name: string; description: string; signature_dish?: string }, idx: number) => (
                    <div key={`restaurant-${idx}`} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{restaurant.description}</p>
                      {restaurant.signature_dish && (
                        <p className="text-sm text-blue-600">
                          <strong>Try:</strong> {restaurant.signature_dish}
                        </p>
                      )}
                    </div>
                  ))}
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
                  {cityPage.filipino_population && (
                    <div>
                      <p className="text-gray-600">Filipino Population</p>
                      <p className="font-bold text-gray-900">{cityPage.filipino_population}</p>
                    </div>
                  )}
                  {cityPage.migration_history && (
                    <div>
                      <p className="text-gray-600">Migration History</p>
                      <p className="text-gray-700">{cityPage.migration_history}</p>
                    </div>
                  )}
                  {cityPage.cultural_tidbit && (
                    <div>
                      <p className="text-gray-600">Did You Know?</p>
                      <p className="text-gray-700">{cityPage.cultural_tidbit}</p>
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