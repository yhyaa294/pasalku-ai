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
      title: "Tanyakan Pertanyaan Anda",
      description:
        "Ketik pertanyaan hukum Anda dalam bahasa Indonesia yang natural. Tidak perlu menggunakan istilah legal yang rumit.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-bounce">💬</div>
        </div>
      ),
      alt: "Pengguna bertanya"
    },
    {
      step: "02",
      title: "AI Memproses & Menganalisis",
      description:
        "AI kami menganalisis pertanyaan Anda, memahami konteks, dan mencari informasi dari database hukum Indonesia.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-pulse">🤖</div>
        </div>
      ),
      alt: "AI menganalisis"
    },
    {
      step: "03",
      title: "Dapatkan Jawaban Lengkap",
      description:
        "Terima jawaban yang jelas dengan referensi pasal, penjelasan, dan rekomendasi tindak lanjut yang bisa Anda lakukan.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-bounce">📋</div>
        </div>
      ),
      alt: "Menerima jawaban"
    },
    {
      step: "04",
      title: "Lanjutkan atau Simpan",
      description:
        "Ajukan pertanyaan lanjutan jika perlu, upload dokumen untuk analisis lebih detail, atau simpan riwayat konsultasi Anda.",
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-pulse">💾</div>
        </div>
      ),
      alt: "Lanjutkan atau simpan"
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
      className={`py-16 md:py-32 px-4 bg-gradient-to-br from-orange-50 via-white to-blue-50 scroll-animate relative overflow-hidden ${className}`}
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6">
            <span>⚡</span> Super Simple
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="text-gray-900">Cara Kerja </span>
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Pasalku.ai</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Hanya 4 langkah untuk mendapatkan solusi hukum Anda
          </p>
        </div>

        {/* Timeline with cards */}
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute left-0 right-0 top-24 h-1 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Number Badge */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-lg transition-all duration-300 group-hover:scale-110 ${
                      index % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                      index % 4 === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                      index % 4 === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                      'bg-gradient-to-br from-green-500 to-green-600'
                    }`}>
                      {step.step}
                    </div>
                    <div className={`absolute -inset-2 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity ${
                      index % 4 === 0 ? 'bg-blue-400' :
                      index % 4 === 1 ? 'bg-purple-400' :
                      index % 4 === 2 ? 'bg-orange-400' :
                      'bg-green-400'
                    }`}></div>
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 min-h-[280px]">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`text-6xl transform group-hover:scale-110 transition-transform duration-300 ${
                      index <= activeStep ? 'animate-bounce' : ''
                    }`}>
                      {step.illustration}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative bottom accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 ${
                    index % 4 === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                    index % 4 === 1 ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                    index % 4 === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                    'bg-gradient-to-r from-green-400 to-green-500'
                  } opacity-0 group-hover:opacity-100`}></div>
                </div>

                {/* Arrow for desktop */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-6 text-orange-400 text-4xl z-20">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Coba Sekarang Gratis →
          </button>
        </div>
      </div>
    </section>
  )
}
