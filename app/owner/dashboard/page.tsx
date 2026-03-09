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
  caption: string | null
}

interface PhotoSlot {
  label: string
  desc: string
}

function getPhotoSlots(categoryPrimary: string): PhotoSlot[] {
  const cat = (categoryPrimary ?? '').toLowerCase()
  if (cat.includes('bakery') || cat.includes('dessert') || cat.includes('cafe') || cat.includes('café')) {
    return [
      { label: 'Best-Selling Pastry', desc: 'Lead with your star item — the pandesal, ensaymada, or ube cake people come for.' },
      { label: 'Storefront / Exterior', desc: 'Help people recognize you. Shoot during the day so your signage is legible.' },
      { label: 'Assortment Display', desc: 'Show your full tray or display case — variety attracts walk-in customers.' },
      { label: 'Interior / Display Case', desc: 'Help visitors picture the experience — your counter, case, or seating area.' },
      { label: 'Baker / Team', desc: 'Put a face behind the food. Decorating in action or hands shaping dough work great.' },
    ]
  }
  if (cat.includes('truck') || cat.includes('pop-up') || cat.includes('popup')) {
    return [
      { label: 'Truck or Cart Setup', desc: 'Show the full vehicle or setup so customers can spot you at events.' },
      { label: 'Signature Item', desc: 'Your best-looking menu item. Make it obvious why people should wait in line.' },
      { label: 'Food Spread', desc: 'Show your range — a combo plate or lineup of your top sellers.' },
      { label: 'Service / Setup Shot', desc: 'Action shots from service, plating, or your setup at a market or event.' },
      { label: 'Owner / Team', desc: 'The face behind the truck. A candid during service or prep works well.' },
    ]
  }
  if (cat.includes('supermarket') || cat.includes('grocery') || cat.includes('market')) {
    return [
      { label: 'Storefront / Exterior', desc: 'Help shoppers find you. A clear shot with visible signage is ideal.' },
      { label: 'Filipino Products Section', desc: 'Show the aisle or shelf that makes you distinctly Filipino.' },
      { label: 'Product Variety', desc: 'A styled shot of products — rice bags, bagoong, vinegar, RTG packs.' },
      { label: 'Interior / Aisle', desc: 'Help customers understand the scale — a market feel or full grocery layout.' },
      { label: 'Owner / Team', desc: 'The people who keep the shelves stocked. A candid works great.' },
    ]
  }
  // Default: Restaurant / Café
  return [
    { label: 'Signature Dish / Bestseller', desc: 'Your strongest food photo. One dish that says "this is what we\'re known for."' },
    { label: 'Storefront / Exterior', desc: 'Help people recognize you when they arrive. Shoot during the day so your signage is legible.' },
    { label: 'Food Spread / Variety', desc: 'Show your range. A bilao, kamayan set, or assortment shot works great.' },
    { label: 'Interior / Dining Area', desc: 'Help visitors understand the vibe — turo-turo, bistro, or dining room layout.' },
    { label: 'Owner / Team / Service Moment', desc: 'The face behind the food. A kitchen prep shot or hands wrapping lumpia works too.' },
  ]
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
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [captionSaved, setCaptionSaved] = useState<Record<string, boolean>>({})

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
      const loaded: ListingPhoto[] = json.photos ?? []
      setPhotos(loaded)
      const initCaptions: Record<string, string> = {}
      loaded.forEach(p => { initCaptions[p.id] = p.caption ?? '' })
      setCaptions(initCaptions)
    }
    setPhotosLoading(false)
  }

  const handleSaveCaption = async (photoId: string) => {
    if (!token) return
    const caption = (captions[photoId] ?? '').trim()
    await fetch('/api/owner/update-caption', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, photoId, caption }),
    })
    setCaptionSaved(prev => ({ ...prev, [photoId]: true }))
    setTimeout(() => setCaptionSaved(prev => ({ ...prev, [photoId]: false })), 2000)
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
        {(() => {
          const slots = getPhotoSlots(listing.category_primary)
          const activePhotos = photos.filter(p => p.status !== 'rejected')
          const canUpload = activePhotos.length < 5

          return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Your Photos</h2>
              <p className="text-sm text-gray-500 mb-1">
                Up to 5 photos · reviewed before going live · your first photo is your featured image
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Lead with food, not your facade — a great dish photo gets more clicks than a storefront shot.
              </p>

              {photosLoading ? (
                <p className="text-sm text-gray-400">Loading photos…</p>
              ) : (
                <>
                  {/* Photo slots */}
                  <div className="space-y-4 mb-6">
                    {slots.map((slot, i) => {
                      const photo = photos.filter(p => p.status !== 'rejected')[i] ?? null
                      const slotNum = i + 1

                      return (
                        <div key={i} className={`rounded-xl border ${photo ? 'border-gray-200 bg-white' : 'border-dashed border-gray-200 bg-gray-50'}`}>
                          {/* Slot header */}
                          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${photo ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                              {slotNum}
                            </span>
                            <span className="text-sm font-semibold text-gray-800">{slot.label}</span>
                            {photo && (
                              <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                                photo.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {photo.status === 'approved' ? 'Live' : 'Under Review'}
                              </span>
                            )}
                          </div>

                          {photo ? (
                            /* Filled slot */
                            <div className="px-4 pb-4">
                              <div className="flex gap-4 mt-2">
                                <div className="shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                  {photo.url ? (
                                    <img src={photo.url} alt={slot.label} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No preview</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  {/* Caption */}
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Caption <span className="text-gray-400">(optional · 50 chars)</span>
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      maxLength={50}
                                      value={captions[photo.id] ?? ''}
                                      onChange={e => setCaptions(prev => ({ ...prev, [photo.id]: e.target.value }))}
                                      placeholder={`e.g. "Our house-made ${slot.label.toLowerCase().split('/')[0].trim()}"`}
                                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    <button
                                      onClick={() => handleSaveCaption(photo.id)}
                                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                        captionSaved[photo.id]
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                      }`}
                                    >
                                      {captionSaved[photo.id] ? '✓ Saved' : 'Save'}
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {(captions[photo.id] ?? '').length}/50 characters
                                  </p>
                                  <button
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium mt-2"
                                  >
                                    Delete photo
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Empty slot */
                            <div className="px-4 pb-4 pt-1">
                              <p className="text-xs text-gray-500">{slot.desc}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Upload area */}
                  {canUpload ? (
                    <div className="border border-dashed border-blue-200 bg-blue-50 rounded-xl p-4 mb-6">
                      <p className="text-sm font-semibold text-blue-800 mb-2">
                        Upload Next Photo — Slot {activePhotos.length + 1} of 5
                      </p>
                      <p className="text-xs text-blue-700 mb-3">
                        <strong>{slots[activePhotos.length]?.label}</strong> — {slots[activePhotos.length]?.desc}
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                      />
                      <p className="text-xs text-gray-400 mt-2">JPEG, PNG, or WebP · max 5 MB</p>
                      {uploading && <p className="text-xs text-blue-600 mt-2">Uploading…</p>}
                      {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <p className="text-sm font-semibold text-green-800">All 5 slots filled</p>
                      <p className="text-xs text-green-700 mt-1">Delete a photo above to replace it with a new one.</p>
                    </div>
                  )}

                  {/* Best Practices */}
                  <div className="border-t border-gray-100 pt-5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Best Practices</h3>
                    <ul className="space-y-1.5 text-sm text-gray-600 mb-4">
                      <li className="flex gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Use bright, clear, real photos of your business and food.</li>
                      <li className="flex gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Natural lighting is best — avoid dark, blurry, or heavily filtered images.</li>
                      <li className="flex gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Your first photo is your featured image — make it your strongest.</li>
                      <li className="flex gap-2"><span className="text-red-400 font-bold mt-0.5">✗</span> Avoid flyers, posters, screenshots, or text-heavy menu photos.</li>
                      <li className="flex gap-2"><span className="text-red-400 font-bold mt-0.5">✗</span> Avoid images that don&apos;t clearly represent your food or business.</li>
                    </ul>
                    <p className="text-xs text-gray-400 italic">
                      Have a menu or QR code? Skip the blurry laminated photo — a clean graphic of your top sellers works much better on mobile.
                    </p>
                  </div>
                </>
              )}
            </div>
          )
        })()}

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
