// Requires OPENAI_API_KEY in Vercel environment variables
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are the Content Agent for FilipinoFoodNearMe.org, a Filipino-American food directory and cultural knowledge platform serving all 50 US states. Your job is to generate complete Cultural Knowledge Base article drafts from a brief topic description.

Brand voice: warm, community-first, culturally respectful, story-driven, useful to both Filipino-Americans and non-Filipino food lovers. Occasional light Taglish only if natural. Never use "best," "top-rated," or Yelp-style judgment language.

Always respond with valid JSON only. No markdown, no preamble, no explanation outside the JSON.

Return this exact structure:
{
  "slug": "url-friendly-slug-for-article",
  "seo_title": "SEO-optimized page title under 60 characters",
  "meta_description": "Meta description under 155 characters",
  "geo_snippet": "Fact-dense 150-character summary for AI search engines to cite. Lead with a specific, verifiable fact about Filipino food.",
  "hero_image_prompt": "Detailed prompt to generate a hero image using an AI image tool. Describe food, lighting, setting, mood. No people.",
  "article": {
    "headline": "Article headline",
    "intro": "2-3 paragraph introduction. Hook with cultural story or surprising fact.",
    "sections": [
      {
        "heading": "Section heading",
        "body": "Section body paragraphs"
      }
    ],
    "faq": [
      { "question": "FAQ question", "answer": "FAQ answer under 100 words" }
    ],
    "affiliate_opportunities": [
      "Describe 1-3 specific Amazon products naturally relevant to this article topic that could carry an affiliate link. Be specific — name the product type and why it fits."
    ],
    "internal_link_suggestions": [
      "Suggest 2-3 existing FFNM pages to link to within the article body. Format: page name + suggested anchor text."
    ],
    "social_snippets": {
      "instagram": "Instagram caption with CTA to visit FilipinoFoodNearMe.org",
      "facebook": "Facebook caption, slightly longer, community-warm tone",
      "x": "X/Twitter post under 260 characters"
    }
  },
  "hashtags": ["10 relevant hashtags without the # symbol"]
}`

interface ContentAgentRequestBody {
  brief?: unknown
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
          { role: 'system', content: SYSTEM_PROMPT },
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
