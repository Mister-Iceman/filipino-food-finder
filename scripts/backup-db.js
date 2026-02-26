#!/usr/bin/env node
/**
 * Supabase database backup script
 * Exports all main tables to timestamped JSON files in backups/<timestamp>/
 *
 * Usage:  npm run backup
 * Reads:  SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and
 *         SUPABASE_SERVICE_ROLE_KEY from .env.local
 */

'use strict'

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// ---------------------------------------------------------------------------
// Parse .env.local manually — no dotenv dependency required
// ---------------------------------------------------------------------------
function parseEnvFile(filePath) {
  const env = {}
  let raw
  try {
    raw = fs.readFileSync(filePath, 'utf8')
  } catch {
    return env
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const envPath = path.resolve(__dirname, '..', '.env.local')
const env = parseEnvFile(envPath)

// Accept SUPABASE_URL or the Next.js public variant
const SUPABASE_URL =
  env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error(
    'ERROR: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) not found in .env.local'
  )
  process.exit(1)
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'ERROR: SUPABASE_SERVICE_ROLE_KEY not found in .env.local'
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// ---------------------------------------------------------------------------
// Tables to export
// ---------------------------------------------------------------------------
const TABLES = [
  'listings',
  'ratings',
  'articles',
  'events',
  'event_submissions',
  'business_submissions',
  'email_verifications',
  'claims',
  'city_pages',
  'listing_update_requests',
]

const BATCH_SIZE = 1000

// ---------------------------------------------------------------------------
// Fetch all rows from a table via paginated range queries
// ---------------------------------------------------------------------------
async function fetchAllRows(table) {
  const rows = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(from, from + BATCH_SIZE - 1)

    if (error) throw new Error(error.message)
    if (!data || data.length === 0) break
    rows.push(...data)
    if (data.length < BATCH_SIZE) break
    from += BATCH_SIZE
  }

  return rows
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')          // e.g. 2026-02-25T14-30-00

  const backupDir = path.resolve(__dirname, '..', 'backups', timestamp)
  fs.mkdirSync(backupDir, { recursive: true })

  console.log(`\nSupabase backup — ${new Date().toUTCString()}`)
  console.log(`Destination: ${backupDir}\n`)

  const summary = {}

  for (const table of TABLES) {
    process.stdout.write(`  ${table.padEnd(28)}`)
    try {
      const rows = await fetchAllRows(table)
      const outPath = path.join(backupDir, `${table}.json`)
      fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8')
      summary[table] = { rows: rows.length, status: 'ok' }
      console.log(`${rows.length} rows`)
    } catch (err) {
      summary[table] = { rows: 0, status: 'error', error: err.message }
      console.log(`ERROR — ${err.message}`)
    }
  }

  // Write a manifest so you know what each backup contains at a glance
  const manifest = {
    createdAt: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    tables: summary,
  }
  fs.writeFileSync(
    path.join(backupDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  )

  const errors = Object.values(summary).filter((s) => s.status === 'error')
  console.log(
    `\nDone. ${TABLES.length - errors.length}/${TABLES.length} tables exported.`
  )
  if (errors.length > 0) {
    console.warn(`${errors.length} table(s) had errors — see manifest.json`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('\nBackup failed:', err.message)
  process.exit(1)
})
