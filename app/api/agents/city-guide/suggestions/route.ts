import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

interface CityListingRow {
  city: string | null
  state: string | null
}

interface ExistingCityPageRow {
  slug: string | null
}

interface CityGuideCandidate {
  city: string
  state: string
  listing_count: number
}

interface CityGuideSuggestion {
  city: string
  state: string
  listing_count: number
  why_prioritize: string
  seo_opportunity: 'High' | 'Medium'
}

interface OpenAiChatResponse {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SYSTEM_PROMPT = `You are the City Guide Suggestion Agent for FilipinoFoodNearMe.org. Given a list of cities with Filipino food listings that do not yet have a city guide, suggest the 3 highest-priority cities to write guides for next.

Consider: listing count (more listings = higher priority), city size and Filipino-American population significance, geographic diversity (avoid suggesting 3 California cities if other states are available), and SEO opportunity.

Always respond with valid JSON only. No markdown, no preamble.

Return exactly:
[
  {
    "city": "City Name",
    "state": "CA",
    "listing_count": 42,
    "why_prioritize": "One sentence explaining why this city should be next.",
    "seo_opportunity": "High or Medium"
  }
]`

function toSlugPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json([])
    }

    const { data: restaurantRows, error: restaurantError } = await supabase
      .from('restaurants')
      .select('city, state')

    if (restaurantError) {
      console.error('City guide suggestions restaurants query error:', restaurantError)
      return NextResponse.json([])
    }

    const { data: existingCityPages, error: cityPagesError } = await supabase
      .from('city_pages')
      .select('slug')

    if (cityPagesError) {
      console.error('City guide suggestions city_pages query error:', cityPagesError)
      return NextResponse.json([])
    }

    const counts = new Map<string, CityGuideCandidate>()
    for (const row of (restaurantRows ?? []) as CityListingRow[]) {
      const city = row.city?.trim()
      const state = row.state?.trim().toUpperCase()
      if (!city || !state) {
        continue
      }

      const key = `${city.toLowerCase()}|${state.toLowerCase()}`
      const existing = counts.get(key)
      if (existing) {
        existing.listing_count += 1
      } else {
        counts.set(key, {
          city,
          state,
          listing_count: 1,
        })
      }
    }

    const qualifyingCities = Array.from(counts.values())
      .filter((item) => item.listing_count >= 5)
      .sort((a, b) => b.listing_count - a.listing_count)

    const existingSlugs = new Set(
      ((existingCityPages ?? []) as ExistingCityPageRow[])
        .map((row) => row.slug?.trim().toLowerCase())
        .filter((slug): slug is string => Boolean(slug))
    )

    const expansionCities = qualifyingCities
      .filter((item) => {
        const citySlug = toSlugPart(item.city)
        for (const existingSlug of existingSlugs) {
          if (existingSlug === citySlug || existingSlug.endsWith(`/${citySlug}`)) {
            return false
          }
        }
        return true
      })
      .slice(0, 5)

    if (expansionCities.length === 0) {
      return NextResponse.json([])
    }

    const userMessage = [
      'Cities needing guides (sorted by listing count):',
      ...expansionCities.map(
        (item) => `- ${item.city}, ${item.state}: ${item.listing_count} listings`
      ),
    ].join('\n')

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 600,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    })

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text()
      console.error('City guide suggestions OpenAI error:', errorText)
      return NextResponse.json([])
    }

    const completion = (await openAiResponse.json()) as OpenAiChatResponse
    const content = completion.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json([])
    }

    const parsed = JSON.parse(content) as CityGuideSuggestion[] | { suggestions?: CityGuideSuggestion[] }
    const suggestions = Array.isArray(parsed) ? parsed : parsed.suggestions

    if (!Array.isArray(suggestions)) {
      return NextResponse.json([])
    }

    return NextResponse.json(suggestions.slice(0, 3))
  } catch (error) {
    console.error('City guide suggestions route error:', error)
    return NextResponse.json([])
  }
}
