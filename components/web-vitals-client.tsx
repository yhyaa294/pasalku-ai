'use client'

import { useEffect } from 'react'

// Lightweight Web Vitals logger without external deps (focus on LCP/FCP/CLS)
export function WebVitalsClient() {
  useEffect(() => {
    const isSupported = typeof PerformanceObserver !== 'undefined'

    // FCP
    if (isSupported && 'PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as PerformanceEntry[]) {
            if (entry.name === 'first-contentful-paint') {
              console.log('[WebVitals] FCP:', Math.round(entry.startTime), 'ms')
              fcpObserver.disconnect()
              break
            }
          }
        })
        fcpObserver.observe({ type: 'paint', buffered: true } as any)
      } catch {}
    }

    // LCP
    let latestLCP = 0
    let lcpObserver: PerformanceObserver | null = null
    if (isSupported) {
      try {
        lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries() as any[]
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            latestLCP = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime || 0
          }
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true } as any)
      } catch {}
    }

    const finalizeLCP = () => {
      if (latestLCP) {
        console.log('[WebVitals] LCP:', Math.round(latestLCP), 'ms')
      }
      if (lcpObserver) lcpObserver.disconnect()
    }

    // CLS (rough estimate)
    let clsValue = 0
    let sessionValue = 0
    let sessionStartTime = 0
    let clsObserver: PerformanceObserver | null = null
    if (isSupported) {
      try {
        clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              const firstSession = entry.startTime - sessionStartTime > 1000 || sessionValue > 0
              if (firstSession) {
                sessionStartTime = entry.startTime
                sessionValue = 0
              }
              sessionValue += entry.value
              clsValue = Math.max(clsValue, sessionValue)
            }
          }
        })
        clsObserver.observe({ type: 'layout-shift', buffered: true } as any)
      } catch {}
    }

    const finalizeCLS = () => {
      if (clsObserver) clsObserver.disconnect()
      if (clsValue) console.log('[WebVitals] CLS:', Number(clsValue.toFixed(3)))
    }

    // Finalize on page hide or visibility change
    const onHidden = (event: Event) => {
      if ((event as any).type === 'pagehide' || document.visibilityState === 'hidden') {
        finalizeLCP()
        finalizeCLS()
        window.removeEventListener('pagehide', onHidden)
        document.removeEventListener('visibilitychange', onHidden)
      }
    }

    window.addEventListener('pagehide', onHidden)
    document.addEventListener('visibilitychange', onHidden)

    // TTFB approximation via navigation timing (mainly for SSR responses)
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (nav) {
        const ttfb = nav.responseStart - nav.requestStart
        console.log('[WebVitals] TTFB:', Math.round(ttfb), 'ms')
      }
    } catch {}

    return () => {
      window.removeEventListener('pagehide', onHidden)
      document.removeEventListener('visibilitychange', onHidden)
      if (lcpObserver) lcpObserver.disconnect()
      if (clsObserver) clsObserver.disconnect()
    }
  }, [])

  return null
}
