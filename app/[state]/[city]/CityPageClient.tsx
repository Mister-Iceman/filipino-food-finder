'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CityPageClientProps {
  state: string
  city: string
}

export default function CityPageClient({ state, city }: CityPageClientProps) {
  const [cityPage, setCityPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCityPage() {
      const slug = `${state}/${city}`
      const { data } = await supabase
        .from('city_pages')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) {
        setCityPage(data)
      }
      setLoading(false)
    }

    fetchCityPage()
  }, [state, city])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!cityPage) {
    return notFound()
  }

  const communityPlaces = cityPage.community_places || []
  const foodHighlights = cityPage.food_highlights || []
  const featuredRestaurants = cityPage.featured_restaurants || []

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

            {communityPlaces.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Where Community Gathers
                </h2>
                <div className="space-y-4">
                  {communityPlaces.map((place: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
                      <p className="text-gray-600">{place.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {foodHighlights.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What You Will Notice in the Food
                </h2>
                <ul className="space-y-3">
                  {foodHighlights.map((highlight: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl">•</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {featuredRestaurants.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Most Memorable Bites
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredRestaurants.map((restaurant: any, idx: number) => (
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
          </div>

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