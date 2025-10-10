import React, { FC, useRef, useEffect, useState } from 'react'

interface HowItWorksSectionProps {
  className?: string
}

export const HowItWorksSection: FC<HowItWorksSectionProps> = ({ className = '' }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      step: "01",
      title: "Uraikan Perkara Anda.",
      description:
        "Sampaikan permasalahan hukum Anda dalam bahasa sehari-hari. Kecerdasan artifisial kami siap menyimak setiap detailnya.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-bounce">💭➡️💬</div>
        </div>
      ),
      alt: "Ilustrasi individu dengan pikiran kusut berubah menjadi gelembung bicara jernih"
    },
    {
      step: "02",
      title: "Jawab Klarifikasi Artifisial.",
      description:
        "AI akan mengajukan pertanyaan-pertanyaan krusial untuk menggali konteks, layaknya dialog dengan konsultan hukum.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-pulse">💬🤖</div>
        </div>
      ),
      alt: "Dua gelembung chat modern - manusia dan AI berinteraksi"
    },
    {
      step: "03",
      title: "Unggah Bukti Pendukung.",
      description:
        "Sertakan dokumen, foto, atau bukti lain yang relevan secara aman untuk analisis yang lebih komprehensif.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-bounce">🔒📄</div>
        </div>
      ),
      alt: "Ikon gembok besar dengan dokumen yang masuk ke kotak digital aman"
    },
    {
      step: "04",
      title: "Terima Analisis Berdasar Hukum.",
      description:
        "Dapatkan ringkasan masalah, opsi penyelesaian, dan rujukan hukum relevan, disajikan dalam bahasa yang mudah dipahami.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-pulse">📱⚖️</div>
        </div>
      ),
      alt: "Tangan memegang tablet dengan informasi terstruktur dan sitasi hukum"
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const sectionTop = sectionRef.current.offsetTop
      const sectionHeight = sectionRef.current.offsetHeight
      const scrollY = window.scrollY + window.innerHeight / 2

      if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
        const progressInSection = (scrollY - sectionTop) / sectionHeight
        setProgress(progressInSection * 100)

        // Update active step based on scroll position
        const activeIndex = Math.min(Math.floor(progressInSection * 4), 3)
        setActiveStep(activeIndex)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className={`py-16 md:py-32 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50 scroll-animate ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Bagaimana Pasalku.ai{' '}
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Mendampingi Anda
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Empat Langkah Mudah Menuju Kejelasan Hukum.
          </p>
        </div>

        <div className="relative">
          {/* Interactive Progress Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full hidden md:block">
            <div className="w-full h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-300 ease-out"
                style={{ height: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-12 md:space-y-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8 scroll-animate-scale`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Interactive Dot on Line */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 hidden md:block transition-all duration-500 ${
                  index <= activeStep
                    ? 'w-6 h-6 bg-orange-500 shadow-lg scale-110'
                    : 'w-4 h-4 bg-gray-300'
                } rounded-full border-2 border-white shadow-md`}>
                  {index <= activeStep && (
                    <div className="w-full h-full bg-orange-500 rounded-full animate-ping"></div>
                  )}
                </div>

                {/* Step Card */}
                <div className={`flex-1 group transition-all duration-500 hover:scale-105 ${
                  index <= activeStep ? 'shadow-2xl shadow-orange-500/20' : ''
                } ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 group-hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg group-hover:shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Illustration */}
                      <div className="flex-shrink-0">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl transition-all duration-300 ${
                          index <= activeStep
                            ? 'bg-gradient-to-br from-orange-100 to-yellow-100 shadow-lg'
                            : 'bg-gray-100'
                        } flex items-center justify-center`}>
                          {step.illustration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center md:text-left flex-1">
                        <div className={`text-4xl md:text-5xl font-black mb-2 md:mb-3 transition-colors duration-300 ${
                          index <= activeStep
                            ? 'text-orange-600 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent'
                            : 'text-gray-300'
                        }`}>
                          {step.step}
                        </div>
                        <h3 className={`text-xl md:text-3xl font-bold mb-3 md:mb-4 transition-colors duration-300 ${
                          index <= activeStep ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm md:text-lg leading-relaxed transition-colors duration-300 ${
                          index <= activeStep ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>

                        {/* Progress indicator for mobile */}
                        <div className="md:hidden mt-4">
                          <div className="flex justify-center">
                            <div className={`w-3 h-3 rounded-full ${
                              index <= activeStep ? 'bg-orange-500' : 'bg-gray-300'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated border effect */}
                    {index <= activeStep && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-orange-400 opacity-50 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
