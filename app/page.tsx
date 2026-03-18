import Link from 'next/link'
import type { Metadata } from 'next'
import { WebsiteStructuredData } from './components/StructuredData'
import { createClient } from '@supabase/supabase-js'
import NewsletterSignup from './components/NewsletterSignup'
import InstagramFeed from './components/InstagramFeed'
import FeaturedArticles from './components/FeaturedArticles'
import LatestNews from './components/LatestNews'
import HeroImageCarousel from './components/HeroImageCarousel'

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Filipino Food Near Me | The First Community Filipino Food Directory in America",
  description: "Flavor With Soul Deserves to Be Found. Discover Filipino restaurants, bakeries, grocery stores and food trucks across America.",
  openGraph: {
    title: "Filipino Food Near Me | First Community Filipino Food Directory",
    description: "Flavor With Soul Deserves to Be Found. The first community-driven Filipino food directory in America. Discover authentic Filipino cuisine across America.",
    siteName: 'Filipino Food Near Me',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Filipino Food Near Me | First Community Filipino Food Directory",
    description: "Flavor With Soul Deserves to Be Found. Discover Filipino restaurants, bakeries, grocery stores and food trucks across America.",
  },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HomePage() {
  // Fetch stats for hero bar
  const { count: listingCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })

  const { data: stateRows } = await supabase
    .from('listings')
    .select('state')

  const stateCount = new Set(stateRows?.map(r => r.state).filter(Boolean)).size

  const { data: cityRows } = await supabase
    .from('listings')
    .select('city')

  const cityCount = new Set(cityRows?.map(r => r.city).filter(Boolean)).size

  // Fetch top 3 upcoming events
  const today = new Date().toISOString().split('T')[0]

  const { data: upcomingRaw } = await supabase
    .from('fenm_events')
    .select('*')
    .eq('show_on_ffnm', true)
    .gte('start_date', today)
    .order('start_date', { ascending: true })
    .limit(3)

  const upcomingEvents = upcomingRaw?.map((e: any) => ({
    ...e,
    event_date: e.start_date,
    event_time: e.start_time,
    location_name: e.venue_name,
    address_street: e.address,
  }))

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
        <section data-section="hero" className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-red-600 to-yellow-500 text-white">
          <HeroImageCarousel />
          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-5xl sm:text-7xl font-bold mb-4 drop-shadow-lg">
                The First & Only Community Filipino Food Directory in America
              </h1>
              <p className="text-2xl sm:text-3xl italic font-medium text-yellow-300 mb-6 max-w-2xl mx-auto tracking-wide drop-shadow">
                Flavor With Soul Deserves to Be Found.
              </p>
              <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
                Connecting you to authentic Filipino restaurants, bakeries, grocery stores, and food trucks across America. Built by the community, for the community.
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

      {/* Stats Bar */}
      <section className="bg-white py-12" aria-label="Directory statistics">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:divide-x divide-gray-200">
            <div className="text-center px-12 py-4 sm:py-0">
              <p className="text-6xl font-bold leading-none" style={{ color: '#62438D' }}>
                {(listingCount ?? 0).toLocaleString()}+
              </p>
              <p className="text-gray-500 mt-2 text-sm font-semibold uppercase tracking-widest">Listings Nationwide</p>
            </div>
            <div className="text-center px-12 py-4 sm:py-0">
              <p className="text-6xl font-bold leading-none" style={{ color: '#62438D' }}>
                {stateCount}
              </p>
              <p className="text-gray-500 mt-2 text-sm font-semibold uppercase tracking-widest">States Covered</p>
            </div>
            <div className="text-center px-12 py-4 sm:py-0">
              <p className="text-6xl font-bold leading-none" style={{ color: '#62438D' }}>
                {cityCount}+
              </p>
              <p className="text-gray-500 mt-2 text-sm font-semibold uppercase tracking-widest">Cities</p>
            </div>
            <div className="text-center px-12 py-4 sm:py-0">
              <p className="text-6xl font-bold leading-none" style={{ color: '#62438D' }}>
                5
              </p>
              <p className="text-gray-500 mt-2 text-sm font-semibold uppercase tracking-widest">Food Categories</p>
            </div>
          </div>
        </div>
      </section>

      <main role="main">
        {/* Upcoming Events / Featured Section */}
        <section data-section="events" className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
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
                      <div className="h-40 overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
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

        {/* Kamayan / Community Dining Section */}
        <section className="relative overflow-hidden">
          <img
            src="/Boodle_5.png"
            alt="Filipino kamayan boodle fight feast with family and friends sharing food on banana leaves"
            className="w-full h-96 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-xl text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Food is Better Together
                </h2>
                <p className="text-lg md:text-xl mb-6 text-gray-200">
                  Kamayan. Boodle fight. Kainan. Whatever you call it—Filipino food is always meant to be shared. Find your community table.
                </p>
                <Link
                  href="/directory"
                  className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
                >
                  Find Filipino Food Near You
                </Link>
              </div>
            </div>
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

        {/* Popular Cities - NEW EMOJI DESIGN */}
        <section aria-labelledby="cities-heading" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="cities-heading" className="text-4xl font-bold text-center text-gray-900 mb-4">
              Popular Cities
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Find Filipino food in major cities across America
            </p>
            
            <nav aria-label="Browse by popular city">
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 list-none">
                <li>
                  <Link
                    href="/california/los-angeles"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in Los Angeles, California"
                  >
                    <div className="text-6xl mb-4">🌴</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Los Angeles</h3>
                    <p className="text-gray-600 text-sm">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/california/san-francisco"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in San Francisco, California"
                  >
                    <div className="text-6xl mb-4">🌉</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">San Francisco</h3>
                    <p className="text-gray-600 text-sm">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/new-york/new-york"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in New York, New York"
                  >
                    <div className="text-6xl mb-4">🗽</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">New York</h3>
                    <p className="text-gray-600 text-sm">New York</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/illinois/chicago"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in Chicago, Illinois"
                  >
                    <div className="text-6xl mb-4">🏙️</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Chicago</h3>
                    <p className="text-gray-600 text-sm">Illinois</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/texas/houston"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in Houston, Texas"
                  >
                    <div className="text-6xl mb-4">🤠</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Houston</h3>
                    <p className="text-gray-600 text-sm">Texas</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/california/san-diego"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in San Diego, California"
                  >
                    <div className="text-6xl mb-4">🏖️</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">San Diego</h3>
                    <p className="text-gray-600 text-sm">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nevada/las-vegas"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in Las Vegas, Nevada"
                  >
                    <div className="text-6xl mb-4">🎰</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Las Vegas</h3>
                    <p className="text-gray-600 text-sm">Nevada</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/washington/seattle"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in Seattle, Washington"
                  >
                    <div className="text-6xl mb-4">☕</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Seattle</h3>
                    <p className="text-gray-600 text-sm">Washington</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/hawaii/honolulu"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in Honolulu, Hawaii"
                  >
                    <div className="text-6xl mb-4">🌺</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Honolulu</h3>
                    <p className="text-gray-600 text-sm">Hawaii</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/virginia/virginia-beach"
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center block"
                    aria-label="Explore Filipino food and culture in Virginia Beach, Virginia"
                  >
                    <div className="text-6xl mb-4">🏖️</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Virginia Beach</h3>
                    <p className="text-gray-600 text-sm">Virginia</p>
                  </Link>
                </li>

              </ul>
            </nav>
            <div className="text-center mt-8">
              <Link href="/guides" className="text-purple-700 hover:text-purple-900 font-semibold">
                See all city guides →
              </Link>
            </div>
          </div>
        </section>
        <FeaturedArticles />
      <LatestNews />
        <NewsletterSignup />   
        <InstagramFeed />
        <section data-section="add-business-cta" aria-labelledby="cta-heading" className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-16">
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

    </div>
  )
}