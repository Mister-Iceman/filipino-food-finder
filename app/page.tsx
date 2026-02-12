import Link from 'next/link'
import { WebsiteStructuredData } from './components/StructuredData'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HomePage() {
  // Fetch top 3 upcoming events
  const today = new Date().toISOString().split('T')[0]
  
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(3)

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number)
    const localDate = new Date(year, month - 1, day)
    
    return localDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <WebsiteStructuredData />
      
      <header role="banner">
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-red-600 to-yellow-500 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-5xl sm:text-7xl font-bold mb-6 drop-shadow-lg">
                The First & Only Community Filipino Food Directory in America
              </h1>
              <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
                Connecting you to authentic Filipino restaurants, bakeries, grocery stores, and food trucks across all 50 states. Built by the community, for the community.
              </p>
              
              <Link
                href="/directory"
                className="inline-block px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-full shadow-xl transition-all hover:scale-105 text-lg"
                aria-label="Browse the complete Filipino food directory"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        </section>
      </header>

      <main role="main">
        {/* Upcoming Events / Featured Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
                <p className="text-gray-600">Filipino food festivals, pop-ups, and community gatherings</p>
              </div>
              <Link 
                href="/events"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All Events →
              </Link>
            </div>

            {!upcomingEvents || upcomingEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">🎉 No upcoming events yet!</p>
                <p className="text-gray-500 mb-6">
                  Check back soon for Filipino food festivals, restaurant grand openings, and community events.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link 
                    href="/events"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
                  >
                    View Events Page
                  </Link>
                  <Link 
                    href="/submit-event"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold"
                  >
                    Submit an Event
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                    {event.image_url && (
                      <div className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {!event.image_url && (
                      <div className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <span className="text-6xl">🎉</span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      {event.is_featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                          ⭐ FEATURED
                        </span>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p className="font-semibold text-blue-600">
                          📅 {formatDate(event.event_date)}
                        </p>
                        {event.city && event.state && (
                          <p className="text-gray-500">📍 {event.city}, {event.state}</p>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
                      )}

                      <Link
                        href="/events"
                        className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="categories-heading" className="max-w-7xl mx-auto px-4 py-16">
          <h2 id="categories-heading" className="text-4xl font-bold text-center text-gray-900 mb-12">
            Browse by Category
          </h2>
          <nav aria-label="Browse by business category">
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 list-none">
              <li>
                <Link 
                  href="/directory?category=Restaurant" 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center hover:scale-105 block"
                  aria-label="Browse Filipino restaurants"
                >
                  <span className="text-6xl mb-4 block" role="img" aria-label="Restaurant">🍽️</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    Restaurants
                  </h3>
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/directory?category=Supermarket%20%26%20Grocery" 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center hover:scale-105 block"
                  aria-label="Browse Filipino grocery stores and markets"
                >
                  <span className="text-6xl mb-4 block" role="img" aria-label="Grocery store">🛒</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    Grocery & Markets
                  </h3>
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/directory?category=Bakery%2C%20Dessert%20%26%20Cafe" 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center hover:scale-105 block"
                  aria-label="Browse Filipino bakeries and cafes"
                >
                  <span className="text-6xl mb-4 block" role="img" aria-label="Bakery">🥐</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    Bakery & Cafe
                  </h3>
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/directory?category=Quick%20Bites%20%26%20Turo-Turo" 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center hover:scale-105 block"
                  aria-label="Browse Filipino quick bites and turo-turo"
                >
                  <span className="text-6xl mb-4 block" role="img" aria-label="Quick food">🌮</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    Quick Bites
                  </h3>
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/directory?category=Food%20Truck%20%26%20Pop-Up" 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center hover:scale-105 block"
                  aria-label="Browse Filipino food trucks"
                >
                  <span className="text-6xl mb-4 block" role="img" aria-label="Food truck">🚚</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    Food Trucks
                  </h3>
                </Link>
              </li>
            </ul>
          </nav>
        </section>

        <section aria-labelledby="cities-heading" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="cities-heading" className="text-4xl font-bold text-center text-gray-900 mb-4">
              Popular Cities
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Find Filipino food in major cities across America
            </p>
            
            <nav aria-label="Browse by popular city">
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 list-none">
                <li>
                  <Link
                    href="/california/los-angeles"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in Los Angeles, California"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Palm tree">🌴</span>
                    <h3 className="font-bold text-gray-900">Los Angeles</h3>
                    <p className="text-sm text-gray-600">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/california/san-francisco"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in San Francisco, California"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Golden Gate Bridge">🌉</span>
                    <h3 className="font-bold text-gray-900">San Francisco</h3>
                    <p className="text-sm text-gray-600">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/new-york/new-york"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in New York, New York"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Statue of Liberty">🗽</span>
                    <h3 className="font-bold text-gray-900">New York</h3>
                    <p className="text-sm text-gray-600">New York</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/illinois/chicago"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in Chicago, Illinois"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="City skyline">🏙️</span>
                    <h3 className="font-bold text-gray-900">Chicago</h3>
                    <p className="text-sm text-gray-600">Illinois</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/texas/houston"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in Houston, Texas"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Cowboy hat">🤠</span>
                    <h3 className="font-bold text-gray-900">Houston</h3>
                    <p className="text-sm text-gray-600">Texas</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/california/san-diego"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in San Diego, California"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Beach">🏖️</span>
                    <h3 className="font-bold text-gray-900">San Diego</h3>
                    <p className="text-sm text-gray-600">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nevada/las-vegas"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in Las Vegas, Nevada"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Slot machine">🎰</span>
                    <h3 className="font-bold text-gray-900">Las Vegas</h3>
                    <p className="text-sm text-gray-600">Nevada</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/washington/seattle"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in Seattle, Washington"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Coffee cup">☕</span>
                    <h3 className="font-bold text-gray-900">Seattle</h3>
                    <p className="text-sm text-gray-600">Washington</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/hawaii/honolulu"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in Honolulu, Hawaii"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Hibiscus flower">🌺</span>
                    <h3 className="font-bold text-gray-900">Honolulu</h3>
                    <p className="text-sm text-gray-600">Hawaii</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/virginia/virginia-beach"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Explore Filipino food and culture in Virginia Beach, Virginia"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Beach">🏖️</span>
                    <h3 className="font-bold text-gray-900">Virginia Beach</h3>
                    <p className="text-sm text-gray-600">Virginia</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </section>

        <section aria-labelledby="cta-heading" className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 id="cta-heading" className="text-4xl font-bold mb-6">
              Find Your Next Favorite Filipino Spot
            </h2>
            <p className="text-xl mb-8">
              From authentic adobo to fresh lumpia, discover the best Filipino cuisine in your area
            </p>
            <Link
              href="/directory"
              className="inline-block px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-full shadow-xl transition-all hover:scale-105 text-lg"
              aria-label="Browse all Filipino food listings nationwide"
            >
              Browse All Listings →
            </Link>
          </div>
        </section>
      </main>

      <footer role="contentinfo" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Filipino Food Near Me. The first and only community Filipino food directory in America.
          </p>
        </div>
      </footer>
    </div>
  )
}