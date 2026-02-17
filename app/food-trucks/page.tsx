import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const metadata: Metadata = {
  title: 'Filipino Food Trucks & Pop-Ups | Filipino Food Near Me',
  description: 'Find Filipino food trucks and pop-up vendors across America. Mobile Filipino cuisine, street food, and event catering.',
}

export default async function FoodTrucksPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('category_primary', 'Food Truck & Pop-Up')
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
          <span>Food Trucks & Pop-Ups</span>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">Filipino Food Trucks & Pop-Ups</h1>
        
        <div className="bg-gradient-to-r from-red-50 to-yellow-50 border-l-4 border-red-600 rounded-lg p-6 mb-8">
          <p className="text-xl text-gray-700 mb-4">
            Discover {totalCount} Filipino food trucks and pop-up vendors across {states.size} states and {cities.size} cities. 
            Mobile Filipino street food, weekend pop-ups, and event catering bringing authentic Filipino flavors to your neighborhood.
          </p>
          <p className="text-gray-600">
            Filipino food trucks are bringing the flavors of Manila street food to American cities—think lumpia rolls, pork BBQ skewers, 
            pancit, and fusion creations like adobo tacos and ube ice cream. Follow them on social media to catch them at your local food truck park or event!
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Food Truck Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Lumpia Rolls', 'BBQ Skewers', 'Adobo Bowls', 'Pancit', 'Sisig Fries', 'Ube Ice Cream', 'Pork Belly Tacos', 'Chicken Inasal', 'Halo-Halo', 'Empanadas', 'Turon', 'Chicken Joy'].map(item => (
              <div key={item} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center text-sm font-medium text-red-900">
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
                <p className="text-sm text-gray-600">📞 {listing.phone}</p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Run a Filipino Food Truck or Pop-Up?</h2>
          <p className="text-gray-700 mb-6">
            Get listed and let people know where to find you. Perfect for mobile vendors and weekend pop-ups!
          </p>
          <Link
            href="/add-business"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            Add Your Food Truck
          </Link>
        </div>
      </div>
    </div>
  )
}