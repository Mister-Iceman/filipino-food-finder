// Inserts generated city guide row into city_pages table
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

interface FoodHighlight {
  text: string
}

interface FeaturedRestaurant {
  name: string
  type: string
  listing_slug: string | null
  neighborhood: string
  memorable_bite: string
}

interface CityGuideSaveRequestBody {
  city?: unknown
  state?: unknown
  state_full?: unknown
  slug?: unknown
  intro_tagline?: unknown
  intro_paragraph_1?: unknown
  intro_paragraph_2?: unknown
  filipino_population?: unknown
  migration_history?: unknown
  key_contributions?: unknown
  cultural_tidbit?: unknown
  community_places?: unknown
  food_intro_paragraph?: unknown
  food_highlights?: unknown
  featured_restaurants?: unknown
  meta_title?: unknown
  meta_description?: unknown
}

interface ExistingCityPageRow {
  slug: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CityGuideSaveRequestBody

    if (
      typeof body.city !== 'string' ||
      typeof body.state !== 'string' ||
      typeof body.state_full !== 'string' ||
      typeof body.slug !== 'string' ||
      typeof body.intro_tagline !== 'string' ||
      typeof body.intro_paragraph_1 !== 'string' ||
      typeof body.intro_paragraph_2 !== 'string' ||
      typeof body.filipino_population !== 'string' ||
      typeof body.migration_history !== 'string' ||
      typeof body.key_contributions !== 'string' ||
      typeof body.cultural_tidbit !== 'string' ||
      typeof body.food_intro_paragraph !== 'string' ||
      typeof body.meta_title !== 'string' ||
      typeof body.meta_description !== 'string' ||
      !Array.isArray(body.food_highlights) ||
      !Array.isArray(body.featured_restaurants)
    ) {
      return NextResponse.json(
        { error: 'Invalid city guide payload' },
        { status: 400 }
      )
    }

    const { data: existingRow, error: existingError } = await supabase
      .from('city_pages')
      .select('slug')
      .eq('slug', body.slug)
      .maybeSingle<ExistingCityPageRow>()

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      )
    }

    if (existingRow) {
      return NextResponse.json(
        { error: 'A city guide for this slug already exists' },
        { status: 409 }
      )
    }

    const insertData = {
      city: body.city,
      state: body.state,
      state_full: body.state_full,
      slug: body.slug,
      intro_tagline: body.intro_tagline,
      intro_paragraph_1: body.intro_paragraph_1,
      intro_paragraph_2: body.intro_paragraph_2,
      filipino_population: body.filipino_population,
      migration_history: body.migration_history,
      key_contributions: body.key_contributions,
      cultural_tidbit: body.cultural_tidbit,
      community_places: body.community_places ?? [],
      food_intro_paragraph: body.food_intro_paragraph,
      food_highlights: body.food_highlights as FoodHighlight[],
      featured_restaurants: body.featured_restaurants as FeaturedRestaurant[],
      meta_title: body.meta_title,
      meta_description: body.meta_description,
    }

    const { error: insertError } = await supabase
      .from('city_pages')
      .insert(insertData)

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      slug: body.slug,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to save city guide',
      },
      { status: 500 }
    )
  }
}
