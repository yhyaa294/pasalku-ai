import { FC, useState, useEffect } from 'react'

interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ onGetStarted }) => {
  const [typedText, setTypedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const fullText = "Pasalku.ai: Asisten Informasi Hukum Berbasis Kecerdasan Artifisial untuk Masyarakat Indonesia."

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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Animated Background Elements - Subtle */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-blue-100/30 to-blue-200/30 rounded-full blur-3xl animate-float opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-orange-100/20 to-orange-200/20 rounded-full blur-3xl animate-float opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-orange-200/20 rounded-full blur-2xl opacity-30"></div>

        {/* Floating Legal Particles - More Subtle */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full animate-float opacity-40"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge - Subtle animation */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-sm font-semibold text-primary">
              <span className="mr-2">⚖️</span>
              Analisis Hukum AI Terpercaya #1 di Indonesia
            </div>

            {/* Hero Title - Focus on Legal Analysis */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-tight mb-6">
              <span className="block bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                Analisis Masalah Hukum
              </span>
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                dengan Kecerdasan AI
              </span>
            </h1>

            {/* Sub-title with Typing Effect */}
            <div className="text-lg md:text-xl lg:text-2xl text-neutral-700 max-w-3xl leading-relaxed font-sans min-h-[80px]">
              <span>{typedText}</span>
              {!isTypingComplete && <span className="animate-pulse">|</span>}
            </div>

            {/* CTA Button - Subtle hover animation */}
            <div>
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center px-8 py-5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-bold text-xl hover:shadow-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Mulai konsultasi hukum gratis"
              >
                <span className="relative flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Mulai Analisis Hukum Gratis
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right Visual Element - Legal Analysis Focus */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background Glow - Subtle */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-xl transform rotate-3 scale-110"></div>

              {/* Main Card - Legal Analysis Showcase */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-neutral-200 overflow-hidden">
                {/* Animated Background Elements - More subtle */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-full blur-xl"></div>
                </div>

                {/* Main Illustration - Legal Analysis Process */}
                <div className="relative z-10 text-center">
                  {/* Legal Document Analysis Icon */}
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="relative transform hover:scale-105 transition-transform duration-500">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary via-primary/80 to-accent rounded-2xl flex items-center justify-center shadow-xl border-4 border-white relative">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Steps Visualization */}
                  <div className="space-y-4 mb-6">
                    {['Analisis Konteks', 'Identifikasi Pasal', 'Rekomendasi Solusi'].map((step, idx) => (
                      <div key={step} className="flex items-center gap-3 bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-semibold text-neutral-700 text-left">{step}</span>
                        <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-display font-bold text-secondary mb-3">
                    AI Legal Analysis Engine
                  </h3>
                  <p className="text-neutral-600 leading-relaxed text-sm">
                    Teknologi kecerdasan buatan kami menganalisis masalah hukum Anda secara komprehensif,
                    memberikan rujukan pasal yang relevan dan solusi praktis dalam hitungan detik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats - Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold">100% Gratis untuk Memulai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-semibold">94% Akurasi Legal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="font-semibold">50,000+ Pengguna Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
 