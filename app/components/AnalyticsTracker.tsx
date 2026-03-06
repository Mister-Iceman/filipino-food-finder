'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '../../hooks/useAnalytics'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)

  useEffect(() => {
    // Skip admin pages
    if (pathname.startsWith('/admin')) return
    // Skip if same path (e.g. initial double-render)
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname
    trackPageView()
  }, [pathname])

  return null
}
