// One address per listing. Every FFNM listing lives at
//   /<state-slug>/<city-slug>/restaurants/<slug>/
// (already the URL in the sitemap and share links). The old /listings/<slug>/
// address now 301-redirects here, and every link on the site should be built
// with listingPath() so visitors and Google only ever see this one URL.

export const STATE_TO_SLUG: Record<string, string> = {
  AL: 'alabama', AK: 'alaska', AZ: 'arizona', AR: 'arkansas', CA: 'california',
  CO: 'colorado', CT: 'connecticut', DE: 'delaware', FL: 'florida', GA: 'georgia',
  HI: 'hawaii', ID: 'idaho', IL: 'illinois', IN: 'indiana', IA: 'iowa',
  KS: 'kansas', KY: 'kentucky', LA: 'louisiana', ME: 'maine', MD: 'maryland',
  MA: 'massachusetts', MI: 'michigan', MN: 'minnesota', MS: 'mississippi', MO: 'missouri',
  MT: 'montana', NE: 'nebraska', NV: 'nevada', NH: 'new-hampshire', NJ: 'new-jersey',
  NM: 'new-mexico', NY: 'new-york', NC: 'north-carolina', ND: 'north-dakota', OH: 'ohio',
  OK: 'oklahoma', OR: 'oregon', PA: 'pennsylvania', RI: 'rhode-island', SC: 'south-carolina',
  SD: 'south-dakota', TN: 'tennessee', TX: 'texas', UT: 'utah', VT: 'vermont',
  VA: 'virginia', WA: 'washington', WV: 'west-virginia', WI: 'wisconsin', WY: 'wyoming',
  DC: 'district-of-columbia',
}

export const STATE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_TO_SLUG).map(([code, slug]) => [
    code,
    slug.split('-').map((w) => (w === 'of' ? w : w[0].toUpperCase() + w.slice(1))).join(' '),
  ])
)

export const SITE_URL = 'https://filipinofoodnearme.org'

export function stateSlug(state: string | null | undefined): string {
  const code = (state ?? '').trim().toUpperCase()
  return STATE_TO_SLUG[code] || code.toLowerCase()
}

export function citySlug(city: string | null | undefined): string {
  return (city ?? '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

type ListingRef = { slug: string; city?: string | null; state?: string | null }

/** Site-relative path for a listing, with trailing slash. */
export function listingPath(l: ListingRef): string {
  if (l.state && l.city) {
    return `/${stateSlug(l.state)}/${citySlug(l.city)}/restaurants/${l.slug}/`
  }
  return `/listings/${l.slug}/`
}

export function listingUrl(l: ListingRef): string {
  return `${SITE_URL}${listingPath(l)}`
}

/** "MA 2538" style zips lost their leading zero in the import. Show 5 digits. */
export function formatZip(zip: string | number | null | undefined): string {
  const z = String(zip ?? '').trim()
  if (/^\d{3,4}$/.test(z)) return z.padStart(5, '0')
  return z
}

/**
 * Street addresses sometimes repeat the city/state/zip
 * ("123 Main St, Seattle, WA 98103"). Strip the trailing copy so the
 * address line doesn't read "Seattle, WA 98103, Seattle, WA 98109".
 */
export function cleanStreet(street: string | null | undefined, city?: string | null, state?: string | null): string {
  let s = (street ?? '').trim()
  if (!s) return s
  if (city) {
    const esc = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`,\\s*${esc(city.trim())}\\s*,?\\s*(${esc((state ?? '').trim())})?\\s*\\d{0,5}(-\\d{4})?\\s*(,\\s*(USA|United States))?\\s*$`, 'i')
    s = s.replace(re, '')
  }
  s = s.replace(/,\s*(USA|United States)\s*$/i, '')
  return s.replace(/,\s*$/, '')
}

/** Remove Google tracking parameters from a Maps link, keep the place query. */
export function cleanMapsUrl(url: string | null | undefined): string | null {
  if (!url || !/^https?:\/\//i.test(url)) return null
  try {
    const u = new URL(url)
    for (const key of [...u.searchParams.keys()]) {
      if (/^(utm_|authuser|rclk|g_ep|g_st|entry|shorturl|coh|hl|gl|ved|ei|sa|source|opi|ftid)$|^utm_/i.test(key)) {
        u.searchParams.delete(key)
      }
    }
    return u.toString()
  } catch {
    return url
  }
}
