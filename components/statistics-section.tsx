import { FC, useState, useEffect, useRef } from 'react'
import { MapPin, BookOpen, Wallet } from 'lucide-react'

interface StatisticsSectionProps {
  className?: string
}

export const StatisticsSection: FC<StatisticsSectionProps> = ({ className = '' }) => {
  const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0])
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    {
      title: "Akses Terbatas",
      number: 96,
      suffix: "/142",
      prefix: "Peringkat ",
      description: "Indonesia berada di peringkat 96 dari 142 negara dalam kategori Akses Keadilan Sipil, menandakan celah besar bagi warga.",
      icon: MapPin,
      source: "World Justice Project, 2023",
      illustration: "/stat1-illustration.svg", // Placeholder untuk peta Indonesia dengan pagar
      alt: "Ikon peta Indonesia yang sebagian tertutup oleh pagar kawat atau gerbang yang menghalangi akses."
    },
    {
      title: "Pemahaman Rendah",
      number: 56.82,
      suffix: "",
      prefix: "Indeks ",
      description: "Indeks Kesadaran Hukum masyarakat masih di kategori 'cukup sadar', mengindikasikan banyak yang belum paham hak & prosedur hukum.",
      icon: BookOpen,
      source: "BPHN, 2022",
      illustration: "/stat2-illustration.svg", // Placeholder untuk kepala manusia dengan tanda tanya
      alt: "Ilustrasi kepala manusia dengan gelembung pertanyaan yang rumit berubah menjadi tanda tanya sederhana yang besar."
    },
    {
      title: "Biaya Mahal",
      number: null,
      suffix: "",
      prefix: "",
      text: "Penghalang Utama",
      description: "Lembaga Bantuan Hukum menegaskan biaya konsultasi menjadi kendala krusial bagi kelompok rentan mengakses keadilan.",
      icon: Wallet,
      source: "Laporan LBH Jakarta",
      illustration: "/stat3-illustration.svg", // Placeholder untuk dompet kosong dengan koin terbang
      alt: "Ikon dompet kosong yang dikelilingi oleh koin-koin yang terbang menjauh, atau tangan yang mencoba meraih tas uang yang terlalu tinggi."
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat, index) => {
              if (stat.number !== null) {
                animateNumber(index, stat.number)
              }
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animateNumber = (index: number, target: number) => {
    const duration = 2000 // 2 seconds
    const start = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - start) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3) // Ease out cubic
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
    <section ref={sectionRef} className={`py-12 md:py-24 px-4 bg-neutral-50 scroll-animate ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 animate-text-shimmer">
            Realita Akses <span className="text-primary">Keadilan di Indonesia</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Data Validasi Tantangan yang Dihadapi Masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group scroll-animate-scale glass-card rounded-xl md:rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 border border-neutral-200 hover-lift"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex justify-center mb-4 md:mb-6">
                <img
                  src={stat.illustration}
                  alt={stat.alt}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-2xl md:text-4xl font-black text-primary mb-2 md:mb-3 animate-text-shimmer">
                {stat.number !== null ? (
                  <>
                    {stat.prefix}{animatedNumbers[index].toFixed(stat.number % 1 === 0 ? 0 : 2)}{stat.suffix}
                  </>
                ) : (
                  stat.text
                )}
              </div>
              <div className="text-lg md:text-xl font-bold text-secondary mb-2 md:mb-3">{stat.title}</div>
              <p className="text-sm md:text-base text-neutral-600 mb-4 md:mb-6 leading-relaxed">{stat.description}</p>
              <div className="text-xs md:text-sm text-neutral-500 italic">Sumber: {stat.source}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
