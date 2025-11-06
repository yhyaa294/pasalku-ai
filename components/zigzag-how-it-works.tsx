'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, MessageSquare, FileSearch, CheckCircle, ArrowDown } from 'lucide-react'

export const ZigzagHowItWorks: FC = () => {
  const steps = [
    {
      number: 1,
      title: "Daftar Gratis",
      description: "Buat akun dalam 30 detik tanpa kartu kredit. Langsung dapat akses ke fitur dasar.",
      icon: UserPlus,
      image: "👤", // Placeholder for actual image
      details: ["Email/Google login", "Verifikasi instant", "Dashboard personal"]
    },
    {
      number: 2,
      title: "Pilih Layanan",
      description: "Pilih dari 96+ fitur AI legal sesuai kebutuhan hukum Anda.",
      icon: MessageSquare,
      image: "💬",
      details: ["Konsultasi AI", "Analisis dokumen", "Pembuatan kontrak"]
    },
    {
      number: 3,
      title: "Input Data",
      description: "Masukkan pertanyaan atau upload dokumen yang ingin dianalisis.",
      icon: FileSearch,
      image: "📄",
      details: ["Upload PDF/Word", "Voice input", "Template tersedia"]
    },
    {
      number: 4,
      title: "Terima Hasil",
      description: "Dapatkan analisis lengkap dengan referensi hukum dalam hitungan detik.",
      icon: CheckCircle,
      image: "✅",
      details: ["Hasil instant", "Sitasi UU lengkap", "Export PDF"]
    }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 rounded-full text-sm font-bold mb-4">
            SANGAT MUDAH
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Cara Kerja <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Pasalku.AI</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Hanya 4 langkah mudah untuk mendapatkan solusi hukum profesional
          </p>
        </motion.div>

        {/* Zigzag Steps */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative mb-20 last:mb-0 ${
                index % 2 === 0 ? 'lg:pr-[50%]' : 'lg:pl-[50%]'
              }`}
            >
              <div className={`lg:flex items-center gap-8 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}>
                
                {/* Content */}
                <div className="flex-1">
                  <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow ${
                    index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                  }`}>
                    {/* Step Number */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl font-black text-2xl mb-6 ${
                      index % 2 === 0 ? 'lg:ml-auto' : ''
                    }`}>
                      {step.number}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {step.description}
                    </p>

                    {/* Details */}
                    <div className={`flex flex-wrap gap-2 ${
                      index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'
                    }`}>
                      {step.details.map((detail, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image/Illustration Placeholder */}
                <div className="mt-6 lg:mt-0">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 rounded-3xl flex items-center justify-center shadow-xl"
                  >
                    <span className="text-6xl">{step.image}</span>
                  </motion.div>
                </div>
              </div>

              {/* Connector Arrow (Mobile/Tablet) */}
              {index < steps.length - 1 && (
                <div className="flex justify-center mt-8 lg:hidden">
                  <ArrowDown className="w-8 h-8 text-gray-400 dark:text-gray-600 animate-bounce" />
                </div>
              )}

              {/* Step Circle for Desktop Line */}
              <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-950 border-4 border-purple-500 rounded-full z-10"></div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <button className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105">
            Mulai Sekarang - Gratis!
          </button>
        </motion.div>
      </div>
    </section>
  )
}
