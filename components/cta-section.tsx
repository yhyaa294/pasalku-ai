import { FC } from 'react'
import { ArrowRight } from 'lucide-react'

interface CTASectionProps {
  onGetStarted: () => void
  className?: string
}

export const CTASection: FC<CTASectionProps> = ({ onGetStarted, className = '' }) => {
  return (
    <section className={`py-16 md:py-32 px-4 bg-primary scroll-animate ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 animate-text-shimmer">
          Temukan Kejelasan Hukum Anda Hari Ini.
        </h2>
        <p className="text-lg md:text-xl text-neutral-100 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Jangan biarkan ketidakpastian menghambat. Mulai konsultasi pertama Anda secara gratis dengan Pasalku.ai.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-gradient-to-r from-accent via-amber-500 to-yellow-500 text-white rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mx-auto"
        >
          Mulai Sekarang
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}
