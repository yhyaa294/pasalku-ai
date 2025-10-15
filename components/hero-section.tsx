import { FC, useState, useEffect } from 'react'

interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ onGetStarted }) => {
  const [typedText, setTypedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const fullText = "Platform konsultasi hukum berbasis AI yang membantu Anda memahami hak-hak hukum dengan mudah, cepat, dan terjangkau."

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        setIsTypingComplete(true)
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Premium Animated Background */}
      <div className="absolute inset-0">
        {/* Animated Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-white to-blue-50/30 gradient-flow"></div>
        
        {/* Floating Orbs with Enhanced Animation */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-orange-400/15 to-orange-500/8 rounded-full blur-3xl smooth-float" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/12 to-purple-500/8 rounded-full blur-3xl smooth-float" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-500/5 rounded-full blur-3xl smooth-float" style={{ animationDuration: '7s', animationDelay: '2s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTk5OTkiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaC0ydjJoMnYtMmgydi0yaC0yem0tMiAydi0yaC0ydjJoMnptMi0yaDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40 pattern-flow"></div>
        
        {/* Shimmer Light Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent animate-slide-right" style={{ top: '30%' }}></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-slide-right" style={{ top: '60%', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 animate-fade-in">
            {/* Fresh Startup Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Baru Diluncurkan 2025 🚀
            </div>

            {/* Hero Title - Startup Style */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
              <span className="block text-gray-900">
                Konsultasi Hukum
              </span>
              <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                Jadi Lebih Mudah
              </span>
            </h1>

            {/* Sub-title - Clean & Simple */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
              {typedText}
              {!isTypingComplete && <span className="animate-blink text-orange-500">|</span>}
            </p>

            {/* CTA Button - Bold & Modern */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40"
              >
                <span className="flex items-center justify-center gap-2">
                  Coba Gratis Sekarang
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-all duration-300">
                Lihat Demo
              </button>
            </div>

            {/* Trust Indicators - Startup Style */}
            <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Gratis untuk mulai</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Tanpa kartu kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Setup 2 menit</span>
              </div>
            </div>
          </div>

          {/* Right Visual Element - Modern & Minimal */}
          <div className="relative animate-fade-in-delayed">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background Glow - Subtle */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-500/10 rounded-3xl blur-2xl"></div>

              {/* Main Card - Clean Design */}
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                {/* Simple Illustration */}
                <div className="text-center space-y-6">
                  {/* Icon Stack */}
                  <div className="flex justify-center items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-lg">
                      <span className="text-3xl">⚖️</span>
                    </div>
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-4xl">🤖</span>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center transform rotate-6 shadow-lg">
                      <span className="text-3xl">💬</span>
                    </div>
                  </div>

                  {/* Simple Text */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      AI + Hukum Indonesia
                    </h3>
                    <p className="text-gray-600">
                      Teknologi modern untuk akses hukum yang lebih baik
                    </p>
                  </div>

                  {/* Stats - Startup Style */}
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">24/7</div>
                      <div className="text-xs text-gray-500">Tersedia</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">&lt;30s</div>
                      <div className="text-xs text-gray-500">Respons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">100%</div>
                      <div className="text-xs text-gray-500">Gratis</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats - Clean */}
        <div className="mt-16 text-center animate-fade-in-up">
          <p className="text-sm text-gray-500 mb-4">Baru Diluncurkan - Mari Tumbuh Bersama</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">Beta</div>
              <div className="text-sm text-gray-500">Early Access</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-500">Fitur AI</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-500">Siap Membantu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
 