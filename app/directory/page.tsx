import { createClient } from '@supabase/supabase-js'
import { Suspense } from 'react'
import DirectoryContent from './DirectoryContent'

export const metadata = {
  title: 'Filipino Restaurant Directory | Filipino Food Near Me',
  description: 'Browse our complete directory of Filipino restaurants, bakeries, grocery stores, and food trucks across America.',
  robots: 'noindex, follow',
  alternates: {
    canonical: 'https://www.filipinofoodnearme.org/directory',
  },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options = {}) =>
        fetch(url, { ...options, cache: 'no-store' }),
    },
  }
)

async function fetchAllListings() {
  let allData: any[] = []
  let from = 0
  const batchSize = 1000

  while (true) {
    const { data } = await supabase
      .from('listings')
      .select('id, name, slug, city, state, zip, address_street, phone, website, google_maps_url, category_primary, category_secondary, google_rating, google_reviews_count, hours, instagram_url, facebook_url, tiktok_url, x_url, is_pickup_only, review_keywords')
      .range(from, from + batchSize - 1)
      .order('name', { ascending: true })

    if (!data || data.length === 0) break
    allData = [...allData, ...data]
    if (data.length < batchSize) break
    from += batchSize
  }

  return allData
}

async function fetchPhotoSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('listing_photos')
    .select('listing_id')
    .eq('status', 'approved')
  const slugs = [...new Set((data ?? []).map((r: { listing_id: string }) => r.listing_id))]
  return slugs
}

export default async function DirectoryPage() {
  const [listings, photoSlugs] = await Promise.all([fetchAllListings(), fetchPhotoSlugs()])

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    }>
      <DirectoryContent initialListings={listings} photoSlugs={photoSlugs} />
    </Suspense>
  )
}
