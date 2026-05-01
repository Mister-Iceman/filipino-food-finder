'use client'

import { FormEvent, useEffect, useState } from 'react'

interface CityGuideSuggestion {
  city: string
  state: string
  listing_count: number
  why_prioritize: string
  seo_opportunity: 'High' | 'Medium'
}

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

interface CityGuideResponse {
  city: string
  state: string
  state_full: string
  slug: string
  intro_tagline: string
  intro_paragraph_1: string
  intro_paragraph_2: string
  filipino_population: string
  migration_history: string
  key_contributions: string
  cultural_tidbit: string
  community_places: unknown[]
  food_intro_paragraph: string
  food_highlights: FoodHighlight[]
  featured_restaurants: FeaturedRestaurant[]
  meta_title: string
  meta_description: string
  seo_title: string
}

type CopySectionKey =
  | 'slug'
  | 'seo_title'
  | 'meta_title'
  | 'meta_description'
  | 'intro_tagline'
  | 'intro_paragraph_1'
  | 'intro_paragraph_2'
  | 'filipino_population'
  | 'migration_history'
  | 'key_contributions'
  | 'cultural_tidbit'
  | 'food_intro_paragraph'
  | 'food_highlights'
  | 'featured_restaurants'
  | 'full_row'

const US_STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'District of Columbia',
}

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

function LabeledTextSection({
  title,
  content,
  sectionKey,
  copiedSection,
  onCopy,
}: {
  title: string
  content: string
  sectionKey: CopySectionKey
  copiedSection: CopySectionKey | null
  onCopy: (section: CopySectionKey, content: string) => void
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <CopyButton
          onCopy={() => onCopy(sectionKey, content)}
          copied={copiedSection === sectionKey}
        />
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
    </div>
  )
}

export default function CityGuideAgentPage() {
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [stateFull, setStateFull] = useState('')
  const [suggestions, setSuggestions] = useState<CityGuideSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true)
  const [result, setResult] = useState<CityGuideResponse | null>(null)
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedSection, setCopiedSection] = useState<CopySectionKey | null>(null)

  useEffect(() => {
    let isActive = true

    const loadSuggestions = async () => {
      try {
        const response = await fetch('/api/agents/city-guide/suggestions')
        if (!response.ok) {
          return
        }

        const data = (await response.json()) as CityGuideSuggestion[]
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

  const generateGuide = async (payload: {
    city: string
    state: string
    state_full: string
  }) => {
    setError('')
    setResult(null)
    setIsGenerating(true)

    try {
      const response = await fetch('/api/agents/city-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as CityGuideResponse | { error?: string }

      if (!response.ok || !('slug' in data)) {
        setError('error' in data && data.error ? data.error : 'Failed to generate city guide.')
        return
      }

      setResult(data)
    } catch {
      setError('Network error while generating the city guide.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      city: city.trim(),
      state: state.trim().toUpperCase(),
      state_full: stateFull.trim(),
    }

    if (!payload.city || !payload.state || !payload.state_full) {
      setError('Please fill in city name, state code, and full state name.')
      return
    }

    await generateGuide(payload)
  }

  const handleSuggestionClick = async (suggestion: CityGuideSuggestion) => {
    const payload = {
      city: suggestion.city,
      state: suggestion.state,
      state_full: US_STATE_NAMES[suggestion.state] ?? suggestion.state,
    }

    setCity(payload.city)
    setState(payload.state)
    setStateFull(payload.state_full)
    await generateGuide(payload)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">City Guide Agent</h1>
            <p className="text-gray-600 mt-2">Generate city guide drafts from real directory listings</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isLoadingSuggestions ? (
              <p className="text-sm text-gray-500">Finding cities that need guides...</p>
            ) : null}

            {suggestions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {suggestions.map((suggestion) => (
                  <div key={`${suggestion.city}-${suggestion.state}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {suggestion.city}, {suggestion.state}
                        </h2>
                        <p className="text-sm text-gray-500">{suggestion.listing_count} listings</p>
                      </div>
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
                    <p className="text-sm text-gray-800 leading-relaxed mb-4">{suggestion.why_prioritize}</p>
                    <button
                      type="button"
                      onClick={() => void handleSuggestionClick(suggestion)}
                      className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Generate Guide for {suggestion.city}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Manual Input</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-bold text-gray-900 mb-2">
                    City name
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-bold text-gray-900 mb-2">
                    State code
                  </label>
                  <input
                    id="state"
                    type="text"
                    maxLength={2}
                    value={state}
                    onChange={(event) => setState(event.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="state-full" className="block text-sm font-bold text-gray-900 mb-2">
                    State full name
                  </label>
                  <input
                    id="state-full"
                    type="text"
                    value={stateFull}
                    onChange={(event) => setStateFull(event.target.value)}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 px-6 rounded-lg"
              >
                {isGenerating ? 'Generating...' : 'Generate City Guide'}
              </button>
              {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            </div>
          </form>
        </div>

        {result ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Full Row JSON</h2>
                <CopyButton
                  onCopy={() => handleCopy('full_row', JSON.stringify(result, null, 2))}
                  copied={copiedSection === 'full_row'}
                />
              </div>
              <p className="text-sm text-gray-600">Copy Full Row as JSON</p>
            </div>

            <LabeledTextSection
              title="Slug"
              content={result.slug}
              sectionKey="slug"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="SEO Title"
              content={result.seo_title}
              sectionKey="seo_title"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Meta Title"
              content={result.meta_title}
              sectionKey="meta_title"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Meta Description"
              content={result.meta_description}
              sectionKey="meta_description"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Intro Tagline"
              content={result.intro_tagline}
              sectionKey="intro_tagline"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Intro Paragraph 1"
              content={result.intro_paragraph_1}
              sectionKey="intro_paragraph_1"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Intro Paragraph 2"
              content={result.intro_paragraph_2}
              sectionKey="intro_paragraph_2"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Filipino Population"
              content={result.filipino_population}
              sectionKey="filipino_population"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Migration History"
              content={result.migration_history}
              sectionKey="migration_history"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Key Contributions"
              content={result.key_contributions}
              sectionKey="key_contributions"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Cultural Tidbit"
              content={result.cultural_tidbit}
              sectionKey="cultural_tidbit"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />
            <LabeledTextSection
              title="Food Intro Paragraph"
              content={result.food_intro_paragraph}
              sectionKey="food_intro_paragraph"
              copiedSection={copiedSection}
              onCopy={handleCopy}
            />

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Food Highlights</h2>
                <CopyButton
                  onCopy={() =>
                    handleCopy(
                      'food_highlights',
                      result.food_highlights.map((item, index) => `${index + 1}. ${item.text}`).join('\n')
                    )
                  }
                  copied={copiedSection === 'food_highlights'}
                />
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                {result.food_highlights.map((item, index) => (
                  <li key={`${item.text}-${index}`}>{item.text}</li>
                ))}
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">Featured Restaurants</h2>
                <CopyButton
                  onCopy={() => handleCopy('featured_restaurants', JSON.stringify(result.featured_restaurants, null, 2))}
                  copied={copiedSection === 'featured_restaurants'}
                />
              </div>
              <div className="space-y-3">
                {result.featured_restaurants.map((restaurant) => (
                  <div
                    key={`${restaurant.name}-${restaurant.type}-${restaurant.neighborhood}`}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {restaurant.type}
                      </span>
                      {restaurant.neighborhood ? (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {restaurant.neighborhood}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-gray-700">{restaurant.memorable_bite}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
