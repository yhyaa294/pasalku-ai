import { useEffect, useRef, useCallback } from 'react'

interface MousePosition {
  x: number
  y: number
}

export const useMouseParallax = (isEnabled: boolean = true) => {
  const rafRef = useRef<number | null>(null)
  const lastEventRef = useRef<MousePosition | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isEnabled) return
    
    lastEventRef.current = { x: e.clientX, y: e.clientY }
    
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const evt = lastEventRef.current
        if (evt && sectionRef.current) {
          try {
            const tx1 = evt.x * 0.02
            const ty1 = evt.y * 0.02
            const tx2 = -evt.x * 0.02
            const ty2 = -evt.y * 0.02
            
            sectionRef.current.style.setProperty('--orb1-x', tx1 + 'px')
            sectionRef.current.style.setProperty('--orb1-y', ty1 + 'px')
            sectionRef.current.style.setProperty('--orb2-x', tx2 + 'px')
            sectionRef.current.style.setProperty('--orb2-y', ty2 + 'px')
          } catch (error) {
            // Silently handle CSS errors
          }
        }
      })
    }
  }, [isEnabled])

  useEffect(() => {
    let supportsFinePointer = false
    
    if (typeof window !== 'undefined') {
      try {
        supportsFinePointer = window.matchMedia?.('(pointer: fine)')?.matches || false
      } catch (e) {
        supportsFinePointer = false
      }
      
      // Initialize CSS variables safely
      const el = sectionRef.current
      if (el && typeof document !== 'undefined') {
        try {
          el.style.setProperty('--orb1-x', '0px')
          el.style.setProperty('--orb1-y', '0px')
          el.style.setProperty('--orb2-x', '0px')
          el.style.setProperty('--orb2-y', '0px')
        } catch (error) {
          // Silently handle CSS variable errors
        }
      }

      if (supportsFinePointer && isEnabled) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove)
      }
  