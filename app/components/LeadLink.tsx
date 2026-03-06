'use client'

import { trackLeadAction } from '../../hooks/useAnalytics'

interface LeadLinkProps {
  href: string
  leadType: string
  listingId: string | number | null
  className?: string
  children: React.ReactNode
}

export default function LeadLink({ href, leadType, listingId, className, children }: LeadLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        try {
          trackLeadAction(leadType, listingId)
        } catch { /* fail silently */ }
      }}
    >
      {children}
    </a>
  )
}
