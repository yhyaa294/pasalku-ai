'use client'

import { FC } from 'react'

export const WhyPasalkuSection: FC = () => {
  const stats = [
    {
      icon: '🆔',
      number: '#96/142',
      title: 'Akses Terbatas',
      description: 'Indonesia berada di peringkat 96 dari 142 negara dalam kategori Akses Keadilan Sipil, menandakan celah besar bagi warga.',
      source: 'World Justice Project, 2023',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: '📊',
      number: '56.82',
      title: 'Pemahaman Rendah',
      description: "Indeks Kesadaran Hukum masyarakat masih di kategori 'cukup sadar', mengindikasikan banyak yang belum paham hak & prosedur hukum.",
      source: 'BPHN, 2022',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: '🚫💰',
      number: 'Penghalang Utama',
      title: 'Biaya Mahal',
      description: 'Lembaga Bantuan Hukum menegaskan biaya konsultasi menjadi kendala krusial bagi kelompok rentan mengakses keadilan.',
      source: 'Laporan LBH Jakarta',
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Mengapa <span className="text-orange-600">Pasalku.ai</span> Ada di Sini
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tantangan akses hukum di Indonesia yang ingin kami bantu selesaikan
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-3xl p-8 border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{stat.icon}</div>

              {/* Number */}
              <div className={`text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.number}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {stat.title}
              </h3>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {stat.description}
              </p>

              {/* Source */}
              <div className="text-sm text-gray-500 italic">
                <span className="font-semibold">Sumber:</span> {stat.source}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-100 rounded-full">
            <span className="text-orange-700 font-semibold">
              💡 Pasalku.ai hadir untuk mengatasi hambatan ini dengan teknologi AI
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}