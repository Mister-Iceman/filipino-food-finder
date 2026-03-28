import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'
import PhoneReveal from '../components/PhoneReveal'

export const revalidate = 86400

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
  title: 'Filipino Grocery Stores & Markets | Filipino Food Near Me',
  description: 'Find Filipino grocery stores and Asian markets across America. Shop for imported Filipino ingredients, frozen goods, snacks, and authentic products.',
}

export default async function GroceryStoresPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('category_primary', 'Supermarket & Grocery')
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
          <span>Grocery Stores</span>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">Filipino Grocery Stores & Markets</h1>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 rounded-lg p-6 mb-8">
          <p className="text-xl text-gray-700 mb-4">
            Discover {totalCount} Filipino grocery stores and Asian markets across {states.size} states and {cities.size} cities. 
            Stock up on imported Filipino ingredients, frozen goods, snacks, condiments, and everything you need to cook authentic Filipino meals at home.
          </p>
          <p className="text-gray-600">
            Filipino grocery stores are the heart of the community—where you can find banana ketchup, ube jam, frozen lumpia wrappers, 
            bagoong, patis, and all the hard-to-find ingredients that make Filipino cooking authentic. Plus, hot food counters serving turo-turo favorites!
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Find</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Frozen Lumpia', 'Banana Ketchup', 'Patis', 'Bagoong', 'Ube Products', 'Frozen Tocino', 'Longanisa', 'Instant Pancit', 'Calamansi', 'Coconut Milk', 'Rice Varieties', 'Frozen Turon'].map(item => (
              <div key={item} className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center text-sm font-medium text-green-900">
                {item}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Own a Filipino Grocery Store?</h2>
          <p className="text-gray-700 mb-6">
            Get your store listed and help Filipinos find authentic ingredients in their area.
          </p>
          <Link
            href="/add-business"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            Add Your Store
          </Link>
        </div>
      </div>
    </div>
  )
}