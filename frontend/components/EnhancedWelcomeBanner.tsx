'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Bell, Sparkles, TrendingUp, Users,
  ChevronRight, Star, Zap, Trophy
} from 'lucide-react'

// Welcome Banner with Polls Highlight
export default function EnhancedWelcomeBanner({ user }: { user: any }) {
  const [currentTip, setCurrentTip] = useState(0)

  const tips = [
    "🚀 96+ AI Features sekarang aktif! Mulai eksplorasi adaptive persona negotiation",
    "🎯 Selesaikan poll di bawah untuk bantu tingkatkan platform AI hukum",
    "📊 Dapatkan akses ke Contract Intelligence Engine dengan 87% akurasi",
    "⚡ Response time <200ms - tercepat di industri AI hukum",
    "🔒 Enterprise security grade A dengan dual AI validation"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Animated stats
  const [animatedStats, setAnimatedStats] = useState({
    features: 0,
    accuracy: 0,
    responses: 0,
    uptime: 0
  })

  useEffect(() => {
    const statsTargets = {
      features: 96,
      accuracy: 94,
      responses: 28,
      uptime: 99.9
    }

    const animate = (key: keyof typeof statsTargets) => {
      const target = statsTargets[key]
      const duration = 2000
      const increment = target / (duration / 16)
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setAnimatedStats(prev => ({ ...prev, [key]: target }))
          clearInterval(timer)
        } else {
          setAnimatedStats(prev => ({
            ...prev,
            [key]: typeof target === 'number' && key === 'uptime'
              ? parseFloat(current.toFixed(1))
              : Math.floor(current)
          }))
        }
      }, 16)
    }

    // Animate all stats
    setTimeout(() => animate('features'), 300)
    setTimeout(() => animate('accuracy'), 600)
    setTimeout(() => animate('responses'), 900)
    setTimeout(() => animate('uptime'), 1200)
  }, [])

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-800 rounded-2xl">
        {/* Animated particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white relative overflow-hidden">
        <CardContent className="p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">🏆 SUPREME LEGAL AI PLATFORM READY!</h2>
                  <p className="text-blue-100">Selamat datang di sistem kecerdasan hukum paling canggih, {user?.name}!</p>
                </div>
              </motion.div>

              {/* Interactive Tips */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <span className="text-sm font-medium">Tips Pintar Hari Ini:</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="text-blue-100"
                  >
                    {tips[currentTip]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="text-center">
                    <Trophy className="w-10 h-10 text-white mx-auto mb-1" />
                    <div className="text-2xl font-bold text-white">#1</div>
                  </div>
                </div>
                {/* Achievement ribbon */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Stats Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'AI Features', value: animatedStats.features, icon: Sparkles, suffix: '+', color: 'from-cyan-400 to-blue-500' },
              { label: 'Accuracy', value: animatedStats.accuracy, icon: TrendingUp, suffix: '%', color: 'from-green-400 to-emerald-500' },
              { label: 'Response Time', value: animatedStats.responses, icon: Zap, suffix: 's', color: 'from-purple-400 to-pink-500' },
              { label: 'Uptime SLA', value: animatedStats.uptime, icon: Trophy, suffix: '%', color: 'from-orange-400 to-red-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index + 1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </motion.div>
                <motion.div
                  className="text-2xl font-bold text-white"
                  key={stat.value}
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                <div className="text-xs text-blue-100 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action for Polls */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">🎯 Bergabung dalam Community Polls</h3>
                  <p className="text-blue-100 text-sm">Suara Anda membantu kami tingkatkan platform AI hukum terbaik Indonesia!</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
                onClick={() => {
                  const element = document.getElementById('community-polls')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Vote Sekarang
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}</content>
</xai:function_call">Now let me replace the old welcome section with this enhanced one. I'll update the dashboard to use the new beautiful welcome banner. Let me first check where the old welcome section is and replace it. I need to import this component and replace the existing welcome section.

<xai:function_call name="Edit">
<parameter name="file_path">app/dashboard/page.tsx