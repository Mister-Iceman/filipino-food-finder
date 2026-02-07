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

// Format slug to readable name: "los-angeles" -> "Los Angeles"
function formatName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// Map full state names to abbreviations
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
  const stateName = formatName(state)
  const stateCode = stateMap[state] || state.toUpperCase()
  
  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .ilike('city', cityName)
    .eq('state', stateCode)

  return {
    title: `Filipino Food in ${cityName}, ${stateCode} | ${count || 0} Restaurants`,
    description: `Discover ${count || 0} authentic Filipino restaurants, bakeries, and grocery stores in ${cityName}, ${stateName}. Find the best Filipino food near you with ratings, hours, and contact info.`,
    openGraph: {
      title: `Filipino Food in ${cityName}, ${stateName}`,
      description: `${count || 0} Filipino restaurants and businesses in ${cityName}`,
    },
  }
}

export default async function CityPage({ params }: PageProps) {
  const { state, city } = await params
  const cityName = formatName(city)
  const stateName = formatName(state)
  const stateCode = stateMap[state] || state.toUpperCase()

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
            flavors from the Philippines right here in {cityName}. Our directory includes restaurants, 
            bakeries, grocery stores, and food trucks serving the Filipino-American community.
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
                {listing.category_secondary && ` • ${listing.category_secondary}`}
              </p>

              {listing.google_rating && (
                <div className="bg-yellow-50 inline-block px-3 py-2 rounded-lg mb-4">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="font-bold text-lg ml-1">{listing.google_rating}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({listing.google_reviews_count})
                  </span>
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