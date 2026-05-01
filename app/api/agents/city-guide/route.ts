import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

interface CityGuideRequestBody {
  city?: unknown
  state?: unknown
  state_full?: unknown
}

interface RestaurantRow {
  name: string | null
  category_primary: string | null
  description: string | null
  city: string | null
  state: string | null
}

interface SelectedRestaurant {
  name: string
  category_primary: string
  description: string
  city: string
  state: string
}

interface FoodHighlight {
  text: string
}

interface FeaturedRestaurant {
  name: string
  type: 'fusion' | 'classic' | 'turo-turo' | 'bakery' | 'dessert' | 'grocery' | 'chain'
  listing_slug: null
  neighborhood: string
  memorable_bite: string
}

interface ParsedCityGuideResponse {
  intro_tagline: string
  intro_paragraph_1: string
  intro_paragraph_2: string
  filipino_population: string
  migration_history: string
  key_contributions: string
  cultural_tidbit: string
  food_intro_paragraph: string
  food_highlights: FoodHighlight[]
  featured_restaurants: FeaturedRestaurant[]
  meta_title: string
  meta_description: string
  seo_title: string
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

const SYSTEM_PROMPT = `You are the City Guide Agent for FilipinoFoodNearMe.org, a Filipino-American food directory serving all 50 US states. Generate a complete city guide entry for the given city.

Brand voice: warm, community-first, culturally respectful, story-driven. Never use "best," "top-rated," or Yelp-style judgment language. Never use generic adjectives like "vibrant," "delicious," or "amazing."

You will receive real business names and categories from the FFNM directory for this city. Use these as the basis for featured_restaurants. Generate a memorable_bite description for each based on their name and category — make it specific, evocative, and community-warm. Do not invent businesses not in the provided list.

Always respond with valid JSON only. No markdown, no preamble, no explanation outside the JSON.

Return exactly this structure:
{
  "intro_tagline": "One evocative headline phrase for Filipino food in this city",
  "intro_paragraph_1": "2-3 sentences. Establish the Filipino-American community presence and history in this city. Specific, story-driven, not generic.",
  "intro_paragraph_2": "2-3 sentences. Describe the neighborhood feel and where Filipino community life happens in this city.",
  "filipino_population": "Estimated Filipino population with context — use known data or reasonable estimates based on city size and Filipino-American demographic patterns.",
  "migration_history": "1-2 sentences on how and when Filipinos came to this city.",
  "key_contributions": "1-2 sentences on Filipino-American contributions to this city.",
  "cultural_tidbit": "One specific, interesting cultural fact about the Filipino community in this city.",
  "food_intro_paragraph": "2-3 sentences describing the character of Filipino food in this city — what makes it distinct, what waves of migration shaped it.",
  "food_highlights": [
    {"text": "Specific food highlight relevant to this city — name actual dish types and context"},
    {"text": "Second food highlight"},
    {"text": "Third food highlight"},
    {"text": "Fourth food highlight"}
  ],
  "featured_restaurants": [
    {
      "name": "Business name exactly as provided",
      "type": "category from: fusion, classic, turo-turo, bakery, dessert, grocery, chain",
      "listing_slug": null,
      "neighborhood": "Area of city if inferable, otherwise leave as empty string",
      "memorable_bite": "Specific evocative description of what makes this place special — warm, community-first tone, 1-2 sentences"
    }
  ],
  "meta_title": "Filipino Food in {City} | Filipino Food Near Me",
  "meta_description": "Meta description under 155 characters. Mention the city, Filipino community, and types of food available.",
  "seo_title": "Filipino Food in {City}: [evocative subtitle]"
}`

function toSlugPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatDescriptionSnippet(text: string | null) {
  const trimmed = (text ?? '').trim()
  if (!trimmed) {
    return ''
  }
  return trimmed.length <= 100 ? trimmed : `${trimmed.slice(0, 100).trim()}...`
}

function selectDiverseRestaurants(restaurants: SelectedRestaurant[]) {
  const selected: SelectedRestaurant[] = []
  const seenCategories = new Set<string>()

  for (const restaurant of restaurants) {
    const categoryKey = restaurant.category_primary.toLowerCase()
    if (!seenCategories.has(categoryKey)) {
      selected.push(restaurant)
      seenCategories.add(categoryKey)
    }
    if (selected.length >= 6) {
      return selected
    }
  }

  for (const restaurant of restaurants) {
    if (selected.some((item) => item.name === restaurant.name)) {
      continue
    }
    selected.push(restaurant)
    if (selected.length >= 6) {
      break
    }
  }

  return selected
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: missing OPENAI_API_KEY' },
        { status: 500 }
      )
    }

    const body = (await request.json()) as CityGuideRequestBody
    const city = typeof body.city === 'string' ? body.city.trim() : ''
    const state = typeof body.state === 'string' ? body.state.trim().toUpperCase() : ''
    const stateFull = typeof body.state_full === 'string' ? body.state_full.trim() : ''

    if (!city || !state || !stateFull) {
      return NextResponse.json(
        { error: 'City, state, and state_full are required' },
        { status: 400 }
      )
    }

    const { data: restaurantRows, error: restaurantError } = await supabase
      .from('restaurants')
      .select('name, category_primary, description, city, state')
      .ilike('city', city)
      .ilike('state', state)
      .limit(20)

    if (restaurantError) {
      console.error('City guide restaurants query error:', restaurantError)
      return NextResponse.json(
        { error: 'Failed to load city listings from Supabase' },
        { status: 500 }
      )
    }

    const usableRestaurants = ((restaurantRows ?? []) as RestaurantRow[])
      .filter(
        (row) =>
          Boolean(row.name?.trim()) &&
          Boolean(row.category_primary?.trim()) &&
          Boolean(row.city?.trim()) &&
          Boolean(row.state?.trim())
      )
      .map((row) => ({
        name: row.name!.trim(),
        category_primary: row.category_primary!.trim(),
        description: row.description?.trim() ?? '',
        city: row.city!.trim(),
        state: row.state!.trim().toUpperCase(),
      }))

    const selectedRestaurants = selectDiverseRestaurants(usableRestaurants)

    const generatedSlug = `${toSlugPart(stateFull)}/${toSlugPart(city)}`

    const formattedBusinesses = selectedRestaurants.length > 0
      ? selectedRestaurants
          .map(
            (restaurant) =>
              `${restaurant.name} | ${restaurant.category_primary} | ${formatDescriptionSnippet(restaurant.description)}`
          )
          .join('\n')
      : 'No businesses provided from the directory.'

    const userMessage = `City: ${city}, ${stateFull}
Real businesses in this city from our directory:
${formattedBusinesses}

Generate a complete city guide for FilipinoFoodNearMe.org.`

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 2000,
        response_format: { type: 'json_object' },
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
      console.error('City guide OpenAI error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate city guide draft' },
        { status: 500 }
      )
    }

    const completion = (await openAiResponse.json()) as OpenAiChatResponse
    const content = completion.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'OpenAI returned an empty city guide response' },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(content) as ParsedCityGuideResponse

    return NextResponse.json({
      city,
      state,
      state_full: stateFull,
      slug: generatedSlug,
      intro_tagline: parsed.intro_tagline,
      intro_paragraph_1: parsed.intro_paragraph_1,
      intro_paragraph_2: parsed.intro_paragraph_2,
      filipino_population: parsed.filipino_population,
      migration_history: parsed.migration_history,
      key_contributions: parsed.key_contributions,
      cultural_tidbit: parsed.cultural_tidbit,
      community_places: [],
      food_intro_paragraph: parsed.food_intro_paragraph,
      food_highlights: parsed.food_highlights,
      featured_restaurants: parsed.featured_restaurants,
      meta_title: parsed.meta_title,
      meta_description: parsed.meta_description,
      seo_title: parsed.seo_title,
    })
  } catch (error) {
    console.error('City guide route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate city guide draft' },
      { status: 500 }
    )
  }
}
