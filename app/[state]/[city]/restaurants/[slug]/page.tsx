import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { STATE_NAMES, SITE_URL, citySlug as toCitySlug, stateSlug as toStateSlug, listingPath, listingUrl as toListingUrl, formatZip, cleanStreet, cleanMapsUrl } from '@/lib/listing-url'
import Link from 'next/link'
import RatingForm from '@/app/components/RatingForm'
import RatingSummary from '@/app/components/RatingSummary'
import AvailableDishesDisplay from '@/app/components/AvailableDishesDisplay'
import AdSlot from '@/app/components/AdSlot'
import SocialShare from '@/app/components/SocialShare'
import PhoneReveal from '@/app/components/PhoneReveal'
import ClaimForm from '@/app/components/ClaimForm'
import LeadLink from '@/app/components/LeadLink'
import ListingDetailTracker from '@/app/components/analytics/ListingDetailTracker'
import { retryFetch } from '@/lib/retry-fetch'

export const revalidate = 3600


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options = {}) =>
        retryFetch(url, { ...options, next: { revalidate: 3600 } }),
    },
  }
)

// Cached fetcher — called by both generateMetadata and ListingPage within the same request.
// React's cache() deduplicates to a single Supabase round-trip per request.
const getListing = cache(async (slug: string) => {
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single()
  return data
})

type Params = Promise<{ state: string; city: string; slug: string }>

function describe(listing: any): string {
  if (listing.description && listing.description.trim().length > 40) {
    const d = listing.description.trim().replace(/\s+/g, ' ')
    return d.length > 158 ? d.slice(0, 155).replace(/\s+\S*$/, '') + '…' : d
  }
  const kind = (listing.category_primary || 'Filipino restaurant').toLowerCase()
  const where = [cleanStreet(listing.address_street, listing.city, listing.state), listing.city, listing.state].filter(Boolean).join(', ')
  const extras = [
    listing.hours ? 'hours' : null,
    listing.phone ? 'phone' : null,
    listing.website ? 'website' : null,
  ].filter(Boolean)
  const tail = extras.length
    ? ` See ${extras.join(', ').replace(/, ([^,]*)$/, ' and $1')}, directions and community notes.`
    : ' See directions, nearby Filipino food and community notes.'
  return `${listing.name} is a Filipino ${kind.replace(/^filipino\s+/, '')} at ${where}.${tail}`
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListing(slug)
  if (!listing) return { robots: { index: false } }

  const stateName = STATE_NAMES[(listing.state || '').toUpperCase()] || listing.state
  const category = (listing.category_primary || 'Restaurant').replace(/\s*&\s*/g, ' & ')
  // Server-rendered, so crawlers see it without running JavaScript.
  const title = `${listing.name}: Filipino ${category} in ${listing.city}, ${listing.state} | FilipinoFoodNearMe`
  const description = describe(listing)
  const url = toListingUrl(listing)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${listing.name} in ${listing.city}, ${stateName}`,
      description,
      url,
      siteName: 'Filipino Food Near Me',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${listing.name} in ${listing.city}, ${stateName}`,
      description,
    },
  }
}

export default async function ListingPage({ params }: { params: Params }) {
  const { state: stateParam, city: cityParam, slug } = await params
  const listing = await getListing(slug)

  // Fetch approved photos (service role for signed URLs)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: retryFetch } }
  )
  const { data: rawPhotos } = await supabaseAdmin
    .from('listing_photos')
    .select('id, storage_path, caption')
    .eq('listing_id', slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: true })
  const photos: { url: string; caption: string | null }[] = []
  if (rawPhotos && rawPhotos.length > 0) {
    const { data: signedUrls } = await supabaseAdmin.storage
      .from('listing-photos')
      .createSignedUrls(rawPhotos.map(p => p.storage_path), 3600)
    signedUrls?.forEach((signed, i) => {
      if (signed.signedUrl) photos.push({ url: signed.signedUrl, caption: rawPhotos[i].caption ?? null })
    })
  }

  if (!listing) {
    // Legacy WordPress slugs not in DB get a permanent 308 redirect to the
    // directory rather than a 404. App Router page routes intercept before
    // next.config.ts redirects for matching dynamic paths, so this is the
    // only reliable place to handle it.
    permanentRedirect('/directory/')
  }

  // One address per listing: send any other state/city spelling to the real one.
  if (listing.state && listing.city &&
      (stateParam !== toStateSlug(listing.state) || cityParam !== toCitySlug(listing.city))) {
    permanentRedirect(listingPath(listing))
  }

  // Server-side data for blocks that used to show "Loading…" to crawlers.
  const [{ data: dishData }, { data: ratingData }] = await Promise.all([
    supabase
      .from('business_dish_tags')
      .select('*, dish_tags(id, name, category, display_order)')
      .eq('business_id', listing.id)
      .order('dish_tags(display_order)'),
    supabase.from('ratings').select('*').eq('listing_id', listing.id),
  ])

  const isGrocery =
    listing.category_primary?.toLowerCase().includes('supermarket') ||
    listing.category_primary?.toLowerCase().includes('grocery') ||
    listing.category_primary?.toLowerCase().includes('market')

  const category = isGrocery ? 'grocery' : 'restaurant'

  const stateSlug = toStateSlug(listing.state)
  const citySlug = toCitySlug(listing.city)

  const baseUrl = SITE_URL
  const listingUrl = toListingUrl(listing)
  const street = cleanStreet(listing.address_street, listing.city, listing.state)
  const zip = formatZip(listing.zip)
  const mapsUrl = cleanMapsUrl(listing.google_maps_url)
  const fullAddress = [street, listing.city, `${listing.state} ${zip}`.trim()].filter(Boolean).join(', ')
  const mapQuery = encodeURIComponent(`${listing.name}, ${fullAddress}`)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${baseUrl}/directory/` },
      { '@type': 'ListItem', position: 3, name: listing.state, item: `${baseUrl}/states/${stateSlug}/` },
      { '@type': 'ListItem', position: 4, name: listing.city, item: `${baseUrl}/${stateSlug}/${citySlug}/` },
      { '@type': 'ListItem', position: 5, name: listing.name, item: listingUrl },
    ],
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': isGrocery ? 'GroceryStore' : 'Restaurant',
    name: listing.name,
    description: describe(listing),
    url: listingUrl,
    servesCuisine: 'Filipino',
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: zip,
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
    ...(listing.website && /^https?:\/\//i.test(listing.website) && { sameAs: [listing.website] }),
    ...(mapsUrl && { hasMap: mapsUrl }),
    // No aggregateRating: the ratings shown come from Google, and Google's
    // review-snippet rules forbid marking up ratings collected on another site.
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
              <Link href={`/states/${stateSlug}/`} className="hover:underline hover:text-blue-600">
                {listing.state}
              </Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li>
              <Link href={`/${stateSlug}/${citySlug}/`} className="hover:underline hover:text-blue-600">
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
              <p className="text-xl text-gray-600 mb-2">{listing.category_primary}</p>
              {!listing.is_claimed ? (
                <p className="text-sm text-gray-500 mb-6">
                  Is this your business?{' '}
                  <a href={`/claim-listing/${slug}/`} className="font-semibold text-amber-700 underline hover:text-amber-800">
                    Add photos, hours and a menu for free
                  </a>
                </p>
              ) : (
                <div className="mb-6" />
              )}

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
                  📍 {fullAddress}
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
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {[
                    ['Google Maps', mapsUrl],
                    ['Instagram', listing.instagram_url],
                    ['Facebook', listing.facebook_url],
                    ['TikTok', listing.tiktok_url],
                    ['X', listing.x_url || listing.twitter_url],
                  ].map(([label, href]) => typeof href === 'string' && /^https?:\/\//i.test(href) && (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{label}</a>
                  ))}
                </div>
                
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
                {listing.description && listing.description.trim() && (
                  <p className="text-gray-700 leading-relaxed mb-6">{listing.description.trim()}</p>
                )}

                <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
                  <iframe
                    title={`Map showing ${listing.name} in ${listing.city}, ${listing.state}`}
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                    className="w-full h-64"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
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
                <AvailableDishesDisplay listingId={listing.id} initialDishes={(dishData ?? []) as any} />
              </div>

              <div className="mb-8">
                <RatingSummary
                  listingId={listing.id}
                  category={category}
                  initialRatings={ratingData ?? []}
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
              href={`/${stateSlug}/${citySlug}/`}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              📍 Filipino Food in {listing.city}
            </Link>
            <Link
              href={`/states/${stateSlug}/`}
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
          <NearbyRestaurants city={listing.city} state={listing.state} currentListingId={listing.id} stateSlug={stateSlug} citySlug={citySlug} />
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

async function NearbyRestaurants({ city, state, currentListingId, stateSlug, citySlug }: { city: string; state: string; currentListingId: number; stateSlug: string; citySlug: string }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (url, options = {}) =>
          retryFetch(url, { ...options, next: { revalidate: 3600 } }),
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
            href={listingPath({ slug: nearby.slug, city, state })}
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
