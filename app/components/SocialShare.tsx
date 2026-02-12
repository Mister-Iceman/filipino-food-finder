'use client'

import { useState } from 'react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || '')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl
  const twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodedUrl + '&text=' + encodedTitle
  const whatsappUrl = 'https://wa.me/?text=' + encodedTitle + '%20' + encodedUrl
  const emailUrl = 'mailto:?subject=' + encodedTitle + '&body=' + encodedDescription + '%0A%0A' + encodedUrl

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Share This Restaurant</h3>
      <p className="text-sm text-gray-600 mb-4">Help others discover great Filipino food!</p>
      
      <div className="flex flex-wrap gap-3">
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
          Facebook
        </a>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium">
          Twitter
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
          WhatsApp
        </a>
        <a href={emailUrl} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium">
          Email
        </a>
        <button onClick={handleCopyLink} className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium">
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}