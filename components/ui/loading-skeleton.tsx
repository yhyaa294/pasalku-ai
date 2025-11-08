"use client"

import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'default' | 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

export default function LoadingSkeleton({ 
  className = "", 
  variant = 'default',
  width,
  height,
  lines = 1
}: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
  
  const variantClasses = {
    default: "rounded-lg",
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-md"
  }

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '2rem')
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses.text)}
            style={{
              width: i === lines - 1 ? '70%' : '100%',
              height: '1rem'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  )
}
