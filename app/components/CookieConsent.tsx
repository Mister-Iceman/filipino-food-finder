'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShowBanner(false)
    // Here you would initialize analytics/tracking
    console.log('Cookies accepted - Analytics would start here')
  }

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setShowBanner(false)
    console.log('Cookies declined - No tracking')
  }

  if (!showBanner) return null

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-6 shadow-2xl z-50 border-t-4 border-yellow-500"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">🍪 We Value Your Privacy</h3>
            <p className="text-gray-300 text-sm">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies. 
              <a href="/privacy" className="text-yellow-400 hover:text-yellow-300 underline ml-1">
                Learn more
              </a>
            </p>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              aria-label="Decline cookies"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-lg font-bold transition-all hover:scale-105"
              aria-label="Accept cookies"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}