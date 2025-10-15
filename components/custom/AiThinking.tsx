'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

interface AiThinkingProps {
  message?: string
  showProgress?: boolean
  steps?: string[]
  currentStep?: number
}

export const AiThinking: React.FC<AiThinkingProps> = ({
  message = 'AI sedang menganalisis...',
  showProgress = false,
  steps = [],
  currentStep = 0
}) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
      {/* Animated AI Icon */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="flex-shrink-0"
      >
        <div className="relative">
          <Brain className="w-6 h-6 text-blue-600" />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut'
            }}
            className="absolute inset-0"
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
        </div>
      </motion.div>

      <div className="flex-1 space-y-2">
        {/* Main message */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{message}</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress steps */}
        {showProgress && steps.length > 0 && (
          <div className="space-y-1.5">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  index < currentStep ? 'bg-green-500' :
                  index === currentStep ? 'bg-blue-500 animate-pulse' :
                  'bg-gray-300'
                }`} />
                <span className={`text-xs ${
                  index <= currentStep ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
