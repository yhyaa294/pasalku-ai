# 🎨 Pasalku.ai - Landing Page Implementation Part 3

## Halaman-Halaman Tambahan & API Integration

### File: `app/(marketing)/contact/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ada pertanyaan? Tim kami siap membantu Anda
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">support@pasalku.ai</p>
                    <p className="text-gray-600">sales@pasalku.ai</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                    <p className="text-gray-600">+62 21 1234 5678</p>
                    <p className="text-sm text-gray-500">Senin - Jumat, 09:00 - 17:00 WIB</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                    <p className="text-gray-600">
                      Jl. Sudirman No. 123<br />
                      Jakarta Pusat 10220<br />
                      Indonesia
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Jam Operasional</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Senin - Jumat</span>
                    <span className="font-medium text-gray-900">09:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sabtu</span>
                    <span className="font-medium text-gray-900">09:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minggu</span>
                    <span className="font-medium text-gray-900">Tutup</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kirim Pesan
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pertanyaan tentang..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                    Pesan berhasil dikirim! Kami akan menghubungi Anda segera.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
                    Terjadi kesalahan. Silakan coba lagi.
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                  <Send className="ml-2" size={20} />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

### File: `app/api/contact/route.ts` (Contact Form API)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Send email via Resend
    const data = await resend.emails.send({
      from: 'Pasalku.ai <noreply@pasalku.ai>',
      to: ['support@pasalku.ai'],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    })

    // Save to database (Neon Instance 2)
    // Optional: Store contact inquiries for CRM
    // await saveContactInquiry({ name, email, subject, message })

    // Trigger Inngest workflow (optional)
    // await inngest.send({
    //   name: 'contact/form.submitted',
    //   data: { name, email, subject, message }
    // })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
```

### File: `app/(marketing)/about/page.tsx`

```tsx
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import { Target, Eye, Heart, Users } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Tentang Pasalku.ai
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami percaya bahwa setiap orang berhak mendapatkan akses ke bantuan hukum yang berkualitas, 
              kapan saja dan di mana saja.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Pasalku.ai didirikan pada tahun 2024 dengan misi untuk mendemokratisasi akses ke bantuan hukum 
                di Indonesia melalui teknologi AI. Kami menggabungkan keahlian hukum dengan teknologi terdepan 
                untuk menciptakan platform yang mudah digunakan, akurat, dan terpercaya.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Dengan menggunakan multiple AI engines dan knowledge graph yang komprehensif, kami memberikan 
                konsultasi hukum yang tidak hanya cepat, tetapi juga akurat dan dapat dipertanggungjawabkan.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Eye className="text-blue-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Visi Kami</h2>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi platform konsultasi hukum berbasis AI terdepan di Indonesia yang memberikan 
                  akses mudah, cepat, dan terpercaya kepada setiap lapisan masyarakat untuk memahami 
                  dan menegakkan hak-hak hukum mereka.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="text-purple-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Misi Kami</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Memberikan konsultasi hukum yang akurat dan mudah dipahami
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Meningkatkan literasi hukum masyarakat Indonesia
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Menghubungkan masyarakat dengan profesional hukum berkualitas
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Terus berinovasi dengan teknologi AI terbaru
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Nilai-Nilai Kami
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                title: 'Empati',
                description: 'Kami memahami bahwa masalah hukum bisa menjadi stres. Kami hadir untuk membantu.'
              },
              {
                icon: Target,
                title: 'Akurasi',
                description: 'Setiap jawaban kami didukung oleh referensi hukum yang valid dan terverifikasi.'
              },
              {
                icon: Users,
                title: 'Aksesibilitas',
                description: 'Bantuan hukum harus mudah diakses oleh semua orang, kapan saja.'
              },
              {
                icon: Eye,
                title: 'Transparansi',
                description: 'Kami terbuka tentang bagaimana AI kami bekerja dan keterbatasannya.'
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
              Tim Kami
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Kombinasi ahli hukum, engineer AI, dan product designer yang berdedikasi
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: 'Dr. Ahmad Santoso, S.H., M.H.',
                  role: 'Chief Legal Officer',
                  description: '15+ tahun pengalaman sebagai advokat'
                },
                {
                  name: 'Sarah Wijaya',
                  role: 'Chief Technology Officer',
                  description: 'Ex-Google AI Engineer'
                },
                {
                  name: 'Budi Prakoso',
                  role: 'Chief Product Officer',
                  description: 'Ex-Gojek Product Lead'
                }
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {[
              { number: '10,000+', label: 'Pengguna Aktif' },
              { number: '50,000+', label: 'Konsultasi Selesai' },
              { number: '1,000+', label: 'Profesional Hukum' },
              { number: '4.9/5', label: 'Rating Pengguna' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

### File: `lib/analytics/statsig.ts` (Statsig Integration)

```typescript
import { StatsigClient } from '@statsig/js-client'

let statsigClient: StatsigClient | null = null

export const initStatsig = async (userId?: string) => {
  if (typeof window === 'undefined') return null

  if (!statsigClient) {
    statsigClient = new StatsigClient(
      process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
      { userID: userId || 'anonymous' }
    )
    
    await statsigClient.initializeAsync()
  }

  return statsigClient
}

export const getStatsigClient = () => statsigClient

// Feature flags
export const checkFeatureFlag = async (flagName: string): Promise<boolean> => {
  const client = await initStatsig()
  if (!client) return false
  
  return client.checkGate(flagName)
}

// A/B Testing
export const getExperiment = async (experimentName: string) => {
  const client = await initStatsig()
  if (!client) return null
  
  return client.getExperiment(experimentName)
}

// Dynamic configs
export const getDynamicConfig = async (configName: string) => {
  const client = await initStatsig()
  if (!client) return null
  
  return client.getDynamicConfig(configName)
}

// Log events
export const logEvent = async (eventName: string, value?: string | number, metadata?: Record<string, any>) => {
  const client = await initStatsig()
  if (!client) return
  
  client.logEvent(eventName, value, metadata)
}

// Example usage in components:
// const showNewFeature = await checkFeatureFlag('new_chat_interface')
// const pricingExperiment = await getExperiment('pricing_test')
// await logEvent('button_clicked', 1, { button_name: 'signup' })
```

### File: `lib/analytics/hypertune.ts` (Hypertune Integration)

```typescript
import { createSource, createClient } from '@hypertune/client'

const hypertuneSource = createSource({
  token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!
})

export const hypertuneClient = createClient({
  source: hypertuneSource,
  context: {
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  }
})

// Feature flags
export const getFeatureFlag = (flagPath: string, defaultValue: boolean = false): boolean => {
  try {
    return hypertuneClient.get(flagPath, defaultValue)
  } catch (error) {
    console.error('Hypertune error:', error)
    return defaultValue
  }
}

// Dynamic values
export const getDynamicValue = <T>(valuePath: string, defaultValue: T): T => {
  try {
    return hypertuneClient.get(valuePath, defaultValue)
  } catch (error) {
    console.error('Hypertune error:', error)
    return defaultValue
  }
}

// Example usage:
// const showBanner = getFeatureFlag('marketing.showPromoBanner', false)
// const maxFreeQueries = getDynamicValue('limits.freeUserQueries', 10)
```

Apakah Anda ingin saya lanjutkan dengan halaman Blog dan FAQ lengkap, atau Anda ingin fokus ke implementasi tertentu?
