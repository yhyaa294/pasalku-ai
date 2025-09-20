import { FC } from 'react'
import { Brain, Shield, Clock, CheckCircle } from 'lucide-react'

interface StatisticsSectionProps {
  className?: string
}

export const StatisticsSection: FC<StatisticsSectionProps> = ({ className = '' }) => {
  return (
    <section className={`py-12 md:py-24 px-4 bg-muted/20 scroll-animate ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 animate-text-shimmer">
            Teknologi AI <span className="text-primary">Terpercaya</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Platform AI legal dengan arsitektur yang dirancang untuk memberikan solusi hukum yang akurat dan dapat diandalkan
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            {
              number: "AI Premium",
              label: "Teknologi Terkini",
              icon: Brain,
              desc: "Machine learning terdepan"
            },
            {
              number: "Validasi",
              label: "Sumber Terpercaya",
              icon: Shield,
              desc: "Database hukum Indonesia"
            },
            {
              number: "Real-time",
              label: "Proses Cepat",
              icon: Clock,
              desc: "Analisis dalam hitungan detik"
            },
            {
              number: "Secure",
              label: "Data Aman",
              icon: CheckCircle,
              desc: "Enkripsi end-to-end"
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center group scroll-animate-scale"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-8 hover:shadow-xl transition-all duration-300 border border-border card-3d-premium hover-lift">
                <div className="w-8 h-8 md:w-16 md:h-16 wood-texture rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 legal-shadow animate-cyber-pulse">
                  <stat.icon className="w-4 h-4 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-2xl md:text-4xl font-black text-primary mb-2 md:mb-3 animate-text-shimmer">
                  {stat.number}
                </div>
                <div className="text-sm md:text-lg font-bold text-foreground mb-1 md:mb-2">{stat.label}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
