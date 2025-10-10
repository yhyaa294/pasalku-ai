import { FC } from 'react'
import { MapPin, BookOpen, Wallet } from 'lucide-react'

interface StatisticsSectionProps {
  className?: string
}

export const StatisticsSection: FC<StatisticsSectionProps> = ({ className = '' }) => {
  const stats = [
    {
      title: "Akses Terbatas",
      number: "Peringkat 96/142",
      description: "Indonesia berada di peringkat 96 dari 142 negara dalam kategori Akses Keadilan Sipil, menandakan celah besar bagi warga.",
      icon: MapPin,
      source: "World Justice Project, 2023"
    },
    {
      title: "Pemahaman Rendah",
      number: "Indeks 56.82",
      description: "Indeks Kesadaran Hukum masyarakat masih di kategori 'cukup sadar', mengindikasikan banyak yang belum paham hak & prosedur hukum.",
      icon: BookOpen,
      source: "BPHN, 2022"
    },
    {
      title: "Biaya Mahal",
      number: "Penghalang Utama",
      description: "Lembaga Bantuan Hukum menegaskan biaya konsultasi menjadi kendala krusial bagi kelompok rentan mengakses keadilan.",
      icon: Wallet,
      source: "Laporan LBH Jakarta"
    },
  ]

  return (
    <section className={`py-12 md:py-24 px-4 bg-muted/20 scroll-animate ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 animate-text-shimmer">
            Realita Akses <span className="text-primary">Keadilan di Indonesia</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Data Validasi Tantangan yang Dihadapi Masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group scroll-animate-scale glass-card rounded-xl md:rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 border border-border card-3d-premium hover-lift"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 wood-texture rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 legal-shadow animate-cyber-pulse">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-2xl md:text-4xl font-black text-primary mb-2 md:mb-3 animate-text-shimmer">
                {stat.number}
              </div>
              <div className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">{stat.title}</div>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">{stat.description}</p>
              <div className="text-xs md:text-sm text-muted-foreground italic">Sumber: {stat.source}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
