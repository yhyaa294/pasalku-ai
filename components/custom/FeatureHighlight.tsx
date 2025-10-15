'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface FeatureHighlightProps {
  icon: LucideIcon
  title: string
  description: string
  isMain?: boolean
  onAction?: () => void
  actionLabel?: string
  illustration?: React.ReactNode
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon: Icon,
  title,
  description,
  isMain = false,
  onAction,
  actionLabel = 'Coba Sekarang',
  illustration
}) => {
  if (isMain) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-full"
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 via-white to-purple-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {description}
                </p>
                
                {onAction && (
                  <Button
                    onClick={onAction}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white font-semibold"
                  >
                    {actionLabel}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>

              {/* Illustration */}
              <div className="relative">
                {illustration || (
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="w-full h-64 bg-gradient-to-br from-primary/20 to-purple-300/20 rounded-3xl flex items-center justify-center"
                  >
                    <Icon className="w-32 h-32 text-primary/30" />
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-200">
        <CardContent className="p-6 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          
          <h4 className="text-xl font-bold text-gray-900">{title}</h4>
          
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
          
          {onAction && (
            <Button
              onClick={onAction}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
