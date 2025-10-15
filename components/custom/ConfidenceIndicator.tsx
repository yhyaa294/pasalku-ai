'use client'

import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ConfidenceIndicatorProps {
  confidence: number // 0-100
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  showLabel = true,
  size = 'md'
}) => {
  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return { label: 'Sangat Tinggi', color: 'text-green-600', bgColor: 'bg-green-500' }
    if (score >= 75) return { label: 'Tinggi', color: 'text-blue-600', bgColor: 'bg-blue-500' }
    if (score >= 60) return { label: 'Sedang', color: 'text-yellow-600', bgColor: 'bg-yellow-500' }
    return { label: 'Rendah', color: 'text-orange-600', bgColor: 'bg-orange-500' }
  }

  const level = getConfidenceLevel(confidence)
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-medium text-gray-700 ${sizeClasses[size]}`}>
              Tingkat Keyakinan AI
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Tingkat keyakinan AI menunjukkan seberapa yakin sistem dengan jawaban yang diberikan
                    berdasarkan data hukum yang tersedia. Semakin tinggi skornya, semakin akurat jawabannya.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`font-bold ${level.color} ${sizeClasses[size]}`}>
              {confidence}%
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${level.color} bg-opacity-10`}>
              {level.label}
            </span>
          </div>
        </div>
      )}

      <div className="relative">
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
          <motion.div
            className={`${level.bgColor} ${heightClasses[size]} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        
        {/* Gradient overlay for visual appeal */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent ${heightClasses[size]} rounded-full pointer-events-none`} />
      </div>
    </div>
  )
}
