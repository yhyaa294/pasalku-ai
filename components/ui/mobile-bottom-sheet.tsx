"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { X, ChevronUp } from 'lucide-react'

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
    auto: 'max-h-[70vh]',
    half: 'h-[50vh]',
    full: 'h-[90vh]'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        ref={sheetRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl',
          'transition-transform duration-300 ease-out',
          heightClasses[height],
          isDragging && 'transition-none'
        )}
        style={{
          transform: `translateY(${currentY}px)`
        }}
      >
        {/* Drag Handle */}
        {enableDrag && (
          <div
            className="flex justify-center py-4 cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        {(title || enableDrag) && (
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200 dark:border-slate-800">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </>
  )
}
