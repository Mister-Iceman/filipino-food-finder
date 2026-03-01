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
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
        <p className="font-bold text-green-800 text-base mb-4">
          ✅ Your claim has been submitted!
        </p>
        <p className="text-sm text-gray-600 mb-4">Here's what happens next:</p>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: '#62438D' }}>1</span>
            <p className="text-sm text-gray-700">We'll review your claim within <strong>2–3 business days</strong>.</p>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: '#62438D' }}>2</span>
            <div className="text-sm text-gray-700">
              <p className="mb-2">To verify ownership, please email us at <strong>info@filipinofoodnearme.org</strong> from your business email address with one of the following:</p>
              <ul className="space-y-1.5 pl-4">
                <li className="flex gap-2"><span className="text-gray-400">•</span><span>A screenshot of your <strong>Google Business Profile dashboard</strong> (not the public page — the backend dashboard that shows you're the verified owner), <em>OR</em></span></li>
                <li className="flex gap-2"><span className="text-gray-400">•</span><span>A photo of your business with your <strong>name tag or business card</strong> visible</span></li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: '#62438D' }}>3</span>
            <p className="text-sm text-gray-700">Once verified, we'll approve your claim and you'll receive a <strong>confirmation email</strong>.</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-5 pt-4 border-t border-green-200">
          Questions? Email <strong>info@filipinofoodnearme.org</strong>
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
