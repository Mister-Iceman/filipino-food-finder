import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const ARTICLE_SLUGS = [
  'balut-betamax-and-beyond-filipino-exotic-eats',
  'filipino-food-month-guide',
  'filipino-sweet-tooth-desserts-bakery',
  'from-rations-to-riches-american-influence-filipino-food',
  'golden-crunch-lumpia-cultural-history',
  'long-life-of-pancit-filipino-noodle-culture',
  'merienda-culture-filipino-snacks-street-food',
  'regional-masterpieces-filipino-food',
  'rise-and-shine-guide-to-filipino-breakfast-almusal',
  'sabaw-season-filipino-soups-stews',
  'sour-power-and-sawsawan-acidity-in-filipino-cooking',
  'tapestry-of-tastes-historical-waves-filipino-cuisine',
  'tree-of-life-coconut-gata-filipino-cuisine',
  'ultimate-sawsawan-guide',
]

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const envPath = join(projectRoot, '.env.local')

function loadEnvFile() {
  try {
    const envFile = readFileSync(envPath, 'utf8')
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      let value = trimmed.slice(eqIndex + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {
    console.error('Could not read .env.local — make sure it exists at project root.')
    process.exit(1)
  }
}

function parseJsStringLiteral(rawValue) {
  return rawValue
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .trim()
}

function extractMetadataField(source, fieldName) {
  const singleQuoteMatch = source.match(new RegExp(`${fieldName}:\\s*'((?:\\\\.|[^'])*)'`, 's'))
  if (singleQuoteMatch) {
    return parseJsStringLiteral(singleQuoteMatch[1])
  }

  const doubleQuoteMatch = source.match(new RegExp(`${fieldName}:\\s*"((?:\\\\.|[^"])*)"`, 's'))
  if (doubleQuoteMatch) {
    return parseJsStringLiteral(doubleQuoteMatch[1])
  }

  return ''
}

function readArticleMetadata(slug) {
  const articlePath = join(projectRoot, 'app', 'cultural-knowledge-base', slug, 'page.tsx')
  const source = readFileSync(articlePath, 'utf8')
  const title = extractMetadataField(source, 'title')
  const description = extractMetadataField(source, 'description')

  if (!title || !description) {
    throw new Error(`Failed to extract metadata for ${slug}`)
  }

  return {
    slug,
    title,
    description,
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function main() {
  const articles = ARTICLE_SLUGS.map(readArticleMetadata)
  const now = new Date().toISOString()

  for (const article of articles) {
    const { data: existing, error: existingError } = await supabase
      .from('articles')
      .select('slug')
      .eq('slug', article.slug)
      .maybeSingle()

    if (existingError) {
      console.error(`[${article.slug}] Failed to check existing row: ${existingError.message}`)
      continue
    }

    if (existing) {
      console.log(`[${article.slug}] Skipped: article already exists`)
      continue
    }

    const { error: insertError } = await supabase
      .from('articles')
      .insert({
        slug: article.slug,
        title: article.title,
        excerpt: article.description,
        meta_description: article.description,
        category: 'knowledge-base',
        status: 'published',
        author_name: 'FilipinoFoodNearMe.org',
        featured: false,
        read_time_minutes: 6,
        published_at: now,
        hero_image_url: '',
        hero_image_alt: '',
        tags: [],
        content: '',
      })

    if (insertError) {
      console.error(`[${article.slug}] Insert failed: ${insertError.message}`)
      continue
    }

    console.log(`[${article.slug}] Inserted successfully`)
  }
}

main().catch((error) => {
  console.error('Article sync failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
