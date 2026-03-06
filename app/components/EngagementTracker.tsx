'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEngagement, trackImpression } from '../../hooks/useAnalytics'

export default function EngagementTracker() {
  const pathname = usePathname()

  const startTimeRef = useRef(Date.now())
  const activeTimeRef = useRef(0)
  const lastActiveRef = useRef(Date.now())
  const isIdleRef = useRef(false)
  const maxScrollRef = useRef(0)
  const firedRef = useRef(false)
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Stable ref so visibilitychange always calls the latest fireEngagement
  const fireEngagementCB = useRef<() => void>(() => {})

  // Single visibilitychange listener mounted once
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') fireEngagementCB.current()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/admin')) return

    // Reset for new page
    startTimeRef.current = Date.now()
    activeTimeRef.current = 0
    lastActiveRef.current = Date.now()
    isIdleRef.current = false
    maxScrollRef.current = 0
    firedRef.current = false

    const markActivity = () => {
      const now = Date.now()
      if (!isIdleRef.current) {
        activeTimeRef.current += (now - lastActiveRef.current) / 1000
      }
      lastActiveRef.current = now
      isIdleRef.current = false
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current)
      activityTimerRef.current = setTimeout(() => {
        isIdleRef.current = true
      }, 30000)
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const depth = Math.round((scrollTop / docHeight) * 100)
        maxScrollRef.current = Math.max(maxScrollRef.current, depth)
      }
      markActivity()
    }

    const fireEngagement = () => {
      if (firedRef.current) return
      firedRef.current = true
      try {
        const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000)
        trackEngagement(
          pathname,
          Math.min(Math.max(maxScrollRef.current, 0), 100),
          Math.max(0, Math.round(activeTimeRef.current)),
          totalTime
        )
      } catch { /* fail silently */ }
    }

    fireEngagementCB.current = fireEngagement

    // IntersectionObserver for data-section impressions
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = (entry.target as HTMLElement).dataset.section
            if (section) {
              trackImpression(section, pathname)
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold: 0.25 }
    )

    // Delay observe to ensure DOM is settled
    const observeTimer = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el))
    }, 400)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', markActivity, { passive: true })
    window.addEventListener('keydown', markActivity, { passive: true })
    window.addEventListener('touchstart', markActivity, { passive: true })
    window.addEventListener('beforeunload', fireEngagement)

    return () => {
      fireEngagement()
      clearTimeout(observeTimer)
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current)
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', markActivity)
      window.removeEventListener('keydown', markActivity)
      window.removeEventListener('touchstart', markActivity)
      window.removeEventListener('beforeunload', fireEngagement)
    }
  }, [pathname])

  return null
}
