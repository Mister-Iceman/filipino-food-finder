import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://filipinofoodnearme.org'

  // Fetch ALL listings. Supabase returns at most 1,000 rows per request,
  // so page through the table instead of relying on a single select.
  const listings: { slug: string; updated_at: string | null; city: string | null; state: string | null }[] = []
  const PAGE = 1000
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('listings')
      .select('slug, updated_at, city, state')
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error || !data) break
    listings.push(...data)
    if (data.length < PAGE) break
  }

  // Unique city/state combinations for city landing pages
  const uniqueCities = [...new Set(
    listings
      .filter((l) => l.city && l.state)
      .map((l) => `${l.city!.toLowerCase().replace(/\s+/g, '-')},${l.state}`)
  )]

  // Map state codes to full names
  const stateNames: { [key: string]: string } = {
    'AL': 'alabama', 'AK': 'alaska', 'AZ': 'arizona', 'AR': 'arkansas',
    'CA': 'california', 'CO': 'colorado', 'CT': 'connecticut', 'DE': 'delaware',
    'FL': 'florida', 'GA': 'georgia', 'HI': 'hawaii', 'ID': 'idaho',
    'IL': 'illinois', 'IN': 'indiana', 'IA': 'iowa', 'KS': 'kansas',
    'KY': 'kentucky', 'LA': 'louisiana', 'ME': 'maine', 'MD': 'maryland',
    'MA': 'massachusetts', 'MI': 'michigan', 'MN': 'minnesota', 'MS': 'mississippi',
    'MO': 'missouri', 'MT': 'montana', 'NE': 'nebraska', 'NV': 'nevada',
    'NH': 'new-hampshire', 'NJ': 'new-jersey', 'NM': 'new-mexico', 'NY': 'new-york',
    'NC': 'north-carolina', 'ND': 'north-dakota', 'OH': 'ohio', 'OK': 'oklahoma',
    'OR': 'oregon', 'PA': 'pennsylvania', 'RI': 'rhode-island', 'SC': 'south-carolina',
    'SD': 'south-dakota', 'TN': 'tennessee', 'TX': 'texas', 'UT': 'utah',
    'VT': 'vermont', 'VA': 'virginia', 'WA': 'washington', 'WV': 'west-virginia',
    'WI': 'wisconsin', 'WY': 'wyoming', 'DC': 'district-of-columbia',
  }

  // Listing pages are served at /:state/:city/restaurants/:slug/ (a rewrite of
  // /listings/:slug/) and that is the canonical URL each listing page declares,
  // so the sitemap lists the same URL. Keep in sync with app/listings/[slug]/page.tsx.
  const listingUrls = listings.map((listing) => {
    let url = `${baseUrl}/listings/${listing.slug}/`
    if (listing.state && listing.city) {
      const stateSlug = stateNames[listing.state] || listing.state.toLowerCase()
      const citySlug = listing.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      url = `${baseUrl}/${stateSlug}/${citySlug}/restaurants/${listing.slug}/`
    }
    return {
      url,
      lastModified: listing.updated_at ? new Date(listing.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  const cityUrls = uniqueCities.map(cityState => {
    const [city, state] = cityState.split(',')
    const stateName = stateNames[state] || state.toLowerCase()
    return {
      url: `${baseUrl}/${stateName}/${city}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })

  // Published articles stored in the database
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, category, updated_at, published_at')
    .eq('status', 'published')
    .in('category', ['knowledge-base', 'newsroom'])

  const articleUrls = (articles ?? []).map((a) => ({
    url: a.category === 'newsroom'
      ? `${baseUrl}/newsroom/${a.slug}/`
      : `${baseUrl}/cultural-knowledge-base/${a.slug}/`,
    lastModified: new Date(a.updated_at ?? a.published_at ?? Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Knowledge base articles that live as their own page folders
  // (app/cultural-knowledge-base/<slug>/page.tsx)
  const culturalKnowledgeUrls = [
    'balut-betamax-and-beyond-filipino-exotic-eats',
    'filipino-food-month-guide',
    'filipino-sweet-tooth-desserts-bakery',
    'flores-de-mayo',
    'from-rations-to-riches-american-influence-filipino-food',
    'golden-crunch-lumpia-cultural-history',
    'long-life-of-pancit-filipino-noodle-culture',
    'merienda-culture-filipino-snacks-street-food',
    'michelin-guide-filipino-food-2026',
    'regional-masterpieces-filipino-food',
    'rise-and-shine-guide-to-filipino-breakfast-almusal',
    'sabaw-season-filipino-soups-stews',
    'sour-power-and-sawsawan-acidity-in-filipino-cooking',
    'tapestry-of-tastes-historical-waves-filipino-cuisine',
    'tree-of-life-coconut-gata-filipino-cuisine',
    'ultimate-sawsawan-guide',
  ].map(slug => ({
    url: `${baseUrl}/cultural-knowledge-base/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dish pages (keys of DISH_INFO in app/dishes/[dish]/page.tsx)
  const dishUrls = [
    'adobo', 'lechon', 'sisig', 'lumpia', 'halo-halo', 'pancit', 'sinigang',
    'kare-kare', 'ube', 'silog', 'dinuguan', 'tapsilog', 'palabok', 'turon',
    'peach-mango-pie', 'garlic-rice', 'bibingka', 'pandesal', 'balut',
  ].map(dish => ({
    url: `${baseUrl}/dishes/${dish}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // State pages, only for states that have listings
  // (/states/ has no Washington DC page, so DC is left out.)
  const stateUrls = [...new Set(listings.map((l) => l.state).filter(Boolean) as string[])]
    .filter((code) => code !== 'DC')
    .map((code) => stateNames[code])
    .filter(Boolean)
    .map((stateSlug) => ({
      url: `${baseUrl}/states/${stateSlug}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  // Browse pages
  const browseUrls = [
    'restaurants', 'bakeries', 'food-trucks', 'grocery-stores', 'quick-bites',
    'dishes', 'states', 'guides', 'guides/most-memorable-filipino-food-cities-2026',
  ].map(path => ({
    url: `${baseUrl}/${path}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Static culture pages (non-DB articles)
  const staticCultureUrls = [
    {
      url: `${baseUrl}/culture/new-wave-filipino-american-cuisine/`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  const all: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/directory/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cultural-knowledge-base/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/newsroom/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/add-business/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...browseUrls,
    ...stateUrls,
    ...dishUrls,
    ...articleUrls,
    ...culturalKnowledgeUrls,
    ...staticCultureUrls,
    ...cityUrls,
    ...listingUrls,
  ]

  // Some articles exist both as a page folder and in the database; list each URL once.
  const seen = new Set<string>()
  return all.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
