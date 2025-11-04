'use client'

import { FC } from 'react'
import { ArrowRight, Sparkles, Shield, Zap, CheckCircle, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface ModernCTASectionProps {
  onGetStarted?: () => void
}

export const ModernCTASection: FC<ModernCTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900"></div>
      
      {/* Animated Overlay Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      {/* Floating Shapes */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
      ></motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
      ></motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold text-sm">
              Bergabung dengan 10,000+ Pengguna Puas
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
          >
            Siap Menyelesaikan
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
              Masalah Hukum Anda?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Mulai gratis hari ini. Tidak perlu kartu kredit.
            <br />
            <span className="font-bold">Upgrade kapan saja</span> sesuai kebutuhan Anda.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button
              onClick={onGetStarted}
              className="group relative px-10 py-6 bg-white text-gray-900 rounded-2xl font-black text-xl shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Mulai Gratis Sekarang
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button className="px-10 py-6 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-bold text-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Lihat Harga
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <CheckCircle className="w-8 h-8 text-green-300 mb-3 mx-auto" />
              <div className="text-white font-bold text-sm">
                Gratis Selamanya
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <Shield className="w-8 h-8 text-blue-300 mb-3 mx-auto" />
              <div className="text-white font-bold text-sm">
                Data Aman
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <Star className="w-8 h-8 text-yellow-300 mb-3 mx-auto" />
              <div className="text-white font-bold text-sm">
                Rating 4.9/5
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <Zap className="w-8 h-8 text-purple-300 mb-3 mx-auto" />
              <div className="text-white font-bold text-sm">
                Setup 30 Detik
              </div>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                  ></div>
                ))}
              </div>
              <span className="font-semibold">10,000+ pengguna aktif</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                ))}
              </div>
              <span className="font-semibold">4.9/5 dari 2,500+ review</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">523 online sekarang</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ModernCTASection
