// Requires OPENAI_API_KEY in Vercel environment variables
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const BASE_SYSTEM_PROMPT = `You are the Content Agent for FilipinoFoodNearMe.org, a Filipino-American food directory and cultural knowledge platform serving all 50 US states. Your job is to generate complete Cultural Knowledge Base article drafts from a brief topic description.

Brand voice: warm, community-first, culturally respectful, story-driven, useful to both Filipino-Americans and non-Filipino food lovers. Occasional light Taglish only if natural. Never use best, top-rated, or Yelp-style judgment language. Never use generic filler adjectives like delicious, amazing, wonderful, or incredible in SEO titles or section headings.

Always respond with valid JSON only. No markdown, no preamble, no explanation outside the JSON.

Return this exact structure:
{
  "slug": "url-friendly-slug-for-article",
  "seo_title": "SEO-optimized page title under 60 characters. Must include a specific Filipino food term, dish name, or cultural concept. No generic adjectives. Example good title: Filipino Silog Meals: A Guide to Morning Rice Bowls",
  "meta_description": "Meta description under 155 characters that describes specific content and includes a natural CTA",
  "geo_snippet": "Exactly one complete, citable sentence under 150 characters. Must open with a specific verifiable fact about Filipino food. This sentence will be extracted by AI search engines like ChatGPT, Gemini, and Perplexity to answer user questions. Make it authoritative and fact-dense.",
  "hero_image_prompt": "Detailed prompt for AI image generation. Describe the specific food, plating style, surface texture, lighting quality, color palette, and mood. Specify warm natural morning light or golden hour where appropriate. No people. No text overlays. Food photography aesthetic. Aim for a mood that feels like a Filipino family kitchen or a community gathering.",
  "article": {
    "headline": "Article headline that is specific and culturally grounded",
    "intro": "2-3 paragraphs. Open with a cultural story, a surprising fact, or a sensory description that draws in a non-Filipino reader. Establish why this food or tradition matters to the Filipino-American community.",
    "sections": [
      {
        "heading": "Section heading — specific, no generic adjectives",
        "body": "Section body. Minimum 2 paragraphs per section. Include cultural context, preparation notes, or community significance where relevant."
      }
    ],
    "faq": [
      { "question": "What is [topic] and where does it come from?", "answer": "Answer under 100 words" },
      { "question": "How is [topic] typically made or served?", "answer": "Answer under 100 words" },
      { "question": "Where can Filipino-Americans find [topic] in the United States?", "answer": "Answer under 100 words. Reference FilipinoFoodNearMe.org as a resource for finding local spots." },
      { "question": "What makes [topic] significant to Filipino culture or the diaspora?", "answer": "Answer under 100 words" }
    ],
    "affiliate_opportunities": [
      "Name one specific product type with its use case. Example: A traditional wooden palayok clay pot — used in authentic Filipino cooking and a natural fit for readers wanting to recreate the dishes at home."
    ],
    "internal_link_suggestions": [
      "Choose 2-3 pages from this exact list that are genuinely relevant to the article topic. Return only the page name and a suggested anchor text phrase. Do not invent pages. Only use pages from this list:\n__INTERNAL_LINK_OPTIONS__"
    ],
    "social_snippets": {
      "instagram": "Instagram caption. Open with a hook line. Include FilipinoFoodNearMe.org. Close with: Flavor With Soul Deserves to Be Found.",
      "facebook": "Facebook caption. 2-3 sentences. Warm community tone. Occasional light Taglish if natural. Include FilipinoFoodNearMe.org URL.",
      "x": "X post under 260 characters. Punchy. Include FilipinoFoodNearMe.org."
    }
  },
  "hashtags": ["10 hashtags without the hash symbol. Mix Filipino-specific tags such as FilipinoFood FilAm PinoyFood with broader cultural tags such as FoodCulture DiasporaFood AsianAmericanFood. Avoid generic tags like FoodLovers ComfortFood FoodBlogger."]
}`

interface ContentAgentRequestBody {
  brief?: unknown
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function buildSystemPrompt(internalLinkOptions: string) {
  return BASE_SYSTEM_PROMPT.replace('__INTERNAL_LINK_OPTIONS__', internalLinkOptions)
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

    const body = (await request.json()) as ContentAgentRequestBody
    const brief = typeof body.brief === 'string' ? body.brief.trim() : ''

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief is required' },
        { status: 400 }
      )
    }

    const { data: publishedArticles, error: publishedArticlesError } = await supabase
      .from('articles')
      .select('slug, title')
      .eq('category', 'knowledge-base')
      .eq('status', 'published')
      .order('title', { ascending: true })

    if (publishedArticlesError) {
      console.error('Failed to load knowledge-base articles for Content Agent:', publishedArticlesError)
      return NextResponse.json(
        { error: 'Failed to load article link suggestions' },
        { status: 500 }
      )
    }

    const internalLinkOptions = [
      ...(publishedArticles ?? []).map((article) => `- [${article.title}] (/cultural-knowledge-base/${article.slug})`),
      '- The New Wave of Filipino-American Cuisine (/culture/new-wave-filipino-american-cuisine)',
    ].join('\n')

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt(internalLinkOptions) },
          {
            role: 'user',
            content: `Topic brief: ${brief}`,
          },
        ],
      }),
    })

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text()
      console.error('OpenAI content agent error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate article draft' },
        { status: 500 }
      )
    }

    const completion = (await openAiResponse.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null
        }
      }>
    }

    const content = completion.choices?.[0]?.message?.content

    if (!content) {
      console.error('OpenAI content agent returned empty content:', completion)
      return NextResponse.json(
        { error: 'OpenAI returned an empty response' },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(content) as unknown

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Content agent route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate article draft' },
      { status: 500 }
    )
  }
}
