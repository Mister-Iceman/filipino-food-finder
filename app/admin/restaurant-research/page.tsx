import Link from 'next/link'
import { approveDraft, queueDrafts, readQueue, rejectDraft, signIn, signOut } from './actions'

export const metadata = { title: 'FFNM Restaurant Research', robots: { index: false, follow: false } }

type Params = { message?: string; error?: string; pending?: string; archive?: string }
type Queue = Awaited<ReturnType<typeof readQueue>>
type Row = Extract<Queue, { signedIn: true }>['pending'][number]

function DraftCard({ row }: { row: Row }) {
  const draft = row.draft
  const links = [
    ['Website', draft.website], ['Map', draft.google_maps_url], ['Instagram', draft.instagram_url],
    ['Facebook', draft.facebook_url], ['TikTok', draft.tiktok_url], ['X', draft.x_url],
  ]
  return (
    <details className="rounded border bg-white p-4">
      <summary className="cursor-pointer font-semibold">
        {draft.name} · {draft.city}, {draft.state}{row.status !== 'pending' && ' · ' + row.status}
      </summary>
      <div className="mt-3 space-y-2 text-sm">
        <p>{draft.address_street}, {draft.city}, {draft.state} {draft.zip}</p>
        <p>{draft.category_primary}{draft.category_secondary && ' · ' + draft.category_secondary}</p>
        <p>Opened {draft.opening} · {draft.opening_status === 'soft_open' ? 'Soft opening' : 'Open'} · {draft.service_mode}</p>
        <p>{draft.description}</p>
        {draft.phone && <p>{draft.phone}</p>}
        {draft.hours && <p>{draft.hours}</p>}
        {draft.is_pickup_only && <p>Pickup only</p>}
        <div className="flex flex-wrap gap-3">
          {links.map(([label, url]) => url && <a key={label} href={url} target="_blank" rel="noreferrer" className="underline">{label}</a>)}
        </div>
        {draft.duplicate_result && <p>{draft.duplicate_result}</p>}
        <ul className="list-disc pl-5">
          {draft.sources.map((source, i) => (
            <li key={i}><a href={source.url} target="_blank" rel="noreferrer" className="underline">Source {i + 1}</a>
              {' · '}{source.checked_on}{' · '}{source.supports}</li>
          ))}
        </ul>
        {row.reviewed_at && <p>Decided {row.reviewed_at.slice(0, 10)} UTC</p>}
        {row.review_note && <p>{row.review_note}</p>}
        {row.listing_slug && <Link href={'/listings/' + row.listing_slug} className="underline">View live listing</Link>}
        {row.status === 'pending' && (
          <form action={approveDraft} className="flex flex-wrap gap-2 border-t pt-3">
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="hash" value={row.draft_hash} />
            <input name="note" aria-label="Review note" maxLength={1000} placeholder="Optional review note" className="rounded border p-2" />
            <button type="submit" className="rounded bg-green-700 px-3 py-2 text-white">Approve &amp; Publish</button>
            <button type="submit" formAction={rejectDraft} className="rounded border px-3 py-2">Reject</button>
          </form>
        )}
      </div>
    </details>
  )
}

function index(value?: string) {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 && n < 10000 ? n - 1 : 0
}

export default async function RestaurantResearch({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams
  const pendingPage = index(params.pending)
  const archivePage = index(params.archive)
  const queue = await readQueue(pendingPage, archivePage)
  return (
    <main className="mx-auto max-w-4xl space-y-5 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Restaurant research</h1>
        {queue.signedIn && <form action={signOut}><button className="underline">Sign out</button></form>}
      </div>
      {typeof params.error === 'string' && <p role="alert" className="text-red-700">{params.error.slice(0, 300)}</p>}
      {typeof params.message === 'string' && <p role="status" className="text-green-800">{params.message.slice(0, 300)}</p>}
      {!queue.signedIn ? (
        queue.configured ? <form action={signIn} className="flex flex-wrap items-center gap-3">
          <label htmlFor="review-key">Restaurant review key</label>
          <input id="review-key" name="key" type="password" required autoComplete="current-password" className="rounded border p-2" />
          <button className="rounded bg-gray-900 px-3 py-2 text-white">Sign in</button>
        </form> : <p>Restaurant review is awaiting setup.</p>
      ) : (
        <>
          <details className="rounded border p-4">
            <summary className="cursor-pointer font-semibold">Queue research drafts</summary>
            <form action={queueDrafts} className="mt-3 space-y-2">
              <label htmlFor="drafts" className="block">Paste draft JSON or the monthly research report JSON. Only ready candidates from a report enter the queue.</label>
              <textarea id="drafts" name="drafts" rows={6} required maxLength={60000} className="w-full rounded border p-2 font-mono text-sm" />
              <button className="rounded bg-gray-900 px-3 py-2 text-white">Queue for review</button>
            </form>
          </details>
          <h2 className="text-lg font-semibold">Awaiting review</h2>
          {queue.pendingError ? <p role="alert">The pending queue is unavailable.</p> : <>
            {queue.pending.map(row => <DraftCard key={row.id} row={row} />)}
            {!queue.pending.length && <p>No pending drafts on this page.</p>}
            <div className="flex gap-4">
              {pendingPage > 0 && <Link href={'?pending=' + pendingPage} className="underline">Previous drafts</Link>}
              {queue.morePending && <Link href={'?pending=' + (pendingPage + 2)} className="underline">More drafts</Link>}
            </div>
          </>}
          <details id="archive" open={params.archive ? true : undefined} className="space-y-3">
            <summary className="cursor-pointer font-semibold">Decision archive</summary>
            {queue.archiveError ? <p role="alert">The archive is unavailable.</p> : <>
              {queue.archive.map(row => <DraftCard key={row.id} row={row} />)}
              {!queue.archive.length && <p>No archived decisions on this page.</p>}
              <div className="flex gap-4">
                {archivePage > 0 && <Link href={'?archive=' + archivePage + '#archive'} className="underline">Newer decisions</Link>}
                {queue.moreArchive && <Link href={'?archive=' + (archivePage + 2) + '#archive'} className="underline">Older decisions</Link>}
              </div>
            </>}
          </details>
        </>
      )}
    </main>
  )
}
