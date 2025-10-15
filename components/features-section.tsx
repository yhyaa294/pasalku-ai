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
        'Dapatkan jawaban hukum cepat dan akurat menggunakan teknologi AI dengan pemahaman konteks hukum Indonesia.',
      features: ['Respons cepat 24/7', 'Referensi Pasal & UU', 'Berbahasa Indonesia'],
    },
    {
      icon: FileText,
      title: 'Analisis Dokumen Cerdas',
      description:
        'Upload dokumen hukum Anda (kontrak, surat, bukti) untuk dianalisis. Dapatkan ringkasan dan rekomendasi.',
      features: ['Format PDF/DOCX/Gambar', 'Ekstraksi poin penting', 'Saran tindak lanjut'],
    },
    {
      icon: Database,
      title: 'Database Hukum Lengkap',
      description:
        'Akses database peraturan perundang-undangan, pasal-pasal, dan terminologi hukum Indonesia yang terupdate.',
      features: ['KUHP & regulasi terbaru', 'Yurisprudensi', 'Istilah hukum Indonesia'],
    },
    {
      icon: Users,
      title: 'Verifikasi Profesional',
      description:
        'Program verifikasi untuk profesional hukum dengan proses yang aman dan akses fitur premium.',
      features: ['Proses verifikasi mudah', 'Badge terverifikasi', 'Fitur profesional'],
    },
    {
      icon: Shield,
      title: 'Keamanan Terjamin',
      description:
        'Data Anda dilindungi dengan enkripsi tingkat tinggi dan sistem keamanan yang terus diperbarui.',
      features: ['Enkripsi HTTPS/TLS', 'Keamanan data pengguna', 'Privasi terjaga'],
    },
    {
      icon: Globe,
      title: 'Mudah Diakses',
      description:
        'Interface berbahasa Indonesia yang mudah dipahami, dapat diakses kapan saja dari mana saja.',
      features: ['Bahasa Indonesia', 'Akses 24/7', 'Mobile & Desktop friendly'],
    },
  ]

  return (
    <section id="features" className={`py-20 md:py-32 px-4 scroll-animate bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
            <span>✨</span> Fitur Unggulan
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
            Semua yang Anda Butuhkan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fitur-fitur unggulan yang membantu Anda memahami dan mengakses informasi hukum dengan mudah.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 scroll-animate-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <div className="space-y-2">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
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
