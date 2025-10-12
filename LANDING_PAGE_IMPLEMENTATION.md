# 🎨 Pasalku.ai - Landing Page & Navigation Implementation Guide

## 📋 Overview

Dokumen ini berisi implementasi lengkap untuk:
1. **Landing Page Komprehensif** - Long-form storytelling page
2. **Enhanced Navbar** - Navigasi terintegrasi dengan scrollspy
3. **10+ Halaman Baru** - About, Pricing, Features, Contact, Blog, dll
4. **API Integration** - Clerk, Stripe, Statsig, dll

---

## 🏗️ Struktur Proyek Frontend

```
frontend/
├── app/
│   ├── (marketing)/              # Marketing pages group
│   │   ├── page.tsx              # Landing page (/)
│   │   ├── about/
│   │   │   └── page.tsx          # About Us (/about)
│   │   ├── pricing/
│   │   │   └── page.tsx          # Pricing (/pricing)
│   │   ├── features/
│   │   │   ├── page.tsx          # Features overview
│   │   │   ├── ai-consultation/
│   │   │   ├── document-analysis/
│   │   │   └── knowledge-graph/
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact (/contact)
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog list
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Blog post
│   │   ├── faq/
│   │   │   └── page.tsx          # FAQ (/faq)
│   │   ├── professional-upgrade/
│   │   │   └── page.tsx          # Professional upgrade
│   │   ├── privacy-policy/
│   │   │   └── page.tsx          # Privacy Policy
│   │   └── terms-of-service/
│   │       └── page.tsx          # Terms of Service
│   │
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── chat/
│   │   └── profile/
│   │
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── marketing/
│   │   ├── Navbar.tsx            # Enhanced navbar
│   │   ├── Hero.tsx              # Hero section
│   │   ├── HowItWorks.tsx        # How it works section
│   │   ├── Features.tsx          # Features section
│   │   ├── UseCases.tsx          # Use cases section
│   │   ├── Testimonials.tsx      # Testimonials section
│   │   ├── PricingPreview.tsx    # Pricing preview
│   │   ├── FAQ.tsx               # FAQ section
│   │   ├── CTA.tsx               # Call to action
│   │   └── Footer.tsx            # Footer
│   │
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── accordion.tsx
│   │   └── ...
│   │
│   └── shared/
│       ├── ScrollSpy.tsx         # Scrollspy component
│       └── SmoothScroll.tsx      # Smooth scroll
│
├── lib/
│   ├── api/
│   │   ├── contact.ts            # Contact form API
│   │   ├── blog.ts               # Blog API
│   │   └── stripe.ts             # Stripe integration
│   │
│   └── utils/
│       ├── analytics.ts          # Statsig/Hypertune
│       └── sentry.ts             # Sentry config
│
└── public/
    ├── images/
    └── videos/
```

---

## 🎨 PART 1: Enhanced Navbar Component

### File: `components/marketing/Navbar.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  // Scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Update active section based on scroll position
      const sections = ['hero', 'how-it-works', 'features', 'use-cases', 'pricing', 'faq']
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMobileMenuOpen(false)
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Pasalku.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        pathname === '/'
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Beranda
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Features Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Fitur
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li>
                        <Link href="/features/ai-consultation" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">AI Konsultasi</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Konsultasi hukum instan dengan AI
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link href="/features/document-analysis" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Analisis Dokumen</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Analisis dokumen hukum otomatis
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link href="/features/knowledge-graph" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Knowledge Graph</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Basis pengetahuan hukum komprehensif
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link href="/features" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Lihat Semua Fitur →</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Jelajahi semua kemampuan Pasalku.ai
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Pricing */}
                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isActive('/pricing')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Paket & Harga
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Professional Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Profesional Hukum
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4">
                      <li>
                        <Link href="/professional-upgrade" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Daftar Sebagai Profesional</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Upgrade ke akun profesional
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link href="/features#professional-benefits" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Manfaat Profesional</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Keuntungan akun profesional
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About */}
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isActive('/about')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Tentang Kami
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Blog */}
                <NavigationMenuItem>
                  <Link href="/blog" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isActive('/blog')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* FAQ */}
                <NavigationMenuItem>
                  <Link href="/faq" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isActive('/faq')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      FAQ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Contact */}
                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isActive('/contact')
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Kontak
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Masuk</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Daftar Gratis</Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Beranda
              </Link>
              <Link href="/features" className="text-gray-700 hover:text-blue-600">
                Fitur
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600">
                Paket & Harga
              </Link>
              <Link href="/professional-upgrade" className="text-gray-700 hover:text-blue-600">
                Profesional Hukum
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                Tentang Kami
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600">
                Blog
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-blue-600">
                FAQ
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                Kontak
              </Link>
              
              <div className="pt-4 border-t space-y-2">
                {isSignedIn ? (
                  <Link href="/dashboard">
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">Masuk</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full">Daftar Gratis</Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
```

---

## 🎨 PART 2: Landing Page Sections

### File: `app/(marketing)/page.tsx`

```tsx
import Navbar from '@/components/marketing/Navbar'
import Hero from '@/components/marketing/Hero'
import HowItWorks from '@/components/marketing/HowItWorks'
import Features from '@/components/marketing/Features'
import UseCases from '@/components/marketing/UseCases'
import Testimonials from '@/components/marketing/Testimonials'
import PricingPreview from '@/components/marketing/PricingPreview'
import FAQ from '@/components/marketing/FAQ'
import CTA from '@/components/marketing/CTA'
import Footer from '@/components/marketing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <UseCases />
        <Testimonials />
        <PricingPreview />
        <FAQ />
        <CTA />
      </main>
      
      <Footer />
    </div>
  )
}
```

### File: `components/marketing/Hero.tsx`

```tsx
'use client'

import { SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'
import Image from 'next/image'

const Hero = () => {
  return (
    <section id="hero" className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700">
              🚀 Platform Hukum AI #1 di Indonesia
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Solusi Hukum Cerdas Anda,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Kapan Saja, Di Mana Saja
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Pasalku.ai menggunakan teknologi AI terdepan untuk memberikan konsultasi hukum instan, 
              analisis dokumen cerdas, dan akses ke basis pengetahuan hukum Indonesia yang komprehensif.
            </p>

            {/* Key Points */}
            <div className="space-y-3">
              {[
                '✓ Konsultasi hukum 24/7 dengan AI',
                '✓ Analisis dokumen dalam hitungan detik',
                '✓ Basis data hukum Indonesia terlengkap',
                '✓ Verifikasi oleh profesional hukum bersertifikat'
              ].map((point, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-700">
                  <span className="text-lg">{point}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-6">
                  Mulai Gratis Sekarang
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </SignUpButton>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Play className="mr-2" size={20} />
                Lihat Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">10,000+</div>
                <div className="text-sm text-gray-600">Pengguna Aktif</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50,000+</div>
                <div className="text-sm text-gray-600">Konsultasi Selesai</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">Rating Pengguna</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Image/Illustration */}
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                {/* Chat Interface Preview */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 bg-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        Apa hukuman untuk pencurian menurut KUHP?
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        Menurut <strong>Pasal 362 KUHP</strong>, pencurian diancam dengan pidana penjara 
                        paling lama 5 tahun atau denda paling banyak Rp 900...
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-blue-600">
                        <span>📚 Pasal 362 KUHP</span>
                        <span>•</span>
                        <span>⚖️ Confidence: 95%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
```

### File: `components/marketing/HowItWorks.tsx`

```tsx
'use client'

import { MessageSquare, FileSearch, Shield, Zap } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    title: 'Ajukan Pertanyaan Anda',
    description: 'Tanyakan masalah hukum Anda dalam bahasa sehari-hari. AI kami siap membantu 24/7.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: FileSearch,
    title: 'Dapatkan Analisis Cepat',
    description: 'AI kami menganalisis pertanyaan Anda dan mencari referensi hukum yang relevan dalam hitungan detik.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Shield,
    title: 'Verifikasi Profesional',
    description: 'Untuk kasus kompleks, dapatkan verifikasi dari profesional hukum bersertifikat.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Zap,
    title: 'Simpan & Akses Kapan Saja',
    description: 'Semua konsultasi tersimpan aman dan dapat diakses kembali kapan saja Anda butuhkan.',
    color: 'from-orange-500 to-orange-600'
  }
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bagaimana Pasalku.ai Membantu Anda
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Proses sederhana dalam 4 langkah untuk mendapatkan bantuan hukum yang Anda butuhkan
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -z-10" />
              )}

              {/* Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-bold text-gray-200">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                    <step.icon className="text-white" size={24} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Siap mencoba?</p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
            Mulai Konsultasi Gratis
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
```

### File: `components/marketing/Features.tsx`

```tsx
'use client'

import { Brain, FileText, Database, Users, Lock, Globe } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Brain,
    title: 'Konsultasi Hukum Instan',
    description: 'Didukung oleh BytePlus Ark & Groq AI untuk respons akurat dan cepat',
    details: [
      'Dual-AI verification untuk akurasi maksimal',
      '4 persona AI: Default, Advokat Progresif, Konsultan Bisnis, Mediator',
      'Citation extraction otomatis (Pasal, UU)',
      'Confidence score untuk setiap jawaban'
    ],
    link: '/features/ai-consultation',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: FileText,
    title: 'Analisis Dokumen Cerdas',
    description: 'OCR & NER untuk ekstraksi informasi dari dokumen hukum',
    details: [
      'Support PDF, DOCX, gambar',
      'OCR untuk dokumen scan',
      'Ekstraksi poin-poin penting',
      'Identifikasi isu hukum otomatis'
    ],
    link: '/features/document-analysis',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Database,
    title: 'Basis Pengetahuan Hukum Komprehensif',
    description: 'EdgeDB knowledge graph dengan ribuan peraturan dan putusan',
    details: [
      'KUHP, KUHPerdata, dan peraturan terkini',
      'Putusan pengadilan sebagai preseden',
      'Terminologi hukum lengkap',
      'Update regulasi real-time'
    ],
    link: '/features/knowledge-graph',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Users,
    title: 'Verifikasi Profesional Hukum',
    description: 'Upgrade ke akun profesional dengan verifikasi dokumen',
    details: [
      'Upload dokumen verifikasi',
      'Review oleh admin',
      'Badge profesional verified',
      'Akses fitur premium'
    ],
    link: '/professional-upgrade',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: Lock,
    title: 'Keamanan Data Terjamin',
    description: 'Enkripsi end-to-end dan audit logging lengkap',
    details: [
      'PIN-protected sessions',
      'Audit trail untuk compliance',
      'RBAC (Role-Based Access Control)',
      'Data encryption at rest & in transit'
    ],
    link: '/features#security',
    color: 'from-red-500 to-red-600'
  },
  {
    icon: Globe,
    title: 'Dukungan Multi-Platform',
    description: 'Akses dari web, mobile, atau API',
    details: [
      'Responsive web app',
      'Mobile app (coming soon)',
      'REST API untuk integrasi',
      'Webhook untuk notifikasi'
    ],
    link: '/features#platform',
    color: 'from-indigo-500 to-indigo-600'
  }
]

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Kekuatan Pasalku.ai di Tangan Anda
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platform lengkap dengan teknologi AI terdepan untuk semua kebutuhan hukum Anda
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-white" size={32} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>

              {/* Details List */}
              <ul className="space-y-2 mb-6">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {detail}
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <Link
                href={feature.link}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                Pelajari Lebih Lanjut
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/features">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Lihat Semua Fitur
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Features
```

### File: `components/marketing/UseCases.tsx`

```tsx
'use client'

import { Users, Briefcase, Building, GraduationCap } from 'lucide-react'

const useCases = [
  {
    icon: Users,
    title: 'Masyarakat Umum',
    description: 'Pahami hak dan kewajiban hukum Anda',
    examples: [
      'Konsultasi hukum keluarga',
      'Masalah ketenagakerjaan',
      'Sengketa properti',
      'Hak konsumen'
    ],
    testimonial: {
      name: 'Budi Santoso',
      role: 'Karyawan Swasta',
      quote: 'Pasalku.ai membantu saya memahami hak-hak saya sebagai karyawan. Sangat mudah dan cepat!'
    }
  },
  {
    icon: Briefcase,
    title: 'Profesional Hukum',
    description: 'Riset cepat dan drafting assistance',
    examples: [
      'Riset preseden hukum',
      'Drafting dokumen legal',
      'Analisis kontrak',
      'Legal research'
    ],
    testimonial: {
      name: 'Siti Nurhaliza, S.H.',
      role: 'Advokat',
      quote: 'Tool yang sangat membantu untuk riset hukum. Menghemat waktu saya hingga 70%!'
    }
  },
  {
    icon: Building,
    title: 'Startup & Bisnis Kecil',
    description: 'Panduan hukum untuk pertumbuhan bisnis',
    examples: [
      'Pembuatan PT/CV',
      'Review kontrak bisnis',
      'Compliance check',
      'Perlindungan IP'
    ],
    testimonial: {
      name: 'Andi Wijaya',
      role: 'Founder Startup',
      quote: 'Sebagai startup, kami butuh bantuan hukum yang affordable. Pasalku.ai solusinya!'
    }
  },
  {
    icon: GraduationCap,
    title: 'Mahasiswa Hukum',
    description: 'Belajar dan riset dengan AI',
    examples: [
      'Bantuan tugas kuliah',
      'Riset skripsi/tesis',
      'Pemahaman konsep hukum',
      'Latihan soal'
    ],
    testimonial: {
      name: 'Dewi Lestari',
      role: 'Mahasiswa Hukum',
      quote: 'Sangat membantu untuk memahami konsep hukum yang kompleks. Recommended!'
    }
  }
]

const UseCases = () => {
  return (
    <section id="use-cases" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Siapa yang Bisa Kami Bantu?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pasalku.ai dirancang untuk membantu berbagai kalangan dalam menghadapi tantangan hukum
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <useCase.icon className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600">
                    {useCase.description}
                  </p>
                </div>
              </div>

              {/* Examples */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Contoh Penggunaan:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {useCase.examples.map((example, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 italic mb-2">
                  "{useCase.testimonial.quote}"
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {useCase.testimonial.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {useCase.testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UseCases
```

### File: `components/marketing/PricingPreview.tsx`

```tsx
'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'selamanya',
    description: 'Untuk mencoba Pasalku.ai',
    features: [
      '10 AI queries per bulan',
      'Konsultasi hukum dasar',
      'Riwayat chat',
      'Akses knowledge base',
      'Community support'
    ],
    cta: 'Mulai Gratis',
    popular: false
  },
  {
    name: 'Premium',
    price: 99000,
    period: 'per bulan',
    description: 'Untuk pengguna aktif',
    features: [
      'Unlimited AI queries',
      'Konsultasi hukum advanced',
      'Analisis dokumen',
      'Dual-AI verification',
      'Priority support',
      'Export chat history',
      'PIN-protected sessions'
    ],
    cta: 'Upgrade Sekarang',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'hubungi kami',
    description: 'Untuk organisasi',
    features: [
      'Semua fitur Premium',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Team management',
      'Custom training'
    ],
    cta: 'Hubungi Sales',
    popular: false
  }
]

const PricingPreview = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pilih Paket yang Sesuai untuk Anda
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 shadow-lg ${
                plan.popular
                  ? 'ring-2 ring-blue-500 scale-105'
                  : 'hover:shadow-xl'
              } transition-all`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Paling Populer
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                {typeof plan.price === 'number' ? (
                  <>
                    <span className="text-4xl font-bold text-gray-900">
                      Rp {plan.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-gray-600 ml-2">
                      / {plan.period}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="text-center mt-12">
          <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold">
            Lihat Perbandingan Lengkap →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PricingPreview
```

Saya akan lanjutkan dengan komponen FAQ, CTA, Footer, dan halaman-halaman baru. Apakah Anda ingin saya lanjutkan?
