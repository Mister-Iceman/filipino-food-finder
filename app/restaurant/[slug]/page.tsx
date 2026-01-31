import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
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
  const description = `${restaurant.name} is a ${restaurant.category_primary} in ${restaurant.city}, ${restaurant.state}. ${restaurant.google_rating ? `Rated ${restaurant.google_rating} stars with ${restaurant.google_reviews_count} reviews.` : 'Find authentic Filipino food.'}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'restaurant.restaurant',
    },
  }
}

// Generate static paths for all restaurants
export async function generateStaticParams() {
  const { data: restaurants } = await supabase
    .from('listings')
    .select('slug')
    .not('slug', 'is', null)

  return restaurants?.map((restaurant) => ({
    slug: restaurant.slug,
  })) || []
}

export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  const { data: restaurant } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!restaurant) {
    notFound()
  }

  // Create Google Maps search URL
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${restaurant.name} ${restaurant.address_street} ${restaurant.city} ${restaurant.state} ${restaurant.zip}`
  )}`

  // Format phone for display
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
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/directory" className="hover:text-blue-600">Directory</Link>
            <span className="mx-2">/</span>
            <Link href={`/directory?state=${restaurant.state}`} className="hover:text-blue-600">
              {restaurant.state}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{restaurant.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
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
                      {restaurant.google_reviews_count} Google reviews
                    </p>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📍</span> Location
                </h2>
                <p className="text-gray-700 text-lg">
                  {restaurant.address_street}<br />
                  {restaurant.city}, {restaurant.state} {restaurant.zip}
                </p>
              </div>

              {/* Hours */}
              {restaurant.hours && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🕐</span> Hours
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">{restaurant.hours}</p>
                </div>
              )}

              {/* Contact */}
              <div className="border-t pt-6 mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📞</span> Contact
                </h2>
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
                    
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website →
                    </a>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 mt-6 flex flex-wrap gap-4">
                
                  href={restaurant.google_maps_url || mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-bold text-center transition-all hover:scale-105"
                >
                  🗺️ Get Directions
                </a>
                {restaurant.website && (
                  
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold text-center transition-all hover:scale-105"
                  >
                    🌐 Visit Website
                  </a>
                )}
              </div>
            </div>

            {/* Map */}
            {(restaurant.google_maps_url || restaurant.address_street) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Map</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                      `${restaurant.name}, ${restaurant.address_street}, ${restaurant.city}, ${restaurant.state}`
                    )}`}
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Share */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Restaurant</h2>
              <div className="space-y-3">
                
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://filipinofoodnearme.org/restaurant/${restaurant.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
                >
                  Share on Facebook
                </a>
                
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20${encodeURIComponent(restaurant.name)}%20on%20Filipino%20Food%20Near%20Me!&url=${encodeURIComponent(`https://filipinofoodnearme.org/restaurant/${restaurant.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
                >
                  Share on X
                </a>
              </div>
            </div>

            {/* More in City */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                More Filipino Food in {restaurant.city}
              </h2>
              <Link
                href={`/directory?city=${encodeURIComponent(restaurant.city)}&state=${restaurant.state}`}
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center font-bold transition-all hover:scale-105"
              >
                Browse {restaurant.city} Restaurants →
              </Link>
            </div>

            {/* Category */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                More {restaurant.category_primary}
              </h2>
              <Link
                href={`/directory?category=${encodeURIComponent(restaurant.category_primary)}`}
                className="block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-3 rounded-lg text-center font-bold transition-all hover:scale-105"
              >
                Browse All {restaurant.category_primary} →
              </Link>
            </div>

            {/* Report Issue */}
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Found an issue?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Help us keep information accurate by reporting outdated or incorrect details.
              </p>
              <Link
                href={`/contact?subject=Report%20Issue%20-%20${encodeURIComponent(restaurant.name)}`}
                className="block bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-center text-sm font-medium transition-colors"
              >
                Report Issue
              </Link>
            </div>
          </div>
        </div>

        {/* Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: restaurant.name,
              address: {
                '@type': 'PostalAddress',
                streetAddress: restaurant.address_street,
                addressLocality: restaurant.city,
                addressRegion: restaurant.state,
                postalCode: restaurant.zip,
                addressCountry: 'US',
              },
              telephone: restaurant.phone,
              url: restaurant.website,
              servesCuisine: 'Filipino',
              priceRange: '$$',
              ...(restaurant.google_rating && {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: restaurant.google_rating,
                  reviewCount: restaurant.google_reviews_count,
                },
              }),
            }),
          }}
        />
      </div>
    </div>
  )
}
```