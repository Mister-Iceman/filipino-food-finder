import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CityPageProps {
  params: Promise<{ state: string; city: string }>
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { state, city } = await params
  const slug = `${state}/${city}`

  const { data: cityPage } = await supabase
    .from('city_pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (cityPage) {
    return {
      title: cityPage.meta_title || `Filipino Food in ${cityPage.city}, ${cityPage.state_full}`,
      description: cityPage.meta_description || `Discover authentic Filipino restaurants in ${cityPage.city}, ${cityPage.state_full}`,
    }
  }

  return {
    title: `Filipino Food in ${city.replace(/-/g, ' ')} | Filipino Food Near Me`,
    description: `Find Filipino restaurants in ${city.replace(/-/g, ' ')}`,
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { state, city } = await params
  const slug = `${state}/${city}`

  const { data: cityPage } = await supabase
    .from('city_pages')
    .select('*')
    .eq('slug', slug)
    .single()

  const stateAbbr = state.toUpperCase().slice(0, 2)
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const { data: restaurants } = await supabase
    .from('listings')
    .select('*')
    .ilike('city', cityName)
    .eq('state', stateAbbr)
    .order('name')

  if (!cityPage && (!restaurants || restaurants.length === 0)) {
    notFound()
  }

  if (cityPage) {
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
            <p className="text-xl md:text-2xl max-w-3xl opacity-95">
              {cityPage.intro_tagline}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section className="bg-white rounded-xl shadow-lg p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {cityPage.intro_paragraph_1}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {cityPage.intro_paragraph_2}
                  </p>
                </div>
              </section>

              {cityPage.community_places && cityPage.community_places.length > 0 && (
                <section className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    🏘️ Where Community Gathers
                  </h2>
                  <div className="space-y-4">
                    {cityPage.community_places.map((place: any, idx: number) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
                        <p className="text-gray-600">{place.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {cityPage.food_highlights && cityPage.food_highlights.length > 0 && (
                <section className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    🍽️ What You'll Notice in the Food
                  </h2>
                  <ul className="space-y-3">
                    {cityPage.food_highlights.map((highlight: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-blue-600 text-xl">•</span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {cityPage.featured_restaurants && cityPage.featured_restaurants.length > 0 && (
                <section className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    ⭐ Most Memorable Bites
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {cityPage.featured_restaurants.map((restaurant: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
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

              {restaurants && restaurants.length > 0 && (
                <section className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    📍 All Filipino Restaurants in {cityPage.city}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {restaurants.map((restaurant: any) => (
                      <Link
                        key={restaurant.id}
                        href={`/listings/${restaurant.slug}`}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-bold text-gray-900 hover:text-blue-600">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-600">{restaurant.category_primary}</p>
                        {restaurant.google_rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{restaurant.google_rating}</span>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Facts</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Filipino Population</p>
                      <p className="font-bold text-gray-900">{cityPage.filipino_population}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Migration History</p>
                      <p className="text-gray-700">{cityPage.migration_history}</p>
                    </div>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Filipino Food in {cityName}
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          {restaurants?.length || 0} Filipino restaurants and businesses
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants?.map((restaurant: any) => (
            <Link
              key={restaurant.id}
              href={`/listings/${restaurant.slug}`}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 mb-2">
                {restaurant.name}
              </h3>
              <p className="text-gray-600 mb-2">{restaurant.category_primary}</p>
              {restaurant.google_rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{restaurant.google_rating}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}