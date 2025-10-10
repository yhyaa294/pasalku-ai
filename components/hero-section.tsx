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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-gray-100 to-orange-100 rounded-full blur-3xl animate-levitate opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full blur-3xl animate-ping opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full blur-2xl animate-pulse opacity-50"></div>

        {/* Floating Energy Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full animate-float opacity-60"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200 text-sm font-semibold text-gray-800 animate-bounce">
              <span className="mr-2">⚖️</span>
              Asisten Hukum AI Terpercaya #1 di Indonesia
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-slide-in-up">
              <span className="block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Akses Keadilan
              </span>
              <span className="block bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent animate-slide-in-right">
                Lebih Mudah, Lebih Jelas.
              </span>
            </h1>

            {/* Sub-title with Typing Effect */}
            <div className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl leading-relaxed font-medium min-h-[80px] animate-slide-in-bottom">
              <span className="font-mono">{typedText}</span>
              {!isTypingComplete && <span className="animate-blink">|</span>}
            </div>

            {/* CTA Button with Animations */}
            <div className="animate-scale-in">
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center px-8 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black text-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-white animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Mulai Konsultasi Gratis
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                </span>
              </button>
            </div>
          </div>

          {/* Right Visual Element - AI & Human Collaboration Illustration */}
          <div className="relative animate-fade-in-delayed">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-3xl blur-xl transform rotate-3 scale-110"></div>

              {/* Main Card */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full blur-2xl animate-float"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full blur-xl animate-float animation-delay-1000"></div>
                  <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-x1 animate-ping"></div>
                </div>

                {/* Main Illustration */}
                <div className="relative z-10 text-center">
                  <div className="relative inline-flex items-center justify-center mb-8">
                    {/* Human Hand */}
                    <div className="absolute left-0 transform -rotate-12 animate-bounce animation-delay-500">
                      <div className="w-20 h-20 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🤝</span>
                      </div>
                    </div>

                    {/* AI Hand/Robot */}
                    <div className="absolute right-0 transform rotate-12 animate-bounce animation-delay-1000">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🤖</span>
                      </div>
                    </div>

                    {/* Central Legal Element */}
                    <div className="relative z-10 transform hover:scale-110 transition-transform duration-500">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 via-orange-300 to-orange-400 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
                        <span className="text-3xl animate-pulse">⚖️</span>
                      </div>
                    </div>
                  </div>

                  {/* Book of Law Element */}
                  <div className="relative mb-6 animate-float">
                    <div className="w-32 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-lg mx-auto border-l-4 border-orange-500 transform hover:rotate-3 transition-transform duration-300">
                      <span className="text-2xl animate-glow">📚</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
                  </div>

                  {/* Mission Statement */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 animate-slide-in-up">
                    Kolaborasi AI & Manusia untuk Keadilan
                  </h3>
                  <p className="text-gray-600 leading-relaxed animate-slide-in-bottom">
                    Bersama-sama kita satukan kepingan keadilan hukum Indonesia
                    dengan kecerdasan buatan yang empati dan akurat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats or Call to Action - Optional */}
        <div className="mt-20 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>100% Gratis Mulai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Akurat & Terpercaya</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Akses 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
 