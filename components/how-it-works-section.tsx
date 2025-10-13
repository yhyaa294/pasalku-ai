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
      title: "Ceritakan Masalah Anda",
      description:
        "Sampaikan permasalahan hukum Anda dengan bahasa sehari-hari. AI kami siap mendengarkan dan memahami konteks kasus Anda.",
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      step: "02",
      title: "AI Menganalisis",
      description:
        "Teknologi dual AI engine kami memproses kasus Anda, mencari referensi hukum relevan, dan menganalisis dengan akurasi tinggi.",
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      step: "03",
      title: "Upload Bukti (Opsional)",
      description:
        "Tambahkan dokumen, foto, atau bukti pendukung untuk analisis yang lebih komprehensif dan akurat.",
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      step: "04",
      title: "Dapatkan Solusi Lengkap",
      description:
        "Terima analisis hukum lengkap dengan referensi UU, saran tindakan, dan confidence score dalam hitungan detik.",
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
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
      className={`py-20 lg:py-32 px-4 bg-gradient-to-b from-white via-neutral-50 to-white scroll-animate ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6 text-secondary">
            Cara Kerja <span className="text-primary">Pasalku.ai</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            4 langkah mudah untuk mendapatkan solusi hukum yang akurat dan terpercaya
          </p>
        </div>

        <div className="relative">
          {/* Horizontal Timeline for Desktop */}
          <div className="hidden md:flex justify-between items-center mb-16">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ${
                    index <= activeStep
                      ? 'bg-gradient-to-br from-primary to-blue-600 shadow-lg scale-110'
                      : 'bg-gray-300'
                  }`}>
                    {step.step}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4">
                    <div className="h-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                        style={{ width: index < activeStep ? '100%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-6 lg:p-8 border transition-all duration-300 scroll-animate-scale ${
                  index <= activeStep
                    ? 'border-primary/30 shadow-xl'
                    : 'border-gray-200 hover:border-primary/20 hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Mobile Step Number */}
                <div className="md:hidden mb-4">
                  <div className={`inline-flex w-12 h-12 rounded-full items-center justify-center text-white font-bold ${
                    index <= activeStep
                      ? 'bg-gradient-to-br from-primary to-blue-600'
                      : 'bg-gray-300'
                  }`}>
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className={`flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl mb-6 transition-all duration-300 ${
                  index <= activeStep
                    ? 'bg-gradient-to-br from-primary/10 to-blue-100 text-primary'
                    : 'bg-gray-100 text-gray-400'
                } group-hover:scale-110`}>
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className={`text-xl lg:text-2xl font-display font-bold mb-3 transition-colors duration-300 ${
                  index <= activeStep ? 'text-secondary' : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className={`text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
                  index <= activeStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
