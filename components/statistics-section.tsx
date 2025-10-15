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
      className={`py-20 md:py-32 px-4 relative scroll-animate bg-gradient-to-b from-white to-gray-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-semibold mb-6">
            <span>📊</span> Data & Fakta
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
            Mengapa Kami <span className="text-orange-600">Hadir</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Data menunjukkan masih banyak tantangan akses keadilan di Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-orange-300 transition-all duration-500 shadow-lg hover:shadow-xl ${
                inView ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 0.1}s`
              }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                  {stat.illustration}
                </div>
              </div>

              {/* Number/Text */}
              <div className="text-center mb-4">
                <div className="text-4xl font-black text-red-600 mb-2">
                  {stat.number !== null ? (
                    <>
                      {inView ? (
                        <>
                          {stat.prefix}
                          {animatedNumbers[index].toFixed(stat.number % 1 === 0 ? 0 : 2)}
                          {stat.suffix}
                        </>
                      ) : (
                        <span className="text-gray-300">0{stat.suffix}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-3xl">{stat.text}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {stat.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-center mb-4 leading-relaxed">
                {stat.description}
              </p>

              {/* Source */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
                <span className="font-medium">Sumber:</span> {stat.source}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Kami hadir untuk menjawab tantangan ini</span>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
