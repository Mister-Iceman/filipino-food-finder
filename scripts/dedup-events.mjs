/**
 * dedup-events.mjs
 *
 * Finds and removes duplicate events from the Supabase events table.
 *
 * Duplicate definition: same title + same start_date
 *
 * Keeper selection:
 *   1. Most complete record (has venue_name + city + ticket_url)
 *   2. Tiebreaker: earlier created_at
 *
 * Near-duplicates (same title, different city) are intentionally kept —
 * these are legitimate multi-city touring event listings.
 *
 * Usage:
 *   node scripts/dedup-events.mjs              # dry-run (shows what would be deleted)
 *   node scripts/dedup-events.mjs --confirm    # execute deletions
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ── Load .env.local ──────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
try {
  const envFile = readFileSync(envPath, 'utf8')
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    // Strip surrounding double or single quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
} catch {
  console.error('Could not read .env.local — make sure it exists at project root.')
  process.exit(1)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const CONFIRM = process.argv.includes('--confirm')

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalize(str) {
  if (!str) return ''
  return str.toLowerCase().replace(/\s+/g, ' ').trim()
}

function hasValue(v) {
  return v !== null && v !== undefined && v !== ''
}

/**
 * Completeness score for an event record.
 * Prioritises the three fields the user cares about most,
 * then awards a point for each additional populated field.
 */
function scoreRecord(rec) {
  let score = 0
  // Primary completeness signals (2 pts each)
  if (hasValue(rec.venue_name))  score += 2
  if (hasValue(rec.city))        score += 2
  if (hasValue(rec.ticket_url))  score += 2
  // Secondary fields (1 pt each)
  const secondary = [
    'description', 'state', 'address', 'organizer',
    'image_url', 'price', 'category', 'website_url',
  ]
  for (const f of secondary) {
    if (hasValue(rec[f])) score++
  }
  return score
}

// ── Fetch all events (paginated) ─────────────────────────────────────────────

async function fetchAllEvents() {
  const all = []
  const pageSize = 1000
  let offset = 0
  while (true) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .range(offset, offset + pageSize - 1)
      .order('id', { ascending: true })
    if (error) throw error
    all.push(...data)
    if (data.length < pageSize) break
    offset += pageSize
  }
  return all
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  Filipino Food Finder — Events Deduplication`)
  console.log(`  Mode: ${CONFIRM ? '🔴 CONFIRM (will DELETE)' : '🟡 DRY-RUN (no changes)'}`)
  console.log(`${'─'.repeat(60)}\n`)

  console.log('Fetching events...')
  let events
  try {
    events = await fetchAllEvents()
  } catch (err) {
    console.error('Failed to fetch events:', err.message)
    process.exit(1)
  }
  console.log(`Fetched ${events.length} total events.\n`)

  if (events.length === 0) {
    console.log('No events found. Exiting.')
    return
  }

  // ── Group by normalized title + start_date ─────────────────────────────────
  // Near-duplicates (same title, DIFFERENT city) are excluded from dedup —
  // they are kept as separate city-specific listings.

  const groups = new Map()
  for (const event of events) {
    const key = `${normalize(event.title)}|||${normalize(event.start_date)}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(event)
  }

  const dupGroups = [...groups.values()].filter(g => g.length > 1)

  // Within each dup group, sub-group by city so we preserve multi-city events
  const toProcess = [] // { keeper, dupes }
  let nearDupeCount = 0

  for (const members of dupGroups) {
    // Sub-group by normalized city
    const cityGroups = new Map()
    for (const m of members) {
      const cityKey = normalize(m.city ?? '')
      if (!cityGroups.has(cityKey)) cityGroups.set(cityKey, [])
      cityGroups.get(cityKey).push(m)
    }

    // Each city group with >1 record is a true duplicate — pick a keeper
    for (const [cityKey, cityMembers] of cityGroups) {
      if (cityMembers.length === 1) continue // unique per city — keep

      // Sort: highest score first; tiebreak by earliest created_at
      cityMembers.sort((a, b) => {
        const scoreDiff = scoreRecord(b) - scoreRecord(a)
        if (scoreDiff !== 0) return scoreDiff
        return new Date(a.created_at) - new Date(b.created_at)
      })

      toProcess.push({
        keeper: cityMembers[0],
        dupes:  cityMembers.slice(1),
      })
    }

    // Count near-dupes (same title, multiple cities)
    const citiesWithEvents = [...cityGroups.values()].filter(g => g.length >= 1)
    if (citiesWithEvents.length > 1) nearDupeCount++
  }

  // ── Report ─────────────────────────────────────────────────────────────────

  if (toProcess.length === 0) {
    console.log('✅ No exact duplicates found (same title + same start_date + same city).')
    if (nearDupeCount > 0) {
      console.log(`ℹ️  ${nearDupeCount} near-duplicate group(s) detected (same title, different cities) — these are KEPT as legitimate multi-city listings.`)
    }
    return
  }

  console.log(`Found ${toProcess.length} duplicate group(s) to clean up:\n`)

  const allDeleteIds = []

  for (const { keeper, dupes } of toProcess) {
    const dupeIds = dupes.map(d => d.id)
    allDeleteIds.push(...dupeIds)

    console.log(`  📌 "${keeper.title}"`)
    console.log(`     start_date : ${keeper.start_date}`)
    console.log(`     city       : ${keeper.city ?? '(none)'}`)
    console.log(`     KEEP  id=${keeper.id}  score=${scoreRecord(keeper)}  created=${keeper.created_at?.slice(0,10)}`)
    console.log(`             venue_name=${keeper.venue_name ?? '—'}  ticket_url=${keeper.ticket_url ? '✓' : '—'}`)
    for (const d of dupes) {
      console.log(`     DEL   id=${d.id}  score=${scoreRecord(d)}  created=${d.created_at?.slice(0,10)}`)
      console.log(`             venue_name=${d.venue_name ?? '—'}  ticket_url=${d.ticket_url ? '✓' : '—'}`)
    }
    console.log()
  }

  if (nearDupeCount > 0) {
    console.log(`ℹ️  ${nearDupeCount} near-duplicate group(s) (same title, different cities) — KEPT.\n`)
  }

  console.log(`${'─'.repeat(60)}`)
  console.log(`  Summary`)
  console.log(`${'─'.repeat(60)}`)
  console.log(`  Total events        : ${events.length}`)
  console.log(`  Duplicate groups    : ${toProcess.length}`)
  console.log(`  Records to DELETE   : ${allDeleteIds.length}`)
  console.log(`  Records after dedup : ${events.length - allDeleteIds.length}`)
  console.log()

  if (!CONFIRM) {
    console.log('🟡 DRY-RUN complete — no changes made.')
    console.log('   Run with --confirm to execute deletions.\n')
    return
  }

  // ── Execute deletions ──────────────────────────────────────────────────────

  console.log('🔴 Deleting duplicates...')
  const batchSize = 50
  let deleted = 0
  let failed = 0

  for (let i = 0; i < allDeleteIds.length; i += batchSize) {
    const batch = allDeleteIds.slice(i, i + batchSize)
    const { error } = await supabase
      .from('events')
      .delete()
      .in('id', batch)
    if (error) {
      console.error(`  ✗ Batch delete failed:`, error.message)
      failed += batch.length
    } else {
      deleted += batch.length
      console.log(`  ✓ Deleted batch of ${batch.length} (ids: ${batch.join(', ')})`)
    }
  }

  console.log()
  console.log(`✅ Done. Deleted ${deleted} record(s). Failed: ${failed}.`)
  if (failed > 0) console.log('   Check errors above — some records may need manual review.')
  console.log()
}

main().catch(err => {
  console.error('\nUnhandled error:', err.message)
  process.exit(1)
})
