const states = new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' '))
const categories = new Set(['Restaurant', 'Quick Bites & Turo-Turo'])

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Expected a restaurant draft.')
  return value as Record<string, unknown>
}

function field(value: unknown, name: string, limit: number, required = false): string | null {
  if ((value == null || value === '') && !required) return null
  if (typeof value !== 'string' || !value.trim() || value.trim().length > limit) throw Error('Check ' + name + '.')
  return value.trim()
}

function link(value: unknown, name: string, required = false) {
  const raw = field(value, name, 1500, required)
  if (!raw) return null
  let url: URL
  try { url = new URL(raw) } catch { throw Error('Check ' + name + '.') }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw Error('Use a public web link for ' + name + '.')
  url.hash = ''
  return url.href
}

export function parseDraft(value: unknown) {
  const item = record(value)
  if (item.decision !== 'ready' || !['open', 'soft_open'].includes(String(item.opening_status))) {
    throw Error('Queue only ready restaurants with confirmed public service.')
  }
  const opening = field(item.opening_date ?? item.opening_month, 'opening date or month', 10, true)!
  const date = new Date(opening.length === 7 ? opening + '-01' : opening)
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date())
  if (!/^\d{4}-\d{2}(-\d{2})?$/.test(opening) || !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, opening.length) !== opening || opening > today) throw Error('Use a valid opening date or month.')
  const state = field(item.state, 'state', 2, true)!.toUpperCase()
  const zip = field(item.zip, 'ZIP code', 10, true)!
  const category = field(item.category_primary, 'category', 80, true)!
  if (!states.has(state) || !/^\d{5}(-\d{4})?$/.test(zip) || !categories.has(category)) {
    throw Error('Check the state, ZIP code, and restaurant category.')
  }
  if (!Array.isArray(item.sources) || item.sources.length < 2 || item.sources.length > 10) throw Error('Include two to ten sources.')
  const sources = item.sources.map(value => {
    const source = record(value)
    return { url: link(source.url, 'source URL', true)!, supports: field(source.supports, 'source evidence', 500, true)!,
      checked_on: field(source.checked_on, 'source check date', 10, true)! }
  })
  if (new Set(sources.map(source => new URL(source.url).hostname.replace(/^www\./, ''))).size < 2) {
    throw Error('Include sources from at least two sites.')
  }
  const service = field(item.service_mode, 'service mode', 150, true)!
  if (item.is_pickup_only != null && typeof item.is_pickup_only !== 'boolean') throw Error('Check the pickup-only setting.')
  const mapsUrl = link(item.google_maps_url, 'map')
  const rating = item.google_rating ?? null
  const reviews = item.google_reviews_count ?? null
  const ratingDate = field(item.google_rating_checked_on, 'Google rating check date', 10)
  if (rating !== null || reviews !== null || ratingDate !== null) {
    if (typeof rating !== 'number' || !Number.isFinite(rating) || rating < 1 || rating > 5 ||
        typeof reviews !== 'number' || !Number.isInteger(reviews) || reviews < 1 || reviews > 2147483647 ||
        !mapsUrl || !ratingDate || !/^\d{4}-\d{2}-\d{2}$/.test(ratingDate) || ratingDate > today) {
      throw Error('Provide the Google rating, review count, Maps link, and date checked together.')
    }
    const checked = new Date(ratingDate)
    if (!Number.isFinite(checked.getTime()) || checked.toISOString().slice(0, 10) !== ratingDate) {
      throw Error('Use a valid Google rating check date.')
    }
  }
  return {
    name: field(item.name, 'name', 160, true)!, category_primary: category,
    category_secondary: field(item.category_secondary, 'secondary category', 80),
    address_street: field(item.address_street, 'street address', 220, true)!,
    city: field(item.city, 'city', 100, true)!, state, zip,
    description: field(item.description, 'description', 3000, true)!,
    phone: field(item.phone, 'phone', 40), hours: field(item.hours, 'hours', 600),
    website: link(item.website, 'website'), google_maps_url: mapsUrl,
    ...(rating !== null ? { google_rating: rating as number, google_reviews_count: reviews as number,
      google_rating_checked_on: ratingDate! } : {}),
    instagram_url: link(item.instagram_url, 'Instagram'), facebook_url: link(item.facebook_url, 'Facebook'),
    tiktok_url: link(item.tiktok_url, 'TikTok'), x_url: link(item.x_url, 'X'),
    is_pickup_only: item.is_pickup_only === true || /^(?:limited )?(?:takeout|pickup)(?: only)?$/i.test(service),
    opening, service_mode: service, opening_status: item.opening_status as 'open' | 'soft_open',
    duplicate_result: field(item.duplicate_result, 'duplicate check', 500), sources,
  }
}

export function parseBatch(value: unknown) {
  const input = Array.isArray(value) ? value
    : value && typeof value === 'object' && 'candidates' in value && Array.isArray(value.candidates)
      ? value.candidates.filter(item => item && typeof item === 'object' && item.decision === 'ready')
      : [value]
  if (!input.length || input.length > 20) throw Error('Queue between one and 20 ready drafts at a time.')
  return input.map(parseDraft)
}

export type ResearchDraft = ReturnType<typeof parseDraft>
