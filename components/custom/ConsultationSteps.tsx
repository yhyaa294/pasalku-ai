'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  number: number
  label: string
  description?: string
}

interface ConsultationStepsProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export const ConsultationSteps: React.FC<ConsultationStepsProps> = ({
  steps,
  currentStep,
  className
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep
        const isCurrent = step.number === currentStep
        const isUpcoming = step.number > currentStep

        return (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#1e40af' : '#e5e7eb'
                }}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                  isCompleted && 'border-green-500 bg-green-500',
                  isCurrent && 'border-primary bg-primary',
                  isUpcoming && 'border-gray-300 bg-gray-200'
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <span className={cn(
                    'text-sm font-bold',
                    isCurrent ? 'text-white' : 'text-gray-500'
                  )}>
                    {step.number}
                  </span>
                )}

                {/* Pulse animation for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{
                      scale: [1, 1.5],
                      opacity: [0.5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                )}
              </motion.div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <p className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  isCurrent ? 'text-primary font-bold' : 'text-gray-600'
                )}>
                  {step.label}
                </p>
                {step.description && isCurrent && (
                  <p className="text-xs text-gray-500 mt-0.5 max-w-[100px]">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative">
                <div className="absolute inset-0 bg-gray-300" />
                <motion.div
                  className="absolute inset-0 bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: isCompleted ? 1 : 0
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
