"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AnimatedGradient from '@/components/ui/animated-gradient'
import HeroDemo from '@/components/hero/HeroDemo'
import { 
  MessageSquare, 
  Play, 
  Sparkles, 
  CheckCircle, 
  Users, 
  Shield,
  ArrowRight,
  Zap,
  TrendingUp
} from 'lucide-react'

export default function HeroSection() {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)

  return (
    <AnimatedGradient className="min-h-screen">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Value Proposition */}
          <div className="space-y-8">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 shadow-xl">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-white font-bold text-sm">
                POWERED BY REAL AI (Groq Llama 3.1 70B)
              </span>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                95% Akurasi
              </Badge>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Konsultasi Hukum
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                  24/7 dengan AI
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-medium">
                AI yang <span className="text-yellow-400 font-bold">benar-benar memahami</span> masalah hukum Anda. 
                Bukan chatbot biasa - ini konsultan digital cerdas dengan akses ke seluruh peraturan Indonesia.
              </p>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
                <span className="text-white font-bold text-lg">95%</span>
                <span className="text-white/70 text-sm">Akurasi</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <Users className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-white font-bold text-lg">10K+</span>
                <span className="text-white/70 text-sm">Konsultasi</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <Shield className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-white font-bold text-lg">100%</span>
                <span className="text-white/70 text-sm">Privasi</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold text-lg px-8 py-5 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                onClick={() => router.push('/konsultasi-ai')}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 mr-3" />
                  <span>Mulai Konsultasi Gratis</span>
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${isHovering ? 'translate-x-2' : ''}`} />
                </div>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white font-semibold px-8 py-5 rounded-2xl backdrop-blur-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                onClick={() => {
                  const demo = document.getElementById('hero-demo')
                  demo?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Play className="w-6 h-6 mr-3" />
                Lihat Demo Live
              </Button>
            </div>
            
            {/* Additional Benefits */}
            <div className="flex items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Response 2 detik</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>Success rate 89%</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Enkripsi end-to-end</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Live Demo */}
          <div className="relative" id="hero-demo">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-3xl animate-pulse" />
            
            {/* Demo Card */}
            <div className="relative transform hover:scale-105 transition-transform duration-300">
              <HeroDemo />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce">
              LIVE DEMO
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              REAL AI
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </AnimatedGradient>
  )
}
