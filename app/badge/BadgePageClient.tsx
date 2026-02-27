'use client'

import { useState } from 'react'
import Link from 'next/link'

const EMBED_CODE = `<a href="https://filipinofoodnearme.org" target="_blank" rel="noopener noreferrer">
  <img src="https://filipinofoodnearme.org/badges/proudly-listed.svg"
       alt="Proudly Listed on FilipinoFoodNearMe.org"
       width="200" height="60">
</a>`

export default function BadgePageClient() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(EMBED_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Community Badge</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Community Badge</h1>
            <p className="text-gray-600 leading-relaxed">
              Display this badge on your website to let customers know you're part of the
              FilipinoFoodNearMe.org community — the first Filipino food directory in America.
            </p>
          </div>

          {/* Badge preview */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Preview</p>
            <div className="flex items-center justify-center bg-gray-100 rounded-xl py-10">
              <a
                href="https://filipinofoodnearme.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/badges/proudly-listed.svg"
                  alt="Proudly Listed on FilipinoFoodNearMe.org"
                  width={200}
                  height={60}
                  style={{ display: 'block' }}
                />
              </a>
            </div>
          </div>

          {/* Embed code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Embed Code</p>
              <button
                onClick={handleCopy}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-gray-950 text-gray-200 text-xs leading-relaxed rounded-xl p-5 overflow-x-auto whitespace-pre-wrap break-all select-all">
              {EMBED_CODE}
            </pre>
            <p className="text-xs text-gray-400 mt-2">
              Paste this snippet anywhere in your website's HTML.
            </p>
          </div>

          {/* Instructions */}
          <div className="border-t border-gray-100 pt-8 space-y-3 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">How to add the badge</p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Copy the embed code above.</li>
              <li>Paste it into your website's footer, sidebar, or "About" page.</li>
              <li>The badge will always display the latest design — no updates needed.</li>
            </ol>
          </div>

          {/* Not listed CTA */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 text-center">
            <p className="text-sm text-purple-900 font-semibold mb-1">Not listed yet?</p>
            <p className="text-sm text-purple-700 mb-4">Add your business to the directory for free.</p>
            <Link
              href="/add-business"
              className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Add Your Business
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
