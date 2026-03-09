/**
 * Generates the dynamic slug for a listing from its name, city, and state.
 * The listings table has no slug column — slugs are computed at runtime.
 *
 * Example: "3 Daughters Brewing", "St. Petersburg", "FL"
 *       →  "3-daughters-brewing-st-petersburg-fl"
 */
export function toSlug(name: string, city: string, state: string): string {
  return `${name} ${city} ${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extracts a probable US state abbreviation from the end of a slug.
 * e.g. "jollibee-alhambra-ca" → "CA"
 * Returns null if the last segment isn't exactly 2 letters.
 */
export function stateHintFromSlug(slug: string): string | null {
  const last = slug.split('-').at(-1) ?? ''
  return /^[a-z]{2}$/.test(last) ? last.toUpperCase() : null
}
