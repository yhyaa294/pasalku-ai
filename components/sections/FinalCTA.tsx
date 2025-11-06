"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Calendar, 
  Shield, 
  Clock, 
  CheckCircle, 
  Zap,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp
} from 'lucide-react'

export default function FinalCTA() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })
  const [activeUsers, setActiveUsers] = useState(127)
  const [emailsCount, setEmailsCount] = useState(4847)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1
        
        if (totalSeconds <= 0) {
          return { hours: 23, minutes: 59, seconds: 59 }
        }
        
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update active users
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2)
      setEmailsCount(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (value: number) => value.toString().padStart(2, '0')

  return (
    <section className="relative py-24 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500/20 rounded-full animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Main CTA */}
          <div className="space-y-8">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 shadow-xl">
              <div className="relative">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-white font-bold text-sm">
                ⏰ PENAWARAN TERBATAS - Gratis Selama Beta
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                Jangan Tunda
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Masalah Hukum Anda
                </span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-medium">
                10,000+ orang telah menyelesaikan masalah hukum mereka dengan AI kami. 
                Mulai sekarang, dapatkan bantuan dalam <span className="text-yellow-400 font-bold">hitungan detik</span>.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">{emailsCount.toLocaleString()}+</div>
                <div className="text-white/70 text-sm">Email Terdaftar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">{activeUsers}</div>
                <div className="text-white/70 text-sm">Online Sekarang</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">89%</div>
                <div className="text-white/70 text-sm">Success Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold text-lg px-8 py-5 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border-0"
                onClick={() => window.location.href = '/konsultasi-ai'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 mr-3" />
                  <span>Mulai Konsultasi Gratis</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white font-semibold px-8 py-5 rounded-2xl backdrop-blur-lg hover:bg-white/10 hover:border-white/50 transition-all duration-500"
                onClick={() => {
                  // Scroll to top or open contact
                  window.location.href = 'mailto:hello@pasalku.ai'
                }}
              >
                <Calendar className="w-6 h-6 mr-3" />
                Hubungi Sales
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>100% Privasi Terjamin</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>24/7 Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <span>Tidak Perlu Kartu Kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Setup 30 Detik</span>
              </div>
            </div>
          </div>

          {/* Right Side - Countdown & Benefits */}
          <div className="space-y-8">
            {/* Countdown Timer */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Penawaran Gratis Berakhir Dalam:
                </h3>
                <p className="text-white/70">
                  Daftar sekarang sebelum beta berakhir
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-4 mb-2">
                    <div className="text-3xl font-black text-white">
                      {formatTime(timeLeft.hours)}
                    </div>
                  </div>
                  <div className="text-white/70 text-sm font-medium">Jam</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-4 mb-2">
                    <div className="text-3xl font-black text-white">
                      {formatTime(timeLeft.minutes)}
                    </div>
                  </div>
                  <div className="text-white/70 text-sm font-medium">Menit</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-4 mb-2">
                    <div className="text-3xl font-black text-white">
                      {formatTime(timeLeft.seconds)}
                    </div>
                  </div>
                  <div className="text-white/70 text-sm font-medium">Detik</div>
                </div>
              </div>

              <Button 
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = '/konsultasi-ai'}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Klaim Akses Gratis Saya
              </Button>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white mb-4">
                Mengapa Memilih Pasalku.AI?
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">95% Success Rate</div>
                    <div className="text-white/70 text-sm">Kasus berhasil diselesaikan</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">10,000+ Pengguna</div>
                    <div className="text-white/70 text-sm">Telah terbantu sejak 2024</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Response 2 Detik</div>
                    <div className="text-white/70 text-sm">Tidak perlu antri berjam-jam</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Trust Badge */}
            <div className="text-center p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-bold text-green-300">100% GRATIS</span>
              </div>
              <p className="text-white/80 text-sm">
                Tidak ada biaya tersembunyi. Tidak perlu kartu kredit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
