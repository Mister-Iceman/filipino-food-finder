import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

interface TopicSuggestion {
  topic_brief: string
  why_timely: string
  seo_opportunity: 'High' | 'Medium'
}

interface OpenAiSuggestionsResponse {
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

const BASE_SYSTEM_PROMPT = `You are the Topic Suggestion Agent for FilipinoFoodNearMe.org, a Filipino-American food directory and cultural knowledge platform. Your job is to suggest 3 timely, high-value Cultural Knowledge Base article topics.

Consider: current month and year (__CURRENT_MONTH_YEAR__), Filipino and Filipino-American cultural calendar, trending Filipino food topics, seasonal relevance, and SEO opportunity. Never suggest a topic that is already covered by an existing article.

Filipino cultural calendar reference:
- January: New Year traditions, Three Kings (Feast of Epiphany), Sinulog Festival food
- February: Lunar New Year overlap, Filipino Valentine food traditions, heart-shaped bibingka
- March/April: Lenten season, Holy Week food traditions, abstinence foods, Visita Iglesia merienda
- April: Filipino Food Month (highest priority all April), adobo awareness, fiesta season begins
- May: Flores de Mayo, Santacruzan, Mother's Day Filipino food gifts, summer fruits like mangoes
- June: Philippine Independence Day (June 12), Pride Month Fil-Am community food spaces, fiesta season peak
- July: Fiesta season, bayanihan food traditions, summer grilling Filipino style
- August: Buwan ng Wika (Filipino Language Month), regional dialect food names, late summer produce
- September: Filipino American History Month preparation, diaspora food stories
- October: Filipino American History Month (highest priority all October), kakanin traditions, Halloween Fil-Am food
- November: All Saints Day (Undas) food traditions, Simbang Gabi preparation begins, early Christmas food
- December: Simbang Gabi, Noche Buena, Christmas kakanin, Media Noche, New Year food traditions

Existing articles to avoid duplicating (__EXISTING_SLUGS__).

Always respond with valid JSON only. No markdown, no preamble.

Return exactly this structure:
[
  {
    "topic_brief": "Ready-to-use 2-3 sentence brief the writer can paste directly into the Content Agent. Be specific about angle, audience, and tone.",
    "why_timely": "One sentence explaining why this topic matters right now this month.",
    "seo_opportunity": "High or Medium"
  }
]`

function buildSystemPrompt(currentMonthYear: string, existingSlugs: string) {
  return BASE_SYSTEM_PROMPT
    .replace('__CURRENT_MONTH_YEAR__', currentMonthYear)
    .replace('__EXISTING_SLUGS__', existingSlugs)
}

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: missing OPENAI_API_KEY' },
        { status: 500 }
      )
    }

    const { data: existingArticles, error: existingArticlesError } = await supabase
      .from('articles')
      .select('slug')
      .eq('category', 'knowledge-base')
      .eq('status', 'published')
      .order('slug', { ascending: true })

    if (existingArticlesError) {
      console.error('Failed to load existing article slugs for suggestions:', existingArticlesError)
      return NextResponse.json(
        { error: 'Failed to load existing article list' },
        { status: 500 }
      )
    }

    const slugList = [
      ...((existingArticles ?? []).map((article) => article.slug)),
      'new-wave-filipino-american-cuisine',
    ].join(', ')

    const now = new Date()
    const currentMonthYear = now.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Los_Angeles',
    })

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(currentMonthYear, slugList),
          },
          {
            role: 'user',
            content: 'Suggest exactly 3 Cultural Knowledge Base article topics for this month.',
          },
        ],
      }),
    })

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text()
      console.error('OpenAI suggestions agent error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate topic suggestions' },
        { status: 500 }
      )
    }

    const completion = (await openAiResponse.json()) as OpenAiSuggestionsResponse
    const content = completion.choices?.[0]?.message?.content

    if (!content) {
      console.error('OpenAI suggestions agent returned empty content:', completion)
      return NextResponse.json(
        { error: 'OpenAI returned an empty suggestions response' },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(content) as TopicSuggestion[] | { suggestions?: TopicSuggestion[] }
    const suggestions = Array.isArray(parsed) ? parsed : parsed.suggestions

    if (!Array.isArray(suggestions)) {
      console.error('OpenAI suggestions agent returned invalid JSON shape:', parsed)
      return NextResponse.json(
        { error: 'OpenAI returned an invalid suggestions format' },
        { status: 500 }
      )
    }

    return NextResponse.json(suggestions.slice(0, 3))
  } catch (error) {
    console.error('Suggestions agent route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate topic suggestions' },
      { status: 500 }
    )
  }
}
