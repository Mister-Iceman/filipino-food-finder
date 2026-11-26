// Supabase occasionally drops a connection mid-render (ETIMEDOUT, ECONNRESET,
// "other side closed"). Without a retry the page returns a 500, which Google
// Search Console reports as "Server error (5xx)". Retry network failures only;
// HTTP responses (including 4xx/5xx from Supabase) are returned as they are.
const RETRIES = 2

export const retryFetch: typeof fetch = async (input, init) => {
  let lastError: unknown
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      return await fetch(input, init)
    } catch (err) {
      if (init?.signal?.aborted) throw err
      lastError = err
      if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 250 * (attempt + 1)))
    }
  }
  throw lastError
}
