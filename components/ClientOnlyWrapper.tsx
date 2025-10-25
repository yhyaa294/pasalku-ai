'use client'

import { useState, useEffect, ReactNode, useCallback } from 'react'

interface ClientOnlyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  /** Optional delay before showing content (useful for preventing flash) */
  delay?: number
  /** Optional error boundary for client-side errors */
  onError?: (error: Error) => void
}

/**
 * Wrapper component to ensure children only render on client side
 * Prevents hydration mismatches for components that use browser APIs
 * 
 * @example
 * <ClientOnlyWrapper fallback={<Loading />}>
 *   <ComponentThatUsesBrowserAPIs />
 * </ClientOnlyWrapper>
 */
export function ClientOnlyWrapper({ 
  children, 
  fallback = null, 
  delay = 0,
  onError 
}: ClientOnlyWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const handleError = useCallback((error: Error) => {
    setHasError(true)
    onError?.(error)
    console.error('ClientOnlyWrapper error:', error)
  }, [onError])

  if (hasError) {
    return <div className="text-red-500 text-sm">Failed to load client content</div>
  }

  if (!hasMounted) {
    return <>{fallback}</>
  }

  try {
    return <>{children}</>
  } catch (error) {
    handleError(error as Error)
    return <div className="text-red-500 text-sm">Failed to render client content</div>
  }
}

/**
 * Hook to check if component has mounted on client
 * Useful for conditional rendering based on client-side state
 * 
 * @param delay Optional delay before returning true
 * @returns boolean indicating if component has mounted on client
 */
export function useClientOnly(delay = 0): boolean {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return hasMounted
}

/**
 * Hook for safely accessing browser APIs
 * Returns a function that only executes on client side
 */
export function useSafeBrowserAPI() {
  const isClient = useClientOnly()

  return useCallback(<T,>(fn: () => T, fallback?: T): T | undefined => {
    if (!isClient) return fallback

    try {
      return fn()
    } catch (error) {
      console.warn('Browser API access failed:', error)
      return fallback
    }
  }, [isClient])
}