#!/usr/bin/env node
/**
 * Import review_keywords from master_enriched_all_states.csv into the listings table.
 *
 * For each CSV row with a non-empty review_keywords value, updates the matching
 * listings row by matching on name, city, and state (case-insensitive trim).
 *
 * Usage:  node scripts/import-review-keywords.js
 * Reads:  NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
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

// ---------------------------------------------------------------------------
// Minimal CSV parser — handles double-quoted fields with embedded commas/newlines
// ---------------------------------------------------------------------------
function parseCSV(raw) {
  const rows = []
  let headers = null
  let i = 0

  function parseField() {
    if (raw[i] === '"') {
      // Quoted field
      i++ // skip opening quote
      let field = ''
      while (i < raw.length) {
        if (raw[i] === '"' && raw[i + 1] === '"') {
          field += '"'
          i += 2
        } else if (raw[i] === '"') {
          i++ // skip closing quote
          break
        } else {
          field += raw[i++]
        }
      }
      return field
    } else {
      // Unquoted field — read until comma or newline
      let field = ''
      while (i < raw.length && raw[i] !== ',' && raw[i] !== '\n' && raw[i] !== '\r') {
        field += raw[i++]
      }
      return field
    }
  }

  while (i < raw.length) {
    const fields = []
    while (i < raw.length && raw[i] !== '\n' && raw[i] !== '\r') {
      fields.push(parseField())
      if (i < raw.length && raw[i] === ',') i++ // skip comma
    }
    // Skip \r\n or \n
    if (raw[i] === '\r') i++
    if (raw[i] === '\n') i++

    if (fields.length === 0 || (fields.length === 1 && fields[0] === '')) continue

    if (!headers) {
      headers = fields
    } else {
      const row = {}
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = fields[j] !== undefined ? fields[j] : ''
      }
      rows.push(row)
    }
  }

  return rows
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const envPath = path.resolve(__dirname, '..', '.env.local')
  const env = parseEnvFile(envPath)

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
  const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY']

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const csvPath = path.resolve(__dirname, '..', 'master_enriched_all_states.csv')
  const raw = fs.readFileSync(csvPath, 'utf8')
  const rows = parseCSV(raw)

  console.log(`Parsed ${rows.length} CSV rows`)

  // Filter to rows with non-empty review_keywords
  const toUpdate = rows.filter(r => r.review_keywords && r.review_keywords.trim() !== '')
  console.log(`Rows with review_keywords: ${toUpdate.length}`)

  let updated = 0
  let skipped = 0
  let notFound = 0

  for (const row of toUpdate) {
    const name = (row.name || '').trim()
    const city = (row.city || '').trim()
    const state = (row.state || '').trim()
    const keywords = row.review_keywords.trim()

    if (!name || !city || !state) {
      skipped++
      continue
    }

    // Find matching listing by name, city, state (case-insensitive)
    const { data: matches, error: fetchError } = await supabase
      .from('listings')
      .select('id')
      .ilike('name', name)
      .ilike('city', city)
      .ilike('state', state)
      .limit(2)

    if (fetchError) {
      console.error(`  ERROR fetching "${name}" (${city}, ${state}):`, fetchError.message)
      skipped++
      continue
    }

    if (!matches || matches.length === 0) {
      notFound++
      continue
    }

    if (matches.length > 1) {
      console.warn(`  WARN: multiple matches for "${name}" (${city}, ${state}) — skipping`)
      skipped++
      continue
    }

    const { error: updateError } = await supabase
      .from('listings')
      .update({ review_keywords: keywords })
      .eq('id', matches[0].id)

    if (updateError) {
      console.error(`  ERROR updating id=${matches[0].id} "${name}":`, updateError.message)
      skipped++
      continue
    }

    updated++
  }

  console.log('\n--- Results ---')
  console.log(`Updated:   ${updated}`)
  console.log(`Not found: ${notFound}`)
  console.log(`Skipped:   ${skipped}`)
  console.log(`Total with keywords: ${toUpdate.length}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
