'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CityData {
  city: string
  state_full: string
  state: string
  intro_tagline: string
  intro_paragraph_1: string
  intro_paragraph_2: string
  filipino_population: string
  migration_history: string
  cultural_tidbit: string
  community_places: Array<{ name: string; description: string }>
  food_highlights: string[]
  featured_restaurants: Array<{ name: string; description: string; signature_dish?: string }>
}

export default function CityPage() {
  const params = useParams()
  const [cityData, setCityData] = useState<CityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCityData() {
      try {
        const state = params?.state as string
        const city = params?.city as string
        
        if (!state || !city) {
          setError('Invalid URL')
          setLoading(false)
          return
        }

        const slug = `${state}/${city}`
        
        const { data, error: fetchError } = await supabase
          .from('city_pages')
          .select('*')
          .eq('slug', slug)
          .single()

        if (fetchError || !data) {
          setError('City guide not found')
          setLoading(false)
          return
        }

        const normalizedData: CityData = {
          ...data,
          community_places: Array.isArray(data.community_places) ? data.community_places : [],
          food_highlights: Array.isArray(data.food_highlights) ? data.food_highlights : [],
          featured_restaurants: Array.isArray(data.featured_restaurants) ? data.featured_restaurants : [],
        }

        setCityData(normalizedData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching city data:', err)
        setError('Failed to load city guide')
        setLoading(false)
      }
    }

    fetchCityData()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading city guide...</p>
        </div>
      </div>
    )
  }

  if (error || !cityData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">{error || 'This city guide is not available yet.'}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/directory" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold">
              Browse Directory
            </Link>
            <Link href="/guides" className="bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-bold">
              View Guides
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm mb-6 opacity-90">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="hover:underline">Guides</Link>
            <span className="mx-2">/</span>
            <span>{cityData.city}</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {cityData.city}, {cityData.state_full}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl opacity-95">
            {cityData.intro_tagline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-xl shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {cityData.intro_paragraph_1}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {cityData.intro_paragraph_2}
                </p>
              </div>
            </section>

            {cityData.community_places.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  🏘️ Where Community Gathers
                </h2>
                <div className="space-y-4">
                  {cityData.community_places.map((place, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
                      <p className="text-gray-600">{place.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {cityData.food_highlights.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  🍽️ What You'll Notice in the Food
                </h2>
                <ul className="space-y-3">
                  {cityData.food_highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl">•</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {cityData.featured_restaurants.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  ⭐ Most Memorable Bites
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {cityData.featured_restaurants.map((restaurant, idx) => (
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
                  <div>
                    <p className="text-gray-600">Filipino Population</p>
                    <p className="font-bold text-gray-900">{cityData.filipino_population}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Migration History</p>
                    <p className="text-gray-700">{cityData.migration_history}</p>
                  </div>
                  {cityData.cultural_tidbit && (
                    <div>
                      <p className="text-gray-600">Did You Know?</p>
                      <p className="text-gray-700">{cityData.cultural_tidbit}</p>
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