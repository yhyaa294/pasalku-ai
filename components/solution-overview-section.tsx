'use client'

import { FC } from 'react'
import { Sparkles, Target, Zap, Shield } from 'lucide-react'

interface SolutionOverviewSectionProps {
  className?: string
}

export const SolutionOverviewSection: FC<SolutionOverviewSectionProps> = ({ className = '' }) => {
  const steps = [
    {
      number: '01',
      title: 'Tanyakan Masalah Anda',
      description: 'Sampaikan pertanyaan hukum Anda dalam bahasa sehari-hari. AI kami siap mendengarkan.',
      icon: '💬',
    },
    {
      number: '02',
      title: 'AI Menganalisis',
      description: 'Dual AI engine kami memproses pertanyaan dengan database hukum Indonesia yang komprehensif.',
      icon: '🤖',
    },
    {
      number: '03',
      title: 'Dapatkan Solusi',
      description: 'Terima jawaban yang akurat, lengkap dengan rujukan pasal dan rekomendasi langkah selanjutnya.',
      icon: '✅',
    },
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Cepat & Efisien',
      description: 'Dapatkan jawaban dalam hitungan detik, bukan hari atau minggu.',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Target,
      title: 'Akurat & Terpercaya',
      description: 'Akurasi 94.1% didukung oleh dual AI engine dan database hukum terkini.',
      color: 'from-blue-400 to-purple-500',
    },
    {
      icon: Shield,
      title: 'Aman & Terjamin',
      description: 'Data Anda dilindungi dengan enkripsi tingkat enterprise dan keamanan berlapis.',
      color: 'from-green-400 to-teal-500',
    },
    {
      icon: Sparkles,
      title: 'Mudah Digunakan',
      description: 'Interface intuitif yang dirancang untuk semua kalangan, tanpa jargon hukum yang rumit.',
      color: 'from-pink-400 to-red-500',
    },
  ]

  return (
    <section
      id="solution-overview"
      className={`py-16 md:py-32 px-4 bg-gradient-to-b from-white via-blue-50/30 to-white scroll-animate ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100/80 backdrop-blur-sm border border-blue-200 text-sm font-semibold text-blue-700 mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 mr-2" />
            Solusi Inovatif
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Bagaimana AI Membantu{' '}
            <span className="block md:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Menyelesaikan Masalah Hukum
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Teknologi kecerdasan buatan yang membuat akses keadilan hukum menjadi mudah, cepat, dan terjangkau untuk semua.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16 md:mb-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative scroll-animate-scale"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connecting Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-full w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 transform -translate-x-1/2 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                )}

                {/* Step Card */}
                <div className="relative bg-white rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-lg z-10">
                  {/* Step Number */}
                  <div className="absolute -top-6 left-8 text-6xl font-black text-blue-100 select-none">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="relative text-6xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Manfaat Yang Anda Dapatkan
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative scroll-animate-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}></div>

                {/* Card */}
                <div className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl shadow-md h-full">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 text-sm text-gray-600 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Teknologi Terdepan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Hasil Terpercaya</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
