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
      className={`py-16 md:py-32 px-4 bg-gradient-to-b from-white via-neutral-50 to-white ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6 md:mb-8 text-secondary">
            Cara Kerja{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pasalku.ai
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            4 Langkah Mudah untuk Mendapatkan Analisis Hukum yang Akurat
          </p>
        </div>

        <div className="relative">
          {/* Interactive Progress Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full hidden md:block">
            <div className="w-full h-full bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-400 rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary to-accent rounded-full transition-all duration-300 ease-out"
                style={{ height: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-12 md:space-y-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}
              >
                {/* Interactive Dot on Line */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 hidden md:block transition-all duration-500 ${
                  index <= activeStep
                    ? 'w-6 h-6 bg-primary shadow-lg scale-110'
                    : 'w-4 h-4 bg-neutral-300'
                } rounded-full border-2 border-white shadow-md`}>
                  {index <= activeStep && (
                    <div className="w-full h-full bg-primary rounded-full animate-ping opacity-75"></div>
                  )}
                </div>

                {/* Step Card */}
                <div className={`flex-1 group transition-all duration-500 hover:scale-105 ${
                  index <= activeStep ? 'shadow-2xl shadow-primary/10' : ''
                } ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200 group-hover:border-primary/30 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Illustration */}
                      <div className="flex-shrink-0">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl transition-all duration-300 ${
                          index <= activeStep
                            ? 'bg-gradient-to-br from-primary/10 to-accent/10 shadow-lg'
                            : 'bg-neutral-100'
                        } flex items-center justify-center`}>
                          {step.illustration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center md:text-left flex-1">
                        <div className={`text-4xl md:text-5xl font-display font-black mb-2 md:mb-3 transition-colors duration-300 ${
                          index <= activeStep
                            ? 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
                            : 'text-neutral-300'
                        }`}>
                          {step.step}
                        </div>
                        <h3 className={`text-xl md:text-3xl font-display font-bold mb-3 md:mb-4 transition-colors duration-300 ${
                          index <= activeStep ? 'text-secondary' : 'text-neutral-500'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm md:text-lg leading-relaxed transition-colors duration-300 ${
                          index <= activeStep ? 'text-neutral-600' : 'text-neutral-400'
                        }`}>
                          {step.description}
                        </p>

                        {/* Progress indicator for mobile */}
                        <div className="md:hidden mt-4">
                          <div className="flex justify-center">
                            <div className={`w-3 h-3 rounded-full ${
                              index <= activeStep ? 'bg-primary' : 'bg-neutral-300'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated border effect */}
                    {index <= activeStep && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 opacity-50"></div>
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
