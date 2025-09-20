import { FC } from 'react'

import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Shield, Clock, Award, Zap, Gavel } from 'lucide-react'

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
          <div className="inline-flex items-center gap-2 md:gap-3 glass-card text-primary px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold border border-primary/20 animate-bounce-in hover-lift">
            <div className="w-4 h-4 md:w-6 md:h-6 wood-texture rounded-full flex items-center justify-center animate-cyber-pulse">
              <Gavel className="w-2 h-2 md:w-3 md:h-3 text-white" />
            </div>
            🚀 AI-Powered Legal Assistant Terdepan di Indonesia
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-text-shimmer">
              Revolusi
            </span>
            <br />
            <span className="text-foreground animate-slide-in-right">Konsultasi Hukum</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent animate-text-shimmer">
              dengan AI
            </span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
            Dapatkan analisis hukum yang mendalam, akurat, dan mudah dipahami dalam hitungan detik.
            <span className="text-primary font-bold animate-text-shimmer"> Teknologi AI terdepan</span>
            yang telah dipercaya oleh ribuan profesional hukum dan masyarakat Indonesia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-800 to-amber-700 text-white rounded-2xl font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <Zap className="w-5 h-5 md:w-6 md:h-6 animate-cyber-pulse" />
              Mulai Analisis Premium Sekarang
            </button>
            <Button
              variant="outline"
              size="lg"
              className="px-6 md:px-10 py-4 md:py-5 text-lg md:text-xl font-semibold rounded-xl md:rounded-2xl border-2 border-secondary hover:bg-secondary hover:text-white transition-all duration-300 bg-transparent hover-lift"
            >
              Lihat Demo Interaktif
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 animate-wave" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 md:pt-12 animate-slide-in-bottom">
            {[
              { icon: CheckCircle, text: "AI Premium Terbaru" },
              { icon: Shield, text: "Data Terenkripsi 256-bit" },
              { icon: Clock, text: "Respon Instan 24/7" },
              { icon: Award, text: "Referensi Hukum Valid" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 hover-lift"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-8 h-8 md:w-12 md:h-12 wood-texture rounded-full flex items-center justify-center animate-cyber-pulse">
                  <item.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground font-medium text-center">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
