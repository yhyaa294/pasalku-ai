import { FC } from 'react'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'

interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden marble-effect">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-levitate"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-2xl animate-hologram"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-xl animate-cyber-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-tight">
            Akses Keadilan <br />
            <span className="text-gray-900 font-black animate-slide-in-right drop-shadow-2xl bg-white/90 px-2 py-1 rounded-lg">
              Lebih Mudah, Lebih Jelas.
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
            Pasalku.ai: Asisten Informasi Hukum Berbasis Kecerdasan Artifisial untuk Masyarakat Indonesia.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-5 h-5 md:w-6 md:h-6 animate-cyber-pulse" />
              Mulai Konsultasi Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
 