import Link from 'next/link'
import { WebsiteStructuredData } from './components/StructuredData'

export default function HomePage() {
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
                    href="/directory?search=Los Angeles"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in Los Angeles, California"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Palm tree">🌴</span>
                    <h3 className="font-bold text-gray-900">Los Angeles</h3>
                    <p className="text-sm text-gray-600">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=San Francisco"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in San Francisco, California"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Golden Gate Bridge">🌉</span>
                    <h3 className="font-bold text-gray-900">San Francisco</h3>
                    <p className="text-sm text-gray-600">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=New York"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in New York, New York"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Statue of Liberty">🗽</span>
                    <h3 className="font-bold text-gray-900">New York</h3>
                    <p className="text-sm text-gray-600">New York</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=Chicago"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in Chicago, Illinois"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="City skyline">🏙️</span>
                    <h3 className="font-bold text-gray-900">Chicago</h3>
                    <p className="text-sm text-gray-600">Illinois</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=Houston"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in Houston, Texas"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Cowboy hat">🤠</span>
                    <h3 className="font-bold text-gray-900">Houston</h3>
                    <p className="text-sm text-gray-600">Texas</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=San Diego"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in San Diego, California"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Beach">🏖️</span>
                    <h3 className="font-bold text-gray-900">San Diego</h3>
                    <p className="text-sm text-gray-600">California</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=Las Vegas"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in Las Vegas, Nevada"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Slot machine">🎰</span>
                    <h3 className="font-bold text-gray-900">Las Vegas</h3>
                    <p className="text-sm text-gray-600">Nevada</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=Seattle"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in Seattle, Washington"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Coffee cup">☕</span>
                    <h3 className="font-bold text-gray-900">Seattle</h3>
                    <p className="text-sm text-gray-600">Washington</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=Honolulu"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in Honolulu, Hawaii"
                  >
                    <span className="text-3xl mb-2 block" role="img" aria-label="Hibiscus flower">🌺</span>
                    <h3 className="font-bold text-gray-900">Honolulu</h3>
                    <p className="text-sm text-gray-600">Hawaii</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/directory?search=Virginia Beach"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all hover:scale-105 shadow-md hover:shadow-xl block"
                    aria-label="Find Filipino food in Virginia Beach, Virginia"
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