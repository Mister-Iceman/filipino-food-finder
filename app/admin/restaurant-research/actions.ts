'use server'

import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { parseBatch } from './draft'
import type { ResearchDraft } from './draft'

const path = '/admin/restaurant-research'
const cookieName = 'ffnm_research_session'
const sessionSeconds = 8 * 60 * 60

function secret() {
  const key = process.env.FFNM_RESEARCH_ADMIN_SECRET
  return key && key.length >= 32 ? key : null
}

function same(a: string, b: string) {
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(a), digest(b))
}

function session(key: string, expiry: number) {
  const mac = createHmac('sha256', key).update('ffnm-restaurant-research:' + expiry).digest('hex')
  return expiry + '.' + mac
}

async function authorized() {
  const key = secret()
  const raw = (await cookies()).get(cookieName)?.value
  if (!key || !raw || !/^\d{10,13}\.[a-f0-9]{64}$/.test(raw)) return false
  const expiry = Number(raw.split('.')[0])
  return expiry > Date.now() && same(raw, session(key, expiry))
}

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function notice(message: string, error = false): never {
  redirect(path + '?' + new URLSearchParams({ [error ? 'error' : 'message']: message }))
}

export async function signIn(form: FormData) {
  const key = secret()
  const provided = form.get('key')
  if (!key || typeof provided !== 'string' || provided.length > 1024 || !same(key, provided)) {
    notice('Unable to sign in. Check the restaurant review key.', true)
  }
  ;(await cookies()).set(cookieName, session(key, Date.now() + sessionSeconds * 1000), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path, maxAge: sessionSeconds,
  })
  redirect(path)
}

export async function signOut() {
  ;(await cookies()).set(cookieName, '', { path, maxAge: 0 })
  redirect(path)
}

export async function queueDrafts(form: FormData) {
  if (!await authorized()) notice('Sign in to queue a draft.', true)
  const raw = form.get('drafts')
  if (typeof raw !== 'string' || raw.length > 60000) notice('Paste up to 60,000 characters of draft JSON.', true)
  let drafts: ResearchDraft[]
  try {
    drafts = parseBatch(JSON.parse(raw))
  } catch (error) {
    notice(error instanceof SyntaxError ? 'Paste valid JSON.' : (error as Error).message, true)
  }
  const rows = drafts.map(draft => ({
    draft, draft_hash: createHash('sha256').update(JSON.stringify(draft)).digest('hex'),
  }))
  const { error } = await db().from('ffnm_restaurant_drafts').upsert(rows, {
    onConflict: 'draft_hash', ignoreDuplicates: true,
  })
  if (error) {
    console.error('[restaurant-research] intake failed', error.code)
    notice('Could not queue the drafts.', true)
  }
  notice('Drafts received. Existing copies keep their current status.')
}

export async function decideDraft(form: FormData) {
  if (!await authorized()) notice('Sign in to review a draft.', true)
  const id = form.get('id')
  const hash = form.get('hash')
  const action = form.get('action')
  const note = form.get('note')
  if (typeof id !== 'string' || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(id) ||
      typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash) ||
      (action !== 'publish' && action !== 'reject') ||
      typeof note !== 'string' || note.length > 1000) notice('Check the decision and try again.', true)

  const { data, error } = await db().rpc('ffnm_decide_restaurant_draft', {
    p_id: id, p_hash: hash, p_action: action, p_note: note.trim(),
  })
  if (error) {
    if (error.code === 'P0001') notice(error.message, true)
    console.error('[restaurant-research] decision failed', error.code)
    notice('Could not save the decision. The draft is still available for review.', true)
  }
  if (data?.status === 'published' && data.slug) {
    for (const target of ['/', '/directory', '/restaurants', '/quick-bites', '/listings/' + data.slug, '/sitemap.xml']) {
      revalidatePath(target)
    }
    revalidatePath('/states/[state]', 'page')
    revalidatePath('/[state]/[city]', 'page')
  }
  notice(data?.status === 'published' ? 'Restaurant published to FFNM.' : 'Draft rejected and archived.')
}

type DraftRow = {
  id: string
  draft_hash: string
  draft: ResearchDraft
  status: 'pending' | 'published' | 'rejected'
  listing_slug: string | null
  review_note: string | null
  reviewed_at: string | null
}

export async function readQueue(page: number, archivePage: number) {
  if (!await authorized()) return { signedIn: false as const, configured: !!secret() }
  const size = 25
  const client = db()
  const [pending, archive] = await Promise.all([
    client.from('ffnm_restaurant_drafts').select('*', { count: 'exact' }).eq('status', 'pending')
      .order('created_at', { ascending: false }).order('id').range(page * size, (page + 1) * size - 1),
    client.from('ffnm_restaurant_drafts').select('*', { count: 'exact' }).in('status', ['published', 'rejected'])
      .order('reviewed_at', { ascending: false }).order('id').range(archivePage * size, (archivePage + 1) * size - 1),
  ])
  return { signedIn: true as const, pending: (pending.data ?? []) as DraftRow[], archive: (archive.data ?? []) as DraftRow[],
    pendingError: !!pending.error, archiveError: !!archive.error,
    morePending: (pending.count ?? 0) > (page + 1) * size,
    moreArchive: (archive.count ?? 0) > (archivePage + 1) * size }
}
