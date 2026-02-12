import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const metadata: Metadata = {
  title: 'Filipino Food & Culture Guides | Filipino Food Near Me',
  description: 'Discover the stories, neighborhoods, and flavors that make each city\'s Filipino community unique. Cultural guides to Filipino food across America.',
  openGraph: {
    title: 'Filipino Food & Culture Guides',
    description: 'Explore Filipino food and culture in cities across America',
    url: 'https://filipinofoodnearme.org/guides',
    type: 'website',
  },
}

export default async function GuidesPage() {
  // Fetch all city pages
  const { data: cityPages } = await supabase
    .from('city_pages')
    .select('*')
    .order('city')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Guides to Filipino Food & Culture
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-95">
            Discover the stories, neighborhoods, and flavors that make each city's Filipino community unique. 
            More than just restaurants—these are cultural journeys through Filipino-America.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why These Guides Matter
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Filipino food is more than what's on the plate. It's the nurse finishing a night shift and stopping 
                for lumpia. It's the family gathering after Sunday mass. It's grandparents teaching their 
                grandchildren to love the dishes they grew up with, and whole neighborhoods keeping an archipelago's 
                worth of stories alive.
              </p>
              <p>
                Each city guide explores where Filipino-Americans gather, what historical waves of migration shaped 
                the local food scene, and which dishes carry the most meaning. You'll find both the classics and 
                the creative reinventions—the turo-turo steam tables and the chef-driven fusions that honor multiple 
                heritages at once.
              </p>
              <p className="font-semibold text-gray-900">
                These aren't "best of" lists. They're cultural maps written with malasakit—care and respect for 
                the communities that built them.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Articles Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Featured Articles
          </h2>
          
          <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            <Link
              href="/guides/most-memorable-filipino-food-cities-2026"
              className="group bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="p-8">
                <div className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full inline-block mb-4 font-bold text-sm">
                  📖 ANNUAL GUIDE 2026
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  The Most Memorable Filipino Food Cities in America (2026)
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  A cultural journey through the 10 cities where Filipino food tells the story of diaspora, 
                  community, and home—from plantation workers and Navy sailors to nurses and tech workers 
                  building vibrant enclaves across the United States.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <span>📍 10 Cities</span>
                  <span>•</span>
                  <span>🏛️ Cultural History</span>
                  <span>•</span>
                  <span>🍽️ Restaurant Highlights</span>
                </div>
                <div className="text-blue-600 font-bold group-hover:text-blue-700 flex items-center gap-2">
                  Read the Full Guide
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* City Guides Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Featured City Guides
          </h2>
          
          {cityPages && cityPages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cityPages.map((city) => (
                <Link
                  key={city.id}
                  href={`/${city.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* City Header with Gradient */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                    <h3 className="text-3xl font-bold mb-2">{city.city}</h3>
                    <p className="text-blue-100 text-lg">{city.state_full}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Population Badge */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
                      <p className="text-sm font-semibold text-yellow-800">
                        📊 {city.filipino_population}
                      </p>
                    </div>

                    {/* Intro Preview */}
                    <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                      {city.intro_paragraph_1}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🏘️</span>
                        <p className="text-sm text-gray-600">
                          {city.community_places[0]?.name || 'Cultural neighborhoods'}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🍽️</span>
                        <p className="text-sm text-gray-600">
                          {city.featured_restaurants?.length || 0} featured restaurants
                        </p>
                      </div>
                    </div>

                    {/* Read Guide Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-blue-600 font-bold group-hover:text-blue-700 flex items-center gap-2">
                        Read the Guide
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <p className="text-lg text-yellow-800">
                City guides are being prepared. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            More Guides Coming Soon
          </h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            We're building comprehensive guides for more cities across America. Each guide includes cultural 
            history, neighborhood highlights, food influences, and the most memorable Filipino restaurants 
            in each area.
          </p>
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-2xl">📝</span>
              <p>Annual series: "Most Memorable Filipino Food Cities"</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-2xl">🗺️</span>
              <p>Regional food guides and cultural deep-dives</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-2xl">📖</span>
              <p>Filipino food glossaries and ingredient guides</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Help Us Build Better Guides
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Know a restaurant we should feature? Have a story about your city's Filipino community? 
              We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/add-business"
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
              >
                Add a Restaurant
              </Link>
              <Link
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
              >
                Share Your Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}