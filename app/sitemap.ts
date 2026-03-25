import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://filipinofoodnearme.org'

  // Fetch all listings
  const { data: listings } = await supabase
    .from('listings')
    .select('slug, updated_at')

  const listingUrls = listings?.map((listing) => ({
    url: `${baseUrl}/listings/${listing.slug}/`,
    lastModified: new Date(listing.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })) || []

  // Fetch all unique cities for city landing pages
  const { data: cities } = await supabase
    .from('listings')
    .select('city, state')
    .not('city', 'is', null)
    .not('state', 'is', null)

  // Create unique city combinations
  const uniqueCities = [...new Set(cities?.map(c =>
    `${c.city.toLowerCase().replace(/\s+/g, '-')},${c.state}`
  ) || [])]

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
    'WI': 'wisconsin', 'WY': 'wyoming'
  }

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

  // Static pages - Cultural Knowledge Base articles
  const culturalKnowledgeUrls = [
    'what-is-kamayan-filipino-feast',
    'guide-to-filipino-breakfast-silog-culture',
    'story-behind-lechon-king-of-filipino-feasts',
    'beginners-guide-to-filipino-food',
    'beyond-the-adobo-5-surprising-truths-filipino-american-soul',
    '10-filipino-dishes-every-food-lover-should-try',
  ].map(slug => ({
    url: `${baseUrl}/cultural-knowledge-base/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
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

  return [
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
    {
      url: `${baseUrl}/cultural-knowledge-base/golden-crunch-history-of-lumpia/`,
      lastModified: new Date('2026-03-19'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...culturalKnowledgeUrls,
    ...staticCultureUrls,
    ...cityUrls,
    ...listingUrls,
  ]
}
