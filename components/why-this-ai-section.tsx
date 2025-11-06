'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock, DollarSign, Brain, Shield, Users } from 'lucide-react'

export const WhyThisAISection: FC = () => {
  const reasons = [
    {
      icon: AlertTriangle,
      title: "Kesulitan Akses Hukum",
      description: "70% masyarakat Indonesia kesulitan mengakses bantuan hukum yang terjangkau",
      stat: "70%",
      color: "red"
    },
    {
      icon: Clock,
      title: "Proses Lama & Rumit",
      description: "Konsultasi tradisional memakan waktu berhari-hari hingga berminggu-minggu",
      stat: "5-14 hari",
      color: "orange"
    },
    {
      icon: DollarSign,
      title: "Biaya Mahal",
      description: "Biaya konsultasi hukum mulai dari 500rb hingga jutaan rupiah per sesi",
      stat: "500K-5M",
      color: "yellow"
    },
    {
      icon: Brain,
      title: "Kurang Pemahaman",
      description: "85% masyarakat tidak memahami hak dan kewajiban hukum mereka",
      stat: "85%",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Risiko Penipuan",
      description: "Banyak kasus penipuan berkedok bantuan hukum online",
      stat: "1000+ kasus",
      color: "blue"
    },
    {
      icon: Users,
      title: "Keterbatasan Ahli",
      description: "Rasio pengacara dengan penduduk Indonesia masih sangat rendah",
      stat: "1:6000",
      color: "green"
    }
  ]

  const colorMap = {
    red: "from-red-500 to-red-600",
    orange: "from-orange-500 to-orange-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600"
  }

  const bgColorMap = {
    red: "bg-red-50 dark:bg-red-950/20",
    orange: "bg-orange-50 dark:bg-orange-950/20",
    yellow: "bg-yellow-50 dark:bg-yellow-950/20",
    purple: "bg-purple-50 dark:bg-purple-950/20",
    blue: "bg-blue-50 dark:bg-blue-950/20",
    green: "bg-green-50 dark:bg-green-950/20"
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold mb-4"
          >
            MENGAPA PASALKU.AI HADIR?
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Masalah Hukum di Indonesia
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Kami hadir untuk mengatasi berbagai tantangan akses keadilan hukum yang dihadapi masyarakat Indonesia
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-3xl ${bgColorMap[reason.color]} p-8 hover:scale-105 transition-transform duration-300`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${colorMap[reason.color]} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <reason.icon className="w-8 h-8 text-white" />
                </div>

                {/* Stat */}
                <div className={`text-4xl font-black bg-gradient-to-r ${colorMap[reason.color]} bg-clip-text text-transparent mb-4`}>
                  {reason.stat}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {reason.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solution CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center">
            <div className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              Solusinya? <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pasalku.AI</span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Platform AI legal yang memberikan akses keadilan hukum untuk semua orang, 
              kapan saja, di mana saja, dengan biaya terjangkau
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
