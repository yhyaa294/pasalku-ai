'use client'

import { FC, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

interface EnhancedHeroSectionProps {
  onGetStarted: () => void
}

export const EnhancedHeroSection: FC<EnhancedHeroSectionProps> = ({ onGetStarted }) => {
  const [typedText, setTypedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const fullText = "Solusi Masalah Hukum dengan AI Terpercaya"

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        setIsTypingComplete(true)
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-blue-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-200/20 rounded-full blur-3xl animate-levitate" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-orange-300/10 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Sparkles className="w-4 h-4" />
                Powered by BytePlus Ark + Groq
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                <span className="block text-gray-900">
                  {typedText}
                </span>
                {!isTypingComplete && (
                  <span className="inline-block w-1 h-12 bg-primary animate-pulse ml-1" />
                )}
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Analisis masalah hukum Anda dalam hitungan detik dengan teknologi AI terdepan
              </p>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 items-center lg:items-start"
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-accent to-orange-600 hover:from-orange-600 hover:to-accent text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Mulai Konsultasi Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Gratis • Tanpa Kartu Kredit</span>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">94.1% Akurasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium">10,000+ Konsultasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="font-medium">Akses 24/7</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Card */}
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100"
              >
                {/* Mock Chat Interface */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-xl">⚖️</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Pasalku.ai</p>
                      <p className="text-xs text-gray-500">Asisten Hukum AI</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                      className="bg-gray-100 rounded-2xl rounded-tl-sm p-3"
                    >
                      <p className="text-sm text-gray-700">
                        Selamat datang! Bagaimana saya bisa membantu masalah hukum Anda?
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      className="bg-primary text-white rounded-2xl rounded-tr-sm p-3 ml-auto max-w-[80%]"
                    >
                      <p className="text-sm">
                        Saya ingin tahu tentang hak saya sebagai karyawan
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2 }}
                      className="bg-gray-100 rounded-2xl rounded-tl-sm p-3"
                    >
                      <p className="text-sm text-gray-700">
                        Baik, saya akan membantu Anda. Berdasarkan UU Ketenagakerjaan...
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                        <span className="text-xs font-medium text-primary">Pasal 156</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Typing Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ delay: 2.5, duration: 1.5, repeat: Infinity }}
                    className="flex gap-1"
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-2xl">⚡</span>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-2xl">📚</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
