'use client'

import { useState } from 'react'
import { trackLeadAction } from '../../hooks/useAnalytics'

interface PhoneRevealProps {
  phone: string
  className?: string
  listingId?: string | number
}

export default function PhoneReveal({ phone, className, listingId }: PhoneRevealProps) {
  const [revealed, setRevealed] = useState(false)

  if (revealed) {
    return (
      <a
        href={`tel:${phone}`}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        📞 {phone}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        setRevealed(true)
        try {
          if (listingId != null) trackLeadAction('phone_click', listingId)
        } catch { /* fail silently */ }
      }}
      className={className}
      aria-label="Click to reveal phone number"
    >
      📞 Click to reveal
    </button>
  )
}
