'use client'

import { FC, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, FileText, MessageSquare, Shield, Brain, Zap, Scale, Search, Calculator, Clock, BookOpen, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const FeaturesShowcase: FC = () => {
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Showing only main features, but we have 96+ total
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI Legal Consultant",
      description: "Konsultasi hukum 24/7 dengan AI yang terlatih dari ribuan kasus",
      gradient: "from-purple-500 to-pink-500",
      badge: "MOST POPULAR"
    },
    {
      icon: FileText,
      title: "Analisis Dokumen",
      description: "Scan & analisis kontrak, perjanjian, dan dokumen hukum lainnya",
      gradient: "from-blue-500 to-cyan-500",
      badge: "ADVANCED"
    },
    {
      icon: Scale,
      title: "Prediksi Kasus",
      description: "Analisis probabilitas kemenangan berdasarkan data historis",
      gradient: "from-green-500 to-emerald-500",
      badge: "AI POWERED"
    },
    {
      icon: MessageSquare,
      title: "Legal Chatbot",
      description: "Tanya jawab instan untuk masalah hukum sehari-hari",
      gradient: "from-orange-500 to-red-500",
      badge: "24/7"
    },
    {
      icon: Shield,
      title: "Perlindungan Konsumen",
      description: "Panduan lengkap hak konsumen dan cara klaim",
      gradient: "from-indigo-500 to-purple-500",
      badge: "UPDATED"
    },
    {
      icon: Search,
      title: "Cek Legalitas",
      description: "Verifikasi legalitas perusahaan, produk, dan layanan",
      gradient: "from-pink-500 to-rose-500",
      badge: "INSTANT"
    },
    {
      icon: Calculator,
      title: "Kalkulator Denda",
      description: "Hitung denda, ganti rugi, dan kompensasi otomatis",
      gradient: "from-teal-500 to-cyan-500",
      badge: "ACCURATE"
    },
    {
      icon: BookOpen,
      title: "Template Dokumen",
      description: "500+ template surat & kontrak siap pakai",
      gradient: "from-yellow-500 to-orange-500",
      badge: "READY TO USE"
    },
    {
      icon: Users,
      title: "Mediasi Online",
      description: "Platform mediasi digital untuk penyelesaian sengketa",
      gradient: "from-gray-600 to-gray-800",
      badge: "NEW"
    }
  ]

  const stats = [
    { number: "96+", label: "Fitur AI" },
    { number: "10K+", label: "Pengguna" },
    { number: "50K+", label: "Kasus Selesai" },
    { number: "94%", label: "Akurasi" }
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            96+ FITUR CANGGIH
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Fitur <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Super Lengkap</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Semua solusi hukum dalam satu platform. Dari konsultasi hingga litigasi.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              <div className="h-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold rounded-full">
                    {feature.badge}
                  </span>
                </div>

                {/* Icon */}
                <motion.div
                  animate={{
                    rotate: hoveredIndex === index ? 360 : 0
                  }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-4 flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Pelajari lebih lanjut
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See All Features Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => router.push('/features-hub')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Lihat Semua 96+ Fitur
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Bottom Wave Decoration */}
        <div className="mt-20 relative">
          <svg className="w-full h-20 text-purple-100 dark:text-purple-950/20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>
    </section>
  )
}
