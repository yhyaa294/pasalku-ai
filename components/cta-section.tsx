 'use client'

import { FC, useEffect, useRef, useState } from 'react'
import { Timer } from 'lucide-react'

interface CTASectionProps {
  onGetStarted: () => void
  className?: string
}

export const CTASection: FC<CTASectionProps> = ({ onGetStarted, className = '' }) => {
  return (
    <section
      id="cta"
      className={`py-24 md:py-32 px-4 relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 ${className}`}
    >
      {/* Modern Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Modern Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-bold mb-8 shadow-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          🚀 Siap Membantu Anda 24/7
        </div>

        {/* Bold Heading */}
        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
          Mulai Konsultasi Hukum <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Anda Sekarang
          </span>
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Dapatkan jawaban untuk pertanyaan hukum Anda dengan mudah dan cepat.
          <br className="hidden md:block" />
          <span className="font-bold text-white"> Gratis untuk memulai. Tidak perlu kartu kredit.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={onGetStarted}
            className="group px-12 py-6 bg-white text-orange-600 rounded-2xl font-black text-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/30"
          >
            <span className="flex items-center justify-center gap-2">
              Mulai Gratis Sekarang
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <button className="px-12 py-6 bg-white/20 backdrop-blur-xl border-2 border-white/40 text-white rounded-2xl font-bold text-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg">
            Lihat Demo
          </button>
        </div>

        {/* Trust Indicators - Modern */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-white text-base">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-semibold">Gratis untuk memulai</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-semibold">Respons &lt;30 detik</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-semibold">Tanpa komitmen</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-white mb-2">50+</div>
            <div className="text-sm text-white/80 font-medium">Fitur AI</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-white mb-2">24/7</div>
            <div className="text-sm text-white/80 font-medium">Support</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-white mb-2">94.1%</div>
            <div className="text-sm text-white/80 font-medium">Akurasi</div>
          </div>
        </div>
      </div>
    </section>
  )
}
