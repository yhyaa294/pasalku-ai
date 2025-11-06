'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

// Import Components
import { UltraSimpleNavbar } from '@/components/ultra-simple-navbar'
import { HeroWithIllustration } from '@/components/hero-with-illustration'
import { WhyThisAISection } from '@/components/why-this-ai-section'
import { FeaturesShowcase } from '@/components/features-showcase'
import { ZigzagHowItWorks } from '@/components/zigzag-how-it-works'
import { PowerfulPricingSection } from '@/components/powerful-pricing-section'
import { FloatingCustomerService, FloatingMusicToggle } from '@/components/floating-widgets'
import { EnhancedFooter } from '@/components/enhanced-footer'

// Dynamic imports for heavy components
const FAQSection = dynamic(() => import('@/components/faq-section').then(m => m.FAQSection), {
  ssr: false,
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <div className="text-gray-500">Loading FAQ...</div>
    </div>
  )
})

const TestimonialsSection = dynamic(() => import('@/components/testimonials-section').then(m => m.TestimonialsSection), {
  ssr: false,
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <div className="text-gray-500">Loading Testimonials...</div>
    </div>
  )
})

export default function PowerfulLandingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check authentication status
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        setIsAuthenticated(!!token)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/register')
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500 animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Fixed Navbar */}
      <UltraSimpleNavbar onLogin={handleLogin} />

      {/* Main Content */}
      <main>
        {/* Hero Section with Illustration/Video */}
        <HeroWithIllustration onGetStarted={handleGetStarted} />

        {/* Why This AI Section - Alasan terciptanya AI ini */}
        <WhyThisAISection />

        {/* Features Showcase - Menampilkan fitur utama dengan tombol "Lihat Lainnya" */}
        <FeaturesShowcase />

        {/* How It Works - Zigzag pattern dengan nomor dan gambar */}
        <ZigzagHowItWorks />

        {/* Pricing Section - 3 opsi: Gratis, 99k, 395k */}
        <PowerfulPricingSection />

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-900">
          <FAQSection />
        </section>

        {/* Testimonials - Scrollable */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <TestimonialsSection />
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-black text-white mb-6">
                Siap Memulai Perjalanan Hukum Anda?
              </h2>
              <p className="text-xl text-white/90 mb-10">
                Bergabunglah dengan 10,000+ pengguna yang sudah merasakan kemudahan akses keadilan
              </p>
              <button
                onClick={handleGetStarted}
                className="px-12 py-5 bg-white text-purple-600 rounded-full font-black text-xl shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300"
              >
                Mulai Gratis Sekarang →
              </button>
              <p className="mt-6 text-white/80 text-sm">
                Tidak perlu kartu kredit • Setup 30 detik • Cancel kapan saja
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <EnhancedFooter />

      {/* Floating Widgets */}
      {mounted && (
        <>
          {/* Customer Service AI Aura - Bottom Right */}
          <FloatingCustomerService />
          
          {/* Music Toggle - Bottom Left */}
          <FloatingMusicToggle />
        </>
      )}

      {/* Smooth Scroll Script */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </div>
  )
}
