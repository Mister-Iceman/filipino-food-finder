// Article images live in Supabase Storage as large PNGs (about 8 MB each).
// Serving them straight from Supabase made every page view download the full
// file and used up most of the project's monthly egress. These helpers route
// those URLs through Vercel's image optimizer (/_next/image), which resizes,
// converts to WebP and caches the result, so Supabase is only hit when the
// cache is cold. Any other URL is returned unchanged.

const SUPABASE_STORAGE_PREFIX =
  'https://kjhufdervnyuayhiwqtc.supabase.co/storage/v1/object/public/'

// Must be one of next.config images.deviceSizes / imageSizes.
export type OptimizedWidth = 640 | 828 | 1200 | 1920

export function optimizedImageUrl(
  url: string | null | undefined,
  width: OptimizedWidth = 1200,
  quality = 75,
): string {
  if (!url) return ''
  if (!url.startsWith(SUPABASE_STORAGE_PREFIX)) return url
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
}

// Rewrites <img src="..."> pointing at Supabase Storage inside article HTML.
export function optimizeContentImages(html: string, width: OptimizedWidth = 1200): string {
  return html.replace(
    /(<img\b[^>]*?\bsrc=)(["'])(https:\/\/kjhufdervnyuayhiwqtc\.supabase\.co\/storage\/v1\/object\/public\/[^"']+)\2/gi,
    (_m, before: string, quote: string, src: string) =>
      `${before}${quote}${optimizedImageUrl(src, width).replace(/&/g, '&amp;')}${quote}`,
  )
}
