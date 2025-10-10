import React, { FC } from 'react'
import { Keyboard, MessageSquare, FilePlus, Tablet, ChevronRight } from 'lucide-react'

interface HowItWorksSectionProps {
  className?: string
}

export const HowItWorksSection: FC<HowItWorksSectionProps> = ({ className = '' }) => {
  const steps = [
    {
      step: "01",
      title: "Uraikan Perkara Anda.",
      description:
        "Sampaikan permasalahan hukum Anda dalam bahasa sehari-hari. Kecerdasan artifisial kami siap menyimak setiap detailnya.",
      icon: Keyboard,
      color: "from-blue-500 to-cyan-500",
      philosophy: "Menggambarkan kesederhanaan proses berbagi masalah pribadi."
    },
    {
      step: "02",
      title: "Jawab Klarifikasi Artifisial.",
      description:
        "AI akan mengajukan pertanyaan-pertanyaan krusial untuk menggali konteks, layaknya dialog dengan konsultan hukum.",
      icon: MessageSquare,
      color: "from-purple-500 to-pink-500",
      philosophy: "Menekankan interaksi cerdas dan pengumpulan informasi yang mendalam."
    },
    {
      step: "03",
      title: "Unggah Bukti Pendukung.",
      description:
        "Sertakan dokumen, foto, atau bukti lain yang relevan secara aman untuk analisis yang lebih komprehensif.",
      icon: FilePlus,
      color: "from-green-500 to-emerald-500",
      philosophy: "Menekankan keamanan data dan pentingnya bukti dalam konteks hukum."
    },
    {
      step: "04",
      title: "Terima Analisis Berdasar Hukum.",
      description:
        "Dapatkan ringkasan masalah, opsi penyelesaian, dan rujukan hukum relevan, disajikan dalam bahasa yang mudah dipahami.",
      icon: Tablet,
      color: "from-orange-500 to-red-500",
      philosophy: "Menunjukkan hasil akhir berupa kejelasan dan informasi yang tervalidasi."
    },
  ]

  return (
    <section id="how-it-works" className={`py-16 md:py-32 px-4 bg-gradient-to-b from-gray-100 via-slate-50 to-gray-200 scroll-animate ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Bagaimana Pasalku.ai <span className="text-primary">Mendampingi Anda</span>
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
            Tiga Langkah Mudah Menuju Kejelasan Hukum.
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
                  title={step.philosophy}
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
