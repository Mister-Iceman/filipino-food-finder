'use client'

import { useState, useEffect, useRef } from 'react'
import type { OwnerDashboardData, TagStatus } from '@/lib/types/owner'

interface DishTag {
  id: number
  name: string
  slug: string | null
  category: 'savory' | 'dessert'
  display_order: number
  is_active: boolean
}

interface GroceryTag {
  id: number
  name: string
  slug: string
  emoji: string | null
  display_order: number
  is_active: boolean
}

interface UniversalTag {
  id: number
  name: string
  slug: string
  emoji: string | null
  display_order: number
  is_active: boolean
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface ListingPhoto {
  id: string
  storage_path: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  url: string | null
}

export default function OwnerDashboardPage() {
  const [token, setToken] = useState<string | null>(null)
  const [data, setData] = useState<OwnerDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Tag catalog
  const [dishTags, setDishTags] = useState<DishTag[]>([])
  const [groceryTags, setGroceryTags] = useState<GroceryTag[]>([])
  const [universalTags, setUniversalTags] = useState<UniversalTag[]>([])

  // Selected IDs (what is currently checked in UI)
  const [selectedDishIds, setSelectedDishIds] = useState<Set<number>>(new Set())
  const [selectedGroceryIds, setSelectedGroceryIds] = useState<Set<number>>(new Set())
  const [selectedUniversalIds, setSelectedUniversalIds] = useState<Set<number>>(new Set())

  // Initial verified IDs (for diffing on save)
  const initialDishIds = useRef<Set<number>>(new Set())
  const initialGroceryIds = useRef<Set<number>>(new Set())
  const initialUniversalIds = useRef<Set<number>>(new Set())

  const [dishSaveStatus, setDishSaveStatus] = useState<SaveStatus>('idle')
  const [featureSaveStatus, setFeatureSaveStatus] = useState<SaveStatus>('idle')

  // Photos
  const [photos, setPhotos] = useState<ListingPhoto[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 1: Extract token from URL or localStorage (runs once on mount)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')

    if (urlToken) {
      localStorage.setItem('owner_dashboard_token', urlToken)
      // Clean token from URL bar
      window.history.replaceState({}, '', '/owner/dashboard')
      setToken(urlToken)
    } else {
      const stored = localStorage.getItem('owner_dashboard_token')
      setToken(stored)
    }
  }, [])

  // Step 2: Once we have a token, verify it and load catalog
  useEffect(() => {
    if (token === null) return
    if (token === '') {
      setError('No access token found. Please use the link from your approval email.')
      setLoading(false)
      return
    }

    loadDashboard(token)
  }, [token])

  const loadDashboard = async (tok: string) => {
    setLoading(true)
    setError(null)

    const [verifyRes, dishRes, groceryRes, universalRes] = await Promise.all([
      fetch('/api/owner/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tok }),
      }),
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/dish_tags?is_active=eq.true&order=display_order.asc`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/grocery_tags?is_active=eq.true&order=display_order.asc`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/universal_tags?is_active=eq.true&order=display_order.asc`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }),
    ])

    if (!verifyRes.ok) {
      const body = await verifyRes.json().catch(() => ({}))
      setError(body.error || 'Invalid or expired access link. Please use the link from your approval email.')
      setLoading(false)
      return
    }

    const dashData: OwnerDashboardData = await verifyRes.json()
    setData(dashData)

    const dishes: DishTag[] = dishRes.ok ? await dishRes.json() : []
    const groceries: GroceryTag[] = groceryRes.ok ? await groceryRes.json() : []
    const universals: UniversalTag[] = universalRes.ok ? await universalRes.json() : []

    setDishTags(dishes)
    setGroceryTags(groceries)
    setUniversalTags(universals)

    // Pre-populate checkboxes from verified_by_owner statuses
    const verifiedDish = new Set(
      dashData.dish_tag_statuses.filter(s => s.verified_by_owner).map(s => s.tag_id)
    )
    const verifiedGrocery = new Set(
      dashData.grocery_tag_statuses.filter(s => s.verified_by_owner).map(s => s.tag_id)
    )
    const verifiedUniversal = new Set(
      dashData.universal_tag_statuses.filter(s => s.verified_by_owner).map(s => s.tag_id)
    )

    setSelectedDishIds(verifiedDish)
    setSelectedGroceryIds(verifiedGrocery)
    setSelectedUniversalIds(verifiedUniversal)

    initialDishIds.current = new Set(verifiedDish)
    initialGroceryIds.current = new Set(verifiedGrocery)
    initialUniversalIds.current = new Set(verifiedUniversal)

    setLoading(false)
  }

  const toggleId = (set: Set<number>, id: number): Set<number> => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  }

  const getDiff = (current: Set<number>, initial: Set<number>) => {
    const verified: number[] = []
    const unverified: number[] = []
    const allIds = new Set([...current, ...initial])
    allIds.forEach(id => {
      if (current.has(id) && !initial.has(id)) verified.push(id)
      if (!current.has(id) && initial.has(id)) unverified.push(id)
    })
    return { verified, unverified }
  }

  const saveDishes = async () => {
    if (!token) return
    setDishSaveStatus('saving')
    const { verified, unverified } = getDiff(selectedDishIds, initialDishIds.current)
    const res = await fetch('/api/owner/save-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        verified_dish_ids: verified,
        unverified_dish_ids: unverified,
      }),
    })
    if (res.ok) {
      initialDishIds.current = new Set(selectedDishIds)
      setDishSaveStatus('saved')
      setTimeout(() => setDishSaveStatus('idle'), 3000)
    } else {
      setDishSaveStatus('error')
    }
  }

  const saveFeatures = async () => {
    if (!token) return
    setFeatureSaveStatus('saving')
    const grocery = getDiff(selectedGroceryIds, initialGroceryIds.current)
    const universal = getDiff(selectedUniversalIds, initialUniversalIds.current)
    const res = await fetch('/api/owner/save-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        verified_grocery_ids: grocery.verified,
        unverified_grocery_ids: grocery.unverified,
        verified_universal_ids: universal.verified,
        unverified_universal_ids: universal.unverified,
      }),
    })
    if (res.ok) {
      initialGroceryIds.current = new Set(selectedGroceryIds)
      initialUniversalIds.current = new Set(selectedUniversalIds)
      setFeatureSaveStatus('saved')
      setTimeout(() => setFeatureSaveStatus('idle'), 3000)
    } else {
      setFeatureSaveStatus('error')
    }
  }

  const loadPhotos = async (tok: string) => {
    setPhotosLoading(true)
    const res = await fetch(`/api/owner/photos?token=${encodeURIComponent(tok)}`)
    if (res.ok) {
      const json = await res.json()
      setPhotos(json.photos ?? [])
    }
    setPhotosLoading(false)
  }

  // Load photos whenever token and data are ready
  useEffect(() => {
    if (token && data) loadPhotos(token)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, data])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token || !data) return
    setUploading(true)
    setUploadError(null)
    const form = new FormData()
    form.append('token', token)
    form.append('listingSlug', data.listing.slug)
    form.append('file', file)
    const res = await fetch('/api/owner/upload-photo', { method: 'POST', body: form })
    const json = await res.json()
    if (!res.ok) {
      setUploadError(json.error ?? 'Upload failed')
    } else {
      await loadPhotos(token)
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!token) return
    const res = await fetch('/api/owner/delete-photo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, photoId }),
    })
    if (res.ok) {
      setPhotos(prev => prev.filter(p => p.id !== photoId))
    }
  }

  const isGrocery = data?.listing.category_primary === 'Supermarket & Grocery'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-width-md text-center max-w-md w-full">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-4">
            Need help? Contact us at{' '}
            <a href="mailto:info@filipinofoodnearme.org" className="text-blue-600 underline">
              info@filipinofoodnearme.org
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { owner, listing } = data
  const savory = dishTags.filter(t => t.category === 'savory')
  const dessert = dishTags.filter(t => t.category === 'dessert')

  const dishTagStatus = (id: number): TagStatus | undefined =>
    data.dish_tag_statuses.find(s => s.tag_id === id)
  const groceryTagStatus = (id: number): TagStatus | undefined =>
    data.grocery_tag_statuses.find(s => s.tag_id === id)
  const universalTagStatus = (id: number): TagStatus | undefined =>
    data.universal_tag_statuses.find(s => s.tag_id === id)

  const saveButtonLabel = (status: SaveStatus) => {
    if (status === 'saving') return 'Saving...'
    if (status === 'saved') return '✓ Saved!'
    if (status === 'error') return 'Error — Try Again'
    return 'Save Changes'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Owner Dashboard</p>
          <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {listing.address_street}, {listing.city}, {listing.state} {listing.zip}
          </p>
        </div>

        {/* Section 1: Business Info Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Business Info</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500">Owner</dt>
              <dd className="font-medium text-gray-900">{owner.owner_name ?? owner.owner_email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{owner.owner_email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Category</dt>
              <dd className="font-medium text-gray-900">{listing.category_primary}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Verified Since</dt>
              <dd className="font-medium text-gray-900">
                {new Date(owner.claimed_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </dd>
            </div>
          </dl>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href={`/listings/${listing.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View your public listing →
            </a>
          </div>
        </div>

        {/* Section 2: Verify Your Dishes (not shown for grocery-only) */}
        {!isGrocery && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Verify Your Dishes</h2>
            <p className="text-sm text-gray-500 mb-5">
              Check every dish you currently serve. This adds a verified badge next to community votes.
            </p>

            {/* Savory */}
            {savory.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Savory Dishes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {savory.map(tag => {
                    const status = dishTagStatus(tag.id)
                    const checked = selectedDishIds.has(tag.id)
                    return (
                      <label
                        key={tag.id}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-blue-50 border-blue-400 text-blue-900'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setSelectedDishIds(prev => toggleId(prev, tag.id))}
                          className="accent-blue-600"
                        />
                        <span className="text-sm font-medium">{tag.name}</span>
                        {status && status.confirmed_count > 0 && (
                          <span className="ml-auto text-xs text-gray-400">{status.confirmed_count}</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Dessert */}
            {dessert.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Desserts & Drinks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {dessert.map(tag => {
                    const status = dishTagStatus(tag.id)
                    const checked = selectedDishIds.has(tag.id)
                    return (
                      <label
                        key={tag.id}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-yellow-50 border-yellow-400 text-yellow-900'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setSelectedDishIds(prev => toggleId(prev, tag.id))}
                          className="accent-yellow-500"
                        />
                        <span className="text-sm font-medium">{tag.name}</span>
                        {status && status.confirmed_count > 0 && (
                          <span className="ml-auto text-xs text-gray-400">{status.confirmed_count}</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            <button
              onClick={saveDishes}
              disabled={dishSaveStatus === 'saving'}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${
                dishSaveStatus === 'saved'
                  ? 'bg-green-600 text-white'
                  : dishSaveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
              }`}
            >
              {saveButtonLabel(dishSaveStatus)}
            </button>
          </div>
        )}

        {/* Section 3: Verify Your Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Verify Your Features</h2>
          <p className="text-sm text-gray-500 mb-5">
            Select everything that applies to your business to help customers find you.
          </p>

          {/* Grocery tags (only for grocery stores) */}
          {isGrocery && groceryTags.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Products You Carry</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {groceryTags.map(tag => {
                  const status = groceryTagStatus(tag.id)
                  const checked = selectedGroceryIds.has(tag.id)
                  return (
                    <label
                      key={tag.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        checked
                          ? 'bg-green-50 border-green-400 text-green-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setSelectedGroceryIds(prev => toggleId(prev, tag.id))}
                        className="accent-green-600"
                      />
                      {tag.emoji && <span>{tag.emoji}</span>}
                      <span className="text-sm font-medium">{tag.name}</span>
                      {status && status.confirmed_count > 0 && (
                        <span className="ml-auto text-xs text-gray-400">{status.confirmed_count}</span>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Universal tags */}
          {universalTags.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Service & Dining Options</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {universalTags.map(tag => {
                  const status = universalTagStatus(tag.id)
                  const checked = selectedUniversalIds.has(tag.id)
                  return (
                    <label
                      key={tag.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        checked
                          ? 'bg-purple-50 border-purple-400 text-purple-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setSelectedUniversalIds(prev => toggleId(prev, tag.id))}
                        className="accent-purple-600"
                      />
                      {tag.emoji && <span>{tag.emoji}</span>}
                      <span className="text-sm font-medium">{tag.name}</span>
                      {status && status.confirmed_count > 0 && (
                        <span className="ml-auto text-xs text-gray-400">{status.confirmed_count}</span>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={saveFeatures}
            disabled={featureSaveStatus === 'saving'}
            className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${
              featureSaveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : featureSaveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50'
            }`}
          >
            {saveButtonLabel(featureSaveStatus)}
          </button>
        </div>

        {/* Section 4: Photos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Your Photos</h2>
          <p className="text-sm text-gray-500 mb-5">
            Upload up to 5 photos of your business, food, or team. Photos are reviewed before going live.
          </p>

          {photosLoading ? (
            <p className="text-sm text-gray-400">Loading photos…</p>
          ) : (
            <>
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {photos.map(photo => (
                    <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      {photo.url ? (
                        <img
                          src={photo.url}
                          alt="Business photo"
                          className="w-full h-28 object-cover"
                        />
                      ) : (
                        <div className="w-full h-28 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No preview</div>
                      )}
                      <div className="p-2 flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          photo.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : photo.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {photo.status === 'approved' ? 'Live' : photo.status === 'pending' ? 'Under Review' : 'Rejected'}
                        </span>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {photos.filter(p => p.status !== 'rejected').length < 5 ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add a Photo
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, or WebP · max 5 MB</p>
                  {uploading && <p className="text-xs text-blue-600 mt-2">Uploading…</p>}
                  {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
                </div>
              ) : (
                <p className="text-sm text-gray-500">You&apos;ve reached the 5-photo limit. Delete a photo to upload a new one.</p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Questions? Email{' '}
          <a href="mailto:info@filipinofoodnearme.org" className="underline">
            info@filipinofoodnearme.org
          </a>
        </p>
      </div>
    </div>
  )
}
