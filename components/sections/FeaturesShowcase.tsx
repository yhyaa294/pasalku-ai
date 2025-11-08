"use client"

import React from 'react'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  FileText, 
  Users, 
  TrendingUp,
  Zap,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Star,
  Play
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI Proaktif",
    description: "AI yang memahami konteks dan suggest solusi yang tepat",
    demo: {
      input: "User: 'Saya di-PHK'",
      output: "AI: 'Saya lihat ini kasus PHK. Berapa lama Anda kerja? Apakah dapat pesangon?'",
      highlight: "AI tanya yang RELEVAN, bukan template!"
    },
    benefits: [
      "Context understanding 95%",
      "Natural conversation flow", 
      "Proactive suggestions"
    ],
    color: "from-purple-600 to-blue-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    icon: FileText,
    title: "Analisis Dokumen",
    description: "Upload kontrak, scan risiko, dapat rekomendasi hukum",
    demo: {
      input: "Upload: 'Kontrak_Kerja.pdf'",
      output: "AI: 'Ditemukan 3 klausul berisiko tinggi: 1. Gaji tidak sesuai UMR 2. Tidak ada pesangon 3. Jam kerja ilegal'",
      highlight: "Scan PDF 2 menit, akurasi 98%!"
    },
    benefits: [
      "PDF document scanning",
      "Risk detection AI",
      "Legal compliance check"
    ],
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    icon: Users,
    title: "Simulasi Negosiasi",
    description: "Practice nego dengan AI HRD sebelum meeting asli",
    demo: {
      input: "User: 'Minta gaji naik 50%'",
      output: "AI HRD: 'Permintaan Anda terlalu tinggi. Budget kami maks 25%. Ada benefit lain?'",
      highlight: "5 persona AI: HRD tegas, Negotiator friendly, dll!"
    },
    benefits: [
      "5 AI personas",
      "Real-time feedback",
      "Strategy improvement"
    ],
    color: "from-green-600 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800"
  },
  {
    icon: TrendingUp,
    title: "Laporan Strategi",
    description: "Generate PDF report profesional untuk persiapan hukum",
    demo: {
      input: "Selesaikan konsultasi",
      output: "Download: 'Laporan_Analisis_Kasus_PHK_2024.pdf' (15 halaman lengkap)",
      highlight: "PDF siap cetak, bisa untuk lawyer!"
    },
    benefits: [
      "Professional PDF reports",
      "Complete documentation",
      "Lawyer-ready format"
    ],
    color: "from-orange-600 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800"
  }
]

export default function FeaturesShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isDemoPlaying, setIsDemoPlaying] = useState(false)

  const runDemo = (index: number) => {
    setIsDemoPlaying(true)
    setTimeout(() => setIsDemoPlaying(false), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-semibold px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            🚀 Fitur Unggulan
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Bukan Chatbot Biasa. Ini{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              AI Konsultan Cerdas
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Setiap fitur dirancang untuk memberikan value nyata. Dari analisis dokumen hingga simulasi negosiasi - 
            semua dalam satu platform dengan AI yang benar-benar memahami kasus Anda.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                  activeFeature === index 
                    ? 'ring-2 ring-purple-500 shadow-xl scale-105' 
                    : 'hover:scale-102'
                } ${feature.bgColor} ${feature.borderColor}`}
                onClick={() => {
                  setActiveFeature(index)
                  runDemo(index)
                }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      {/* Benefits */}
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Demo Panel */}
          <div className="relative">
            <div className="sticky top-8 space-y-6">
              {/* Active Feature Demo */}
              <Card className="p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 border-purple-200 dark:border-purple-800 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${features[activeFeature].color}`}>
                      {React.createElement(features[activeFeature].icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        💡 Demo: {features[activeFeature].title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {features[activeFeature].description}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Live Preview
                  </Badge>
                </div>

                {/* Demo Content */}
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Input:</span>
                    </div>
                    <p className="font-mono text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                      {features[activeFeature].demo.input}
                    </p>
                  </div>

                  {isDemoPlaying && (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">AI sedang memproses...</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Output:</span>
                    </div>
                    <p className="font-mono text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                      {features[activeFeature].demo.output}
                    </p>
                  </div>

                  {/* Highlight */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                      <Zap className="w-5 h-5" />
                      <span className="font-bold text-sm">{features[activeFeature].demo.highlight}</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Klik kartu lain untuk lihat demo berbeda
                  </p>
                  <Button 
                    size="sm" 
                    className={`bg-gradient-to-r ${features[activeFeature].color} hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                    onClick={() => runDemo(activeFeature)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Main Demo
                  </Button>
                </div>
              </Card>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2-5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Menit Response</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Akurasi</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tersedia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
