'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface OnboardingStep {
  title: string
  description: string
  image?: string
  icon?: React.ReactNode
}

interface OnboardingTourProps {
  steps: OnboardingStep[]
  onComplete: () => void
  onSkip: () => void
  storageKey?: string
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  onComplete,
  onSkip,
  storageKey = 'onboarding_completed'
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if onboarding has been completed
    const hasCompleted = localStorage.getItem(storageKey)
    if (!hasCompleted) {
      setIsVisible(true)
    }
  }, [storageKey])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
    onComplete()
  }

  const handleSkipClick = () => {
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
    onSkip()
  }

  if (!isVisible) return null

  const step = steps[currentStep]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleSkipClick}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              aria-label="Skip onboarding"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <CardContent className="p-8">
              {/* Progress Indicator */}
              <div className="flex gap-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {/* Icon or Image */}
                  {step.icon && (
                    <div className="mb-6 flex justify-center">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                  )}

                  {step.image && (
                    <div className="mb-6">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Sebelumnya
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleSkipClick}
                  >
                    Lewati
                  </Button>

                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    {currentStep === steps.length - 1 ? 'Mulai' : 'Lanjut'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
