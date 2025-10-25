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
      description: 'Mulai perjalanan hukum Anda tanpa risiko. Sempurna untuk eksplorasi awal.',
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
      buttonText: 'Mulai Tanpa Risiko',
      badge: null,
      savings: null,
      guarantee: '✓ Tidak Perlu Kartu Kredit',
      socialProof: '2,000+ pengguna memulai dari sini'
    },
    {
      name: 'Premium',
      subtitle: 'Untuk Individual & UMKM',
      price: '97000',
      period: '/bulan',
      description: 'Solusi lengkap untuk kebutuhan hukum sehari-hari. Paling populer di kalangan UMKM.',
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
      buttonText: 'Mulai Premium Sekarang',
      badge: 'PALING POPULER',
      savings: '💰 Hemat hingga Rp 5.000.000/bulan vs konsultasi tradisional',
      guarantee: '🛡️ Garansi 30 Hari Uang Kembali',
      socialProof: '847 pengguna memilih paket ini bulan lalu',
      scarcity: '🔥 Hanya 23 slot tersisa bulan ini'
    },
    {
      name: 'Professional',
      subtitle: 'Untuk Kantor Hukum & Enterprise',
      price: '397000',
      period: '/bulan',
      description: 'Solusi enterprise dengan fitur unlimited dan support premium untuk tim besar.',
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
        'Pelatihan khusus tim',
        'White label option',
        'Dedicated account manager'
      ],
      excluded: [],
      popular: false,
      color: 'from-blue-500 to-indigo-600',
      buttonText: 'Hubungi Sales',
      badge: 'ENTERPRISE',
      savings: '💎 ROI 300%+ untuk kantor hukum',
      guarantee: '🤝 Custom SLA & Contract',
      socialProof: '50+ kantor hukum menggunakan',
      scarcity: null
    }
  ]

  return (
    <section id="pricing" className={`py-20 md:py-32 px-4 bg-gradient-to-b from-white via-purple-50/20 to-white relative overflow-hidden ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.05),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-bold mb-6">
            <span>💎</span> Investasi Terbaik untuk Ketenangan Pikiran
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Pilih Paket yang <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Tepat untuk Anda</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mulai gratis, upgrade kapan saja. <span className="text-purple-600 font-semibold">Tidak ada kontrak jangka panjang</span>, batalkan kapan saja tanpa pertanyaan.
          </p>
          
          {/* VALUE PROPOSITION */}
          <div className="mt-8 inline-flex items-center gap-6 flex-wrap justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Gratis selamanya untuk paket dasar</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Upgrade atau downgrade kapan saja</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Garansi uang kembali 30 hari</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative ${
                plan.popular
                  ? 'md:-mt-4 md:mb-4 md:scale-105 z-10'
                  : ''
              }`}
            >
              {/* POPULAR BADGE - ANCHORING */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`px-6 py-2 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-bold shadow-lg animate-pulse`}>
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* SCARCITY BADGE */}
              {plan.scarcity && (
                <div className="absolute -top-4 right-4 z-20">
                  <div className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
                    {plan.scarcity}
                  </div>
                </div>
              )}

              <div
                className={`relative h-full rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white border-2 border-purple-500 shadow-2xl shadow-purple-500/20'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-purple-300 hover:shadow-xl'
                }`}
              >
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold text-gray-900">Rp</span>
                      <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {parseInt(plan.price).toLocaleString('id-ID')}
                      </span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    {plan.price === '0' && (
                      <p className="text-sm text-green-600 font-semibold mt-2">
                        Gratis Selamanya
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* SAVINGS - VALUE DEMONSTRATION */}
                {plan.savings && (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-800 font-semibold text-center">
                      {plan.savings}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => router.push(plan.name === 'Professional' ? '/contact' : '/register')}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 mb-6 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </button>

                {/* GUARANTEE - RISK REDUCTION */}
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">
                    {plan.guarantee}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Yang Anda Dapatkan:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Excluded Features (if any) */}
                {plan.excluded.length > 0 && (
                  <div className="space-y-2 pt-6 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Tidak Termasuk:</p>
                    {plan.excluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400 text-sm">✕</span>
                        <span className="text-xs text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* SOCIAL PROOF */}
                {plan.socialProof && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>{plan.socialProof}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* COMPARISON TABLE - Additional Value */}
        <div className="mb-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-8">Bandingkan dengan Konsultasi Tradisional</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-red-900 text-lg mb-4">❌ Konsultasi Tradisional</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-red-500">✕</span>
                  <span className="text-sm text-gray-700">Biaya Rp 2-5 juta per konsultasi</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500">✕</span>
                  <span className="text-sm text-gray-700">Harus datang ke kantor (waktu & transport)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500">✕</span>
                  <span className="text-sm text-gray-700">Tunggu 3-7 hari untuk appointment</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500">✕</span>
                  <span className="text-sm text-gray-700">Jam kerja terbatas (9-5)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500">✕</span>
                  <span className="text-sm text-gray-700">Tidak ada garansi kepuasan</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-green-900 text-lg mb-4">✅ Pasalku.ai Premium</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Hanya Rp 97.000/bulan (unlimited konsultasi)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Akses dari mana saja (rumah, kantor, mobile)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Jawaban dalam hitungan detik</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">24/7 tersedia kapan Anda butuh</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Garansi 30 hari uang kembali</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-2xl font-bold text-purple-600">
              Hemat hingga 98% dari biaya konsultasi tradisional!
            </p>
          </div>
        </div>

        {/* Add-Ons Section */}
        <div className="mt-16 md:mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Add-On Terpopuler
          </h3>
          <p className="text-gray-600 mb-8">
            Sesuaikan paket Anda dengan fitur tambahan yang dibutuhkan
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="glass-card rounded-xl p-6 border border-border hover:border-primary transition-all bg-white">
              <div className="text-3xl mb-3">💾</div>
              <h4 className="font-bold text-lg mb-2 text-foreground">Additional Storage</h4>
              <p className="text-sm text-gray-600 mb-3">Tambahan penyimpanan 50GB</p>
              <p className="font-bold text-primary mb-3">Rp 47.000/bulan</p>
              <button 
                onClick={() => router.push('/pricing')}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Tambahkan →
              </button>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border hover:border-primary transition-all bg-white">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-bold text-lg mb-2 text-foreground">Advanced Analytics</h4>
              <p className="text-sm text-gray-600 mb-3">Dashboard analytics dengan insights mendalam</p>
              <p className="font-bold text-primary mb-3">Rp 97.000/bulan</p>
              <button 
                onClick={() => router.push('/pricing')}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Tambahkan →
              </button>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border hover:border-primary transition-all bg-white">
              <div className="text-3xl mb-3">🏷️</div>
              <h4 className="font-bold text-lg mb-2 text-foreground">White Label Solution</h4>
              <p className="text-sm text-gray-600 mb-3">Solusi white label untuk kantor hukum</p>
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

        {/* FAQ / Trust Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-purple-200">
          <h3 className="text-2xl font-bold text-center mb-8">Pertanyaan yang Sering Diajukan</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Apakah saya bisa upgrade/downgrade kapan saja?</h4>
              <p className="text-sm text-gray-700">Ya! Anda bisa mengubah paket kapan saja tanpa penalti. Perubahan akan efektif di periode billing berikutnya.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Bagaimana cara kerja garansi 30 hari?</h4>
              <p className="text-sm text-gray-700">Jika tidak puas dalam 30 hari pertama, kami akan mengembalikan 100% uang Anda tanpa pertanyaan.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Apakah data saya aman?</h4>
              <p className="text-sm text-gray-700">Sangat aman! Kami menggunakan enkripsi tingkat enterprise dan compliant dengan standar keamanan internasional.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Bagaimana cara pembayaran?</h4>
              <p className="text-sm text-gray-700">Kami menerima transfer bank, kartu kredit, dan e-wallet. Pembayaran otomatis setiap bulan.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold mb-4">Siap Memulai?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan akses hukum
          </p>
          <button
            onClick={() => router.push('/register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Mulai Gratis Sekarang
            <span>→</span>
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Tidak perlu kartu kredit • Gratis selamanya • Upgrade kapan saja
          </p>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
