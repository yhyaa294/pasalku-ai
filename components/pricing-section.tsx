'use client'

import { FC } from 'react'
import { Award, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PricingSectionProps {
  className?: string
}

export const PricingSection: FC<PricingSectionProps> = ({ className = '' }) => {
  const router = useRouter()
  const plans = [
    {
      name: 'Gratis',
      price: '0',
      period: '',
      description: 'Untuk pengguna yang ingin mencoba fitur dasar',
      features: [
        '5 konsultasi per bulan',
        'Akses database hukum dasar',
        'Riwayat chat 7 hari',
        'Dukungan email',
      ],
      popular: false,
      color: 'from-gray-500 to-gray-600',
      buttonText: 'Mulai Gratis'
    },
    {
      name: 'Premium',
      price: '49000',
      period: '/bulan',
      description: 'Untuk akses penuh dan fitur premium',
      features: [
        'Konsultasi unlimited',
        'Analisis dokumen hukum',
        'Riwayat chat unlimited',
        'Referensi pasal lengkap',
        'Priority support 24/7',
        'Export hasil konsultasi'
      ],
      popular: true,
      color: 'from-purple-500 to-pink-500',
      buttonText: 'Upgrade ke Premium'
    },
  ]

  return (
    <section id="pricing" className={`py-20 md:py-32 px-4 scroll-animate bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
            <span>💰</span> Harga Transparan
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
            Pilih Paket yang <span className="text-orange-600">Tepat</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mulai gratis atau upgrade untuk fitur lebih lengkap dan konsultasi unlimited
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 scroll-animate-scale ${
                plan.popular 
                  ? "border-orange-500 shadow-2xl shadow-orange-500/20 scale-105" 
                  : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg">
                    ⭐ Paling Populer
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                  plan.popular 
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30" 
                    : "bg-gray-100"
                }`}>
                  <Award className={`w-8 h-8 ${plan.popular ? "text-white" : "text-gray-600"}`} />
                </div>

                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <span className="text-5xl font-black text-gray-900">
                    {plan.price === '0' ? 'Gratis' : `Rp ${Number(plan.price).toLocaleString('id-ID')}`}
                  </span>
                  {plan.price !== '0' && (
                    <span className="text-xl text-gray-500">{plan.period}</span>
                  )}
                </div>

                <p className="text-gray-600">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.popular ? "text-orange-500" : "text-gray-400"
                    }`} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 px-8 rounded-xl font-bold transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
                onClick={() => router.push('/pricing')}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">💳 Tidak perlu kartu kredit untuk paket gratis</p>
        </div>
      </div>
    </section>
  )
}
