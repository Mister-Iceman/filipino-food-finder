import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const metadata: Metadata = {
  title: 'Filipino Food Near Me | Find Authentic Filipino Restaurants Across America',
  description: 'Discover authentic Filipino restaurants, bakeries, and grocery stores near you. Community-driven directory of Filipino food businesses across the United States.',
  openGraph: {
    title: 'Filipino Food Near Me',
    description: 'Find authentic Filipino restaurants across America',
    url: 'https://filipinofoodnearme.org',
    siteName: 'Filipino Food Near Me',
    type: 'website',
  },
}

export default async function Home() {
  // Fetch total listings count
  const { count: totalListings } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })

  // Fetch unique states
  const { data: listings } = await supabase
    .from('listings')
    .select('state')

  const uniqueStates = new Set(listings?.map(l => l.state) || [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Find Filipino Food Near You
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-95">
            Discover authentic Filipino restaurants, bakeries, and grocery stores across America. 
            Community-driven, trusted, and always free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/directory"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Browse All Restaurants
            </Link>
            <Link
              href="/add-business"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Add Your Business
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span>{totalListings || 0}+ Restaurants</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              <span>{uniqueStates.size} States</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💯</span>
              <span>Always Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Bayanihan, One Bite at a Time
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We make Filipino food easier to find, easier to support, and easier to celebrate—wherever you are in America.
          </p>
          <p className="text-gray-600">
            Built by the community, for the community. No paywalls, no favoritism, just authentic Filipino food.
          </p>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Cities
            </h2>
            <p className="text-xl text-gray-600">
              Explore Filipino food in major cities across America
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Link href="/california/los-angeles" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🌴</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Los Angeles</h3>
              <p className="text-gray-600 text-sm">California</p>
            </Link>

            <Link href="/california/san-francisco" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🌉</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">San Francisco</h3>
              <p className="text-gray-600 text-sm">California</p>
            </Link>

            <Link href="/new-york/new-york" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🗽</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">New York</h3>
              <p className="text-gray-600 text-sm">New York</p>
            </Link>

            <Link href="/illinois/chicago" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🏙️</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Chicago</h3>
              <p className="text-gray-600 text-sm">Illinois</p>
            </Link>

            <Link href="/texas/houston" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🤠</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Houston</h3>
              <p className="text-gray-600 text-sm">Texas</p>
            </Link>

            <Link href="/california/san-diego" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🏖️</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">San Diego</h3>
              <p className="text-gray-600 text-sm">California</p>
            </Link>

            <Link href="/nevada/las-vegas" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🎰</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Las Vegas</h3>
              <p className="text-gray-600 text-sm">Nevada</p>
            </Link>

            <Link href="/washington/seattle" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">☕</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Seattle</h3>
              <p className="text-gray-600 text-sm">Washington</p>
            </Link>

            <Link href="/hawaii/honolulu" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🌺</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Honolulu</h3>
              <p className="text-gray-600 text-sm">Hawaii</p>
            </Link>

            <Link href="/virginia/virginia-beach" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-6xl mb-4">🏖️</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Virginia Beach</h3>
              <p className="text-gray-600 text-sm">Virginia</p>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/guides"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
            >
              View All City Guides
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse & Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find Filipino restaurants, bakeries, and groceries by city, state, or category. Filter by what you're craving.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">See Ratings & Info</h3>
              <p className="text-gray-600 leading-relaxed">
                Check Google ratings, hours, addresses, and community reviews to find the perfect spot.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visit & Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Support Filipino-owned businesses and share your experience with the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Help Us Build the Directory
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Know a Filipino restaurant, bakery, or grocery we're missing? Add it to the directory 
            and help others discover great Filipino food.
          </p>
          <Link
            href="/add-business"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
          >
            Add Your Business
          </Link>
          <p className="mt-6 text-sm text-gray-600">
            It's free, fast, and helps the whole community. Maraming salamat! 🙏
          </p>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/directory" className="hover:text-white">Directory</Link></li>
                <li><Link href="/guides" className="hover:text-white">City Guides</Link></li>
                <li><Link href="/states" className="hover:text-white">Browse by State</Link></li>
                <li><Link href="/events" className="hover:text-white">Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Browse by State</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/states/california" className="hover:text-white">California</Link></li>
                <li><Link href="/states/texas" className="hover:text-white">Texas</Link></li>
                <li><Link href="/states/new-york" className="hover:text-white">New York</Link></li>
                <li><Link href="/states/hawaii" className="hover:text-white">Hawaii</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/add-business" className="hover:text-white">Add Business</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white">Support Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Filipino Food Near Me. Built with malasakit for the Filipino-American community.</p>
          </div>
        </div>
      </section>
    </div>
  )
}