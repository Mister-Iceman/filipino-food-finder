// Requires OPENAI_API_KEY in Vercel environment variables. Uses gpt-image-1 (ChatGPT Images 2.0). Cost approx $0.04-0.08 per image.
import { NextRequest, NextResponse } from 'next/server'

const IMAGE_PROMPT_PREFIX = 'Food photography for a Filipino-American cultural knowledge article. No people. No text overlays. No logos. Clean food photography aesthetic: '

interface ImageAgentRequestBody {
  prompt?: unknown
  slug?: unknown
}

interface OpenAiImageGenerationResponse {
  data?: Array<{
    b64_json?: string
    url?: string
  }>
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

    const body = (await request.json()) as ImageAgentRequestBody
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const fullPrompt = `${IMAGE_PROMPT_PREFIX}${prompt}`

    const openAiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: fullPrompt,
        size: '1536x1024',
        quality: 'medium',
        n: 1,
        output_format: 'jpeg',
      }),
    })

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text()
      console.error('OpenAI image agent error:', errorText)
      return NextResponse.json(
        { error: `Failed to generate image: ${errorText || 'Unknown OpenAI error'}` },
        { status: 500 }
      )
    }

    const imageResponse = (await openAiResponse.json()) as OpenAiImageGenerationResponse
    const imageData = imageResponse.data?.[0]?.b64_json ?? imageResponse.data?.[0]?.url ?? null

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data returned' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      imageData,
      slug,
      isUrl: !imageResponse.data?.[0]?.b64_json,
    })
  } catch (error) {
    console.error('Image agent route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate hero image' },
      { status: 500 }
    )
  }
}
