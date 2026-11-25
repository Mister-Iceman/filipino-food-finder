import { createClient } from '@supabase/supabase-js'
import { permanentRedirect } from 'next/navigation'
import { listingPath } from '@/lib/listing-url'

// Old address. Every listing now lives at /<state>/<city>/restaurants/<slug>/,
// so this route only 301-redirects there (keeps old links, emails and
// bookmarks working while Google sees one URL per listing).

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function OldListingAddress({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const { data } = await supabase
    .from('listings')
    .select('slug, city, state')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle()

  if (!data || !data.city || !data.state) {
    // Legacy WordPress slugs that were never in the database.
    permanentRedirect('/directory/')
  }

  // Keep query strings (for example the email-verification link).
  const sp = await searchParams
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === 'string') qs.set(k, v)
  }
  const q = qs.toString()
  permanentRedirect(listingPath(data) + (q ? `?${q}` : ''))
}
