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
      prefix: "Peringkat ",
      description: "Indonesia berada di peringkat 96 dari 142 negara dalam kategori Akses Keadilan Sipil, menandakan celah besar bagi warga.",
      source: "World Justice Project, 2023",
      illustration: (
        <div className="text-center">
          <div className="text-6xl animate-bounce">🇮🇩🔒</div>
        </div>
      ),
      alt: "Ikon peta Indonesia yang sebagian tertutup oleh pagar kawat atau gerbang yang menghalangi akses."
    },
    {
      title: "Pemahaman Rendah",
      number: 56.82,
      suffix: "",
      prefix: "Indeks ",
      description: "Indeks Kesadaran Hukum masyarakat masih di kategori 'cukup sadar', mengindikasikan banyak yang belum paham hak & prosedur hukum.",
      source: "BPHN, 2022",
      illustration: (
        <div className="text-center">
          <div className="text-6xl animate-pulse">🧠❓</div>
        </div>
      ),
      alt: "Ilustrasi kepala manusia dengan gelembung pertanyaan yang rumit berubah menjadi tanda tanya sederhana yang besar."
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
        <div className="text-center">
          <div className="text-6xl animate-bounce">💰🚫</div>
        </div>
      ),
      alt: "Ikon dompet kosong dengan koin terbang menjauh"
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
      className={`py-16 md:py-32 px-4 relative scroll-animate ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-orange-100/30 to-red-100/30 rounded-full blur-2xl animate-levitate"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-br from-red-100/30 to-yellow-100/30 rounded-full blur-2xl animate-ping"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-yellow-100/30 to-orange-100/30 rounded-full blur-xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-6xl font-black mb-6 md:mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Realita Akses <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Keadilan</span>{' '}
            <span className="block md:inline">di Indonesia</span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Data Validasi Tantangan yang Dihadapi Masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group scroll-animate-scale relative ${
                inView ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
              } transition-all duration-700 ease-out`}
              style={{
                animationDelay: `${index * 0.2}s`,
                transitionDelay: `${index * 0.1}s`
              }}
            >
              {/* Dramatic Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-3xl transform rotate-3 scale-105 group-hover:rotate-2 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-orange-500/10 rounded-3xl transform -rotate-2 scale-110 group-hover:-rotate-3 transition-transform duration-500"></div>

              {/* Main Card */}
              <div className="relative bg-white rounded-3xl p-8 md:p-12 border border-gray-200 hover:border-orange-300 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl shadow-lg group-hover:shadow-orange-500/20">

                {/* Animated Border Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse"></div>

                {/* Dramatic Illustration */}
                <div className="flex justify-center mb-6 md:mb-8 relative">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-gray-100 to-orange-100 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-orange-200 group-hover:border-orange-300">
                    {stat.illustration}
                  </div>

                  {/* Animated Glow Effect */}
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-orange-300/20 to-red-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                </div>

                {/* Animated Number/Text */}
                <div className="text-3xl md:text-5xl font-black mb-4 md:mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent animate-pulse">
                  {stat.number !== null ? (
                    <>
                      {inView ? (
                        <>
                          {stat.prefix}
                          {animatedNumbers[index].toFixed(stat.number % 1 === 0 ? 0 : 2)}
                          {stat.suffix}
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                        </>
                      ) : (
                        <span className="text-gray-300">0{stat.suffix}</span>
                      )}
                    </>
                  ) : (
                    <div className="relative">
                      <span className="text-2xl md:text-4xl">{stat.text}</span>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 group-hover:text-orange-600 transition-colors duration-300">
                  {stat.title}
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
                  {stat.description}
                </p>

                {/* Source with subtle styling */}
                <div className="text-xs md:text-sm text-gray-500 border-t border-gray-200 pt-4">
                  <span className="font-medium">Sumber:</span> {stat.source}
                </div>

                {/* Animated bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Dramatic Call to Action at bottom */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 text-sm text-gray-600 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-orange-600">Data Valid & Terkini</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Menggambarkan Realita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
              <span className="font-semibold">Solusi Diperlukan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
