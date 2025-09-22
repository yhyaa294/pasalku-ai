import { FC } from 'react'
import { MessageSquare, Brain, Search, FileText, ChevronRight } from 'lucide-react'

interface HowItWorksSectionProps {
  className?: string
}

export const HowItWorksSection: FC<HowItWorksSectionProps> = ({ className = '' }) => {
  const steps = [
    {
      step: "01",
      title: "Input Pertanyaan",
      description:
        "Masukkan pertanyaan hukum Anda dalam bahasa natural. AI kami memahami konteks dan nuansa bahasa Indonesia dengan sempurna.",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02",
      title: "AI Processing",
      description:
        "Sistem AI menganalisis pertanyaan menggunakan database hukum terlengkap dan algoritma machine learning terdepan.",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "03",
      title: "Legal Research",
      description:
        "Pencarian mendalam di ribuan dokumen hukum, yurisprudensi, dan peraturan terkini untuk menemukan referensi yang relevan.",
      icon: Search,
      color: "from-green-500 to-emerald-500",
    },
    {
      step: "04",
      title: "Hasil Komprehensif",
      description:
        "Dapatkan jawaban lengkap dengan analisis, referensi hukum, dan rekomendasi tindakan yang dapat langsung diimplementasikan.",
      icon: FileText,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section className={`py-16 md:py-32 px-4 bg-gradient-to-b from-gray-100 via-slate-50 to-gray-200 scroll-animate ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Cara <span className="text-primary">Kerja</span> Platform
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
            Proses sederhana namun powerful yang mengubah pertanyaan hukum kompleks menjadi jawaban yang jelas dan
            actionable dalam hitungan detik
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group scroll-animate-scale"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border hover:shadow-xl transition-all duration-300 hover-lift">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${step.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 legal-shadow`}
                >
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-primary/20 mb-2 md:mb-3 animate-text-shimmer">
                  {step.step}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="w-8 h-8 text-primary/30 animate-wave" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
