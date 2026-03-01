'use client'

import { useState } from 'react'

interface Props {
  listingId: number
  listingName: string
}

export default function ClaimForm({ listingId, listingName }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    claimant_name: '',
    claimant_email: '',
    claimant_phone: '',
    claimant_message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/claim-listing/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          listing_name: listingName,
          ...form,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit claim.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-6 bg-green-50 border border-green-300 rounded-xl p-5">
        <p className="font-semibold text-green-800 mb-1">Claim submitted!</p>
        <p className="text-green-700 text-sm">
          We've received your claim for <strong>{listingName}</strong> and will review it within 2–3 business days. Check your email for a confirmation.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-4 py-2 rounded-full transition"
        >
          🏪 Is this your business? Claim it
        </button>
      ) : (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Claim this Business</h3>
              <p className="text-sm text-gray-600 mt-0.5">
                Are you the owner or manager of <strong>{listingName}</strong>? Submit a claim and we'll verify within 2–3 business days.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.claimant_name}
                  onChange={e => set('claimant_name', e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.claimant_email}
                  onChange={e => set('claimant_email', e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="you@yourbusiness.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.claimant_phone}
                onChange={e => set('claimant_phone', e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="(555) 555-5555"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                How can you verify ownership? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.claimant_message}
                onChange={e => set('claimant_message', e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                placeholder="e.g. I'm the owner. My business license and Google Business profile can verify this."
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded-lg text-sm"
              >
                {loading ? 'Submitting...' : 'Submit Claim'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium px-5 py-2 rounded-lg border border-gray-300 hover:border-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
