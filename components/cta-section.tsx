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
      className={`py-24 md:py-32 px-4 relative overflow-hidden scroll-animate bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 ${className}`}
    >
      {/* Simple Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mmgydi0yaC0yem0wIDR2Mi0yaDJ2LTJoLTJ6bS0yIDJ2LTJoLTJ2Mmgyem0yLTJoMnYtMmgtMnYyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Siap Membantu Anda
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Mulai Konsultasi Hukum <br className="hidden md:block" />
          Anda Sekarang
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
          Dapatkan jawaban untuk pertanyaan hukum Anda dengan mudah dan cepat.
          <span className="font-bold"> Gratis untuk memulai.</span>
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onGetStarted}
            className="px-10 py-5 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Mulai Gratis Sekarang
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Gratis untuk memulai</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Respons cepat</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Tanpa komitmen</span>
          </div>
        </div>
      </div>
    </section>
  )
}
