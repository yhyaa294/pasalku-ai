'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { EnhancedFooter } from '@/components/enhanced-footer'
import {
  Check,
  X,
  Award,
  Phone,
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID

  const handlePlanClick = async (planName: string) => {
    try {
      if (planName === 'Gratis') {
        window.location.href = '/register?plan=free'
        return
      }
      if (planName === 'Professional') {
        window.location.href = '/contact?plan=enterprise'
        return
      }
      if (planName === 'Premium') {
        setLoadingPlan('Premium')
        if (!priceId) {
          alert('Checkout belum dikonfigurasi. Mohon set NEXT_PUBLIC_STRIPE_PRICE_ID dan STRIPE_SECRET_KEY.')
          return
        }
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId })
        })
        const data = await res.json()
        if (res.ok && data?.url) {
          window.location.href = data.url
        } else {
          alert(data?.error || 'Gagal memulai checkout')
        }
        return
      }
    } finally {
      setLoadingPlan(null)
    }
  }

  const pricingPlans = [
    {
      name: 'Gratis',
      subtitle: 'Untuk Memulai',
      price: {
        monthly: 'Rp 0',
        yearly: 'Rp 0'
      },
      popular: false,
      description: 'Coba fitur-fitur dasar Pasalku.ai tanpa biaya. Ideal untuk pengguna individu.',
      features: [
        { name: '5 konsultasi per bulan', included: true },
        { name: 'Analisis dokumen sederhana', included: true },
        { name: 'Chat dukungan umum', included: true },
        { name: 'Template dokumen dasar', included: true },
        { name: 'Penyimpanan 100MB', included: true },
        { name: 'Riset hukum terbatas', included: false },
        { name: 'Konsultasi dengan profesional hukum', included: false },
        { name: 'API akses', included: false },
        { name: 'Pelatihan khusus', included: false },
        { name: 'Prioritas support', included: false }
      ],
      cta: 'Mulai Gratis',
      ctaLink: '/register?plan=free'
    },
    {
      name: 'Premium',
      subtitle: 'Untuk Individual & UMKM',
      price: {
        monthly: 'Rp 97.000',
        yearly: 'Rp 997.000'
      },
      popular: true,
      description: 'Fitur lengkap untuk konsultan hukum individu dan pelaku usaha menengah.',
      features: [
        { name: '50 konsultasi per bulan', included: true },
        { name: 'Analisis dokumen canggih', included: true },
        { name: 'Riset hukum mendalam', included: true },
        { name: 'Template dokumen premium', included: true },
        { name: 'Penyimpanan 2GB', included: true },
        { name: 'Chat dukungan prioritumoritas', included: true },
        { name: 'Konsultasi dengan profesional hukum', included: true },
        { name: 'Dashboard analytics', included: true },
        { name: 'API akses terbatas', included: false },
        { name: 'Prioritas support 24/7', included: false }
      ],
      cta: 'Mulai Premium',
      ctaLink: '/register?plan=premium',
      savings: 'Hemat Rp 191.000/tahun'
    },
    {
      name: 'Professional',
      subtitle: 'Untuk Kantor Hukum & Enterprise',
      price: {
        monthly: 'Rp 397.000',
        yearly: 'Rp 3.997.000'
      },
      popular: false,
      description: 'Solusi enterprise lengkap untuk kantor hukum dan perusahaan besar.',
      features: [
        { name: 'Konsultasi tak terbatas', included: true },
        { name: 'Semua fitur AI kecerdasan web hukum', included: true },
        { name: 'Riset hukum unlimited', included: true },
        { name: 'Semua template dokumen', included: true },
        { name: 'Penyimpanan unlimited', included: true },
        { name: 'Support 24/7 dengan SLA', included: true },
        { name: 'Priority konsultasi dengan ahli', included: true },
        { name: 'Dashboard analytics enterprise', included: true },
        { name: 'API akses penuh', included: true },
        { name: 'Pelatihan khusus tim', included: true }
      ],
      cta: 'Hubungi Sales',
      ctaLink: '/contact?plan=enterprise',
      savings: 'Hemat Rp 797.000/tahun'
    }
  ]

  const addOns = [
    {
      name: 'Additional Storage',
      description: 'Tambahn penyimpanan 50GB',
      price: 'Rp 47.000/bulan'
    },
    {
      name: 'Advanced Analytics',
      description: 'Dashboard analytics dengan insights mendalam',
      price: 'Rp 97.000/bulan'
    },
    {
      name: 'White Label Solution',
      description: 'Solusi white label untuk kantor hukum',
      price: 'Hubungi untuk harga'
    }
  ]

  const enterpriseFeatures = [
    'Custom AI model training',
    'Multi-user management',
    'Advanced security & compliance',
    'Dedicated account manager',
    'Custom integrations',
    'Priority feature development'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">Pasalku.ai</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/features">
                <Button variant="ghost">Fitur</Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost">FAQ</Button>
              </Link>
              <Link href="/chat">
                <Button>Mulai Konsultasi</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Paket & Harga
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Pilih paket yang cocok untuk kebutuhan hukum Anda. Dari akses gratis sampai solusi enterprise,
              kami punya paket yang sesuai dengan budget dan kebutuhan Anda.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                Bulanan
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                aria-label="Toggle billing cycle"
                className={`relative w-16 h-8 rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ left: billingCycle === 'yearly' ? 34 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-lg ${billingCycle === 'yearly' ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                Tahunan
              </span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 ml-2">
                Hemat sampai 25%
              </Badge>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-1 text-sm font-bold">
                      <Sparkles className="w-4 h-4 mr-1" />
                      PAKET TERLARIS
                    </Badge>
                  </div>
                )}

                <Card className={`h-full backdrop-blur-sm bg-white/95 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-purple-500/50 border-purple-200' : ''
                }`}>
                  <CardHeader className="pb-4">
                    <div className="text-center">
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                        {plan.name}
                      </CardTitle>
                      <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-black text-gray-900 mb-2">
                        {plan.price[billingCycle]}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        per {billingCycle === 'monthly' ? 'bulan' : 'tahun'}
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-4 px-2">
                        {plan.description}
                      </p>

                      {/* Savings Badge */}
                      {billingCycle === 'yearly' && plan.savings && (
                        <Badge className="bg-green-100 text-green-800 text-xs mb-4">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          {feature.included ? (
                            <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                              <X className="w-3 h-3 text-gray-500" />
                            </div>
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                      <Button
                        onClick={() => handlePlanClick(plan.name)}
                        disabled={loadingPlan === plan.name}
                        className={`w-full py-3 font-semibold ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                            : plan.name === 'Gratis'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        }`}
                      >
                        {loadingPlan === plan.name ? 'Memproses...' : plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Add-ons Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Add-On Terpopuler
              </h2>
              <p className="text-lg text-gray-600">
                Sesuaikan paket Anda dengan fitur tambahan yang dibutuhkan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addOns.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl border-0">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{addon.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                      <div className="text-lg font-semibold text-blue-600 mb-4">{addon.price}</div>
                      <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                        Tambahkan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enterprise Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-white text-center">
              <Building2 className="w-16 h-16 mx-auto mb-6 text-blue-300" />
              <h2 className="text-3xl font-bold mb-4">Butuh Solusi Enterprise?</h2>
              <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">
                Untuk kantor hukum besar, perusahaan multinasional, atau institusi pemerintah,
                kami tawarkan solusi custom dengan fitur-fitur enterprise khusus.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {enterpriseFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/contact?subject=Enterprise%20Solution">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  <Phone className="w-5 h-5 mr-2" />
                  Hubungi Tim Sales
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* FAQ Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Masih Ada Pertanyaan?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Lihat FAQ lengkap kami untuk mengetahui lebih detail tentang fitur, pembayaran, dan dukungan.
            </p>

            <Link href="/faq">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-600 text-white px-8 py-3 text-lg font-medium">
                Lihat FAQ Lengkap
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <EnhancedFooter />
    </div>
  )
}