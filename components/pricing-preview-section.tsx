'use client'

import { FC } from 'react'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

interface PricingPreviewSectionProps {
  className?: string
}

export const PricingPreviewSection: FC<PricingPreviewSectionProps> = ({ className = '' }) => {
  const plans = [
    {
      name: 'Free',
      tagline: 'Mulai Gratis',
      price: '0',
      period: '',
      description: 'Cocok untuk penggunaan personal dan eksplorasi platform',
      features: [
        '10 AI queries per bulan',
        'Konsultasi hukum dasar',
        'Riwayat chat 30 hari',
        'Akses knowledge base',
      ],
      cta: 'Mulai Sekarang',
      popular: false,
      color: 'from-gray-500 to-gray-600',
    },
    {
      name: 'Premium',
      tagline: 'Paling Populer',
      price: '99.000',
      period: '/bulan',
      description: 'Untuk pengguna aktif dan profesional hukum',
      features: [
        'Unlimited AI queries',
        'Analisis dokumen lengkap',
        'Dual-AI verification',
        'Priority support 24/7',
        'Export chat & reports',
        'PIN-protected sessions',
      ],
      cta: 'Lihat Detail Lengkap',
      popular: true,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const handleCTAClick = (planName: string) => {
    window.location.href = '/pricing'
  }

  return (
    <section
      id="pricing-preview"
      className={`py-16 md:py-32 px-4 bg-gradient-to-b from-white via-purple-50/20 to-white scroll-animate ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-100/80 backdrop-blur-sm border border-purple-200 text-sm font-semibold text-purple-700 mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 mr-2" />
            Harga Transparan
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Investasi Yang{' '}
            <span className="block md:inline bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Terjangkau & Bernilai
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Pilih paket yang sesuai dengan kebutuhan Anda. Mulai gratis atau upgrade untuk fitur premium.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative scroll-animate-scale group ${
                plan.popular ? 'md:scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    🔥 PALING POPULER
                  </div>
                </div>
              )}

              {/* Animated Glow */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-2xl rounded-3xl group-hover:opacity-30 transition-opacity duration-500"></div>
              )}

              {/* Card */}
              <div
                className={`relative bg-white rounded-3xl p-8 md:p-10 border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-lg ${
                  plan.popular
                    ? 'border-purple-400 hover:border-purple-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {plan.tagline}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      {plan.price === '0' ? (
                        <span className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                          Gratis
                        </span>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-gray-600">Rp</span>
                          <span className={`text-5xl md:text-6xl font-black ${
                            plan.popular
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
                              : 'text-gray-900'
                          }`}>
                            {plan.price}
                          </span>
                          <span className="text-xl text-gray-500">{plan.period}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${
                        plan.popular
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      } flex items-center justify-center`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleCTAClick(plan.name)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="text-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-6 text-sm text-gray-600 px-8 py-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Tanpa Biaya Tersembunyi</div>
                <div className="text-xs text-gray-500">Harga transparan & jelas</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Upgrade Kapan Saja</div>
                <div className="text-xs text-gray-500">Fleksibel sesuai kebutuhan</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Batalkan Kapan Saja</div>
                <div className="text-xs text-gray-500">Tanpa kontrak jangka panjang</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
