import { createClient } from '@supabase/supabase-js'
import { retryFetch } from '@/lib/retry-fetch'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, { global: { fetch: retryFetch } })