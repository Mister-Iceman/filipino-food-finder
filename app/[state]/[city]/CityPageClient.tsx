'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CityPageContent({ params }: { params: Promise<{ state: string; city: string }> }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    params.then(p => {
      supabase
        .from('city_pages')
        .select('*')
        .eq('slug', `${p.state}/${p.city}`)
        .single()
        .then(({ data }) => setData(data))
    })
  }, [params])

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading city guide...</div>
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
            <section className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-700 leading-relaxed mb-4">{data.intro_paragraph_1}</p>
              <p className="text-gray-700 leading-relaxed">{data.intro_paragraph_2}</p>
            </section>

            {data.community_places?.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">Where Community Gathers</h2>
                <div className="space-y-4">
                  {data.community_places.map((p: any, i: number) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <p className="text-gray-600">{p.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.food_highlights?.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">What You Will Notice</h2>
                <ul className="space-y-3">
                  {data.food_highlights.map((h: string, i: number) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-blue-600 text-xl">•</span>
                      <span className="text-gray-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {data.featured_restaurants?.length > 0 && (
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">Most Memorable Bites</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {data.featured_restaurants.map((r: any, i: number) => (
                    <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-bold text-xl mb-2">{r.name}</h3>
                      <p className="text-gray-600 mb-3">{r.description}</p>
                      {r.signature_dish && (
                        <p className="text-sm text-blue-600">
                          <strong>Try:</strong> {r.signature_dish}
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
                <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Filipino Population</p>
                    <p className="font-bold">{data.filipino_population}</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}