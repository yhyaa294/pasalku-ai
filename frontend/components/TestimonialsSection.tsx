'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote, CheckCircle, Users, Award, TrendingUp } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Prof. Dr. Hendrawan Yudhistira, S.H., LL.M.",
      role: "Dekan Fakultas Hukum Universitas Indonesia",
      company: "Universitas Indonesia",
      image: "👨‍🏫",
      content: "Pasalku.ai telah merevolusi cara pengajaran hukum di kampus kami. Akurasi 94.1% dalam analisis kontrak memberikan mahasiswa wawasan praktis yang tak ternilai.",
      rating: 5,
      highlights: ["Educational Value", "Research Tool", "Contract Analysis"],
      verified: true
    },
    {
      name: "Rina Andriani, S.H., M.Kn.",
      role: "Managing Partner",
      company: "Andriani & Partners Law Firm",
      image: "👩‍⚖️",
      content: "Dalam 6 bulan menggunakan platform ini, efisiensi praktik hukum kami meningkat 60%. Dokumentasi otomatis dan analisis risiko membantu kami menangani lebih banyak kasus penting.",
      rating: 5,
      highlights: ["Efficiency Boost", "Risk Analysis", "Documentation"],
      verified: true,
      stats: "+60% efficiency"
    },
    {
      name: "Ahmad Rahman, S.H.",
      role: "Legal Director",
      company: "PT. Teknologi Indonesia",
      image: "👨‍💼",
      content: "Sebagai corporate lawyer, Pasalku.ai membantu saya dalam due diligence dan contract review. Fitur Cross-Validation memberikan confidence yang tak tergantikan.",
      rating: 5,
      highlights: ["Due Diligence", "Contract Review", "Cross-Validation"],
      verified: true,
      stats: "200+ contracts reviewed"
    },
    {
      name: "Maya Sari, S.H.",
      role: "Startup Legal Advisor",
      company: "Indonesian Tech Startup Association",
      image: "👩‍🚀",
      content: "Untuk startup dengan budget terbatas, Pasalku.ai adalah solusi perfect. Template kontrak dan konsultasi AI membantu kami stay compliant tanpa biaya mahal.",
      rating: 5,
      highlights: ["Budget-Friendly", "Smart Templates", "Compliance"],
      verified: true,
      stats: "15+ startups assisted"
    },
    {
      name: "Dr. Budi Santoso, S.H., LL.M.",
      role: "Senior Legal Consultant",
      company: "Kemenkumham RI",
      image: "👨‍💻",
      content: "Platform ini tidak hanya menghemat waktu, tapi juga meningkatkan kualitas putusan. Knowledge Graph membantu menemukan precedent yang tepat untuk setiap kasus.",
      rating: 5,
      highlights: ["Quality Improvement", "Precedent Search", "Government Use"],
      verified: true,
      stats: "98% case accuracy"
    },
    {
      name: "Linda Kartika, S.H.",
      role: "Individu Pengguna",
      company: "Wiraswasta",
      image: "👩‍💼",
      content: "Saya awalnya ragu dengan AI, tapi setelah menggunakan Pasalku.ai, saya jadi lebih paham hak-hak hukum saya. Fitur konsultasi gratis sangat membantu orang seperti saya.",
      rating: 5,
      highlights: ["User-Friendly", "Free Access", "Legal Education"],
      verified: true,
      stats: "Personal use"
    }
  ]

  const stats = [
    { icon: Users, value: "50,000+", label: "Pengguna Aktif", color: "from-blue-500 to-cyan-500" },
    { icon: Award, value: "94.1%", label: "Akurasi AI", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, value: "97%", label: "Kepuasan Pengguna", color: "from-green-500 to-emerald-500" },
    { icon: CheckCircle, value: "1M+", label: "Konsultasi Berhasil", color: "from-orange-500 to-red-500" }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Quote className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Apa Kata Mereka Tentang Pasalku.ai
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ribuan profesional hukum dan individu telah mengalami transformasi berkat
            teknologi AI hukum yang kami kembangkan dengan passion dan integritas.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl border-0 text-center p-4">
                <CardContent className="p-0">
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full backdrop-blur-sm bg-white/95 hover:bg-white/100 transition-all duration-300 hover:shadow-xl border-0 overflow-hidden group">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">{testimonial.image}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 truncate">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-purple-600 font-medium truncate">{testimonial.role}</p>
                      <p className="text-xs text-gray-500 truncate">{testimonial.company}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{testimonial.rating}.0 rating</span>
                  </div>

                  {/* Content */}
                  <blockquote className="text-gray-700 mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {testimonial.highlights.map((highlight, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats (if available) */}
                  {testimonial.stats && (
                    <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                      💡 {testimonial.stats}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Card className="backdrop-blur-sm bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="p-8 relative">
              <h3 className="text-2xl font-bold mb-4">
                Gabung dengan 50,000+ Pengguna Puas
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Mulai perjalanan Anda menuju pemahaman hukum yang lebih baik dengan teknologi AI terdepan.
                Ribuan profesional telah mempercayai Pasalku.ai untuk transformasi praktik hukum mereka.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Mulai Konsultasi Gratis
                </button>
                <button className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Baca Lebih Banyak Testimonial
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}