'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

const CATEGORIES = [
  'Restaurant',
  'Bakery, Dessert & Cafe',
  'Supermarket & Grocery',
  'Food Truck & Pop-Up',
  'Quick Bites & Turo-Turo',
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [listingName, setListingName] = useState('')

  const [form, setForm] = useState({
    name: '',
    category_primary: 'Restaurant',
    address_street: '',
    city: '',
    state: 'CA',
    zip: '',
    phone: '',
    website: '',
    google_maps_url: '',
    description: '',
    hours: '',
    google_rating: '',
    google_reviews_count: '',
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (isAuthenticated) {
      fetchListing()
    }
  }, [isAuthenticated])

  const fetchListing = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !data) {
      setError('Listing not found.')
      setLoading(false)
      return
    }

    setListingName(data.name)
    setForm({
      name: data.name || '',
      category_primary: data.category_primary || 'Restaurant',
      address_street: data.address_street || '',
      city: data.city || '',
      state: data.state || 'CA',
      zip: data.zip || '',
      phone: data.phone || '',
      website: data.website || '',
      google_maps_url: data.google_maps_url || '',
      description: data.description || '',
      hours: data.hours || '',
      google_rating: data.google_rating?.toString() || '',
      google_reviews_count: data.google_reviews_count?.toString() || '',
    })
    setLoading(false)
  }

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const res = await fetch(`/api/admin/edit-listing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to save changes.')
    } else {
      setSuccess('Listing updated successfully!')
      setListingName(form.name)
      setTimeout(() => setSuccess(''), 4000)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const res = await fetch(`/api/admin/edit-listing/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to delete listing.')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter admin password"
              />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading listing...</p>
      </div>
    )
  }

  if (error && !form.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <a href="/admin" className="text-blue-600 hover:underline">← Back to Admin</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <a href="/admin" className="text-blue-600 hover:underline text-sm inline-block mb-2">
            ← Back to Admin Dashboard
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
          <p className="text-gray-500 mt-1 text-sm">{listingName} · ID: {id}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category_primary}
                onChange={e => set('category_primary', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={form.address_street}
                onChange={e => set('address_street', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 123 Main St"
              />
            </div>

            {/* City / State / Zip */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.state}
                  onChange={e => set('state', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {US_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip</label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={e => set('zip', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="(213) 555-0123"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="url"
                value={form.website}
                onChange={e => set('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://example.com"
              />
            </div>

            {/* Google Maps URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
              <input
                type="url"
                value={form.google_maps_url}
                onChange={e => set('google_maps_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://maps.google.com/..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Brief description of the business..."
              />
            </div>

            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours of Operation</label>
              <textarea
                value={form.hours}
                onChange={e => set('hours', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder={"Mon–Fri: 10am–9pm\nSat–Sun: 11am–8pm"}
              />
            </div>

            {/* Google Rating + Reviews */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.google_rating}
                  onChange={e => set('google_rating', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 4.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Reviews Count</label>
                <input
                  type="number"
                  min="0"
                  value={form.google_reviews_count}
                  onChange={e => set('google_reviews_count', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 124"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <a
                href="/admin"
                className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg text-center"
              >
                Cancel
              </a>
            </div>
          </form>

          {/* Delete section */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-500 mb-4">
              Permanently delete this listing. This action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold px-6 py-2.5 rounded-lg text-sm"
              >
                Delete Listing
              </button>
            ) : (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <p className="text-red-800 font-medium mb-1 text-sm">
                  Are you sure you want to delete &ldquo;{listingName}&rdquo;?
                </p>
                <p className="text-red-600 text-xs mb-4">This will permanently remove the listing and cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg text-sm"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-bold px-5 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
