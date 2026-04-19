import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface StatePageProps {
  params: Promise<{ state: string }>
}

const stateMap: { [key: string]: { full: string; abbr: string } } = {
  'alabama': { full: 'Alabama', abbr: 'AL' },
  'alaska': { full: 'Alaska', abbr: 'AK' },
  'arizona': { full: 'Arizona', abbr: 'AZ' },
  'arkansas': { full: 'Arkansas', abbr: 'AR' },
  'california': { full: 'California', abbr: 'CA' },
  'colorado': { full: 'Colorado', abbr: 'CO' },
  'connecticut': { full: 'Connecticut', abbr: 'CT' },
  'delaware': { full: 'Delaware', abbr: 'DE' },
  'florida': { full: 'Florida', abbr: 'FL' },
  'georgia': { full: 'Georgia', abbr: 'GA' },
  'hawaii': { full: 'Hawaii', abbr: 'HI' },
  'idaho': { full: 'Idaho', abbr: 'ID' },
  'illinois': { full: 'Illinois', abbr: 'IL' },
  'indiana': { full: 'Indiana', abbr: 'IN' },
  'iowa': { full: 'Iowa', abbr: 'IA' },
  'kansas': { full: 'Kansas', abbr: 'KS' },
  'kentucky': { full: 'Kentucky', abbr: 'KY' },
  'louisiana': { full: 'Louisiana', abbr: 'LA' },
  'maine': { full: 'Maine', abbr: 'ME' },
  'maryland': { full: 'Maryland', abbr: 'MD' },
  'massachusetts': { full: 'Massachusetts', abbr: 'MA' },
  'michigan': { full: 'Michigan', abbr: 'MI' },
  'minnesota': { full: 'Minnesota', abbr: 'MN' },
  'mississippi': { full: 'Mississippi', abbr: 'MS' },
  'missouri': { full: 'Missouri', abbr: 'MO' },
  'montana': { full: 'Montana', abbr: 'MT' },
  'nebraska': { full: 'Nebraska', abbr: 'NE' },
  'nevada': { full: 'Nevada', abbr: 'NV' },
  'new-hampshire': { full: 'New Hampshire', abbr: 'NH' },
  'new-jersey': { full: 'New Jersey', abbr: 'NJ' },
  'new-mexico': { full: 'New Mexico', abbr: 'NM' },
  'new-york': { full: 'New York', abbr: 'NY' },
  'north-carolina': { full: 'North Carolina', abbr: 'NC' },
  'north-dakota': { full: 'North Dakota', abbr: 'ND' },
  'ohio': { full: 'Ohio', abbr: 'OH' },
  'oklahoma': { full: 'Oklahoma', abbr: 'OK' },
  'oregon': { full: 'Oregon', abbr: 'OR' },
  'pennsylvania': { full: 'Pennsylvania', abbr: 'PA' },
  'rhode-island': { full: 'Rhode Island', abbr: 'RI' },
  'south-carolina': { full: 'South Carolina', abbr: 'SC' },
  'south-dakota': { full: 'South Dakota', abbr: 'SD' },
  'tennessee': { full: 'Tennessee', abbr: 'TN' },
  'texas': { full: 'Texas', abbr: 'TX' },
  'utah': { full: 'Utah', abbr: 'UT' },
  'vermont': { full: 'Vermont', abbr: 'VT' },
  'virginia': { full: 'Virginia', abbr: 'VA' },
  'washington': { full: 'Washington', abbr: 'WA' },
  'west-virginia': { full: 'West Virginia', abbr: 'WV' },
  'wisconsin': { full: 'Wisconsin', abbr: 'WI' },
  'wyoming': { full: 'Wyoming', abbr: 'WY' },
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params
  const stateInfo = stateMap[state]

  if (!stateInfo) {
    return {
      title: 'State Not Found | Filipino Food Near Me',
    }
  }

  const { data: listings } = await supabase
    .from('listings')
    .select('city', { count: 'exact' })
    .eq('state', stateInfo.abbr)

  const uniqueCities = new Set(listings?.map(l => l.city) || []).size
  const totalListings = listings?.length || 0

  if (totalListings === 0) {
    return {
      title: `Filipino Food in ${stateInfo.full} | Filipino Food Near Me`,
      description: `Help us build our directory of Filipino restaurants, bakeries, and grocery stores in ${stateInfo.full}. Know a Filipino food business? Add it to our community directory.`,
      openGraph: {
        title: `Filipino Food in ${stateInfo.full}`,
        description: `Building the Filipino food directory for ${stateInfo.full}`,
      },
    }
  }

  return {
    title: `Filipino Food in ${stateInfo.full} | ${totalListings} Restaurants`,
    description: `Discover ${totalListings} Filipino restaurants, bakeries, and grocery stores across ${uniqueCities} cities in ${stateInfo.full}. Find authentic Filipino food near you.`,
    openGraph: {
      title: `Filipino Food in ${stateInfo.full}`,
      description: `${totalListings} Filipino food businesses across ${stateInfo.full}`,
    },
  }
}

export default async function StatePage({ params }: StatePageProps) {
  const { state } = await params
  const stateInfo = stateMap[state]

  if (!stateInfo) {
    notFound()
  }

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('state', stateInfo.abbr)
    .order('city')
    .order('name')

  // EMPTY STATE - Show placeholder instead of 404
  if (!listings || listings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm mb-6 text-gray-600">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/directory" className="hover:underline">Directory</Link>
            <span className="mx-2">/</span>
            <span>{stateInfo.full}</span>
          </nav>

          <div className="text-center py-16">
            <div className="mb-8">
              <div className="text-6xl mb-4">🍽️</div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Filipino Food in {stateInfo.full}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're building our directory for {stateInfo.full}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Know a Filipino restaurant, bakery, or grocery store in {stateInfo.full}?
              </h2>
              <p className="text-gray-700 mb-6">
                Help us build the most complete directory of Filipino food in America! 
                Add businesses you know and love to help fellow food lovers discover Filipino cuisine in {stateInfo.full}.
              </p>
              <Link
                href="/add-business"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
              >
                Add a Business
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <div className="text-3xl mb-2">🏪</div>
                <h3 className="font-bold text-gray-900 mb-2">Restaurants</h3>
                <p className="text-sm text-gray-600">
                  Turo-turo, fine dining, food trucks, and everything in between
                </p>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                <div className="text-3xl mb-2">🥐</div>
                <h3 className="font-bold text-gray-900 mb-2">Bakeries & Cafés</h3>
                <p className="text-sm text-gray-600">
                  Pandesal, ensaymada, ube desserts, and Filipino coffee spots
                </p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <div className="text-3xl mb-2">🛒</div>
                <h3 className="font-bold text-gray-900 mb-2">Grocery Stores</h3>
                <p className="text-sm text-gray-600">
                  Filipino markets and stores with imported ingredients
                </p>
              </div>
            </div>

            <div className="mt-12 text-gray-600">
              <p className="mb-4">
                Once businesses are added, this page will show all Filipino food businesses in {stateInfo.full}, 
                organized by city with ratings, locations, and more.
              </p>
              <Link href="/directory" className="text-blue-600 hover:underline font-medium">
                ← Browse other states
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // NORMAL STATE - Has listings
  const citiesMap = listings.reduce((acc, listing) => {
    const city = listing.city
    if (!acc[city]) {
      acc[city] = []
    }
    acc[city].push(listing)
    return acc
  }, {} as Record<string, typeof listings>)

  const cities = Object.keys(citiesMap).sort()

  const { data: cityPages } = await supabase
    .from('city_pages')
    .select('city, slug')
    .eq('state', stateInfo.abbr)

  const enhancedCities = new Set(cityPages?.map(cp => cp.city) || [])

  const siteUrl = 'https://filipinofoodnearme.org'
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${siteUrl}/directory` },
      { '@type': 'ListItem', position: 3, name: stateInfo.full, item: `${siteUrl}/states/${state}` },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4">
        <nav className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/directory" className="hover:underline">Directory</Link>
          <span className="mx-2">/</span>
          <span>{stateInfo.full}</span>
        </nav>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Filipino Food in {stateInfo.full}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Discover {listings.length} authentic Filipino restaurants, bakeries, and grocery stores 
          across {cities.length} cities in {stateInfo.full}.
        </p>

        {cityPages && cityPages.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📖 Featured City Guides
            </h2>
            <p className="text-gray-700 mb-6">
              Explore the culture, history, and flavors of Filipino food in these cities:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityPages.map((cityPage: any) => (
                <Link
                  key={cityPage.slug}
                  href={`/${cityPage.slug}`}
                  className="bg-white hover:bg-blue-50 border-2 border-blue-300 rounded-lg p-4 transition-colors"
                >
                  <h3 className="text-xl font-bold text-blue-600 hover:text-blue-700">
                    {cityPage.city} Guide →
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cultural stories & restaurant highlights
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-12">
          {cities.map((city) => (
            <div key={city} className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{city}</h2>
                  <p className="text-gray-600">{citiesMap[city].length} Filipino food businesses</p>
                </div>
                {enhancedCities.has(city) && (
                  <Link
                    href={`/${state}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    View City Guide
                  </Link>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {citiesMap[city].map((listing: any) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.slug}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-gray-900 hover:text-blue-600 mb-1">
                      {listing.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{listing.category_primary}</p>
                    {listing.is_pickup_only && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">🛍️ Pickup & Pre-Order</span>
                      </div>
                    )}
                    {listing.google_rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{listing.google_rating}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Know a Filipino food business in {stateInfo.full}?
          </h2>
          <p className="text-gray-700 mb-6">
            Help us build the most complete directory of Filipino food in America!
          </p>
          <Link
            href="/add-business"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            Add Your Business
          </Link>
        </div>
      </div>
    </div>
  )
}