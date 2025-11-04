'use client'

import { FC, useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Shield, TrendingUp, Zap, CheckCircle2, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ onGetStarted }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    { icon: Shield, text: "94.1% Akurasi AI", color: "text-primary" },
    { icon: Users, text: "50,000+ Pengguna Aktif", color: "text-accent" },
    { icon: CheckCircle2, text: "PDPA Compliant", color: "text-success" },
    { icon: Star, text: "4.9/5 Rating", color: "text-warning" }
  ]

  useEffect(() => {
    setIsMounted(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-20 scroll-trigger stagger-children">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 via-transparent to-accent-100/20"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,primary-100/5_1px,transparent_1px),linear-gradient(to_bottom,primary-100/5_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200/20 rounded-full blur-2xl animate-parallaxFloat animate-morphShape"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-200/20 rounded-full blur-2xl animate-parallaxFloat animate-colorShift" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-300/20 rounded-full blur-xl animate-parallaxFloat" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content - Mobile First */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start">
              <Badge variant="secondary" className="bg-primary-100 text-primary-800 hover:bg-primary-200 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Hukum Indonesia Terdepan
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-secondary-900 leading-tight">
                Konsultasi Hukum
                <span className="block text-primary-600">Cerdas & Instan</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-secondary-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Platform AI hukum pertama di Indonesia dengan akurasi 94.1%. 
                Dapatkan jawaban hukum akurat dalam hitungan detik, 
                24/7 tanpa biaya tersembunyi.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-secondary-200 transition-all duration-300 ${
                    activeFeature === index ? 'scale-105 shadow-lg border-primary-300' : 'scale-100'
                  }`}
                >
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-sm font-medium text-secondary-700">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-buttonPulse animate-liquidButton touch-optimized"
              >
                Mulai Konsultasi Gratis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-secondary-300 hover:border-primary-400 hover:bg-primary-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Lihat Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{i}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-secondary-600">
                <span className="font-semibold text-secondary-900">50,000+</span> pengguna aktif
              </p>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative lg:pl-8">
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-secondary-200 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-white text-sm font-medium">Pasalku.ai Assistant</span>
                </div>
              </div>

              {/* Chat Interface Mock */}
              <div className="p-6 space-y-4 h-96 overflow-hidden">
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="bg-secondary-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-700">Halo! Saya AI hukum Pasalku. Ada yang bisa saya bantu?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Saya ingin mendirikan PT. Apa saja syaratnya?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-secondary-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] space-y-2">
                      <p className="text-sm text-secondary-700 font-medium">Syarat mendirikan PT:</p>
                      <ul className="text-xs text-secondary-600 space-y-1">
                        <li>• Minimal 2 pendiri</li>
                        <li>• Modal minimal Rp 50 juta</li>
                        <li>• Akta pendirian notaris</li>
                        <li>• Pengesahan Kemenkumham</li>
                        <li>• NPWP perusahaan</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex justify-start">
                  <div className="bg-secondary-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-secondary-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <input 
                    type="text" 
                    placeholder="Ketik pertanyaan hukum Anda..."
                    className="flex-1 px-4 py-2 bg-secondary-50 border border-secondary-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    readOnly
                  />
                  <button className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-secondary-200 px-4 py-3 animate-float">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-success-500" />
                <span className="text-sm font-medium text-secondary-700">Analisis Selesai</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-secondary-200 px-4 py-3 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-accent-500" />
                <span className="text-sm font-medium text-secondary-700">Response 0.3s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 lg:mt-24">
          {[
            { number: "94.1%", label: "Akurasi AI", icon: TrendingUp },
            { number: "50K+", label: "Pengguna", icon: Users },
            { number: "24/7", label: "Tersedia", icon: Shield },
            { number: "0.3s", label: "Response Time", icon: Zap }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-secondary-900">{stat.number}</div>
              <div className="text-sm text-secondary-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
