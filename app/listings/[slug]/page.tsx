import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/directory" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Directory
        </Link>

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

          <div className="space-y-4">
            <p className="text-gray-700">
              📍 {listing.address_street}, {listing.city}, {listing.state} {listing.zip}
            </p>
            {listing.phone && <p className="text-gray-700">📞 {listing.phone}</p>}
            {listing.hours && <p className="text-gray-700">🕐 {listing.hours}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}