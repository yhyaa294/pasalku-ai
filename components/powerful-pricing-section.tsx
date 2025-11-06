'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Zap, Star, Crown, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const PowerfulPricingSection: FC = () => {
  const router = useRouter()

  const plans = [
    {
      name: "Gratis",
      price: "0",
      period: "selamanya",
      description: "Untuk coba-coba dan kebutuhan dasar",
      icon: "⚡",
      color: "from-gray-400 to-gray-600",
      badge: null,
      features: [
        { text: "5 konsultasi AI per hari", available: true },
        { text: "Akses fitur dasar", available: true },
        { text: "Template dokumen terbatas", available: true },
        { text: "Response time standard", available: true },
        { text: "Community support", available: true },
        { text: "Analisis dokumen premium", available: false },
        { text: "Konsultasi unlimited", available: false },
        { text: "Priority support", available: false },
        { text: "Export tanpa watermark", available: false },
        { text: "API access", available: false }
      ],
      cta: "Mulai Gratis",
      ctaStyle: "border-2 border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
    },
    {
      name: "Premium",
      price: "99",
      period: "ribu/bulan",
      description: "Paling populer untuk individu & UMKM",
      icon: "🚀",
      color: "from-blue-500 to-purple-600",
      badge: "BEST VALUE",
      features: [
        { text: "50 konsultasi AI per hari", available: true },
        { text: "Akses 80% fitur premium", available: true },
        { text: "500+ template dokumen", available: true },
        { text: "Response time cepat", available: true },
        { text: "Email & chat support", available: true },
        { text: "Analisis dokumen hingga 50 halaman", available: true },
        { text: "Export PDF tanpa watermark", available: true },
        { text: "Riwayat konsultasi 6 bulan", available: true },
        { text: "Konsultasi unlimited", available: false },
        { text: "API access", available: false }
      ],
      cta: "Upgrade Premium",
      ctaStyle: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
    },
    {
      name: "Professional",
      price: "395",
      period: "ribu/bulan",
      description: "Untuk firma hukum & enterprise",
      icon: "👑",
      color: "from-yellow-500 via-orange-500 to-red-500",
      badge: "MOST POWERFUL",
      features: [
        { text: "Konsultasi AI unlimited", available: true },
        { text: "Akses SEMUA 96+ fitur", available: true },
        { text: "Template dokumen unlimited", available: true },
        { text: "Response time instant", available: true },
        { text: "Dedicated account manager", available: true },
        { text: "Analisis dokumen unlimited", available: true },
        { text: "Export semua format", available: true },
        { text: "Riwayat permanen", available: true },
        { text: "API access penuh", available: true },
        { text: "Custom integration", available: true }
      ],
      cta: "Mulai Professional",
      ctaStyle: "bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:shadow-lg"
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white via-purple-50 to-white dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-950/50 dark:to-orange-950/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-bold mb-4">
            <Zap className="w-4 h-4" />
            HARGA TRANSPARAN
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Investasi <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">Terbaik</span> Untuk Keadilan
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan Anda. Upgrade atau downgrade kapan saja.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${index === 1 ? 'md:-mt-8' : ''}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className={`px-4 py-2 bg-gradient-to-r ${plan.color} text-white text-xs font-bold rounded-full shadow-lg`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`h-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                index === 1 ? 'border-4 border-purple-400 dark:border-purple-600' : 'border border-gray-200 dark:border-slate-700'
              }`}>
                {/* Header */}
                <div className={`p-8 bg-gradient-to-br ${plan.color} text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-5xl mb-2">{plan.icon}</div>
                      <h3 className="text-2xl font-black">{plan.name}</h3>
                    </div>
                    {index === 1 && (
                      <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                    )}
                    {index === 2 && (
                      <Crown className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                    )}
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">
                      {plan.price === "0" ? "Rp 0" : `Rp ${plan.price}`}
                    </span>
                    <span className="text-sm opacity-90">
                      {plan.period}
                    </span>
                  </div>
                  
                  <p className="mt-3 text-sm opacity-95">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="p-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.available ? (
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          feature.available 
                            ? 'text-gray-700 dark:text-gray-300' 
                            : 'text-gray-400 dark:text-gray-600 line-through'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => router.push('/pricing')}
                    className={`w-full mt-8 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Money Back Guarantee */}
                  {index > 0 && (
                    <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                      💰 Garansi uang kembali 7 hari
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Masih bingung? Konsultasi gratis dengan tim kami
          </p>
          <button className="px-8 py-3 bg-white dark:bg-slate-800 border-2 border-purple-400 text-purple-600 dark:text-purple-400 rounded-full font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all">
            💬 Chat Dengan Sales
          </button>
        </motion.div>
      </div>
    </section>
  )
}
