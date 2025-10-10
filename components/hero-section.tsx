import { FC } from 'react'

import { Button } from '@/components/ui/button'
import { Scale, Waves } from 'lucide-react'

interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-50">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl animate-levitate"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-accent/10 to-optional-brown/10 rounded-full blur-2xl animate-hologram"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-optional-green/5 to-primary/5 rounded-full blur-xl animate-cyber-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-secondary mb-6">
            Akses Keadilan
            <span className="block text-primary animate-slide-in-right">Lebih Mudah, Lebih Jelas.</span>
          </h1>

          <h2 className="text-2xl md:text-3xl text-neutral-600 max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
            Pasalku.ai: Asisten Informasi Hukum Berbasis Kecerdasan Artifisial untuk Masyarakat Indonesia.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-scale-in">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-accent via-amber-500 to-yellow-500 text-white rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Scale className="w-5 h-5 animate-cyber-pulse" />
              Mulai Konsultasi Gratis
            </button>
          </div>

          {/* Ilustrasi Utama */}
          <div className="max-w-4xl mx-auto mt-12">
            <img
              src="/placeholder-hero-illustration.svg" // Ganti dengan path ilustrasi aktual jika tersedia
              alt="Transformasi Akses Hukum: Ilustrasi timbangan digital, buku terbuka bercahaya, gelombang sinyal AI, transisi dari kekacauan dokumen ke kejelasan digital yang diakses tangan manusia. Filosofi: Keterjangkauan dan Kejelasan, AI sebagai jembatan ke informasi hukum rumit."
              className="w-full h-auto rounded-2xl shadow-xl animate-slide-in-bottom"
            />
            <p className="text-sm text-neutral-500 text-center mt-4 italic">
              Transformasi Akses Hukum
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
 