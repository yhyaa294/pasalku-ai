import { FC } from 'react'
import { Brain, Search, FileText, Shield, Globe, TrendingUp, CheckCircle } from 'lucide-react'

interface FeaturesSectionProps {
  className?: string
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ className = '' }) => {
  const features = [
    {
      icon: Brain,
      title: "AI Legal Analysis",
      description:
        "Analisis mendalam menggunakan machine learning terdepan dengan database hukum Indonesia terlengkap. Mampu memahami konteks dan nuansa hukum yang kompleks.",
      features: ["Natural Language Processing", "Deep Learning Algorithm", "Contextual Understanding"],
    },
    {
      icon: Search,
      title: "Smart Legal Search",
      description:
        "Pencarian cerdas yang memahami intent pengguna dan memberikan hasil yang relevan dari ribuan dokumen hukum, peraturan, dan yurisprudensi terkini.",
      features: ["Semantic Search", "Auto-Complete", "Filtered Results"],
    },
    {
      icon: FileText,
      title: "Document Generator",
      description:
        "Generator dokumen hukum otomatis yang dapat membuat kontrak, surat kuasa, dan dokumen legal lainnya sesuai standar hukum Indonesia.",
      features: ["Template Library", "Custom Fields", "Legal Compliance"],
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description:
        "Keamanan tingkat enterprise dengan enkripsi end-to-end, compliance GDPR, dan perlindungan data pribadi yang ketat sesuai standar internasional.",
      features: ["256-bit Encryption", "GDPR Compliant", "Zero-Log Policy"],
    },
    {
      icon: Globe,
      title: "Multi-Jurisdiction",
      description:
        "Dukungan untuk berbagai yurisdiksi hukum Indonesia dari tingkat daerah hingga nasional, termasuk hukum adat dan peraturan khusus.",
      features: ["National Law", "Regional Regulations", "Customary Law"],
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description:
        "Dashboard analitik yang memberikan insights mendalam tentang tren hukum, statistik kasus, dan prediksi outcome berdasarkan data historis.",
      features: ["Trend Analysis", "Case Prediction", "Success Rate"],
    },
  ]

  return (
    <section className={`py-16 md:py-32 px-4 scroll-animate bg-gradient-to-b from-slate-100 via-gray-50 to-slate-200 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Fitur <span className="text-primary">Revolusioner</span>
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
            Teknologi AI terdepan yang menghadirkan solusi hukum komprehensif dengan akurasi tinggi dan kemudahan
            penggunaan yang luar biasa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border hover:shadow-xl transition-all duration-300 group hover-lift scroll-animate-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 wood-texture rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 legal-shadow animate-cyber-pulse">
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary animate-text-shimmer">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                {feature.description}
              </p>
              <div className="space-y-2">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-primary animate-cyber-pulse" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
