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
      
      {/* Floating Orbs with Mouse Parallax */}
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
          {/* Left Content - Psychology Enhanced */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Urgency Badge with Social Proof */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200/50 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                🔥 500+ konsultasi hari ini • Baru Diluncurkan 2025
              </span>
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>

            {/* Hero Title - LOSS AVERSION PSYCHOLOGY */}
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

            {/* Sub-title - BENEFIT-ORIENTED */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-medium">
              Dapatkan <span className="text-blue-600 font-semibold">jawaban hukum yang jelas</span> dalam hitungan detik. Platform AI yang membantu Anda <span className="text-purple-600 font-semibold">memahami hak-hak</span> dan <span className="text-blue-600 font-semibold">melindungi kepentingan</span> Anda tanpa biaya mahal.
            </p>

            {/* CTA Buttons - RISK REDUCTION ENHANCED */}
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
                  ✓ Tidak perlu kartu kredit • ✓ Gratis selamanya
                </p>
              </div>
              
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-white hover:text-blue-600 transition-all duration-300 hover:shadow-lg">
                <span className="flex items-center justify-center gap-2">
                  Lihat Demo
                  <Zap className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                </span>
              </button>
            </div>
          </div>

          {/* Right Visual - Modern Bento Grid */}
          <div className="relative animate-fade-in-delayed">
            {/* Glassmorphism Card with Bento Layout */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              
              {/* Main Bento Grid - Enhanced */}
              <div className="relative grid grid-cols-2 gap-4">
                {/* Large Card - AI Feature with Premium Design */}
                <div className="col-span-2 relative group bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <span className="text-4xl animate-pulse">🤖</span>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">AI Legal Assistant</h3>
                        <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Powered by Advanced AI Technology
                        </p>
                      </div>
                    </div>
                    
                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Stat 1 - 24/7 */}
                      <div className="group/stat relative text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-200/20 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="text-3xl font-black text-blue-600 mb-1 group-hover/stat:scale-110 transition-transform duration-300">24/7</div>
                          <div className="text-xs font-semibold text-blue-700">Available</div>
                          <div className="text-[10px] text-blue-600/70 mt-1">Always Online</div>
                        </div>
                      </div>

                      {/* Stat 2 - Response Time */}
                      <div className="group/stat relative text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200/50 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-200/20 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="text-3xl font-black text-purple-600 mb-1 group-hover/stat:scale-110 transition-transform duration-300">&lt;30s</div>
                          <div className="text-xs font-semibold text-purple-700">Response</div>
                          <div className="text-[10px] text-purple-600/70 mt-1">Lightning Fast</div>
                        </div>
                      </div>

                      {/* Stat 3 - Accuracy */}
                      <div className="group/stat relative text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200/50 hover:border-green-300 hover:shadow-lg hover:shadow-green-200/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-green-200/20 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="text-3xl font-black text-green-600 mb-1 group-hover/stat:scale-110 transition-transform duration-300">AI</div>
                          <div className="text-xs font-semibold text-green-700">Powered</div>
                          <div className="text-[10px] text-green-600/70 mt-1">Smart Tech</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small Card 1 - Citations with Enhanced Design */}
                <div className="relative group bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/50 shadow-xl hover:shadow-amber-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-300/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <span className="text-3xl">⚖️</span>
                    </div>
                    <h4 className="font-black text-lg text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">Auto Citations</h4>
                    <p className="text-sm text-gray-600 font-medium">Referensi hukum otomatis</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      Akurat & Terpercaya
                    </div>
                  </div>
                </div>

                {/* Small Card 2 - Predictions with Enhanced Design */}
                <div className="relative group bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 shadow-xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-green-300/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <span className="text-3xl">📊</span>
                    </div>
                    <h4 className="font-black text-lg text-gray-900 mb-2 group-hover:text-green-700 transition-colors">AI Predictions</h4>
                    <p className="text-sm text-gray-600 font-medium">Prediksi hasil kasus</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      Data-Driven Insights
                    </div>
                  </div>
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
