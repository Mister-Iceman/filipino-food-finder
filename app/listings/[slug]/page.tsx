import { createClient } from '@supabase/supabase-js'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import RatingForm from '../../components/RatingForm'
import RatingSummary from '../../components/RatingSummary'
import AvailableDishesDisplay from '../../components/AvailableDishesDisplay'
import AdSlot from '../../components/AdSlot'
import SocialShare from '../../components/SocialShare'
import PhoneReveal from '../../components/PhoneReveal'
import ClaimForm from '../../components/ClaimForm'
import LeadLink from '../../components/LeadLink'
import ListingDetailTracker from '../../components/analytics/ListingDetailTracker'

export const revalidate = 3600

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return {
    alternates: {
      canonical: `https://filipinofoodnearme.org/listings/${slug}/`,
    },
  }
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .single()

  // Fetch approved photos (service role for signed URLs)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: rawPhotos } = await supabaseAdmin
    .from('listing_photos')
    .select('id, storage_path, caption')
    .eq('listing_id', slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: true })
  const photos: { url: string; caption: string | null }[] = []
  for (const p of rawPhotos ?? []) {
    const { data: signed } = await supabaseAdmin.storage
      .from('listing-photos')
      .createSignedUrl(p.storage_path, 3600)
    if (signed?.signedUrl) photos.push({ url: signed.signedUrl, caption: p.caption ?? null })
  }

  if (!listing) {
    // Legacy WordPress slugs not in DB get a permanent 308 redirect to the
    // directory rather than a 404. App Router page routes intercept before
    // next.config.ts redirects for matching dynamic paths, so this is the
    // only reliable place to handle it.
    permanentRedirect('/directory/')
  }

  const isGrocery =
    listing.category_primary?.toLowerCase().includes('supermarket') ||
    listing.category_primary?.toLowerCase().includes('grocery') ||
    listing.category_primary?.toLowerCase().includes('market')

  const category = isGrocery ? 'grocery' : 'restaurant'

  const STATE_TO_SLUG: Record<string, string> = {
    'AL': 'alabama', 'AK': 'alaska', 'AZ': 'arizona', 'AR': 'arkansas', 'CA': 'california',
    'CO': 'colorado', 'CT': 'connecticut', 'DE': 'delaware', 'FL': 'florida', 'GA': 'georgia',
    'HI': 'hawaii', 'ID': 'idaho', 'IL': 'illinois', 'IN': 'indiana', 'IA': 'iowa',
    'KS': 'kansas', 'KY': 'kentucky', 'LA': 'louisiana', 'ME': 'maine', 'MD': 'maryland',
    'MA': 'massachusetts', 'MI': 'michigan', 'MN': 'minnesota', 'MS': 'mississippi', 'MO': 'missouri',
    'MT': 'montana', 'NE': 'nebraska', 'NV': 'nevada', 'NH': 'new-hampshire', 'NJ': 'new-jersey',
    'NM': 'new-mexico', 'NY': 'new-york', 'NC': 'north-carolina', 'ND': 'north-dakota', 'OH': 'ohio',
    'OK': 'oklahoma', 'OR': 'oregon', 'PA': 'pennsylvania', 'RI': 'rhode-island', 'SC': 'south-carolina',
    'SD': 'south-dakota', 'TN': 'tennessee', 'TX': 'texas', 'UT': 'utah', 'VT': 'vermont',
    'VA': 'virginia', 'WA': 'washington', 'WV': 'west-virginia', 'WI': 'wisconsin', 'WY': 'wyoming',
    'DC': 'district-of-columbia',
  }
  const stateSlug = STATE_TO_SLUG[listing.state] || listing.state.toLowerCase()
  const citySlug = listing.city?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || ''

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'
  const listingUrl = `${baseUrl}/listings/${slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${baseUrl}/directory` },
      { '@type': 'ListItem', position: 3, name: listing.state, item: `${baseUrl}/states/${stateSlug}` },
      { '@type': 'ListItem', position: 4, name: listing.city, item: `${baseUrl}/${stateSlug}/${citySlug}` },
      { '@type': 'ListItem', position: 5, name: listing.name, item: listingUrl },
    ],
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': isGrocery ? 'GroceryStore' : 'Restaurant',
    name: listing.name,
    description: `${listing.category_primary} in ${listing.city}, ${listing.state}`,
    servesCuisine: 'Filipino',
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address_street,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
      addressCountry: 'US',
    },
    ...(listing.latitude && listing.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: listing.latitude,
        longitude: listing.longitude,
      },
    }),
    ...(listing.phone && { telephone: listing.phone }),
    ...(listing.website && { url: listing.website }),
    ...(listing.google_rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: listing.google_rating,
        reviewCount: listing.google_reviews_count || 0,
      },
    }),
    ...(listing.hours && { openingHours: listing.hours }),
    ...(listing.image_url && { image: listing.image_url }),
    ...((listing.instagram_url || listing.facebook_url || listing.twitter_url || listing.tiktok_url) && {
      sameAs: [
        listing.instagram_url,
        listing.facebook_url,
        listing.twitter_url,
        listing.tiktok_url,
      ].filter(Boolean),
    }),
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ListingDetailTracker
        listingId={listing.id}
        listingName={listing.name}
        listingCategory={listing.category_primary ?? ''}
        listingCity={listing.city ?? ''}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4">
        <nav className="text-sm mb-6 text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 flex-wrap gap-y-1">
            <li>
              <Link href="/" className="hover:underline hover:text-blue-600">Home</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li>
              <Link href="/directory" className="hover:underline hover:text-blue-600">Directory</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li>
              <Link href={`/states/${stateSlug}`} className="hover:underline hover:text-blue-600">
                {listing.state}
              </Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li>
              <Link href={`/${stateSlug}/${citySlug}`} className="hover:underline hover:text-blue-600">
                {listing.city}
              </Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li className="text-gray-500">{listing.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{listing.name}</h1>
              <p className="text-xl text-gray-600 mb-6">{listing.category_primary}</p>

              {listing.is_pickup_only && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">🛍️ Pickup & Pre-Order</span>
                </div>
              )}

              {listing.google_rating && (
                <div className="bg-yellow-50 inline-block px-4 py-2 rounded-lg mb-6">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="font-bold text-xl ml-2">{listing.google_rating}</span>
                  <span className="text-gray-500 ml-2">({listing.google_reviews_count} reviews)</span>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <p className="text-gray-700">
                  📍 {listing.address_street}, {listing.city}, {listing.state} {listing.zip}
                </p>
                {listing.phone && (
                  <p className="text-gray-700">
                    <PhoneReveal phone={listing.phone} className="hover:text-blue-600 underline" listingId={listing.id} />
                  </p>
                )}
                {listing.hours && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Hours</p>
                    <p className="text-sm text-blue-800">🕐 {listing.hours}</p>
                  </div>
                )}
                {listing.website && (
                  <p className="text-gray-700">
                    🌐 <LeadLink href={listing.website} leadType="website_click" listingId={listing.id} className="text-blue-600 hover:underline">Visit Website</LeadLink>
                  </p>
                )}
                
                {/* Last Updated & Report Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(listing.updated_at || listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <Link 
                    href={`/contact?subject=Report%20Incorrect%20Info%20-%20${encodeURIComponent(listing.name)}&restaurant=${encodeURIComponent(listing.name)}&city=${encodeURIComponent(listing.city)}&state=${listing.state}`}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    📝 Report incorrect info
                  </Link>
                  {listing.is_claimed && (
                    <Link
                      href={`/owner/edit/${slug}`}
                      className="text-xs bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-3 py-1.5 rounded-full transition"
                    >
                      ✏️ Update listing info
                    </Link>
                  )}
                </div>
                </div>
                {!listing.is_claimed && (
                  <ClaimForm listingId={listing.id} listingName={listing.name} />
                )}

              {/* Photos gallery */}
              {photos.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Photos</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((photo, i) => (
                      <div key={i}>
                        <a href={photo.url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={photo.url}
                            alt={`${listing.name} photo ${i + 1}`}
                            className="w-full h-36 object-cover rounded-lg border border-gray-100 hover:opacity-90 transition-opacity"
                          />
                        </a>
                        {photo.caption && (
                          <p className="text-xs text-gray-500 mt-1 px-0.5">{photo.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner photo CTA */}
              {listing.is_claimed && photos.length === 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                  Is this your business?{' '}
                  <Link href={`/owner/login?slug=${slug}`} className="font-semibold underline hover:text-blue-900">
                    Log in to add photos →
                  </Link>
                </div>
              )}

              <div className="bg-gray-50 border-l-4 border-gray-300 rounded-lg p-4 mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-2">Looking for something else?</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/restaurants" className="text-xs bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-3 py-1 rounded-full transition-colors">
                    🍽️ Restaurants
                  </Link>
                  <Link href="/bakeries" className="text-xs bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-3 py-1 rounded-full transition-colors">
                    🥐 Bakeries
                  </Link>
                  <Link href="/grocery-stores" className="text-xs bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-3 py-1 rounded-full transition-colors">
                    🛒 Grocery Stores
                  </Link>
                  <Link href="/quick-bites" className="text-xs bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-3 py-1 rounded-full transition-colors">
                    🌮 Quick Bites
                  </Link>
                  <Link href="/food-trucks" className="text-xs bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-3 py-1 rounded-full transition-colors">
                    🚚 Food Trucks
                  </Link>
                </div>
              </div>

              <div className="mb-8">
                <SocialShare 
                  url={listingUrl}
                  title={`${listing.name} - Filipino Food in ${listing.city}, ${listing.state}`}
                  description={`Check out ${listing.name}, a ${listing.category_primary} in ${listing.city}, ${listing.state}. Find authentic Filipino food near you!`}
                />
              </div>

              <div className="mb-8">
                <AvailableDishesDisplay listingId={listing.id} />
              </div>

              <div className="mb-8">
                <RatingSummary
                  listingId={listing.id}
                  category={category}
                />
              </div>
            </div>

            <div className="mt-8">
              <RatingForm
                listingId={listing.id}
                listingName={listing.name}
                listingSlug={slug}
                category={category}
                businessType={listing.category_primary || ''}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <AdSlot 
                slot="0987654321" 
                format="vertical"
                responsive={true}
              />
            </div>
          </div>
        </div>

        {/* Internal links: city, state, category, Cultural KB */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Explore Filipino Food Near You</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${stateSlug}/${citySlug}`}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              📍 Filipino Food in {listing.city}
            </Link>
            <Link
              href={`/states/${stateSlug}`}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              🗺️ Filipino Food in {listing.state}
            </Link>
            <Link
              href={`/directory?category=${encodeURIComponent(listing.category_primary || 'Restaurant')}`}
              className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              🍽️ Browse {listing.category_primary || 'Restaurants'}
            </Link>
            <Link
              href="/cultural-knowledge-base"
              className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              📖 Filipino Food Culture
            </Link>
            <Link
              href="/cultural-knowledge-base/ultimate-sawsawan-guide"
              className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              🥫 The Sawsawan Guide
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <NearbyRestaurants city={listing.city} state={listing.state} currentListingId={listing.id} />
        </div>

        {!listing.is_claimed && (
          <div className="mt-12 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-8 text-center">
            <div className="text-3xl mb-3">🏷️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Is this your business?</h3>
            <p className="text-gray-600 mb-2 max-w-lg mx-auto">
              This listing was added by the FilAm Network community. Claim it to add photos, update your details, respond to visitors, and get featured to thousands of Filipino-Americans actively searching for businesses like yours.
            </p>
            <p className="text-sm text-amber-700 font-medium mb-6">
              Verified listings get 3x more visibility in our directory.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`/claim-listing/${slug}`} className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full transition-all hover:scale-105">
                Claim This Listing →
              </a>
              <a href="/advertise" className="inline-block px-6 py-3 border-2 border-amber-500 text-amber-700 font-bold rounded-full hover:bg-amber-100 transition-all">
                Learn About Advertising
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

async function NearbyRestaurants({ city, state, currentListingId }: { city: string; state: string; currentListingId: number }) {
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

  const { data: nearbyListings } = await supabase
    .from('listings')
    .select('id, name, slug, category_primary, google_rating, google_reviews_count')
    .eq('city', city)
    .eq('state', state)
    .neq('id', currentListingId)
    .limit(6)

  if (!nearbyListings || nearbyListings.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        More Filipino Food in {city}, {state}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyListings.map((nearby) => (
          <Link
            key={nearby.id}
            href={`/listings/${nearby.slug}`}
            className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-gray-900 hover:text-blue-600 mb-1">
              {nearby.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{nearby.category_primary}</p>
            {nearby.google_rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium text-sm">{nearby.google_rating}</span>
                <span className="text-gray-500 text-xs">({nearby.google_reviews_count})</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}