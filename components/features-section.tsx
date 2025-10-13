import { FC } from 'react'
import { Brain, FileText, Shield, Globe, Users, Database, CheckCircle } from 'lucide-react'

interface FeaturesSectionProps {
  className?: string
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ className = '' }) => {
  const features = [
    {
      icon: Brain,
      title: 'Analisis Masalah Hukum AI',
      description:
        'Sistem AI canggih menganalisis masalah hukum Anda secara mendalam dengan akurasi 94%, memberikan konteks lengkap dan rujukan pasal yang relevan.',
      features: ['4 persona AI spesialis', 'Ekstraksi pasal otomatis', 'Tingkat kepercayaan tinggi'],
    },
    {
      icon: FileText,
      title: 'Analisis Dokumen Cerdas',
      description:
        'Upload dokumen hukum (kontrak, surat, bukti) untuk analisis komprehensif. AI mengidentifikasi poin penting dan potensi isu hukum secara otomatis.',
      features: ['Support PDF/DOCX/Gambar', 'OCR & ekstraksi data', 'Ringkasan & rekomendasi aksi'],
    },
    {
      icon: Database,
      title: 'Database Hukum Lengkap',
      description:
        'Akses ke knowledge graph berisi peraturan perundangan, yurisprudensi, dan terminologi hukum Indonesia yang terus diperbarui.',
      features: ['KUHP & regulasi terkini', 'Preseden pengadilan', 'Glossary hukum lengkap'],
    },
    {
      icon: Shield,
      title: 'Keamanan Data Terjamin',
      description:
        'Keamanan tingkat enterprise dengan enkripsi end-to-end, sesi terlindungi PIN, dan audit logging komprehensif untuk melindungi data Anda.',
      features: ['Enkripsi TLS/HTTPS', 'Audit trail lengkap', 'RBAC & PIN protection'],
    },
    {
      icon: Users,
      title: 'Verifikasi Profesional',
      description:
        'Upgrade ke akun profesional untuk mendapat badge terverifikasi dan akses fitur premium dengan proses verifikasi yang aman dan terpercaya.',
      features: ['Upload dokumen profesional', 'Review admin manual', 'Badge & kredibilitas'],
    },
    {
      icon: Globe,
      title: 'Multi-Platform Access',
      description:
        'Akses Pasalku.ai dari berbagai platform dan perangkat. Interface responsif mendukung penggunaan di desktop, tablet, dan smartphone.',
      features: ['Web & mobile responsive', 'Cloud-based access', 'Sync lintas perangkat'],
    },
  ]

  return (
    <section id="features" className={`py-16 md:py-32 px-4 bg-gradient-to-b from-white via-blue-50/20 to-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6 md:mb-8 text-secondary">
            Fitur Unggulan <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pasalku.ai</span>
          </h2>
          <p className="text-lg md:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Teknologi AI terdepan untuk analisis hukum yang akurat, cepat, dan aman
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-neutral-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
              role="article"
              aria-labelledby={`feature-title-${index}`}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-accent rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
              </div>
              <h3 id={`feature-title-${index}`} className="text-xl md:text-2xl font-display font-bold mb-3 md:mb-4 text-secondary">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-neutral-600 mb-4 md:mb-6 leading-relaxed">
                {feature.description}
              </p>
              <div className="space-y-2">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <span className="text-neutral-700">{item}</span>
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
