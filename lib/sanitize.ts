import sanitizeHtml from 'sanitize-html'

/**
 * Strip all HTML tags and trim whitespace from a string value.
 * Non-string values (undefined, null, numbers) return an empty string.
 */
export function cleanText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim()
}

/**
 * Strip HTML tags, then validate the value starts with https:// or http://.
 * Returns the cleaned URL string, or an empty string if missing or invalid.
 * Never rejects — invalid URLs are silently dropped so optional link fields
 * don't block the whole submission.
 */
export function cleanUrl(value: unknown): string {
  const str = cleanText(value)
  if (!str) return ''
  if (str.startsWith('https://') || str.startsWith('http://')) return str
  return ''
}
