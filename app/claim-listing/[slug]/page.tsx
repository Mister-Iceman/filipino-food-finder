'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ClaimListingPage() {
  const params = useParams()
  const slug = params.slug as string

  const [listingId, setListingId] = useState('')
  const [listingName, setListingName] = useState('')
  const [listingCity, setListingCity] = useState('')
  const [listingState, setListingState] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerRole, setOwnerRole] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [loaded, setLoaded] = useState(false)

  // Load listing info on mount
  useState(() => {
    if (!slug || loaded) return
    setLoaded(true)
    fetch(`/api/listing-info?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setListingId(data.id)
          setListingName(data.name)
          setListingCity(data.city)
          setListingState(data.state)
        }
      })
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const res = await fetch('/api/claim-listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listingId,
        listing_name: listingName,
        listing_city: listingCity,
        listing_state: listingState,
        owner_name: ownerName,
        owner_role: ownerRole,
        owner_email: ownerEmail,
        message,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMsg(data.error || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-12 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🇵🇭</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Salamat! Claim Submitted</h1>
          <p className="text-gray-600 mb-2">
            We received your claim for <strong>{listingName}</strong>.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Our team will review it within 2–3 business days. You'll get a confirmation email at <strong>{ownerEmail}</strong>.
          </p>
          <Link href={`/listings/${slug}`} className="text-blue-600 hover:underline text-sm">
            ← Back to listing
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:underline hover:text-blue-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/listings/${slug}`} className="hover:underline hover:text-blue-600">
            {listingName || 'Listing'}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">Claim This Business</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏪</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim This Business</h1>
            {listingName && (
              <p className="text-blue-600 font-semibold">{listingName}</p>
            )}
            {listingCity && (
              <p className="text-gray-500 text-sm">{listingCity}, {listingState}</p>
            )}
          </div>

          {/* What you get */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
            <p className="font-semibold text-purple-900 text-sm mb-2">What you get as a Community Member:</p>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>✅ "Community Member" badge on your listing</li>
              <li>✅ Ability to request info updates via email</li>
              <li>✅ Early access to future business features</li>
              <li>✅ Listed in our verified business community</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                required
                placeholder="e.g. Maria Santos"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Role at This Business <span className="text-red-500">*</span>
              </label>
              <select
                value={ownerRole}
                onChange={e => setOwnerRole(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Select your role...</option>
                <option value="Owner">Owner</option>
                <option value="Co-Owner">Co-Owner</option>
                <option value="Manager">Manager</option>
                <option value="Authorized Representative">Authorized Representative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Business Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={ownerEmail}
                onChange={e => setOwnerEmail(e.target.value)}
                required
                placeholder="you@yourbusiness.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Preferably your business email. Personal email is also accepted.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Anything to add? (optional)
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="e.g. I've owned this restaurant since 2018. Our website is..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-60"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Claim Request'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you confirm you are an authorized representative of this business. 
              Claiming only verifies contact access — not legal business status.
              Claims are reviewed within 2–3 business days.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
