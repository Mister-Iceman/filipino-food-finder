'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

function toSlug(name: string, city: string, state: string): string {
  return `${name} ${city} ${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stateHintFromSlug(slug: string): string | null {
  const last = slug.split('-').at(-1) ?? ''
  return /^[a-z]{2}$/.test(last) ? last.toUpperCase() : null
}

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

interface PendingPhoto {
  id: string
  listing_id: string
  owner_email: string
  storage_path: string
  status: string
  created_at: string
  url: string | null
  listing_name: string | null
}

export default function AdminPhotosPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [photos, setPhotos] = useState<PendingPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadPhotos = async () => {
    setLoading(true)

    const { data: rawPhotos } = await supabase
      .from('listing_photos')
      .select('id, listing_id, owner_email, storage_path, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (!rawPhotos || rawPhotos.length === 0) {
      setPhotos([])
      setLoading(false)
      return
    }

    // Get signed URLs; batch listing name lookup by state to avoid per-photo queries
    const slugs = [...new Set(rawPhotos.map(p => p.listing_id as string))]
    const listingNameMap: Record<string, string> = {}
    for (const slug of slugs) {
      const hint = stateHintFromSlug(slug)
      const q = supabase.from('listings').select('name, city, state')
      const { data: cands } = hint ? await q.ilike('state', hint) : await q
      const match = (cands ?? []).find(
        (l: { name: string; city: string; state: string }) =>
          toSlug(l.name ?? '', l.city ?? '', l.state ?? '') === slug
      )
      listingNameMap[slug] = match?.name ?? slug
    }

    const enriched = await Promise.all(
      rawPhotos.map(async (photo) => {
        const { data: signed } = await supabase.storage
          .from('listing-photos')
          .createSignedUrl(photo.storage_path, 3600)
        return {
          ...photo,
          url: signed?.signedUrl ?? null,
          listing_name: listingNameMap[photo.listing_id] ?? photo.listing_id,
        }
      })
    )

    setPhotos(enriched)
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) loadPhotos()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const handleAction = async (photoId: string, action: 'approve' | 'reject') => {
    setActionLoading(photoId)
    await fetch('/api/admin/review-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD, photoId, action }),
    })
    setPhotos(prev => prev.filter(p => p.id !== photoId))
    setActionLoading(null)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true)
    else alert('Incorrect password')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <a href="/admin" className="text-sm text-blue-600 hover:underline">← Admin Dashboard</a>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Photo Review Queue</h1>
          </div>
          <button
            onClick={loadPhotos}
            className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : photos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">All caught up!</h2>
            <p className="text-gray-500">No pending photos to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{photos.length} photo{photos.length !== 1 ? 's' : ''} awaiting review</p>
            {photos.map(photo => (
              <div key={photo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-5 items-start">
                <div className="shrink-0 w-48 h-36 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {photo.url ? (
                    <img src={photo.url} alt="Pending photo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No preview</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{photo.listing_name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    <a href={`mailto:${photo.owner_email}`} className="text-blue-600 hover:underline">{photo.owner_email}</a>
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    <a
                      href={`/listings/${photo.listing_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      /listings/{photo.listing_id} →
                    </a>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted {new Date(photo.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  {photo.url && (
                    <a
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                    >
                      Open full size →
                    </a>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAction(photo.id, 'approve')}
                      disabled={actionLoading === photo.id}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-bold"
                    >
                      {actionLoading === photo.id ? '…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleAction(photo.id, 'reject')}
                      disabled={actionLoading === photo.id}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-bold"
                    >
                      {actionLoading === photo.id ? '…' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
