'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [slug, setSlug] = useState(searchParams.get('slug') ?? '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    await fetch('/api/owner/send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, listingSlug: slug }),
    })
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
        <p className="text-gray-600 mb-6">
          We sent a secure access link valid for 24 hours. If your email matches your listing claim, it will arrive shortly.
        </p>
        <Link href="/" className="text-[#0038A8] hover:underline text-sm">← Back to homepage</Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🇵🇭</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Owner Login</h1>
        <p className="text-gray-500 text-sm">
          Log in to manage photos for your listing on FilipinoFoodNearMe.org
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Your Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@yourbusiness.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0038A8] outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must match the email used when you claimed this listing.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Listing URL Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().trim())}
            required
            placeholder="e.g. jollibee-alhambra-ca"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0038A8] outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Found in your listing URL: filipinofoodnearme.org/listings/<strong>your-slug-here</strong>
          </p>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#0038A8] hover:bg-[#002a80] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Send My Access Link'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Don&apos;t have a claimed listing yet?{' '}
        <Link href="/add-business" className="text-[#0038A8] hover:underline">Claim your listing →</Link>
      </p>
    </>
  )
}

export default function OwnerLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <Suspense fallback={<div className="text-center text-gray-400">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
