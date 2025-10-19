'use client'

import React, { FC, useRef, useEffect, useState } from 'react'

interface HowItWorksSectionProps {
  className?: string
}

export const HowItWorksSection: FC<HowItWorksSectionProps> = ({ className = '' }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      step: "01",
      title: "Tanyakan Pertanyaan Anda",
      description:
        "Ketik pertanyaan hukum Anda dalam bahasa Indonesia yang natural. Tidak perlu menggunakan istilah legal yang rumit.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-bounce">💬</div>
        </div>
      ),
      alt: "Pengguna bertanya"
    },
    {
      step: "02",
      title: "AI Memproses & Menganalisis",
      description:
        "AI kami menganalisis pertanyaan Anda, memahami konteks, dan mencari informasi dari database hukum Indonesia.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-pulse">🤖</div>
        </div>
      ),
      alt: "AI menganalisis"
    },
    {
      step: "03",
      title: "Dapatkan Jawaban Lengkap",
      description:
        "Terima jawaban yang jelas dengan referensi pasal, penjelasan, dan rekomendasi tindak lanjut yang bisa Anda lakukan.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-bounce">📋</div>
        </div>
      ),
      alt: "Menerima jawaban"
    },
    {
      step: "04",
      title: "Lanjutkan atau Simpan",
      description:
        "Ajukan pertanyaan lanjutan jika perlu, upload dokumen untuk analisis lebih detail, atau simpan riwayat konsultasi Anda.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-pulse">💾</div>
        </div>
      ),
      alt: "Lanjutkan atau simpan"
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const sectionTop = sectionRef.current.offsetTop
      const sectionHeight = sectionRef.current.offsetHeight
      const scrollY = window.scrollY + window.innerHeight / 2

      if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
        const progressInSection = (scrollY - sectionTop) / sectionHeight
        setProgress(progressInSection * 100)

        // Update active step based on scroll position
        const activeIndex = Math.min(Math.floor(progressInSection * 4), 3)
        setActiveStep(activeIndex)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className={`py-20 md:py-32 px-4 bg-gradient-to-b from-white via-purple-50/20 to-white relative overflow-hidden ${className}`}
    >
      {/* Modern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.05),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-bold mb-6">
            <span>⚡</span> Super Simple & Fast
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            <span className="text-gray-900">Cara Kerja </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Pasalku.ai</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hanya 4 langkah sederhana untuk mendapatkan solusi hukum Anda
          </p>
        </div>

        {/* Modern Timeline */}
        <div className="relative">
          {/* Animated Progress Line */}
          <div className="hidden md:block absolute left-0 right-0 top-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-gradient-x bg-[length:200%_auto]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Modern Number Badge */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                      index % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                      index % 4 === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                      index % 4 === 2 ? 'bg-gradient-to-br from-pink-500 to-pink-600' :
                      'bg-gradient-to-br from-green-500 to-green-600'
                    }`}>
                      {step.step}
                    </div>
                    <div className={`absolute -inset-2 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity ${
                      index % 4 === 0 ? 'bg-blue-400' :
                      index % 4 === 1 ? 'bg-purple-400' :
                      index % 4 === 2 ? 'bg-pink-400' :
                      'bg-green-400'
                    }`}></div>
                  </div>
                </div>

                {/* Glassmorphism Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 min-h-[280px] group-hover:border-purple-200">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                      {step.illustration}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-600 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>

                  {/* Gradient Bottom Border */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl transition-all duration-300 ${
                    index % 4 === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    index % 4 === 1 ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                    index % 4 === 2 ? 'bg-gradient-to-r from-pink-400 to-pink-600' :
                    'bg-gradient-to-r from-green-400 to-green-600'
                  } opacity-0 group-hover:opacity-100`}></div>
                </div>

                {/* Modern Arrow */}
                {index < 3 && (
                  <div className="hidden md:flex absolute top-8 -right-4 items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm z-20 shadow-lg">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modern CTA */}
        <div className="mt-20 text-center">
          <button className="group px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-gradient-x">
            <span className="flex items-center justify-center gap-2">
              Coba Sekarang Gratis
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <p className="text-sm text-gray-500 mt-4">Tidak perlu kartu kredit • Setup 2 menit</p>
        </div>
      </div>
    </section>
  )
}
