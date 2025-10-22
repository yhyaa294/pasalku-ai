'use client'

import { FC, useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react'

interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ onGetStarted }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-purple-50/20 pt-20">
      {/* Modern Gradient Background with Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Floating Orbs with Mouse Parallax - Only render transform after mount */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
        style={isMounted ? {
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        } : undefined}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={isMounted ? {
          transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
          animationDelay: '1s'
        } : { animationDelay: '1s' }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Modern & Clean */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Modern Badge with Glassmorphism */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powered by AI • Baru Diluncurkan 2025
              </span>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>

            {/* Hero Title - Loss Aversion Psychology */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              <span className="block text-gray-900 mb-2">
                Jangan Biarkan
              </span>
              <span className="block bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                Kebingungan Hukum
              </span>
              <span className="block text-gray-900 mt-2">
                Merugikan Anda
              </span>
            </h1>

            {/* Sub-title - Benefit-Oriented */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-medium">
              Dapatkan <span className="text-blue-600 font-semibold">jawaban hukum yang jelas</span> dalam hitungan detik. Platform AI yang membantu Anda <span className="text-purple-600 font-semibold">memahami hak-hak</span> dan <span className="text-blue-600 font-semibold">melindungi kepentingan</span> Anda tanpa biaya mahal.
            </p>

            {/* CTA Buttons - Risk Reduction Enhanced */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={onGetStarted}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 animate-gradient-x overflow-hidden"
                >
                  <span className="relative flex items-center justify-center gap-2 z-10">
                    Mulai Tanpa Risiko
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <p className="text-sm text-gray-500 text-center">
                  Tidak perlu kartu kredit • Gratis selamanya
                </p>
              </div>
              
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-white hover:text-blue-600 transition-all duration-300 hover:shadow-lg">
                <span className="flex items-center justify-center gap-2">
                  Lihat Demo
                  <Zap className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                </span>
              </button>
            </div>

            {/* Trust Bar - Social Proof & Authority */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-4 text-center sm:text-left">Dipercaya oleh ribuan pengguna di Indonesia</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-green-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✅</span>
                  </div>
                  <span className="font-medium text-gray-700 text-xs">Terverifikasi Ahli Hukum</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-blue-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🔒</span>
                  </div>
                  <span className="font-medium text-gray-700 text-xs">Enkripsi Enterprise</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">⭐</span>
                  </div>
                  <span className="font-medium text-gray-700 text-xs">97% Kepuasan</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-purple-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🚀</span>
                  </div>
                  <span className="font-medium text-gray-700 text-xs">1000+ Pengguna</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual - Modern Bento Grid */}
          <div className="relative animate-fade-in-delayed">
            {/* Glassmorphism Card with Bento Layout */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              
              {/* Main Bento Grid */}
              <div className="relative grid grid-cols-2 gap-4">
                {/* Large Card - AI Feature */}
                <div className="col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">AI Legal Assistant</h3>
                      <p className="text-sm text-gray-600">Powered by Advanced AI</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-xl font-bold text-blue-600">24/7</div>
                      <div className="text-xs text-gray-600">Available</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-xl font-bold text-purple-600">&lt;30s</div>
                      <div className="text-xs text-gray-600">Response</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-xl font-bold text-green-600">94%</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Small Card 1 - Citations */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Auto Citations</h4>
                  <p className="text-xs text-gray-600">Legal references</p>
                </div>

                {/* Small Card 2 - Predictions */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Predictions</h4>
                  <p className="text-xs text-gray-600">Case outcomes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats - Modern Design */}
        <div className="mt-20 text-center animate-fade-in-up">
          <p className="text-sm text-gray-500 mb-6 font-medium">Dipercaya oleh pengguna di seluruh Indonesia</p>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">50+</div>
              <div className="text-sm text-gray-600 font-medium">Fitur AI</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm text-gray-600 font-medium">Support</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">94.1%</div>
              <div className="text-sm text-gray-600 font-medium">Akurasi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
 