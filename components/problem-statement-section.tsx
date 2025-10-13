'use client'

import { FC } from 'react'
import { AlertCircle, Scale, FileQuestion, Clock } from 'lucide-react'

interface ProblemStatementSectionProps {
  className?: string
}

export const ProblemStatementSection: FC<ProblemStatementSectionProps> = ({ className = '' }) => {
  const problems = [
    {
      icon: Scale,
      title: 'Akses Hukum Terbatas',
      description: 'Konsultasi hukum tradisional sering kali mahal dan sulit dijangkau oleh masyarakat umum.',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: FileQuestion,
      title: 'Informasi Hukum Kompleks',
      description: 'Bahasa hukum yang rumit membuat masyarakat kesulitan memahami hak dan kewajiban mereka.',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      icon: Clock,
      title: 'Proses Yang Memakan Waktu',
      description: 'Mendapatkan jawaban hukum dasar bisa memakan waktu berhari-hari bahkan berminggu-minggu.',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: AlertCircle,
      title: 'Kurangnya Kesadaran Hukum',
      description: 'Banyak orang tidak tahu harus kemana atau bagaimana mencari bantuan hukum yang tepat.',
      color: 'from-orange-600 to-red-500',
    },
  ]

  return (
    <section
      id="problem-statement"
      className={`py-16 md:py-32 px-4 bg-gradient-to-b from-white via-orange-50/30 to-white scroll-animate ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-red-100/80 backdrop-blur-sm border border-red-200 text-sm font-semibold text-red-700 mb-6 animate-bounce">
            <AlertCircle className="w-4 h-4 mr-2" />
            Tantangan Yang Dihadapi
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Masalah Hukum Yang Sering Dihadapi{' '}
            <span className="block md:inline bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Masyarakat Indonesia
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Memahami dan mengakses keadilan hukum seharusnya tidak menjadi privilege, tetapi hak setiap warga negara.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative scroll-animate-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`}></div>

              {/* Card */}
              <div className="relative bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-lg h-full">
                {/* Icon */}
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${problem.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <problem.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {problem.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {problem.description}
                </p>

                {/* Animated bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${problem.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <p className="text-lg md:text-xl text-gray-700 font-semibold mb-6">
            Saatnya untuk Perubahan. Solusi Modern untuk Masalah Hukum Modern.
          </p>
          <div className="inline-flex items-center gap-4 text-sm text-gray-600 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Solusi Inovatif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Mudah Diakses</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
