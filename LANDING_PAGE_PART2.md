# 🎨 Pasalku.ai - Landing Page Implementation Part 2

## Komponen Landing Page (Lanjutan)

### File: `components/marketing/FAQ.tsx`

```tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    question: 'Apa itu Pasalku.ai?',
    answer: 'Pasalku.ai adalah platform konsultasi hukum berbasis AI yang menggunakan teknologi terdepan untuk memberikan bantuan hukum instan, analisis dokumen, dan akses ke basis pengetahuan hukum Indonesia yang komprehensif.'
  },
  {
    question: 'Apakah konsultasi AI dapat menggantikan pengacara?',
    answer: 'Tidak. AI kami dirancang sebagai alat bantu untuk memberikan informasi dan panduan awal. Untuk kasus kompleks atau representasi hukum, kami merekomendasikan konsultasi dengan profesional hukum bersertifikat yang tersedia di platform kami.'
  },
  {
    question: 'Bagaimana cara kerja Dual-AI verification?',
    answer: 'Kami menggunakan dua AI engine (BytePlus Ark dan Groq) yang bekerja secara paralel untuk memverifikasi jawaban. Jika kedua AI memberikan jawaban yang konsisten, confidence score akan lebih tinggi.'
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Ya, sangat aman. Kami menggunakan enkripsi end-to-end, PIN-protected sessions, dan audit logging lengkap. Semua data disimpan sesuai standar keamanan industri dan regulasi perlindungan data.'
  },
  {
    question: 'Berapa biaya berlangganan?',
    answer: 'Kami menawarkan paket Free (10 queries/bulan), Premium (Rp 99.000/bulan untuk unlimited queries), dan Enterprise (custom pricing). Lihat halaman Pricing untuk detail lengkap.'
  },
  {
    question: 'Bagaimana cara upgrade ke akun profesional?',
    answer: 'Klik menu "Profesional Hukum" di navbar, lalu pilih "Daftar Sebagai Profesional". Upload dokumen verifikasi (ijazah, sertifikat, dll) dan tim kami akan review dalam 1-3 hari kerja.'
  }
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xl text-gray-600">
            Temukan jawaban untuk pertanyaan umum tentang Pasalku.ai
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 text-gray-500 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  size={20}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Link to Full FAQ */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Masih ada pertanyaan?</p>
          <Link href="/faq" className="text-blue-600 hover:text-blue-700 font-semibold">
            Lihat FAQ Lengkap →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FAQ
```

### File: `components/marketing/CTA.tsx`

```tsx
'use client'

import { SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const CTA = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Siap Merasakan Bantuan Hukum Tanpa Batas?
          </h2>
          
          {/* Description */}
          <p className="text-xl text-blue-100 mb-8">
            Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan konsultasi hukum dengan AI. 
            Mulai gratis, tidak perlu kartu kredit.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-white mb-1">10,000+</div>
              <div className="text-sm text-blue-100">Pengguna Aktif</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">50,000+</div>
              <div className="text-sm text-blue-100">Konsultasi</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
              <div className="text-sm text-blue-100">Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                Mulai Sekarang - Gratis
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </SignUpButton>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Hubungi Sales
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-blue-100 mt-8">
            ✓ Tidak perlu kartu kredit  •  ✓ Setup dalam 2 menit  •  ✓ Cancel kapan saja
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTA
```

### File: `components/marketing/Footer.tsx`

```tsx
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-white">Pasalku.ai</span>
            </div>
            <p className="text-gray-400 mb-4">
              Platform konsultasi hukum berbasis AI untuk Indonesia. 
              Bantuan hukum cerdas, kapan saja, di mana saja.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produk</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="hover:text-white transition-colors">Fitur</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Harga</Link></li>
              <li><Link href="/features/ai-consultation" className="hover:text-white transition-colors">AI Konsultasi</Link></li>
              <li><Link href="/features/document-analysis" className="hover:text-white transition-colors">Analisis Dokumen</Link></li>
              <li><Link href="/features/knowledge-graph" className="hover:text-white transition-colors">Knowledge Graph</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Kontak</Link></li>
              <li><Link href="/professional-upgrade" className="hover:text-white transition-colors">Jadi Profesional</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bantuan</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Dokumentasi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Pasalku.ai. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

---

## 📄 Halaman-Halaman Baru

### File: `app/(marketing)/pricing/page.tsx`

```tsx
import { Metadata } from 'next'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pricing - Pasalku.ai',
  description: 'Pilih paket yang sesuai untuk kebutuhan hukum Anda'
}

const features = [
  {
    category: 'AI Consultation',
    items: [
      { name: 'AI Queries per bulan', free: '10', premium: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Dual-AI Verification', free: false, premium: true, enterprise: true },
      { name: 'AI Personas', free: '1', premium: '4', enterprise: '4 + Custom' },
      { name: 'Citation Extraction', free: true, premium: true, enterprise: true },
      { name: 'Confidence Score', free: true, premium: true, enterprise: true },
    ]
  },
  {
    category: 'Document Analysis',
    items: [
      { name: 'Upload Dokumen', free: false, premium: true, enterprise: true },
      { name: 'OCR Support', free: false, premium: true, enterprise: true },
      { name: 'Analisis Otomatis', free: false, premium: true, enterprise: true },
      { name: 'Export Results', free: false, premium: true, enterprise: true },
    ]
  },
  {
    category: 'Features',
    items: [
      { name: 'Chat History', free: '30 hari', premium: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'PIN-Protected Sessions', free: false, premium: true, enterprise: true },
      { name: 'Knowledge Base Access', free: 'Basic', premium: 'Full', enterprise: 'Full + Custom' },
      { name: 'API Access', free: false, premium: false, enterprise: true },
      { name: 'Custom Integrations', free: false, premium: false, enterprise: true },
    ]
  },
  {
    category: 'Support',
    items: [
      { name: 'Support Type', free: 'Community', premium: 'Priority Email', enterprise: 'Dedicated' },
      { name: 'Response Time', free: '48 jam', premium: '24 jam', enterprise: '4 jam' },
      { name: 'SLA Guarantee', free: false, premium: false, enterprise: true },
    ]
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Header */}
        <div className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Harga yang Transparan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan Anda. Upgrade atau downgrade kapan saja.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Untuk mencoba</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Rp 0</span>
                <span className="text-gray-600 ml-2">/ selamanya</span>
              </div>
              <Button variant="outline" className="w-full mb-6">
                Mulai Gratis
              </Button>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2" size={16} />
                  10 AI queries/bulan
                </li>
                <li className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2" size={16} />
                  1 AI persona
                </li>
                <li className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2" size={16} />
                  Chat history 30 hari
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <X className="text-gray-300 mr-2" size={16} />
                  Document analysis
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Paling Populer
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <p className="text-blue-100 mb-6">Untuk pengguna aktif</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Rp 99.000</span>
                <span className="text-blue-100 ml-2">/ bulan</span>
              </div>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 mb-6">
                Upgrade Sekarang
              </Button>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-white">
                  <Check className="text-yellow-400 mr-2" size={16} />
                  Unlimited AI queries
                </li>
                <li className="flex items-center text-sm text-white">
                  <Check className="text-yellow-400 mr-2" size={16} />
                  4 AI personas
                </li>
                <li className="flex items-center text-sm text-white">
                  <Check className="text-yellow-400 mr-2" size={16} />
                  Document analysis
                </li>
                <li className="flex items-center text-sm text-white">
                  <Check className="text-yellow-400 mr-2" size={16} />
                  Priority support
                </li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Untuk organisasi</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <Button variant="outline" className="w-full mb-6">
                Hubungi Sales
              </Button>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2" size={16} />
                  Semua fitur Premium
                </li>
                <li className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2" size={16} />
                  API access
                </li>
                <li className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2" size={16} />
                  Custom integrations
                </li>
                <li className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2" size={16} />
                  SLA guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Perbandingan Fitur Lengkap
          </h2>
          
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold bg-blue-50">Premium</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, catIndex) => (
                  <>
                    <tr key={`cat-${catIndex}`} className="bg-gray-50">
                      <td colSpan={4} className="p-4 font-semibold text-gray-900">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={`item-${catIndex}-${itemIndex}`} className="border-b">
                        <td className="p-4 text-gray-700">{item.name}</td>
                        <td className="p-4 text-center">
                          {typeof item.free === 'boolean' ? (
                            item.free ? <Check className="text-green-500 mx-auto" size={20} /> : <X className="text-gray-300 mx-auto" size={20} />
                          ) : (
                            <span className="text-gray-700">{item.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center bg-blue-50">
                          {typeof item.premium === 'boolean' ? (
                            item.premium ? <Check className="text-green-500 mx-auto" size={20} /> : <X className="text-gray-300 mx-auto" size={20} />
                          ) : (
                            <span className="text-gray-700">{item.premium}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof item.enterprise === 'boolean' ? (
                            item.enterprise ? <Check className="text-green-500 mx-auto" size={20} /> : <X className="text-gray-300 mx-auto" size={20} />
                          ) : (
                            <span className="text-gray-700">{item.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Pertanyaan Tentang Harga
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Apakah saya bisa upgrade/downgrade kapan saja?</h3>
              <p className="text-gray-600">Ya, Anda bisa mengubah paket kapan saja. Perubahan akan berlaku di periode billing berikutnya.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Apakah ada biaya tersembunyi?</h3>
              <p className="text-gray-600">Tidak ada biaya tersembunyi. Harga yang tertera sudah final.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Bagaimana cara pembayaran?</h3>
              <p className="text-gray-600">Kami menerima pembayaran melalui kartu kredit, transfer bank, dan e-wallet via Stripe.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

Saya telah membuat komponen FAQ, CTA, Footer, dan halaman Pricing lengkap. Apakah Anda ingin saya lanjutkan dengan:

1. **Halaman About Us** - Tentang perusahaan, tim, visi misi
2. **Halaman Contact** - Form kontak dengan API integration
3. **Halaman Blog** - Blog list dan blog post detail
4. **Halaman FAQ lengkap** - FAQ page terpisah
5. **API Integration** - Contact form API, Blog API, Statsig/Hypertune

Atau Anda ingin fokus ke bagian tertentu?
