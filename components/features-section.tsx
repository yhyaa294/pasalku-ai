import { FC } from 'react'
import { Brain, FileText, Shield, Globe, Users, Database, CheckCircle } from 'lucide-react'

interface FeaturesSectionProps {
  className?: string
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ className = '' }) => {
  const features = [
    {
      icon: Brain,
      title: 'Konsultasi Hukum Instan',
      description:
        'Jawaban cepat dan akurat didukung AI (BytePlus Ark) dengan pemahaman konteks hukum Indonesia.',
      features: ['4 persona AI', 'Citation extraction (Pasal/UU)', 'Confidence score'],
    },
    {
      icon: FileText,
      title: 'Analisis Dokumen Cerdas',
      description:
        'Unggah dokumen untuk dianalisis (kontrak, surat, bukti). Ekstraksi poin penting dan isu hukum.',
      features: ['Dukungan PDF/DOCX/Gambar', 'OCR & NER', 'Ringkasan & rekomendasi'],
    },
    {
      icon: Database,
      title: 'Basis Pengetahuan Hukum',
      description:
        'Knowledge Graph (EdgeDB) berisi peraturan, pasal, yurisprudensi, dan terminologi hukum.',
      features: ['KUHP & regulasi', 'Preseden pengadilan', 'Terminologi hukum'],
    },
    {
      icon: Users,
      title: 'Verifikasi Profesional Hukum',
      description:
        'Upgrade akun untuk lencana profesional dan akses fitur premium dengan proses verifikasi aman.',
      features: ['Upload dokumen', 'Review admin', 'Badge terverifikasi'],
    },
    {
      icon: Shield,
      title: 'Keamanan Data Terjamin',
      description:
        'Keamanan tingkat enterprise: enkripsi, PIN-protected sessions, dan audit logging menyeluruh.',
      features: ['TLS/HTTPS', 'Audit trail', 'RBAC & PIN'],
    },
    {
      icon: Globe,
      title: 'Dukungan Multi-Bahasa',
      description:
        'Antarmuka dan jawaban AI siap mendukung Bahasa Indonesia; ekspansi multi-bahasa ke depan.',
      features: ['Bahasa Indonesia', 'Terminologi hukum lokal', 'Rencana multi-bahasa'],
    },
  ]

  return (
    <section id="features" className={`py-16 md:py-32 px-4 scroll-animate bg-gradient-to-b from-slate-100 via-gray-50 to-slate-200 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Kekuatan <span className="text-primary">Pasalku.ai</span> di Tangan Anda
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-slide-in-bottom">
            Sorotan kemampuan inti yang membuat pengalaman konsultasi hukum Anda cepat, akurat, dan aman.
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
