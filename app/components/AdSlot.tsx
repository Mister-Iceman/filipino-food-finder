'use client'

import { useEffect } from 'react'

interface AdSlotProps {
  slot: string // Ad slot ID (you'll get these from AdSense)
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean
  className?: string
}

export default function AdSlot({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = '' 
}: AdSlotProps) {
  // Set this to true when you get AdSense approval
  const ADSENSE_ENABLED = false

  const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? ''

  useEffect(() => {
    if (ADSENSE_ENABLED && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }
  }, [])

  // Don't render anything if AdSense is not enabled yet
  if (!ADSENSE_ENABLED) {
    return null
  }

  return (
    <div className={`ad-slot ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}