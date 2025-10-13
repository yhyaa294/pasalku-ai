import { FC, useEffect, useRef, useState } from 'react'
import { Timer } from 'lucide-react'

interface CTASectionProps {
  onGetStarted: () => void
  className?: string
}

export const CTASection: FC<CTASectionProps> = ({ onGetStarted, className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        setScrollY(scrollTop - rect.top)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const parallaxOffset = scrollY * 0.5 // Adjust speed as needed

  return (
    <section
      id="cta"
      ref={sectionRef}
      className={`py-20 md:py-40 px-4 relative overflow-hidden scroll-animate ${className}`}
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl animate-levitate"
            style={{ transform: `translateY(${parallaxOffset * -0.2}px)` }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl animate-float"
            style={{ transform: `translateY(${parallaxOffset * -0.15}px)` }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-red-400 to-orange-500 rounded-full blur-2xl animate-ping"
            style={{ transform: `translateY(${parallaxOffset * -0.1}px)` }}
          ></div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-30"></div>
      </div>

      {/* Animated particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-orange-400 rounded-full animate-pulse opacity-30"
          style={{
            left: `${20 + (i * 15)}%`,
            top: `${30 + Math.sin(i) * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + i * 0.5}s`,
          }}
        />
      ))}

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Urgency Badge */}
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 text-orange-200 text-sm font-semibold mb-8 animate-pulse">
          <Timer className="w-4 h-4 mr-2 animate-spin" />
          Bergabunglah dengan Komunitas Legal Tech Terdepan
        </div>

        {/* Main Heading with Parallax */}
        <div
          className="mb-8 md:mb-10"
          style={{ transform: `translateY(${parallaxOffset * 0.1}px)` }}
        >
          <h2 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
              Siap Memulai Perjalanan
            </span>
            <span className="block bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
              Hukum Anda?
            </span>
          </h2>
        </div>

        {/* Description with subtle animation */}
        <p className="text-lg md:text-2xl text-gray-200 mb-10 md:mb-16 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
          Dapatkan akses ke platform legal AI terdepan. Mulai gratis hari ini dan rasakan kemudahan konsultasi hukum modern.
        </p>

        {/* Main CTA Button with Urgency Animation */}
        <div className="relative">
          <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-10 py-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-2xl font-black text-xl md:text-2xl hover:from-orange-400 hover:via-orange-500 hover:to-red-400 transition-all duration-500 transform hover:scale-110 hover:shadow-2xl shadow-orange-500/50 overflow-hidden"
            style={{ transform: `translateY(${parallaxOffset * 0.05}px)` }}
          >
            {/* Pulsing background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>

            <span className="relative flex items-center gap-4">
              {/* Animated Timer Icon */}
              <div className="relative">
                <Timer className="w-6 h-6 md:w-8 md:h-8 text-orange-200 animate-spin" />
                <div className="absolute inset-0 bg-orange-300 rounded-full animate-ping opacity-20"></div>
              </div>

              <span>Mulai Sekarang</span>

              {/* Animated dots for urgency */}
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-100"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
              </div>

              {/* Final animated timer icon */}
              <div className="relative">
                <Timer className="w-6 h-6 md:w-8 md:h-8 text-orange-200 animate-spin animation-reverse" />
                <div className="absolute inset-0 bg-orange-300 rounded-full animate-ping opacity-20"></div>
              </div>
            </span>
          </button>

          {/* Urgency rings around button */}
          <div className="absolute inset-0 -m-4 rounded-3xl border-2 border-orange-400 opacity-0 group-hover:opacity-50 animate-pulse transition-opacity duration-500"></div>
          <div className="absolute inset-0 -m-8 rounded-3xl border border-red-400 opacity-0 group-hover:opacity-30 animate-ping transition-opacity duration-700 animation-delay-500"></div>
        </div>

        {/* Additional urgency text */}
        <div className="mt-8 text-center">
          <p className="text-sm md:text-base text-gray-300 flex items-center justify-center gap-2 animate-fade-in">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Konsultasi gratis • Respons cepat • Tanpa komitmen</span>
            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          </p>
        </div>

        {/* Closing call to action */}
        <div className="mt-12 md:mt-16 animate-fade-in-up animation-delay-1000">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-center">
              <div className="text-orange-300 font-bold mb-1">Pasalku.ai</div>
              <div className="text-white/80 text-sm">Kejelasan Hukum dalam Genggaman</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
