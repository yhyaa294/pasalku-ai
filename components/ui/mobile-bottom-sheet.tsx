"use client"

import { useState, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import styles from './mobile-bottom-sheet.module.css'

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  height?: 'auto' | 'half' | 'full'
  enableDrag?: boolean
}

export default function MobileBottomSheet({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  enableDrag = true
}: MobileBottomSheetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!enableDrag) return
    
    setIsDragging(true)
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStartY(clientY)
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !enableDrag) return
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const deltaY = clientY - dragStartY
    
    if (deltaY > 0) {
      setCurrentY(deltaY)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging || !enableDrag) return
    
    setIsDragging(false)
    
    // Close if dragged more than 100px
    if (currentY > 100) {
      onClose()
    }
    
    setCurrentY(0)
  }

  const heightClasses = {
    auto: styles.heightAuto,
    half: styles.heightHalf,
    full: styles.heightFull
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={styles.backdrop}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        ref={sheetRef}
        className={cn(
          styles.sheetContainer,
          'dark:bg-slate-900 bg-white',
          heightClasses[height],
          isDragging && styles.noTransition
        )}
        style={{
          '--sheet-translate': `${currentY}px`
        } as CSSProperties}
      >
        {/* Drag Handle */}
        {enableDrag && (
          <div
            className={cn(
              styles.dragHandle,
              isDragging && styles.dragHandleActive
            )}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className={cn(styles.dragHandleBar, 'dark:bg-gray-600')} />
          </div>
        )}

        {/* Header */}
        {(title || enableDrag) && (
          <div className={cn(styles.header, 'dark:border-slate-800')}>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={cn(styles.closeButton, 'dark:hover:bg-slate-800')}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  )
}
