"use client"

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import styles from './magic-button.module.css'

interface MagicButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'glow' | 'shimmer' | 'pulse'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  disabled?: boolean
  loading?: boolean
}

export default function MagicButton({
  children,
  onClick,
  variant = 'glow',
  size = 'md',
  className = "",
  disabled = false,
  loading = false
}: MagicButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    buttonRef.current?.style.setProperty('--glow-x', `${x}px`)
    buttonRef.current?.style.setProperty('--glow-y', `${y}px`)
  }

  const resetGlowPosition = () => {
    buttonRef.current?.style.removeProperty('--glow-x')
    buttonRef.current?.style.removeProperty('--glow-y')
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-6 text-xl'
  }

  const variantClasses = {
    default: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
    glow: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-300',
    shimmer: 'relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600',
    pulse: 'bg-gradient-to-r from-purple-600 to-blue-600 animate-pulse hover:animate-none'
  }

  return (
    <Button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        resetGlowPosition()
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Shimmer Effect */}
      {variant === 'shimmer' && (
        <div className={styles.shimmerEffect} />
      )}

      {/* Glow Follow Mouse */}
      {variant === 'glow' && isHovering && (
        <div className={styles.glowEffect} />
      )}

      {/* Ripple Effect */}
      {isHovering && (
        <div className={styles.rippleEffect} />
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
        </div>
      )}

      <span className={cn(styles.contentWrapper, loading && styles.hiddenContent)}>
        {children}
      </span>
    </Button>
  )
}
