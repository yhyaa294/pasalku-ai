import { FC } from 'react'
import { Brain, FileText, Shield, Globe, Users, Database, CheckCircle } from 'lucide-react'

interface FeaturesSectionProps {
  className?: string
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ className = '' }) => {
  // Primary feature - Legal Analysis (larger, more prominent)
  const primaryFeature = {
    icon: Brain,
    title: 'Analisis Masalah Hukum',
    description:
      'AI menganalisis kasus Anda dengan referensi UU dan putusan pengadilan yang relevan. Dapatkan analisis mendalam dengan confidence score dan citation extraction.',
    features: ['Dual AI Engine (BytePlus Ark + GPT-4)', 'Referensi UU & Putusan Pengadilan', 'Confidence Score & Citation', '4 Persona AI Profesional'],
  }

  // Secondary features
  const features = [
    {
      icon: FileText,
      title: 'Analisis Dokumen Cerdas',
      description:
        'Upload dokumen hukum untuk analisis otomatis. Ekstraksi poin penting dan identifikasi isu hukum.',
      features: ['PDF/DOCX/Gambar', 'OCR & NER', 'Ringkasan Otomatis'],
    },
    {
      icon: Database,
      title: 'Knowledge Graph Hukum',
      description:
        'Akses basis pengetahuan hukum lengkap dengan peraturan, pasal, dan yurisprudensi terkini.',
      features: ['KUHP & Regulasi', 'Preseden Pengadilan', 'Terminologi Hukum'],
    },
    {
      icon: Globe,
      title: 'Multi-bahasa Support',
      description:
        'Interface dan respons AI dalam Bahasa Indonesia dengan dukungan terminologi hukum lokal.',
      features: ['Bahasa Indonesia', 'Terminologi Lokal', 'Ekspansi Multi-bahasa'],
    },
    {
      icon: Shield,
      title: 'Keamanan Data Terjamin',
      description:
        'Keamanan tingkat enterprise dengan enkripsi, PIN-protected sessions, dan audit logging.',
      features: ['TLS/HTTPS', 'Audit Trail', 'RBAC & PIN'],
    },
    {
      icon: Users,
      title: 'Verifikasi Profesional',
      description:
        'Upgrade ke akun profesional dengan badge terverifikasi dan akses fitur premium.',
      features: ['Upload Dokumen', 'Review Admin', 'Badge Profesional'],
    },
  ]

  return (
    <section id="features" className={`py-20 lg:py-32 px-4 bg-gradient-to-b from-white via-neutral-50 to-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6 text-secondary">
            Fitur <span className="text-primary">Pasalku.ai</span> untuk Anda
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Platform AI konsultasi hukum dengan teknologi terdepan untuk memberikan solusi hukum yang akurat dan terpercaya
          </p>
        </div>

        {/* Primary Feature - Large Card */}
        <div className="mb-8 scroll-animate-scale">
          <div className="relative group bg-gradient-to-br from-primary/5 via-blue-50 to-primary/5 rounded-3xl p-8 lg:p-12 border-2 border-primary/20 hover:border-primary/40 hover:shadow-2xl transition-all duration-300">
            {/* Accent corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-full"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <primaryFeature.icon className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-display font-bold mb-4 text-secondary">
                  {primaryFeature.title}
                </h3>
                
                <p className="text-base lg:text-lg text-gray-600 mb-6 leading-relaxed">
                  {primaryFeature.description}
                </p>

                <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 hover:shadow-lg transition-all duration-300">
                  <span>Coba Sekarang</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {primaryFeature.features.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:bg-white transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Features - Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 scroll-animate-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-blue-100 mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
              </div>
              
              <h3 className="text-xl lg:text-2xl font-display font-bold mb-3 text-secondary">
                {feature.title}
              </h3>
              
              <p className="text-sm lg:text-base text-gray-600 mb-5 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
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
