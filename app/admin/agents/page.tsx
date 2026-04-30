'use client'

import { FormEvent, useEffect, useState } from 'react'

interface ArticleSection {
  heading: string
  body: string
}

interface ArticleFaqItem {
  question: string
  answer: string
}

interface SocialSnippets {
  instagram: string
  facebook: string
  x: string
}

interface ArticleContent {
  headline: string
  intro: string
  sections: ArticleSection[]
  faq: ArticleFaqItem[]
  affiliate_opportunities: string[]
  internal_link_suggestions: string[]
  social_snippets: SocialSnippets
}

interface ContentAgentResponse {
  slug: string
  seo_title: string
  meta_description: string
  geo_snippet: string
  hero_image_prompt: string
  article: ArticleContent
  hashtags: string[]
}

interface ImageAgentResponse {
  imageData: string
  slug: string
}

interface TopicSuggestion {
  topic_brief: string
  why_timely: string
  seo_opportunity: 'High' | 'Medium'
}

type CopySectionKey =
  | 'slug'
  | 'seo_title'
  | 'meta_description'
  | 'geo_snippet'
  | 'hero_image_prompt'
  | 'full_article'
  | 'affiliate_opportunities'
  | 'internal_link_suggestions'
  | 'social_instagram'
  | 'social_facebook'
  | 'social_x'
  | 'hashtags'

function CopyButton({
  onCopy,
  copied,
}: {
  onCopy: () => void
  copied: boolean
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-semibold"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function formatParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function buildArticleCopy(article: ArticleContent) {
  const sectionText = article.sections
    .map((section) => `${section.heading}\n\n${section.body}`)
    .join('\n\n')

  const faqText = article.faq
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join('\n\n')

  return [
    article.headline,
    '',
    article.intro,
    '',
    sectionText,
    '',
    'FAQ',
    faqText,
  ].join('\n')
}

function buildListCopy(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n')
}

export default function ContentAgentPage() {
  const [brief, setBrief] = useState('')
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true)
  const [result, setResult] = useState<ContentAgentResponse | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedSection, setCopiedSection] = useState<CopySectionKey | null>(null)
  const [heroImagePrompt, setHeroImagePrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<ImageAgentResponse | null>(null)
  const [imageError, setImageError] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadSuggestions = async () => {
      try {
        const response = await fetch('/api/agents/suggestions')
        if (!response.ok) {
          return
        }

        const data = (await response.json()) as TopicSuggestion[]
        if (isActive && Array.isArray(data)) {
          setSuggestions(data.slice(0, 3))
        }
      } catch {
        // Fail silently for suggestions.
      } finally {
        if (isActive) {
          setIsLoadingSuggestions(false)
        }
      }
    }

    void loadSuggestions()

    return () => {
      isActive = false
    }
  }, [])

  const handleCopy = async (section: CopySectionKey, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedSection(section)
      window.setTimeout(() => {
        setCopiedSection((current) => (current === section ? null : current))
      }, 1800)
    } catch {
      setError('Unable to copy content to clipboard.')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setResult(null)

    const trimmedBrief = brief.trim()

    if (!trimmedBrief) {
      setError('Please enter a topic brief.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/agents/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brief: trimmedBrief }),
      })

      const data = (await response.json()) as ContentAgentResponse | { error?: string }

      if (!response.ok || !('slug' in data)) {
        setError('error' in data && data.error ? data.error : 'Failed to generate article draft.')
        return
      }

      setResult(data)
      setHeroImagePrompt(data.hero_image_prompt)
      setGeneratedImage(null)
      setImageError('')
    } catch {
      setError('Network error while generating the article draft.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!result) {
      return
    }

    const trimmedPrompt = heroImagePrompt.trim()

    if (!trimmedPrompt) {
      setImageError('Please enter a hero image prompt.')
      return
    }

    setImageError('')
    setGeneratedImage(null)
    setIsGeneratingImage(true)

    try {
      const response = await fetch('/api/agents/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          slug: result.slug,
        }),
      })

      const data = (await response.json()) as ImageAgentResponse | { error?: string }

      if (!response.ok || !('imageData' in data)) {
        setImageError('error' in data && data.error ? data.error : 'Failed to generate hero image.')
        return
      }

      setGeneratedImage(data)
    } catch {
      setImageError('Network error while generating the hero image.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Content Agent</h1>
            <p className="text-gray-600 mt-2">Generate Cultural KB article drafts</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoadingSuggestions ? (
              <p className="text-sm text-gray-500">Finding this month&apos;s best topics...</p>
            ) : null}

            {suggestions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.topic_brief} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-xs text-gray-500">{suggestion.why_timely}</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          suggestion.seo_opportunity === 'High'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {suggestion.seo_opportunity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4">{suggestion.topic_brief}</p>
                    <button
                      type="button"
                      onClick={() => setBrief(suggestion.topic_brief)}
                      className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Use This Topic
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div>
              <label htmlFor="brief" className="block text-sm font-bold text-gray-900 mb-2">
                Topic brief
              </label>
              <textarea
                id="brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                placeholder="Describe the article topic in 1–2 sentences. Example: An introduction to Filipino Christmas food traditions for non-Filipino readers curious about Noche Buena."
                rows={5}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 px-6 rounded-lg"
              >
                {isLoading ? 'Generating...' : 'Generate Article'}
              </button>
              {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            </div>
          </form>
        </div>

        {result ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Slug</h2>
                <CopyButton
                  onCopy={() => handleCopy('slug', result.slug)}
                  copied={copiedSection === 'slug'}
                />
              </div>
              <p className="text-sm text-gray-700 break-all">{result.slug}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">SEO Title</h2>
                <CopyButton
                  onCopy={() => handleCopy('seo_title', result.seo_title)}
                  copied={copiedSection === 'seo_title'}
                />
              </div>
              <p className="text-gray-700">{result.seo_title}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Meta Description</h2>
                <CopyButton
                  onCopy={() => handleCopy('meta_description', result.meta_description)}
                  copied={copiedSection === 'meta_description'}
                />
              </div>
              <p className="text-gray-700">{result.meta_description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">GEO Snippet</h2>
                <CopyButton
                  onCopy={() => handleCopy('geo_snippet', result.geo_snippet)}
                  copied={copiedSection === 'geo_snippet'}
                />
              </div>
              <p className="text-gray-700">{result.geo_snippet}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Hero Image Prompt</h2>
                <CopyButton
                  onCopy={() => handleCopy('hero_image_prompt', result.hero_image_prompt)}
                  copied={copiedSection === 'hero_image_prompt'}
                />
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{result.hero_image_prompt}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Full Article</h2>
                <CopyButton
                  onCopy={() => handleCopy('full_article', buildArticleCopy(result.article))}
                  copied={copiedSection === 'full_article'}
                />
              </div>

              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.article.headline}</h3>
                  <div className="space-y-4">
                    {formatParagraphs(result.article.intro).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  {result.article.sections.map((section) => (
                    <section key={`${section.heading}-${section.body.slice(0, 24)}`}>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{section.heading}</h4>
                      <div className="space-y-3">
                        {formatParagraphs(section.body).map((paragraph) => (
                          <p key={`${section.heading}-${paragraph}`}>{paragraph}</p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">FAQ</h4>
                  <div className="space-y-4">
                    {result.article.faq.map((item) => (
                      <div key={item.question} className="border border-gray-200 rounded-lg p-4">
                        <p className="font-semibold text-gray-900 mb-2">{item.question}</p>
                        <p>{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Affiliate Opportunities</h2>
                <CopyButton
                  onCopy={() => handleCopy('affiliate_opportunities', buildListCopy(result.article.affiliate_opportunities))}
                  copied={copiedSection === 'affiliate_opportunities'}
                />
              </div>
              <ul className="space-y-2 text-gray-700">
                {result.article.affiliate_opportunities.map((item) => (
                  <li key={item} className="border border-gray-200 rounded-lg p-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Internal Link Suggestions</h2>
                <CopyButton
                  onCopy={() => handleCopy('internal_link_suggestions', buildListCopy(result.article.internal_link_suggestions))}
                  copied={copiedSection === 'internal_link_suggestions'}
                />
              </div>
              <ul className="space-y-2 text-gray-700">
                {result.article.internal_link_suggestions.map((item) => (
                  <li key={item} className="border border-gray-200 rounded-lg p-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Social Snippets</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">Instagram</h3>
                    <CopyButton
                      onCopy={() => handleCopy('social_instagram', result.article.social_snippets.instagram)}
                      copied={copiedSection === 'social_instagram'}
                    />
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{result.article.social_snippets.instagram}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">Facebook</h3>
                    <CopyButton
                      onCopy={() => handleCopy('social_facebook', result.article.social_snippets.facebook)}
                      copied={copiedSection === 'social_facebook'}
                    />
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{result.article.social_snippets.facebook}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">X</h3>
                    <CopyButton
                      onCopy={() => handleCopy('social_x', result.article.social_snippets.x)}
                      copied={copiedSection === 'social_x'}
                    />
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{result.article.social_snippets.x}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Hashtags</h2>
                <CopyButton
                  onCopy={() => handleCopy('hashtags', result.hashtags.map((tag) => `#${tag}`).join(' '))}
                  copied={copiedSection === 'hashtags'}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">Hero Image</h2>
                <p className="text-gray-600 mt-1">Generate a matched hero image for this article</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="hero-image-prompt" className="block text-sm font-bold text-gray-900 mb-2">
                    Hero image prompt
                  </label>
                  <textarea
                    id="hero-image-prompt"
                    value={heroImagePrompt}
                    onChange={(event) => setHeroImagePrompt(event.target.value)}
                    rows={7}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 px-6 rounded-lg"
                  >
                    {isGeneratingImage ? 'Generating Image...' : 'Generate Hero Image'}
                  </button>
                  {imageError ? <p className="text-sm font-medium text-red-600">{imageError}</p> : null}
                </div>

                {generatedImage ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    {/* Base64 preview uses a direct img tag per product requirement. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${generatedImage.imageData}`}
                      alt={`Generated hero image for ${generatedImage.slug}`}
                      className="w-full rounded-lg border border-gray-100"
                    />
                    <div className="mt-4 space-y-2">
                      <a
                        href={`data:image/png;base64,${generatedImage.imageData}`}
                        download={`${generatedImage.slug}.jpg`}
                        className="inline-flex text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Download Image
                      </a>
                      <p className="text-sm text-gray-500">
                        Compress to under 500KB JPG before committing to the repo. Target path: public/images/hero/{generatedImage.slug}.jpg
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
