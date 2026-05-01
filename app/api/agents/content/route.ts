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
      {
        "product_description": "One sentence describing the product and why it fits this article naturally",
        "amazon_search_query": "3-5 word Amazon search query for this product, no brand names",
        "suggested_anchor_text": "2-4 word anchor text phrase for the in-article link"
      }
    ],
    "internal_link_suggestions": [
      "Choose 2-3 pages from this exact list that are genuinely relevant to the article topic. Return only the page name and a suggested anchor text phrase. Do not invent pages. Only use pages from this list:\n__INTERNAL_LINK_OPTIONS__"
    ]
  },
  "hashtags": ["10 hashtags without the hash symbol. Mix Filipino-specific tags such as FilipinoFood FilAm PinoyFood with broader cultural tags such as FoodCulture DiasporaFood AsianAmericanFood. Avoid generic tags like FoodLovers ComfortFood FoodBlogger."]
}`

const SOCIAL_AND_IMAGE_SYSTEM_PROMPT = `You are the Social Media Copy and Image Prompt Agent for FilipinoFoodNearMe.org — a Filipino-American food directory and cultural knowledge platform serving all 50 US states. Tagline: Flavor With Soul Deserves to Be Found.

You generate two things: platform-native social media captions and a cinematic hero image prompt.

SOCIAL COPY RULES:
Write like a culturally fluent Filipino-American who genuinely loves the food and community. Use emojis naturally to add energy — not decoratively. Emojis should punctuate ideas, not replace words.

Brand voice rules:
- Warm, specific, story-driven, community-first
- Name actual dishes, regions, traditions — never be generic
- Light Taglish only when natural: sarap, masarap, ulam, merienda, lodi — never forced
- Banned words: vibrant, delicious, amazing, incredible, join us, explore, journey
- Banned openers: "Are you ready", "Have you tried", "Did you know"
- Always include FilipinoFoodNearMe.org as plain text URL — never as a markdown link
- Instagram and Facebook always close with: Flavor With Soul Deserves to Be Found. 🌺

Platform rules:
Instagram:
- Open with a punchy culturally specific hook — a sensory detail or cultural truth
- 3-4 short punchy lines with \n line breaks between them
- 2-4 emojis placed where they add energy
- URL on its own line at the end, preceded by tagline on its own line
- Never combine URL with the \n prefix — URL must be clean plain text on its own line

Facebook:
- 3-5 lines with \n line breaks
- Include a community memory question
- 2-4 emojis
- URL as clean plain text on its own line at the end

X/Twitter:
- Under 240 characters total including URL
- One sharp cultural insight or dish callout
- 1-2 emojis max
- URL as plain text

TikTok:
- Under 150 characters total including URL
- Hook-first, sounds like a discovery
- 1-2 emojis
- URL as plain text

HERO IMAGE PROMPT RULES:
Generate a cinematic, specific image generation prompt for a 1536x1024 landscape article hero image.

Split composition:
- TOP HALF: Clean warm cream background with subtle banig woven texture. Bold dark maroon headline text matching the article headline exactly. Smaller tagline: "Flavor With Soul Deserves to Be Found." and URL "FilipinoFoodNearMe.org" below it. Philippine sun motif (Sun of Liberty with 8 rays) as a restrained gold decorative element top center. Gold diamond divider elements.
- BOTTOM HALF: Photorealistic horizontal food strip on banana leaves and dark wood surface. Warm natural light from the left. Each dish must be described with specific visual texture cues.

CRITICAL food realism rules:
- Always specify exact visual details: glistening, lacquered skin, char marks, condensation, steam rising, rendered fat, glossy sauce
- Never use "colorful array" or "spread of dishes" — describe each dish individually with specific visual details
- Lechon: describe as whole roasted pig with mahogany lacquered crackling skin, deep amber color, rendered fat visible
- Halo-halo: describe as tall glass with layered shaved ice, purple ube ice cream scoop on top, condensation on glass exterior, colorful layers visible through glass
- Grilled items: char marks clearly visible, glistening with marinade glaze, slight smoke haze
- All food must look photorealistic and appetizing — shot by a professional food photographer

Always respond with valid JSON only. No markdown, no preamble, no explanation outside the JSON.

Return exactly:
{
  "social_snippets": {
    "instagram": "caption with \n line breaks, URL as clean plain text on its own line",
    "facebook": "caption with \n line breaks, URL as clean plain text on its own line",
    "x": "caption under 240 chars with plain text URL",
    "tiktok": "caption under 150 chars with plain text URL"
  },
  "hashtags": ["10 hashtags without # symbol — mix: FilipinoFood FilAm PinoyFood FilipinoFoodNearMe with cultural tags DiasporaFood AsianAmericanFood FoodCulture FilAmFood — no generic tags like FoodLovers ComfortFood FoodBlogger"],
  "hero_image_prompt": "Single cinematic image generation prompt as plain text. Between 100-140 words. No JSON inside this field. Specific food visual details for each dish mentioned."
}`

interface ContentAgentRequestBody {
  brief?: unknown
}

interface AffiliateOpportunityResponseItem extends Record<string, unknown> {
  product_description: string
  amazon_search_query: string
  suggested_anchor_text: string
  affiliate_url: string
}

interface RawAffiliateOpportunity extends Record<string, unknown> {
  product_description?: unknown
  amazon_search_query?: unknown
  suggested_anchor_text?: unknown
  affiliate_url?: string
}

interface ParsedContentAgentResponse {
  slug?: string
  seo_title?: string
  meta_description?: string
  geo_snippet?: string
  article?: {
    headline?: string
    intro?: string
    sections?: Array<{
      heading?: string
      body?: string
    }>
    faq?: Array<{
      question?: string
      answer?: string
    }>
    affiliate_opportunities?: RawAffiliateOpportunity[]
    internal_link_suggestions?: unknown[]
  }
  hashtags?: string[]
}

interface SocialAndImageResponse {
  social_snippets?: {
    instagram?: string
    facebook?: string
    x?: string
    tiktok?: string
  }
  hashtags?: string[]
  hero_image_prompt?: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function buildSystemPrompt(internalLinkOptions: string) {
  return BASE_SYSTEM_PROMPT.replace('__INTERNAL_LINK_OPTIONS__', internalLinkOptions)
}

function extractKeyTopics(article: NonNullable<ParsedContentAgentResponse['article']>) {
  const text = [
    article.headline ?? '',
    ...(article.sections ?? []).flatMap((section) => [section.heading ?? '', section.body ?? '']),
    ...(article.faq ?? []).flatMap((item) => [item.question ?? '', item.answer ?? '']),
  ].join(' ')

  const matches = text.match(/\b[A-Z][a-z]+(?:[-'][A-Za-z]+)?(?:\s+[A-Z][a-z]+(?:[-'][A-Za-z]+)?){0,2}\b/g) ?? []
  const blocked = new Set([
    'What',
    'How',
    'Where',
    'Filipino',
    'Filipino-Americans',
    'United States',
    'Flavor With Soul Deserves',
  ])

  const uniqueTopics: string[] = []
  for (const match of matches) {
    const cleaned = match.trim()
    if (blocked.has(cleaned) || cleaned.length < 3) {
      continue
    }
    if (!uniqueTopics.includes(cleaned)) {
      uniqueTopics.push(cleaned)
    }
    if (uniqueTopics.length >= 12) {
      break
    }
  }

  return uniqueTopics.join(', ')
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

    const parsed = JSON.parse(content) as ParsedContentAgentResponse

    const AFFILIATE_TAG = 'filipinofoodn-20'
    if (Array.isArray(parsed.article?.affiliate_opportunities)) {
      parsed.article.affiliate_opportunities = parsed.article.affiliate_opportunities.map(
        (item: RawAffiliateOpportunity) => ({
          ...item,
          affiliate_url: `https://www.amazon.com/s?k=${encodeURIComponent(String(item.amazon_search_query ?? ''))}&tag=${AFFILIATE_TAG}`,
        })
      ) as AffiliateOpportunityResponseItem[]
    }

    const articleHeadline = parsed.article?.headline ?? ''
    const articleIntro = (parsed.article?.intro ?? '').slice(0, 300)
    const keyTopics = parsed.article ? extractKeyTopics(parsed.article) : ''

    const socialAndImageResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1500,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SOCIAL_AND_IMAGE_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Article headline: ${articleHeadline}
Intro: ${articleIntro}
Key dishes and topics: ${keyTopics}`,
          },
        ],
      }),
    })

    if (!socialAndImageResponse.ok) {
      const errorText = await socialAndImageResponse.text()
      console.error('OpenAI social/image agent error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate social snippets and hero image prompt' },
        { status: 500 }
      )
    }

    const socialAndImageCompletion = (await socialAndImageResponse.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null
        }
      }>
    }

    const socialAndImageContent = socialAndImageCompletion.choices?.[0]?.message?.content

    if (!socialAndImageContent) {
      console.error('OpenAI social/image agent returned empty content:', socialAndImageCompletion)
      return NextResponse.json(
        { error: 'OpenAI returned an empty social/image response' },
        { status: 500 }
      )
    }

    const socialAndImageParsed = JSON.parse(socialAndImageContent) as SocialAndImageResponse

    return NextResponse.json({
      ...parsed,
      ...socialAndImageParsed,
    })
  } catch (error) {
    console.error('Content agent route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate article draft' },
      { status: 500 }
    )
  }
}
