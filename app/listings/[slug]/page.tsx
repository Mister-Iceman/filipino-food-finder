import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RatingForm from '../../components/RatingForm'
import RatingSummary from '../../components/RatingSummary'
import AdSlot from '../../components/AdSlot'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!listing) {
    notFound()
  }

  // Determine category (restaurant vs grocery)
  const isGrocery = 
    listing.category_primary?.toLowerCase().includes('supermarket') ||
    listing.category_primary?.toLowerCase().includes('grocery') ||
    listing.category_primary?.toLowerCase().includes('market')

  const category = isGrocery ? 'grocery' : 'restaurant'

  // Generate JSON-LD schema for SEO
  const schema = {
    '@context': 'https://schema.org',
    '@type': isGrocery ? 'GroceryStore' : 'Restaurant',
    name: listing.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address_street,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
      addressCountry: 'US',
    },
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
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/directory" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Directory
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{listing.name}</h1>
              <p className="text-xl text-gray-600 mb-6">{listing.category_primary}</p>

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
                {listing.phone && <p className="text-gray-700">📞 {listing.phone}</p>}
                {listing.hours && <p className="text-gray-700">🕐 {listing.hours}</p>}
              </div>

              {/* Community Ratings Summary */}
              <div className="mb-8">
                <RatingSummary 
                  listingId={listing.id}
                  category={category}
                />
              </div>
            </div>

            {/* Rating Form Section */}
            <div className="mt-8">
              <RatingForm 
                listingId={listing.id} 
                listingName={listing.name}
                listingSlug={slug}
                category={category}
              />
            </div>
          </div>
          
          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Ad Slot - Vertical */}
              <AdSlot 
                slot="0987654321" 
                format="vertical"
                responsive={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}