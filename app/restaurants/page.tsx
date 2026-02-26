import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'
import PhoneReveal from '../components/PhoneReveal'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options = {}) =>
        fetch(url, { ...options, next: { revalidate: 3600 } }),
    },
  }
)

export const metadata: Metadata = {
  title: 'Filipino Restaurants | Filipino Food Near Me',
  description: 'Find authentic Filipino restaurants across America. From traditional turo-turo to modern Filipino fusion cuisine. Browse our complete directory of Filipino dining.',
}

export default async function RestaurantsPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('category_primary', 'Restaurant')
    .order('name')

  const totalCount = listings?.length || 0
  const states = new Set(listings?.map(l => l.state) || [])
  const cities = new Set(listings?.map(l => l.city) || [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:underline">Home</Link>
          {' / '}
          <Link href="/directory" className="hover:underline">Directory</Link>
          {' / '}
          <span>Restaurants</span>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">Filipino Restaurants</h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
          <p className="text-xl text-gray-700 mb-4">
            Discover {totalCount} authentic Filipino restaurants across {states.size} states and {cities.size} cities in America. 
            From family-owned turo-turo serving home-style comfort food to modern Filipino fusion restaurants reimagining classic dishes, 
            find your next favorite spot to experience the rich flavors of Filipino cuisine.
          </p>
          <p className="text-gray-600">
            Filipino food is all about bold flavors, communal dining, and dishes that taste like home. Whether you're craving crispy lechon kawali, 
            savory adobo, tangy sinigang, or sweet halo-halo, our directory connects you to Filipino restaurants that keep the culture alive 
            through food.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Popular Dishes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Adobo', 'Sisig', 'Lumpia', 'Lechon', 'Pancit', 'Kare-Kare', 'Sinigang', 'Halo-Halo', 'Longanisa', 'Tapsilog', 'Bibingka', 'Ube'].map(dish => (
              <div key={dish} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center text-sm font-medium text-blue-900">
                {dish}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings?.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.slug}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                {listing.name}
              </h2>
              <p className="text-gray-600 mb-3">{listing.category_primary}</p>

              {listing.is_pickup_only && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">🛍️ Pickup & Pre-Order</span>
                </div>
              )}

              {listing.google_rating && (
                <div className="bg-yellow-50 inline-block px-3 py-1 rounded-lg mb-3">
                  <span className="text-yellow-500">★</span>
                  <span className="font-bold ml-1">{listing.google_rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({listing.google_reviews_count})</span>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-2">
                📍 {listing.city}, {listing.state}
              </p>
              {listing.phone && (
                <p className="text-sm text-gray-600"><PhoneReveal phone={listing.phone} className="text-sm text-gray-600" /></p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Own a Filipino Restaurant?</h2>
          <p className="text-gray-700 mb-6">
            Get your restaurant listed in our community directory and connect with Filipino food lovers across America.
          </p>
          <Link
            href="/add-business"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            Add Your Restaurant
          </Link>
        </div>
      </div>
    </div>
  )
}