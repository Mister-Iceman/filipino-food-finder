'use client'

import { useState } from 'react'
import SocialLinks from './SocialLinks.jsx'

function FooterNewsletterBar() {
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
    setStatus(res.ok ? 'success' : 'error')
    if (res.ok) setEmail('')
  }

  return (
    <div className="bg-gray-800 border-b border-gray-700 py-5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-white font-semibold text-sm flex items-center gap-1"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1f5-1f1ed.svg" alt="Philippine flag" className="w-4 h-4 inline-block" /> Get Filipino food finds in your inbox</p>
          <p className="text-gray-400 text-xs mt-0.5">New spots, events & stories. No spam, ever.</p>
        </div>
        {status === 'success' ? (
          <p className="text-green-400 text-sm font-semibold">✅ Salamat! You're subscribed.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 sm:w-56 px-4 py-2 rounded-lg text-gray-900 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-60 whitespace-nowrap"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="text-red-400 text-xs">Something went wrong. Try again.</p>}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer role="contentinfo">
      <FooterNewsletterBar />

      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">

            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4">About</h3>
              <ul className="space-y-2 list-none">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Support Us</a></li>
                <li><a href="/add-business" className="text-gray-400 hover:text-white transition-colors">Add Your Business</a></li>
                <li><a href="/newsroom" className="text-gray-400 hover:text-purple-300 transition-colors">Newsroom</a></li>
                <li><a href="/newsroom" className="text-gray-400 hover:text-purple-300 transition-colors">Press</a></li>
              </ul>
            </div>

            {/* Directory */}
            <div>
              <h3 className="text-lg font-bold mb-4">Directory</h3>
              <ul className="space-y-2 list-none">
                <li><a href="/directory" className="text-gray-400 hover:text-white transition-colors">Browse All</a></li>
                <li><a href="/directory?category=Restaurant" className="text-gray-400 hover:text-white transition-colors">Restaurants</a></li>
                <li><a href="/directory?category=Supermarket%20%26%20Grocery" className="text-gray-400 hover:text-white transition-colors">Grocery Stores</a></li>
                <li><a href="/directory?category=Bakery%2C%20Dessert%20%26%20Cafe" className="text-gray-400 hover:text-white transition-colors">Bakeries & Cafes</a></li>
                <li><a href="/states" className="text-gray-400 hover:text-white transition-colors">Browse by State</a></li>
                <li><a href="/events" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h3 className="text-lg font-bold mb-4">Learn</h3>
              <ul className="space-y-2 list-none">
                <li><a href="/cultural-knowledge-base" className="text-gray-400 hover:text-purple-300 transition-colors">Cultural Knowledge Base</a></li>
                <li><a href="/guides" className="text-gray-400 hover:text-purple-300 transition-colors">City Guides</a></li>
                <li><a href="/cultural-knowledge-base/10-filipino-dishes-every-food-lover-should-try" className="text-gray-400 hover:text-purple-300 transition-colors">10 Dishes to Try</a></li>
                <li><a href="/newsroom" className="text-gray-400 hover:text-purple-300 transition-colors">Latest News</a></li>
                <li><a href="/community-partners" className="text-gray-400 hover:text-purple-300 transition-colors">Community Partners</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2 list-none">
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/accessibility" className="text-gray-400 hover:text-white transition-colors">Accessibility</a></li>
                <li><a href="/affiliate-disclosure" className="text-gray-400 hover:text-white transition-colors">Affiliate Disclosure</a></li>
              </ul>
            </div>

            {/* For Business Owners */}
            <div>
              <h3 className="text-lg font-bold mb-4">For Business Owners</h3>
              <ul className="space-y-2 list-none">
                <li><a href="/why-list-with-us" className="text-gray-400 hover:text-white transition-colors">Why List With Us</a></li>
                <li><a href="/add-business" className="text-gray-400 hover:text-white transition-colors">Add Your Business</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Claim a Listing</a></li>
                <li><a href="/advertise" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">Advertise With Us ↗</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-lg font-bold mb-4">Connect</h3>
              <p className="text-gray-400 mb-4">The first and only community Filipino food directory in America</p>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1f5-1f1ed.svg" alt="Philippine flag" className="w-8 h-8" />
                <span className="text-gray-300 font-medium">Filipino Food Near Me</span>
              </div>
              <a
                href="mailto:info@filipinofoodnearme.org"
                className="text-gray-400 hover:text-white transition-colors block mb-4"
              >
                info@filipinofoodnearme.org
              </a>
              <div className="mb-4">
                <SocialLinks />
              </div>
              <div className="mt-4">
                <a href="https://buymeacoffee.com/filipinofoodnearme" target="_blank" rel="noopener noreferrer" className="inline-block">
                  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" className="h-10 hover:scale-105 transition-transform" />
                </a>
              </div>
            </div>

          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">© 2026 Filipino Food Near Me. All rights reserved.</p>
              </div>
              <p className="text-gray-500 text-xs text-center md:text-right max-w-md">
                <strong>Disclaimer:</strong> Information may not be current. Ratings reflect community-sourced data. Contact businesses directly to verify details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
