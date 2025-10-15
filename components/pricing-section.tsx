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
      subtitle: 'Untuk Memulai',
      price: '0',
      period: '/bulan',
      description: 'Coba fitur-fitur dasar Pasalku.ai tanpa biaya. Ideal untuk pengguna individu.',
      features: [
        '5 konsultasi per bulan',
        'Analisis dokumen sederhana',
        'Chat dukungan umum',
        'Template dokumen dasar',
        'Penyimpanan 100MB',
        'Riset hukum terbatas'
      ],
      excluded: [
        'Konsultasi dengan profesional hukum',
        'API akses',
        'Pelatihan khusus',
        'Prioritas support'
      ],
      popular: false,
      color: 'from-gray-500 to-gray-600',
      buttonText: 'Mulai Gratis',
      badge: null
    },
    {
      name: 'Premium',
      subtitle: 'Untuk Individual & UMKM',
      price: '97000',
      period: '/bulan',
      description: 'Fitur lengkap untuk konsultan hukum individu dan pelaku usaha menengah.',
      features: [
        '50 konsultasi per bulan',
        'Analisis dokumen canggih',
        'Riset hukum mendalam',
        'Template dokumen premium',
        'Penyimpanan 2GB',
        'Chat dukungan prioritas',
        'Konsultasi dengan profesional hukum',
        'Dashboard analytics',
        'API akses terbatas',
        'Prioritas support 24/7'
      ],
      excluded: [],
      popular: true,
      color: 'from-purple-500 to-pink-500',
      buttonText: 'Mulai Premium',
      badge: 'PAKET TERLARIS'
    },
    {
      name: 'Professional',
      subtitle: 'Untuk Kantor Hukum & Enterprise',
      price: '397000',
      period: '/bulan',
      description: 'Solusi enterprise lengkap untuk kantor hukum dan perusahaan besar.',
      features: [
        'Konsultasi tak terbatas',
        'Semua fitur AI kecerdasan web hukum',
        'Riset hukum unlimited',
        'Semua template dokumen',
        'Penyimpanan unlimited',
        'Support 24/7 dengan SLA',
        'Priority konsultasi dengan ahli',
        'Dashboard analytics enterprise',
        'API akses penuh',
        'Pelatihan khusus tim'
      ],
      excluded: [],
      popular: false,
      color: 'from-blue-500 to-indigo-600',
      buttonText: 'Hubungi Sales',
      badge: null
    }
  ]

  return (
    <section id="pricing" className={`py-16 md:py-32 px-4 scroll-animate ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-text-shimmer">
            Pilih <span className="text-primary">Paket</span> Anda
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Mulai gratis atau upgrade untuk fitur lebih lengkap dan konsultasi unlimited
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glass-card rounded-2xl md:rounded-3xl p-6 md:p-8 border transition-all duration-300 hover-lift scroll-animate-scale ${
                plan.popular ? "border-primary shadow-xl scale-105" : "border-border hover:shadow-xl"
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full text-white text-sm font-bold animate-cyber-pulse">
                    🔥 {plan.badge}
                  </div>
                </div>
              )}

              <div
                className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${plan.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 legal-shadow animate-hologram`}
              >
                <Award className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-1 text-primary animate-text-shimmer">
                {plan.name}
              </h3>
              
              <p className="text-sm md:text-base text-muted-foreground mb-4 font-semibold">
                {plan.subtitle}
              </p>

              <div className="mb-4 md:mb-6">
                <span className="text-3xl md:text-5xl font-black text-foreground">
                  {plan.price === '0' ? 'Rp 0' : `Rp ${Number(plan.price).toLocaleString('id-ID')}`}
                </span>
                <span className="text-lg md:text-xl text-muted-foreground">
                  {plan.period}
                </span>
              </div>

              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                {plan.description}
              </p>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary animate-cyber-pulse flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base text-muted-foreground">{feature}</span>
                  </div>
                ))}
                {plan.excluded && plan.excluded.map((feature, idx) => (
                  <div key={`ex-${idx}`} className="flex items-start gap-3 opacity-40">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm md:text-base text-muted-foreground line-through">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg border-2 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-600"
                    : "bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
                }`}
                onClick={() => {
                  // Arahkan ke halaman pricing detail
                  router.push('/pricing')
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons Section Preview */}
        <div className="mt-16 md:mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Add-On Terpopuler
          </h3>
          <p className="text-muted-foreground mb-8">
            Sesuaikan paket Anda dengan fitur tambahan yang dibutuhkan
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="glass-card rounded-xl p-6 border border-border hover:border-primary transition-all">
              <div className="text-3xl mb-3">💾</div>
              <h4 className="font-bold text-lg mb-2 text-foreground">Additional Storage</h4>
              <p className="text-sm text-muted-foreground mb-3">Tambahan penyimpanan 50GB</p>
              <p className="font-bold text-primary mb-3">Rp 47.000/bulan</p>
              <button 
                onClick={() => router.push('/pricing')}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Tambahkan →
              </button>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border hover:border-primary transition-all">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-bold text-lg mb-2 text-foreground">Advanced Analytics</h4>
              <p className="text-sm text-muted-foreground mb-3">Dashboard analytics dengan insights mendalam</p>
              <p className="font-bold text-primary mb-3">Rp 97.000/bulan</p>
              <button 
                onClick={() => router.push('/pricing')}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Tambahkan →
              </button>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border hover:border-primary transition-all">
              <div className="text-3xl mb-3">🏷️</div>
              <h4 className="font-bold text-lg mb-2 text-foreground">White Label Solution</h4>
              <p className="text-sm text-muted-foreground mb-3">Solusi white label untuk kantor hukum</p>
              <p className="font-bold text-primary mb-3">Hubungi untuk harga</p>
              <button 
                onClick={() => router.push('/pricing')}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Tambahkan →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
