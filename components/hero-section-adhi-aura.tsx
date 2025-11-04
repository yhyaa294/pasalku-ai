'use client'

import { FC } from 'react'
import { ArrowRight, Zap, Shield, Star, Users, CheckCircle } from 'lucide-react'

interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-white pt-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08),transparent_50%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-6">
              <span className="text-2xl">🔥</span>
              <span className="text-sm font-semibold text-orange-700">500+ konsultasi hari ini</span>
            </div>

            {/* Main Headline - Loss Aversion Psychology */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Jangan Biarkan
              <br />
              <span className="text-red-600">Kebingungan Hukum</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Merugikan Anda
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
              Platform konsultasi hukum berbasis <span className="font-semibold text-blue-600">AI</span> yang membantu Anda memahami hak-hak hukum dengan{' '}
              <span className="font-semibold text-purple-600">mudah</span>, <span className="font-semibold text-green-600">cepat</span>, dan{' '}
              <span className="font-semibold text-pink-600">terjangkau</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Lihat Demo
              </button>
            </div>

            {/* Risk Reduction Text */}
            <p className="text-sm text-gray-500 mb-8">
              ✅ Tidak perlu kartu kredit • 🎁 Gratis selamanya • 🛡️ Data terenkripsi
            </p>

            {/* Trust Bar - Social Proof & Authority */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700">Terverifikasi</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700">Enkripsi Data</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100">
                <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700">97% Puas</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100">
                <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700">1000+ User</span>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            {/* Main Card - AI Legal Assistant */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-4 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🤖
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Legal Assistant</h3>
                  <p className="text-gray-600 text-sm">Powered by Advanced AI</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-blue-50 rounded-xl py-3">
                  <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
                  <div className="text-xs text-gray-600">Available</div>
                </div>
                <div className="text-center bg-purple-50 rounded-xl py-3">
                  <div className="text-2xl font-bold text-purple-600 mb-1">&lt;30s</div>
                  <div className="text-xs text-gray-600">Response</div>
                </div>
                <div className="text-center bg-green-50 rounded-xl py-3">
                  <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Bottom Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mb-3">
                  ⚖️
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Auto Citations</h4>
                <p className="text-sm text-gray-600">Legal references</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-3">
                  📊
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Predictions</h4>
                <p className="text-sm text-gray-600">Case outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
