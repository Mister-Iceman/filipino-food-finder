/**
 * FFNM First-Party Analytics — Table Setup Script
 *
 * Run: node scripts/setup-analytics.mjs
 *
 * This checks which analytics tables exist in Supabase and
 * prints setup instructions if any are missing.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const TABLES = [
  'page_views',
  'sessions',
  'listing_interactions',
  'search_queries',
  'user_journeys',
  'outbound_clicks',
  'category_views',
  'city_views',
]

console.log('🔍 Checking analytics tables...\n')

const missing = []
const existing = []

for (const table of TABLES) {
  const { error } = await supabase.from(table).select('id').limit(1)
  if (error && error.code === '42P01') {
    missing.push(table)
    console.log(`  ❌ ${table} — missing`)
  } else if (error) {
    console.log(`  ⚠️  ${table} — error: ${error.message}`)
  } else {
    existing.push(table)
    console.log(`  ✅ ${table} — exists`)
  }
}

console.log('')

if (missing.length === 0) {
  console.log('✅ All analytics tables exist! Your first-party analytics system is ready.')
} else {
  console.log(`⚠️  ${missing.length} table(s) missing: ${missing.join(', ')}`)
  console.log('')
  console.log('To create them:')
  console.log('1. Go to your Supabase Dashboard → SQL Editor')
  console.log('2. Run the migration file: supabase/migrations/20260317_first_party_analytics.sql')
  console.log('')
  console.log('Or copy and paste from:')
  const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '20260317_first_party_analytics.sql')
  console.log(`   ${sqlPath}`)
}
