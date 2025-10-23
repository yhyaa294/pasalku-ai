'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * ClientOnly Component
 * 
 * Mencegah hydration errors dengan memastikan children hanya di-render
 * setelah component mounted di client-side.
 * 
 * Gunakan untuk komponen yang:
 * - Mengakses window, document, localStorage
 * - Menggunakan browser APIs
 * - Memiliki animasi kompleks
 * - Third-party libraries yang tidak SSR-safe
 */

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
