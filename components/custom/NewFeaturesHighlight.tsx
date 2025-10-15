'use client'

import { motion } from 'framer-motion'
import { Brain, FileText, Database, Users, ArrowRight } from 'lucide-react'
import { FeatureHighlight } from './FeatureHighlight'

interface NewFeaturesHighlightProps {
  onConsultationClick: () => void
}

export const NewFeaturesHighlight: React.FC<NewFeaturesHighlightProps> = ({
  onConsultationClick
}) => {
  const mainFeatureIllustration = (
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
      className="relative w-full h-64"
    >
      {/* Animated Document Analysis Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Central Document */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-40 h-48 bg-white rounded-lg shadow-2xl border-2 border-primary/20 flex flex-col p-4"
          >
            <div className="space-y-2">
              <div className="h-2 bg-primary/20 rounded w-full" />
              <div className="h-2 bg-primary/20 rounded w-3/4" />
              <div className="h-2 bg-primary/20 rounded w-5/6" />
              <div className="h-2 bg-primary/20 rounded w-2/3" />
            </div>
            
            {/* AI Badge */}
            <div className="mt-auto flex items-center justify-center gap-2 bg-primary/10 rounded-full px-3 py-1">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">AI</span>
            </div>
          </motion.div>

          {/* Floating Analysis Indicators */}
          {[
            { icon: '⚖️', position: 'top-0 -left-8', delay: 0 },
            { icon: '📋', position: 'top-0 -right-8', delay: 0.5 },
            { icon: '✓', position: 'bottom-0 -left-8', delay: 1 },
            { icon: '🔍', position: 'bottom-0 -right-8', delay: 1.5 }
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`absolute ${item.position} w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center text-xl shadow-lg`}
              animate={{
                y: [0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: item.delay,
                ease: 'easeInOut'
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">Fitur Unggulan</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Solusi Hukum dengan{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AI Terdepan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analisis masalah hukum Anda dalam hitungan detik dengan teknologi AI yang akurat dan terpercaya
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feature - Takes full width on mobile, 2 columns on desktop */}
          <div className="lg:col-span-3">
            <FeatureHighlight
              icon={Brain}
              title="Analisis Masalah Hukum"
              description="Dapatkan analisis mendalam tentang masalah hukum Anda dengan referensi pasal yang akurat. AI kami akan memandu Anda melalui 4 langkah sederhana untuk memahami situasi hukum Anda dengan lebih baik."
              isMain
              onAction={onConsultationClick}
              actionLabel="Mulai Konsultasi Gratis"
              illustration={mainFeatureIllustration}
            />
          </div>

          {/* Supporting Features */}
          <FeatureHighlight
            icon={FileText}
            title="Analisis Dokumen"
            description="Upload dokumen hukum Anda dan dapatkan analisis komprehensif tentang isi, risiko, dan rekomendasi perbaikan."
            onAction={() => window.location.href = '/documents'}
            actionLabel="Analisis Dokumen"
          />

          <FeatureHighlight
            icon={Database}
            title="Knowledge Graph Hukum"
            description="Jelajahi database hukum Indonesia yang lengkap dengan visualisasi interaktif dan pencarian cerdas."
            onAction={() => window.location.href = '/knowledge-base'}
            actionLabel="Jelajahi Database"
          />

          <FeatureHighlight
            icon={Users}
            title="Verifikasi Profesional"
            description="Konsultasi dengan pengacara dan profesional hukum bersertifikat untuk kasus yang memerlukan penanganan lebih lanjut."
            onAction={() => window.location.href = '/professional-upgrade'}
            actionLabel="Temui Profesional"
          />
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">94.1%</p>
              <p className="text-sm text-gray-600">Tingkat Akurasi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">10,000+</p>
              <p className="text-sm text-gray-600">Konsultasi Selesai</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">24/7</p>
              <p className="text-sm text-gray-600">Akses Tersedia</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
