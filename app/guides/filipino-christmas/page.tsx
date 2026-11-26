import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { listingPath, SITE_URL } from '../../../lib/listing-url'

// Filipino Christmas guide. Every event and business on this page comes
// straight from the database (refreshed daily), so nothing here is made up.
export const revalidate = 86400

const PAGE_PATH = '/guides/filipino-christmas/'
const FENM_ORIGIN = 'https://www.filipinoeventsnearme.org'
const TITLE = 'Filipino Christmas Guide: Simbang Gabi, Noche Buena & Parol Events'
const DESCRIPTION =
  'Where to find Simbang Gabi masses, parol lantern events, and Filipino lechon, bakeries and party trays for Noche Buena across the U.S. Updated daily.'

export const metadata: Metadata = {
  title: `${TITLE} | Filipino Food Near Me`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'article', url: `${SITE_URL}${PAGE_PATH}` },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Spot = {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  google_rating: number | string | null
  google_reviews_count: number | null
  review_keywords: string | null
}

type HolidayEvent = {
  id: string
  title: string
  slug: string
  start_date: string
  city: string | null
  state: string | null
  venue_name: string | null
  category: string | null
}

const SPOT_FIELDS = 'id, name, slug, city, state, google_rating, google_reviews_count, review_keywords'
const BAKERY = 'Bakery, Dessert & Cafe'

// One card per business: the import has a few duplicate rows.
function dedupe(rows: Spot[], limit: number): Spot[] {
  const seen = new Set<string>()
  const out: Spot[] = []
  for (const r of rows) {
    const key = `${r.name.trim().toLowerCase()}|${(r.city ?? '').trim().toLowerCase()}`
    if (seen.has(key)) continue
    if (Number(r.google_rating ?? 0) < 4) continue
    seen.add(key)
    out.push(r)
    if (out.length >= limit) break
  }
  return out
}

async function getSpots() {
  const base = () =>
    supabase
      .from('listings')
      .select(SPOT_FIELDS)
      .gte('google_reviews_count', 20)
      .order('google_reviews_count', { ascending: false })

  const [lechon, bakeries, trays] = await Promise.all([
    base().or('name.ilike.%lechon%,review_keywords.ilike.%lechon%').limit(40),
    supabase
      .from('listings')
      .select(`${SPOT_FIELDS}, category_primary, category_secondary`)
      .gte('google_reviews_count', 20)
      .order('google_reviews_count', { ascending: false })
      .or('review_keywords.ilike.%bibingka%,review_keywords.ilike.%puto bumbong%,review_keywords.ilike.%ensaymada%,review_keywords.ilike.%ensaimada%,review_keywords.ilike.%ube%,review_keywords.ilike.%kakanin%')
      .limit(120),
    base()
      .or('review_keywords.ilike.%catering%,review_keywords.ilike.%party tray%,review_keywords.ilike.%trays%,review_keywords.ilike.%bilao%')
      .limit(40),
  ])

  return {
    lechon: dedupe((lechon.data ?? []) as Spot[], 9),
    bakeries: dedupe(
      ((bakeries.data ?? []) as (Spot & { category_primary: string | null; category_secondary: string | null })[]).filter(
        (r) => r.category_primary === BAKERY || r.category_secondary === BAKERY
      ),
      9
    ),
    trays: dedupe((trays.data ?? []) as Spot[], 9),
  }
}

async function getEvents(): Promise<HolidayEvent[]> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('fenm_events')
    .select('id, title, slug, start_date, city, state, venue_name, category')
    .eq('status', 'active')
    .gte('start_date', today)
    .lte('start_date', `${new Date().getFullYear() + (new Date().getMonth() === 0 ? 0 : 1)}-01-10`)
    .or('title.ilike.%simbang%,title.ilike.%parol%,title.ilike.%christmas%,title.ilike.%noche buena%,title.ilike.%pasko%,title.ilike.%lantern%,title.ilike.%misa de gallo%,title.ilike.%panunuluyan%')
    .order('start_date', { ascending: true })
    .limit(30)
  return (data ?? []) as HolidayEvent[]
}

function formatDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function SpotCard({ spot }: { spot: Spot }) {
  return (
    <Link
      href={listingPath(spot)}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-red-300 transition-all"
    >
      <h3 className="font-bold text-gray-900 mb-1">{spot.name}</h3>
      <p className="text-sm text-gray-600 mb-2">
        {[spot.city, spot.state].filter(Boolean).join(', ')}
      </p>
      {spot.google_rating ? (
        <p className="text-sm text-gray-700">
          ⭐ {Number(spot.google_rating).toFixed(1)}
          {spot.google_reviews_count ? (
            <span className="text-gray-500"> · {spot.google_reviews_count.toLocaleString()} Google reviews</span>
          ) : null}
        </p>
      ) : null}
    </Link>
  )
}

function SponsorSlot() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-yellow-400 bg-yellow-50 p-6 md:p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-yellow-700 mb-2">Sponsor this guide</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">This spot is open for the holidays</h2>
      <p className="text-gray-700 max-w-2xl mx-auto mb-5">
        One Filipino business can be the featured sponsor of this Christmas guide on Filipino Food Near Me
        and Filipino Events Near Me through the season.
      </p>
      <Link
        href="/advertise/"
        className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        See sponsorship options
      </Link>
    </div>
  )
}

export default async function FilipinoChristmasGuide() {
  const [spots, events] = await Promise.all([getSpots(), getEvents()])
  const simbang = events.filter((e) => /simbang|misa de gallo/i.test(e.title))
  const otherEvents = events.filter((e) => !/simbang|misa de gallo/i.test(e.title))

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides/` },
      { '@type': 'ListItem', position: 3, name: 'Filipino Christmas', item: `${SITE_URL}${PAGE_PATH}` },
    ],
  }

  const foodSections: { id: string; title: string; blurb: string; search: string; rows: Spot[] }[] = [
    {
      id: 'lechon',
      title: 'Lechon for the Noche Buena table',
      blurb: 'Places where reviewers mention lechon. Whole lechon and lechon belly sell out in late December, so call ahead and ask how far in advance they take orders.',
      search: 'lechon',
      rows: spots.lechon,
    },
    {
      id: 'bakeries',
      title: 'Bakeries for bibingka, ensaymada and ube',
      blurb: 'Filipino bakeries whose reviews mention holiday favorites like bibingka, puto bumbong, ensaymada and ube. Ask what they bake for the season.',
      search: 'bakery',
      rows: spots.bakeries,
    },
    {
      id: 'party-trays',
      title: 'Party trays and catering',
      blurb: 'Spots whose reviews mention catering or party trays of pancit, lumpia and more. Holiday dates fill up early, so check with them before you plan around a tray.',
      search: 'catering',
      rows: spots.trays,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="bg-gradient-to-br from-red-700 via-red-600 to-green-700 text-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/guides/" className="hover:text-white">Guides</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Filipino Christmas</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">Filipino Christmas Guide</h1>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-95">
            Paskong Pinoy is famously long, and it runs on food, faith and lanterns.
            Here is where to find Simbang Gabi, parol events, and the lechon, bibingka and party trays for
            Noche Buena near you.
          </p>
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <a href="#simbang-gabi" className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full">Simbang Gabi</a>
            <a href="#parol-events" className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full">Parol & holiday events</a>
            <a href="#lechon" className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full">Lechon</a>
            <a href="#bakeries" className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full">Bakeries</a>
            <a href="#party-trays" className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full">Party trays</a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">
        <SponsorSlot />

        <section id="simbang-gabi" className="scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Simbang Gabi masses</h2>
          <p className="text-gray-700 mb-6 max-w-3xl">
            Simbang Gabi is the novena of nine masses leading up to Christmas, traditionally held from
            December 16 to 24. Many U.S. parishes hold them in the evening, and plenty of families
            follow mass with bibingka and puto bumbong.
          </p>
          {simbang.length > 0 ? (
            <ul className="grid md:grid-cols-2 gap-4">
              {simbang.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No Simbang Gabi masses are listed yet for this season.</p>
          )}
          <p className="mt-5 text-sm text-gray-600">
            Parish not listed? <a href={`${FENM_ORIGIN}/submit-event`} className="text-red-700 font-semibold hover:underline">Add it free on Filipino Events Near Me</a>, or read the{' '}
            <a href={`${FENM_ORIGIN}/guides/first-simbang-gabi-guide`} className="text-red-700 font-semibold hover:underline">first-timer&apos;s guide to Simbang Gabi</a>.
          </p>
        </section>

        <section id="parol-events" className="scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Parol and holiday events</h2>
          <p className="text-gray-700 mb-6 max-w-3xl">
            The parol, the star-shaped lantern, is the symbol of a Filipino Christmas. These are the
            lantern festivals, workshops and holiday gatherings listed so far.
          </p>
          {otherEvents.length > 0 ? (
            <ul className="grid md:grid-cols-2 gap-4">
              {otherEvents.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No parol or holiday events are listed yet for this season.</p>
          )}
          <p className="mt-5 text-sm text-gray-600">
            See every upcoming event on{' '}
            <a href={`${FENM_ORIGIN}/guides/filipino-christmas`} className="text-red-700 font-semibold hover:underline">Filipino Events Near Me&apos;s Christmas guide</a>.
          </p>
        </section>

        {foodSections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{s.title}</h2>
            <p className="text-gray-700 mb-6 max-w-3xl">{s.blurb}</p>
            {s.rows.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {s.rows.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nothing listed here yet.</p>
            )}
            <Link
              href={`/directory/?search=${encodeURIComponent(s.search)}`}
              className="inline-block mt-5 text-red-700 font-semibold hover:underline"
            >
              Find {s.search === 'bakery' ? 'bakeries' : s.search} near you →
            </Link>
          </section>
        ))}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Own a Filipino restaurant or bakery?</h2>
          <p className="text-gray-700 mb-4">
            Make sure holiday customers can find you. Listing is free, and you can claim your page to update
            your hours and holiday ordering details.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/add-business/" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg">Add your business</Link>
            <Link href="/claim-listing/" className="border border-gray-300 hover:border-red-400 text-gray-800 font-semibold px-5 py-2.5 rounded-lg">Claim your listing</Link>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Listings and events come from Filipino Food Near Me and Filipino Events Near Me and refresh daily.
          Ratings are from Google. Always confirm dates, hours and holiday ordering with the business or parish.
        </p>
      </div>
    </div>
  )
}

function EventRow({ event }: { event: HolidayEvent }) {
  return (
    <li>
      <a
        href={`${FENM_ORIGIN}/events/${event.slug}`}
        className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-green-400 transition-all"
      >
        <p className="text-sm font-semibold text-red-700 mb-1">{formatDate(event.start_date)}</p>
        <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
        <p className="text-sm text-gray-600">
          {[event.venue_name, [event.city, event.state].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
        </p>
      </a>
    </li>
  )
}
