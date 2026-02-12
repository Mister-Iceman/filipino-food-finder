import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PageProps {
  params: Promise<{ state: string; city: string }>
}

function formatName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const stateMap: { [key: string]: string } = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new-hampshire': 'NH', 'new-jersey': 'NJ', 'new-mexico': 'NM', 'new-york': 'NY',
  'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
  'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params
  const cityName = formatName(city)
  const stateCode = stateMap[state] || state.toUpperCase()
  const slug = `${state}/${city}`
  
  // Check for enhanced city page
  const { data: cityPage } = await supabase
    .from('city_pages')
    .select('meta_title, meta_description')
    .eq('slug', slug)
    .single()

  if (cityPage) {
    return {
      title: cityPage.meta_title,
      description: cityPage.meta_description,
      openGraph: {
        title: cityPage.meta_title,
        description: cityPage.meta_description,
      },
    }
  }

  // Fallback to basic metadata
  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .ilike('city', cityName)
    .eq('state', stateCode)

  return {
    title: `Filipino Food in ${cityName}, ${stateCode} | ${count || 0} Restaurants`,
    description: `Discover ${count || 0} authentic Filipino restaurants in ${cityName}.`,
  }
}

export default async function CityPage({ params }: PageProps) {
  const { state, city } = await params
  const cityName = formatName(city)
  const stateName = formatName(state)
  const stateCode = stateMap[state] || state.toUpperCase()
  const slug = `${state}/${city}`

  // Check for enhanced city page content
  const { data: cityPage } = await supabase
    .from('city_pages')
    .select('*')
    .eq('slug', slug)
    .single()

  // Fetch all listings for this city
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .ilike('city', cityName)
    .eq('state', stateCode)
    .order('google_rating', { ascending: false, nullsFirst: false })

  if (!listings || listings.length === 0) {
    notFound()
  }

  // If we have enhanced content, show the full cultural page
  if (cityPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="text-sm mb-6 opacity-90">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/directory" className="hover:underline">Directory</Link>
              <span className="mx-2">/</span>
              <span className="capitalize">{stateName}</span>
              <span className="mx-2">/</span>
              <span>{cityName}</span>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {cityPage.intro_tagline}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Cultural Intro */}
              <section className="bg-white rounded-xl shadow-lg p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl leading-relaxed text-gray-700">
                    {cityPage.intro_paragraph_1}
                  </p>
                  {cityPage.intro_paragraph_2 && (
                    <p className="text-xl leading-relaxed text-gray-700 mt-4">
                      {cityPage.intro_paragraph_2}
                    </p>
                  )}
                </div>
              </section>

              {/* Where the Community Gathers */}
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Where the Community Gathers
                </h2>
                <div className="space-y-6">
                  {cityPage.community_places.map((place: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {place.name}
                        {place.area && (
                          <span className="text-base font-normal text-gray-600 ml-2">
                            ({place.area})
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {place.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* What You'll Notice in the Food */}
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What You'll Notice in the Food Here
                </h2>
                <div className="prose prose-lg max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {cityPage.food_intro_paragraph}
                  </p>
                </div>
                <ul className="space-y-4">
                  {cityPage.food_highlights.map((highlight: any, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-2xl">🍽️</span>
                      <p className="text-gray-700 leading-relaxed flex-1">
                        {highlight.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Most Memorable Bites */}
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Most Memorable Bites
                </h2>
                <div className="space-y-6">
                  {cityPage.featured_restaurants.map((restaurant: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {restaurant.listing_slug ? (
                              <Link 
                                href={`/listings/${restaurant.listing_slug}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {restaurant.name}
                              </Link>
                            ) : (
                              restaurant.name
                            )}
                          </h3>
                          <p className="text-gray-600">{restaurant.neighborhood}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {restaurant.type}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed italic">
                        "{restaurant.memorable_bite}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* All Restaurants in City */}
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  All Filipino Restaurants in {cityName}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {listings.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      href={`/listings/${restaurant.slug}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-bold text-gray-900 hover:text-blue-600">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-gray-600">{restaurant.category_primary}</p>
                      {restaurant.google_rating && (
                        <div className="mt-2">
                          <span className="text-yellow-500">★</span>
                          <span className="font-bold ml-1">{restaurant.google_rating}</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Call to Action */}
              <section className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-8">
                <p className="text-lg text-gray-800 leading-relaxed mb-4">
                  Filipino food in {cityName} is more than what's on the plate—it's nurses getting off night shift, 
                  kids learning to love the dishes their grandparents grew up with, and whole neighborhoods keeping 
                  an archipelago's worth of stories alive.
                </p>
                <p className="text-lg text-gray-800 leading-relaxed">
                  If a meal from this page brings you a little closer to home—or helps you discover Filipino flavors 
                  for the first time—help us keep this community project going. Visit{' '}
                  <Link href="/" className="text-blue-600 font-bold hover:underline">
                    FilipinoFoodNearMe.org
                  </Link>{' '}
                  whenever you're craving something Filipino, share it with friends, family, and visitors, and support 
                  the restaurants and small businesses that keep {cityName}'s Filipino heart beating.
                </p>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  Filipinos in {cityName}
                </h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Population</h3>
                    <p className="text-gray-700">{cityPage.filipino_population}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Roots</h3>
                    <p className="text-gray-700">{cityPage.migration_history}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Today</h3>
                    <p className="text-gray-700">{cityPage.key_contributions}</p>
                  </div>
                  {cityPage.cultural_tidbit && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Did You Know?</h3>
                      <p className="text-gray-700">{cityPage.cultural_tidbit}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-6 border-t border-blue-300">
                  <Link
                    href="/directory"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-3 rounded-lg font-bold transition-colors"
                  >
                    Browse All Cities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback to simple listing view if no enhanced content
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/directory" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Directory
        </Link>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Filipino Food in {cityName}, {stateCode}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Discover {listings.length} authentic Filipino restaurants, bakeries, and grocery stores in {cityName}. 
          From traditional favorites to modern Filipino fusion, find the best Filipino food near you.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            About Filipino Food in {cityName}
          </h2>
          <p className="text-gray-700">
            {cityName} has a vibrant Filipino community with diverse dining options. Whether you're craving 
            classic adobo, crispy lechon, sweet halo-halo, or fresh pandesal, you'll find authentic 
            flavors from the Philippines right here in {cityName}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link 
              key={listing.id} 
              href={`/listings/${listing.slug}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                {listing.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {listing.category_primary}
              </p>

              {listing.google_rating && (
                <div className="bg-yellow-50 inline-block px-3 py-2 rounded-lg mb-4">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="font-bold text-lg ml-1">{listing.google_rating}</span>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                <p>📍 {listing.address_street}</p>
                {listing.phone && <p>📞 {listing.phone}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}