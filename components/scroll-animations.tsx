'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Optional: unobserve after first trigger
          // observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '50px', // Trigger 50px before element comes into view
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}

// Scroll Progress Bar Component
export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const updateScrollProgress = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      
      const scrollPx = document.documentElement.scrollTop
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0

      setScrollProgress(scrolled)
    }

    if (typeof window !== 'undefined') {
      updateScrollProgress() // Initial call
      window.addEventListener('scroll', updateScrollProgress, { passive: true })
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', updateScrollProgress)
      }
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${scrollProgress / 100})` }}
    />
  )
}

// Parallax Container Component
export function ParallaxContainer({
  children,
  speed = 0.5,
  className = '',
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const [offset, setOffset] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    
    const handleScroll = () => {
      if (!ref.current || typeof window === 'undefined') return

      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const elementTop = rect.top + scrolled

      // Only apply parallax when element is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const parallax = (scrolled - elementTop) * speed
        setOffset(parallax)
      }
    }

    if (typeof window !== 'undefined') {
      handleScroll() // Initial call
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [speed])

  if (!isMounted) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={className}>
      <div style={{ transform: `translateY(${offset}px)` }}>
        {children}
      </div>
    </div>
  )
}

// Animated Section Wrapper
export function AnimatedSection({
  children,
  animation = 'fade-in-up',
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  animation?: 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'fade-in-scale' | 'blur-fade-in'
  className?: string
  delay?: number
}) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animation : 'opacity-0'}`}
      style={{
        animationDelay: `${delay}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
