'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'
type ManagementView = 'listings' | 'events'

interface Partner {
  id: string
  org_name: string
  full_name: string | null
  website: string | null
  contact_email: string
  description: string | null
  category: string
  status: string
  created_at: string
}

interface PendingClaim {
  id: string
  listing_id: number
  listing_name: string
  listing_city: string
  listing_state: string
  owner_name: string
  owner_role: string
  owner_email: string
  message: string | null
  status: string
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [listings, setListings] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>([])
  const [claimActionLoading, setClaimActionLoading] = useState<string | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [partnerActionLoading, setPartnerActionLoading] = useState<string | null>(null)
  const [showPartnerForm, setShowPartnerForm] = useState(false)
  const [partnerFormData, setPartnerFormData] = useState({
    org_name: '',
    full_name: '',
    website: '',
    contact_email: '',
    description: '',
    category: 'Organization',
  })
  
  const [formData, setFormData] = useState({
    name: '',
    address_street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    website: '',
    google_maps_url: '',
    category_primary: 'Restaurant',
    category_secondary: '',
    google_rating: '',
    google_reviews_count: '',
    hours: '',
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
    x_url: ''
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (isAuthenticated) {
      loadListings()
      loadPendingClaims()
      loadPartners()
    }
  }, [isAuthenticated])

  const loadPendingClaims = async () => {
    const { data } = await supabase
      .from('claims')
      .select('id, listing_id, listing_name, listing_city, listing_state, owner_name, owner_role, owner_email, message, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setPendingClaims(data ?? [])
  }

  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    setClaimActionLoading(claimId)
    const { data: claim } = await supabase
      .from('claims')
      .select('token')
      .eq('id', claimId)
      .single()

    if (!claim?.token) {
      alert('Could not find claim token')
      setClaimActionLoading(null)
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://filipinofoodnearme.org'
    await fetch(`${baseUrl}/api/approve-claim?token=${claim.token}&action=${action}`)
    await loadPendingClaims()
    setClaimActionLoading(null)
  }

  const loadPartners = async () => {
    const { data } = await supabase
      .from('community_partners')
      .select('id, org_name, full_name, website, contact_email, description, category, status, created_at')
      .order('created_at', { ascending: false })
    setPartners(data ?? [])
  }

  const handlePartnerAction = async (id: string, action: 'approved' | 'rejected') => {
    setPartnerActionLoading(id)
    await supabase
      .from('community_partners')
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq('id', id)
    await loadPartners()
    setPartnerActionLoading(null)
  }

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('community_partners').insert({
      org_name: partnerFormData.org_name,
      full_name: partnerFormData.full_name || null,
      website: partnerFormData.website || null,
      contact_email: partnerFormData.contact_email,
      description: partnerFormData.description || null,
      category: partnerFormData.category,
      status: 'approved',
    })
    if (!error) {
      setPartnerFormData({ org_name: '', full_name: '', website: '', contact_email: '', description: '', category: 'Organization' })
      setShowPartnerForm(false)
      await loadPartners()
    } else {
      alert('Error: ' + error.message)
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

  const loadListings = async () => {
    setIsSearching(false)
    setSearchQuery('')
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (data) setListings(data)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadListings()
      return
    }

    setIsSearching(true)
    const cleanQuery = searchQuery.trim()
    
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .or(`name.ilike.%${cleanQuery}%,city.ilike.%${cleanQuery}%,state.ilike.%${cleanQuery}%,zip.ilike.%${cleanQuery}%,address_street.ilike.%${cleanQuery}%,review_keywords.ilike.%${cleanQuery}%`)
      .order('name', { ascending: true })
      .limit(100)
    
    if (data) {
      setListings(data)
    } else {
      setListings([])
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearching(false)
    loadListings()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const dataToSubmit = {
      ...formData,
      google_rating: formData.google_rating ? parseFloat(formData.google_rating) : null,
      google_reviews_count: formData.google_reviews_count ? parseInt(formData.google_reviews_count) : 0
    }

    if (editingId) {
      const { error } = await supabase
        .from('listings')
        .update(dataToSubmit)
        .eq('id', editingId)
      
      if (!error) {
        alert('Restaurant updated!')
        resetForm()
        if (isSearching && searchQuery) {
          handleSearch(e)
        } else {
          loadListings()
        }
      }
    } else {
      const { error } = await supabase
        .from('listings')
        .insert([dataToSubmit])
      
      if (!error) {
        alert('Restaurant added!')
        resetForm()
        loadListings()
      } else {
        alert('Error: ' + error.message)
      }
    }
  }

  const handleEdit = (listing: any) => {
    setFormData({
      name: listing.name || '',
      address_street: listing.address_street || '',
      city: listing.city || '',
      state: listing.state || '',
      zip: listing.zip || '',
      country: listing.country || 'US',
      phone: listing.phone || '',
      website: listing.website || '',
      google_maps_url: listing.google_maps_url || '',
      category_primary: listing.category_primary || 'Restaurant',
      category_secondary: listing.category_secondary || '',
      google_rating: listing.google_rating?.toString() || '',
      google_reviews_count: listing.google_reviews_count?.toString() || '',
      hours: listing.hours || '',
      instagram_url: listing.instagram_url || '',
      facebook_url: listing.facebook_url || '',
      tiktok_url: listing.tiktok_url || '',
      x_url: listing.x_url || ''
    })
    setEditingId(listing.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)
      
      if (!error) {
        alert('Restaurant deleted!')
        if (isSearching && searchQuery) {
          handleSearch(new Event('submit') as any)
        } else {
          loadListings()
        }
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address_street: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
      phone: '',
      website: '',
      google_maps_url: '',
      category_primary: 'Restaurant',
      category_secondary: '',
      google_rating: '',
      google_reviews_count: '',
      hours: '',
      instagram_url: '',
      facebook_url: '',
      tiktok_url: '',
      x_url: ''
    })
    setEditingId(null)
    setShowForm(false)
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
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold"
          >
            {showForm ? 'Cancel' : '+ Add Restaurant'}
          </button>
        </div>

        {/* Pending Claims */}
        {pendingClaims.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-1">
              Pending Claims ({pendingClaims.length})
            </h2>
            <p className="text-amber-700 text-sm mb-4">Review and approve or reject listing ownership claims.</p>
            <div className="space-y-4">
              {pendingClaims.map(claim => (
                <div key={claim.id} className="bg-white border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{claim.listing_name}</p>
                      <p className="text-sm text-gray-600">{claim.listing_city}, {claim.listing_state}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">{claim.owner_name}</span>
                        {claim.owner_role ? ` · ${claim.owner_role}` : ''}
                      </p>
                      <p className="text-sm text-gray-600">{claim.owner_email}</p>
                      {claim.message && (
                        <p className="text-sm text-gray-500 mt-2 italic">"{claim.message}"</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted {new Date(claim.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleClaimAction(claim.id, 'approve')}
                        disabled={claimActionLoading === claim.id}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        {claimActionLoading === claim.id ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleClaimAction(claim.id, 'reject')}
                        disabled={claimActionLoading === claim.id}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        {claimActionLoading === claim.id ? '...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Partners */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-teal-900">
              Community Partners ({partners.length})
            </h2>
            <button
              onClick={() => setShowPartnerForm(!showPartnerForm)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg"
            >
              {showPartnerForm ? 'Cancel' : '+ Add Partner'}
            </button>
          </div>
          <p className="text-teal-700 text-sm mb-4">Approve inquiries or add partners manually. Approved partners appear on the public page.</p>

          {showPartnerForm && (
            <form onSubmit={handleAddPartner} className="bg-white border border-teal-200 rounded-lg p-5 mb-5 space-y-3">
              <h3 className="font-bold text-gray-800 mb-2">Add Partner Manually</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text" required placeholder="Organization Name *"
                  value={partnerFormData.org_name}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, org_name: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="text" placeholder="Contact Full Name"
                  value={partnerFormData.full_name}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, full_name: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="url" placeholder="Website"
                  value={partnerFormData.website}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, website: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="email" required placeholder="Contact Email *"
                  value={partnerFormData.contact_email}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, contact_email: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
                <select
                  value={partnerFormData.category}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, category: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                >
                  {['Organization','Business Association','Nonprofit','Media','Government & Civic','Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Description (optional)"
                  value={partnerFormData.description}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, description: e.target.value })}
                  rows={2}
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                />
              </div>
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2 rounded-lg text-sm">
                Add as Approved
              </button>
            </form>
          )}

          <div className="space-y-3">
            {partners.length === 0 ? (
              <p className="text-teal-700 text-sm">No partner records yet.</p>
            ) : (
              partners.map(partner => (
                <div key={partner.id} className="bg-white border border-teal-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900">{partner.org_name}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          partner.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : partner.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {partner.status}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{partner.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{partner.contact_email}</p>
                      {partner.website && (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline">{partner.website}</a>
                      )}
                      {partner.description && (
                        <p className="text-sm text-gray-500 mt-1 italic">"{partner.description}"</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Submitted {new Date(partner.created_at).toLocaleDateString()}</p>
                    </div>
                    {partner.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handlePartnerAction(partner.id, 'approved')}
                          disabled={partnerActionLoading === partner.id}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold"
                        >
                          {partnerActionLoading === partner.id ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handlePartnerAction(partner.id, 'rejected')}
                          disabled={partnerActionLoading === partner.id}
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold"
                        >
                          {partnerActionLoading === partner.id ? '...' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Restaurants</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, state, zip code, or address..."
              className="flex-1 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
            >
              Search
            </button>
            {isSearching && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-3 rounded-lg font-bold"
              >
                Clear
              </button>
            )}
          </form>
          {isSearching && (
            <p className="text-sm text-gray-600 mt-3">
              Showing search results for: <strong>"{searchQuery}"</strong> ({listings.length} found)
            </p>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={formData.category_primary}
                  onChange={(e) => setFormData({...formData, category_primary: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Supermarket & Grocery">Supermarket & Grocery</option>
                  <option value="Bakery, Dessert & Cafe">Bakery, Dessert & Cafe</option>
                  <option value="Quick Bites & Turo-Turo">Quick Bites & Turo-Turo</option>
                  <option value="Food Truck & Pop-Up">Food Truck & Pop-Up</option>
                </select>

                <select
                  value={formData.category_secondary}
                  onChange={(e) => setFormData({...formData, category_secondary: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Secondary Category (Optional)</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Supermarket & Grocery">Supermarket & Grocery</option>
                  <option value="Bakery, Dessert & Cafe">Bakery, Dessert & Cafe</option>
                  <option value="Quick Bites & Turo-Turo">Quick Bites & Turo-Turo</option>
                  <option value="Food Truck & Pop-Up">Food Truck & Pop-Up</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Street Address *"
                required
                value={formData.address_street}
                onChange={(e) => setFormData({...formData, address_street: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City *"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="State (CA) *"
                  required
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Zip Code *"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="url"
                placeholder="Google Maps URL"
                value={formData.google_maps_url}
                onChange={(e) => setFormData({...formData, google_maps_url: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Google Rating (4.5)"
                  value={formData.google_rating}
                  onChange={(e) => setFormData({...formData, google_rating: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Review Count (123)"
                  value={formData.google_reviews_count}
                  onChange={(e) => setFormData({...formData, google_reviews_count: e.target.value})}
                  className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <textarea
                placeholder="Business Hours"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="Instagram URL"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                    className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="Facebook URL"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
                    className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="TikTok URL"
                    value={formData.tiktok_url}
                    onChange={(e) => setFormData({...formData, tiktok_url: e.target.value})}
                    className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="X (Twitter) URL"
                    value={formData.x_url}
                    onChange={(e) => setFormData({...formData, x_url: e.target.value})}
                    className="px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                >
                  {editingId ? 'Update Restaurant' : 'Add Restaurant'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-2xl font-bold">
              {isSearching ? `Search Results (${listings.length})` : `Recent Listings (${listings.length})`}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">City, State</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Rating</th>
                  <th className="px-6 py-3 text-right text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {isSearching ? 'No restaurants found matching your search.' : 'No restaurants found.'}
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{listing.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{listing.city}, {listing.state}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{listing.category_primary}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {listing.google_rating ? `★ ${listing.google_rating}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}