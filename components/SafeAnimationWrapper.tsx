'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SafeAnimationWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  delay?: number
}

/**
 * Wrapper for Framer Motion animations that prevents hydration mismatches
 * Only renders animations after client-side hydration is complete
 */
export function SafeAnimationWrapper({ 
  children, 
  fallback = null, 
  delay = 100 
}: SafeAnimationWrapperProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Small delay to ensure DOM is fully hydrated
    const timer = setTimeout(() => {
      setIsReady(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!isReady) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Safe Motion component that only animates after hydration
 */
export function SafeMotion({ 
  children, 
  className = '',
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.3 },
  ...props 
}: any) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return <div className={className} {...props}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  )
}