'use client'

import { useState } from 'react'

const CATEGORIES = [
  'Organization',
  'Business Association',
  'Nonprofit',
  'Media',
  'Government & Civic',
  'Other',
]

export default function PartnerForm() {
  const [formData, setFormData] = useState({
    org_name: '',
    website: '',
    contact_email: '',
    description: '',
    category: 'Organization',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const res = await fetch('/api/partner-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setStatus('success')
    } else {
      const data = await res.json().catch(() => ({}))
      setErrorMsg(data.error || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <p className="text-2xl mb-2">Salamat!</p>
        <p className="text-gray-700">We've received your inquiry. We'll be in touch within a few days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Organization Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.org_name}
          onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
          placeholder="e.g. Filipino American Historical Society"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourorg.org"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            placeholder="contact@yourorg.org"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Brief Description
          <span className="text-gray-400 font-normal ml-1">({150 - formData.description.length} chars remaining)</span>
        </label>
        <textarea
          rows={3}
          maxLength={150}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell us about your organization and how you serve the Filipino community..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
