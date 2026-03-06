'use client'

import { useEffect, useRef } from 'react'
import { trackArticleRead } from '../../hooks/useAnalytics'

export default function ArticleReadTracker({ articleSlug }: { articleSlug: string }) {
  const firedRef = useRef(false)

  useEffect(() => {
    firedRef.current = false

    const handleScroll = () => {
      if (firedRef.current) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const depth = Math.round((scrollTop / docHeight) * 100)
        if (depth >= 80) {
          firedRef.current = true
          trackArticleRead(articleSlug, depth)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [articleSlug])

  return null
}
