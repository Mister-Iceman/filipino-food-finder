'use client'

import { useState } from 'react'

interface PhoneRevealProps {
  phone: string
  className?: string
}

export default function PhoneReveal({ phone, className }: PhoneRevealProps) {
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
      }}
      className={className}
      aria-label="Click to reveal phone number"
    >
      📞 Click to reveal
    </button>
  )
}
