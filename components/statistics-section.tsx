'use client'

import { FC, useState, useEffect, useRef } from 'react'

interface StatisticsSectionProps {
  className?: string
}

export const StatisticsSection: FC<StatisticsSectionProps> = ({ className = '' }) => {
  const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0])
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    {
      title: "Akses Terbatas",
      number: 96,
      suffix: "/142",
      prefix: "#",
      description: "Indonesia berada di peringkat 96 dari 142 negara dalam kategori Akses Keadilan Sipil, menandakan celah besar bagi warga.",
      source: "World Justice Project, 2023",
      illustration: (
        <div className="text-center relative">
          <div className="relative inline-block">
            <div className="text-5xl mb-2">🇮🇩</div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
              96
            </div>
          </div>
        </div>
      ),
      alt: "Indonesia ranking 96",
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Pemahaman Rendah",
      number: 56.82,
      suffix: "",
      prefix: "",
      description: "Indeks Kesadaran Hukum masyarakat masih di kategori 'cukup sadar', mengindikasikan banyak yang belum paham hak & prosedur hukum.",
      source: "BPHN, 2022",
      illustration: (
        <div className="text-center relative">
          <div className="relative">
            <div className="text-5xl">🧠</div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-1">
                <div className="w-2 h-6 bg-yellow-400 rounded-sm"></div>
                <div className="w-2 h-6 bg-yellow-400 rounded-sm"></div>
                <div className="w-2 h-6 bg-yellow-400 rounded-sm"></div>
                <div className="w-2 h-6 bg-gray-300 rounded-sm"></div>
                <div className="w-2 h-6 bg-gray-300 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      ),
      alt: "Low legal awareness",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Biaya Mahal",
      number: null,
      suffix: "",
      prefix: "",
      text: "Penghalang Utama",
      description: "Lembaga Bantuan Hukum menegaskan biaya konsultasi menjadi kendala krusial bagi kelompok rentan mengakses keadilan.",
      source: "Laporan LBH Jakarta",
      illustration: (
        <div className="text-center relative">
          <div className="relative inline-block">
            <div className="text-5xl">💸</div>
            <div className="absolute -top-2 -right-2">
              <svg className="w-8 h-8 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      ),
      alt: "High cost barrier",
      color: "from-orange-500 to-red-500"
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            stats.forEach((stat, index) => {
              if (stat.number !== null) {
                animateNumber(index, stat.number)
              }
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animateNumber = (index: number, target: number) => {
    const duration = 2500 // 2.5 seconds for more dramatic effect
    const start = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - start) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4) // Ease out quartic for more dramatic effect
      const currentValue = startValue + (target - startValue) * easeOut

      setAnimatedNumbers(prev => {
        const newNumbers = [...prev]
        newNumbers[index] = currentValue
        return newNumbers
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  return (
    <section
      id="statistics"
      ref={sectionRef}
      className={`py-16 md:py-32 px-4 relative bg-gradient-to-b from-white to-gray-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            Mengapa <span className="text-orange-600">Pasalku.ai</span> Ada di Sini
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Tantangan akses hukum di Indonesia yang ingin kami bantu selesaikan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg ${
                inView ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 0.15}s`
              }}
            >
              {/* Icon/Illustration - Simple & Clean */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                  {stat.illustration}
                </div>
              </div>

              {/* Number/Text - Clean Typography */}
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {stat.number !== null ? (
                    <>
                      {inView ? (
                        <>
                          {stat.prefix}{animatedNumbers[index].toFixed(stat.number % 1 === 0 ? 0 : 2)}{stat.suffix}
                        </>
                      ) : (
                        <span className="text-gray-300">0{stat.suffix}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl">{stat.text}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {stat.title}
                </h3>
              </div>

              {/* Description - Readable */}
              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                {stat.description}
              </p>

              {/* Source - Subtle */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
                <span className="font-medium">Sumber:</span> {stat.source}
              </div>
            </div>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 font-medium">
            💡 Kami hadir untuk membantu mengatasi tantangan ini
          </p>
        </div>
      </div>
    </section>
  )
}
