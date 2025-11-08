"use client"

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MobileOptimizedCardProps {
  children: React.ReactNode
  className?: string
  onTap?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  enableHaptic?: boolean
}

export default function MobileOptimizedCard({
  children,
  className = "",
  onTap,
  onSwipeLeft,
  onSwipeRight,
  enableHaptic = true
}: MobileOptimizedCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const touchStart = useRef({ x: 0, y: 0 })
  const touchEnd = useRef({ x: 0, y: 0 })

  // Haptic feedback helper
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptic || !window.navigator) return
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      }
      navigator.vibrate(patterns[type])
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }
    setIsPressed(true)
    triggerHaptic('light')
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }

    const deltaX = touchEnd.current.x - touchStart.current.x
    const deltaY = touchEnd.current.y - touchStart.current.y

    // Detect swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left')
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
    
    const deltaX = touchEnd.current.x - touchStart.current.x
    const deltaY = touchEnd.current.y - touchStart.current.y

    // Check for tap (small movement)
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      onTap?.()
      triggerHaptic('medium')
    }
    // Check for swipe
    else if (Math.abs(deltaX) > 80 && Math.abs(deltaY) < 50) {
      if (deltaX > 0) {
        onSwipeRight?.()
        triggerHaptic('heavy')
      } else {
        onSwipeLeft?.()
        triggerHaptic('heavy')
      }
    }

    // Reset swipe direction
    setTimeout(() => setSwipeDirection(null), 300)
  }

  return (
    <Card
      className={cn(
        // Mobile-optimized base styles
        'relative overflow-hidden',
        'touch-manipulation', // Optimize for touch
        'select-none', // Prevent text selection on mobile
        'transition-all duration-200 ease-out',
        
        // Press state
        isPressed && 'scale-[0.98] shadow-lg',
        
        // Swipe indicators
        swipeDirection === 'left' && 'border-l-4 border-l-red-500 -translate-x-2',
        swipeDirection === 'right' && 'border-r-4 border-r-green-500 translate-x-2',
        
        // Mobile-specific sizing
        'w-full max-w-sm mx-auto sm:max-w-md',
        'min-h-[120px] sm:min-h-[140px]',
        
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe hint overlay */}
      {swipeDirection && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200',
          swipeDirection === 'left' ? 'bg-red-500/10' : 'bg-green-500/10'
        )}>
          <div className={cn(
            'text-2xl font-bold',
            swipeDirection === 'left' ? 'text-red-500' : 'text-green-500'
          )}>
            {swipeDirection === 'left' ? '← Swipe' : 'Swipe →'}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        'transition-opacity duration-200',
        swipeDirection && 'opacity-30'
      )}>
        {children}
      </div>

      {/* Mobile touch feedback indicator */}
      {isPressed && (
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      )}
    </Card>
  )
}
