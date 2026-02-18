'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    const res = await fetch('/api/newsletter-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setStatus('success')
      setEmail('')
    } else {
      setStatus('error')
    }
  }

  return (
    <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #62438D 0%, #92345A 50%, #BF2F26 100%)' }}>
      <div className="max-w-2xl mx-auto text-center text-white">
        <div className="text-4xl mb-4">🇵🇭</div>
        <h2 className="text-3xl font-bold mb-3">
          Stay in the Loop, Kababayan
        </h2>
        <p className="text-lg text-white/80 mb-8">
          New spots, upcoming events, and Filipino food stories—delivered to your inbox. 
          Help us build this community, one craving at a time.
        </p>

        {status === 'success' ? (
          <div className="bg-white/20 backdrop-blur rounded-xl px-8 py-6 inline-block">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-xl font-bold">Salamat! You're in.</p>
            <p className="text-white/80 text-sm mt-1">Watch your inbox for Filipino food finds.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-lg transition-all disabled:opacity-60 whitespace-nowrap"
            >
              {status === 'loading' ? 'Joining...' : 'Join the Community'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-red-200 text-sm">Something went wrong. Please try again.</p>
        )}

        <p className="mt-4 text-white/50 text-xs">
          No spam. Unsubscribe anytime. We respect your inbox.
        </p>
      </div>
    </section>
  )
}