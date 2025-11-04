'use client'

import { FC, useState, useEffect } from 'react'
import { ArrowRight, Zap, Shield, Star, Users, CheckCircle, Sparkles, TrendingUp, Award } from 'lucide-react'
import { motion } from 'framer-motion'

interface EnhancedHeroSectionProps {
  onGetStarted: () => void
}

export const EnhancedHeroSection: FC<EnhancedHeroSectionProps> = ({ onGetStarted }) => {
  const [activeUsers, setActiveUsers] = useState(523)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate real-time user count
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { icon: Users, value: '10,000+', label: 'Pengguna Aktif', color: 'text-blue-600' },
    { icon: Award, value: '94.1%', label: 'Akurasi AI', color: 'text-purple-600' },
    { icon: TrendingUp, value: '500+', label: 'Konsultasi/Hari', color: 'text-green-600' },
    { icon: Star, value: '4.9/5', label: 'Rating User', color: 'text-yellow-500' }
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-400/10 dark:bg-pink-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            {/* Live Activity Badge */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 border-2 border-orange-200 dark:border-orange-800 rounded-full px-5 py-3 mb-8 shadow-lg"
            >
              <div className="relative">
                <span className="text-2xl animate-bounce">🔥</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                  {mounted ? activeUsers : 500}+ konsultasi hari ini
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-400">Live sekarang</span>
              </div>
            </motion.div>

            {/* Main Headline with Gradient Animation */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1]"
            >
              <span className="block mb-2">Solusi Hukum</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
                Cerdas & Terpercaya
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl mt-2 text-gray-700 dark:text-gray-300">
                dalam Genggaman Anda
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              Platform AI hukum pertama di Indonesia dengan{' '}
              <span className="font-bold text-blue-600 dark:text-blue-400">akurasi 94.1%</span>.
              Konsultasi instan, analisis dokumen otomatis, dan{' '}
              <span className="font-bold text-purple-600 dark:text-purple-400">96+ fitur</span> untuk semua kebutuhan hukum Anda.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <button
                onClick={onGetStarted}
                className="group relative px-8 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Mulai Gratis Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="group px-8 py-5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl font-semibold text-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 group-hover:animate-pulse" />
                Lihat Demo Interaktif
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Gratis selamanya</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Data terenkripsi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Rating 4.9/5</span>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                  <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced Feature Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            {/* Main Card - AI Legal Assistant */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 mb-6 border border-gray-200/50 dark:border-slate-700/50 relative overflow-hidden"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
              
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl"
                  >
                    🤖
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                      AI Legal Assistant
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      Powered by Advanced AI • Akurasi 94.1%
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 rounded-2xl py-4 border border-blue-200 dark:border-blue-800">
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent mb-1">
                      24/7
                    </div>
                    <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      Selalu Siap
                    </div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 rounded-2xl py-4 border border-purple-200 dark:border-purple-800">
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent mb-1">
                      &lt;30s
                    </div>
                    <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                      Respons Cepat
                    </div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 rounded-2xl py-4 border border-green-200 dark:border-green-800">
                    <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent mb-1">
                      94%
                    </div>
                    <div className="text-xs font-semibold text-green-700 dark:text-green-300">
                      Akurasi Tinggi
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -3, scale: 1.05 }}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-slate-700/50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                    ⚖️
                  </div>
                  <h4 className="font-black text-lg text-gray-900 dark:text-white mb-2">
                    Sitasi Otomatis
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Referensi hukum lengkap
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3, scale: 1.05 }}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-slate-700/50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                    📊
                  </div>
                  <h4 className="font-black text-lg text-gray-900 dark:text-white mb-2">
                    Prediksi Kasus
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Analisis outcome
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
