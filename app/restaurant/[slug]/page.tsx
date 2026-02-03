import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { data: restaurant } = await supabase
      .from('listings')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (!restaurant) {
      return {
        title: 'Restaurant Not Found | Filipino Food Near Me',
      }
    }

    const title = `${restaurant.name} - ${restaurant.city}, ${restaurant.state} | Filipino Food Near Me`
    const description = `${restaurant.name} is a ${restaurant.category_primary} in ${restaurant.city}, ${restaurant.state}. Find authentic Filipino food.`

    return { title, description }
  } catch (error) {
    return { title: 'Restaurant | Filipino Food Near Me' }
  }
}

export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  const { data: restaurant, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !restaurant) {
    notFound()
  }

  const mapsUrl = restaurant.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address_street} ${restaurant.city} ${restaurant.state}`)}`

  const formatPhone = (phone: string) => {
    if (!phone) return null
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/directory" className="hover:text-blue-600">Directory</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{restaurant.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                  <p className="text-xl text-gray-600">
                    {restaurant.category_primary}
                    {restaurant.category_secondary && ` • ${restaurant.category_secondary}`}
                  </p>
                </div>
                
                {restaurant.google_rating && (
                  <div className="bg-yellow-50 px-4 py-3 rounded-lg text-center">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-2xl">★</span>
                      <span className="text-3xl font-bold">{restaurant.google_rating}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {restaurant.google_reviews_count} reviews
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">📍 Location</h2>
                <p className="text-gray-700 text-lg">
                  {restaurant.address_street}<br />
                  {restaurant.city}, {restaurant.state} {restaurant.zip}
                </p>
              </div>

              {restaurant.hours && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">🕐 Hours</h2>
                  <p className="text-gray-700 whitespace-pre-line">{restaurant.hours}</p>
                </div>
              )}

              <div className="border-t pt-6 mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">📞 Contact</h2>
                {restaurant.phone && (
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong>{' '}
                    <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                      {formatPhone(restaurant.phone)}
                    </a>
                  </p>
                )}
                {restaurant.website && (
                  <p className="text-gray-700">
                    <strong>Website:</strong>{' '}
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Website →
                    </a>
                  </p>
                )}
              </div>

              <div className="border-t pt-6 mt-6 flex flex-wrap gap-4">
                
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-bold text-center"
                >
                  🗺️ Get Directions
                </a>
                {restaurant.website && (
                  
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold text-center"
                  >
                    🌐 Visit Website
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Map</h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share</h2>
              <div className="space-y-3">
                
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://filipinofoodnearme.org/restaurant/${restaurant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center font-medium"
                >
                  Share on Facebook
                </a>
                
                  href={`https://twitter.com/intent/tweet?text=Check out ${restaurant.name}!&url=https://filipinofoodnearme.org/restaurant/${restaurant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-lg text-center font-medium"
                >
                  Share on X
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">More in {restaurant.city}</h2>
              <Link
                href={`/directory?city=${restaurant.city}`}
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center font-bold"
              >
                Browse {restaurant.city} →
              </Link>
            </div>

            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Found an issue?</h3>
              <p className="text-sm text-gray-600 mb-4">Report outdated information</p>
              <Link href="/contact" className="block bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-center text-sm font-medium">
                Report Issue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}