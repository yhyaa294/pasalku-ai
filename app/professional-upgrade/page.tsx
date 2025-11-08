'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { UltraSimpleNavbar } from '@/components/ultra-simple-navbar'
import { EnhancedFooter } from '@/components/enhanced-footer'
import {
  Award,
  Briefcase,
  FileText,
  Users,
  Shield,
  CheckCircle,
  Star,
  TrendingUp,
  MessageSquare,
  Database,
  Building
} from 'lucide-react'
import Link from 'next/link'

export default function ProfessionalUpgradePage() {
  const [isAuthenticated] = useState(false)
  const [userRole] = useState<'public' | 'legal_professional' | 'admin'>('public')
  const [showForm, setShowForm] = useState(false)
  const [verificationStep, setVerificationStep] = useState(1)

  const handleLogin = () => window.location.href = '/login'
  const handleChatClick = () => window.location.href = '/chat'

  const professionalBenefits = [
    {
      icon: Users,
      title: "Networking Profesional",
      description: "Gabung dengan komunitas pengacara, notaris, dan profesional hukum terverifikasi",
      detail: "Akses ke directory profesional hukum, kemampuan untuk berkolaborasi pada kasus besar"
    },
    {
      icon: Database,
      title: "Database Kasus Premium",
      description: "Akses ke database 50,000+ kasus hukum Indonesia dengan analisis AI mendalam",
      detail: "Hidden precedents, pattern recognition, dan analisis outcome prediction"
    },
    {
      icon: Shield,
      title: "Professional Liability Insurance",
      description: "Perlindungan asuransi dalam penggunaan platform untuk praktik profesional",
      detail: "Coverage hingga Rp 1 milyar untuk kesalahan praktik hukum yang berkaitan dengan platform"
    },
    {
      icon: MessageSquare,
      title: "Prioritas Support 24/7",
      description: "Dukungan dedicated dari account manager dan tim legal tech specialist",
      detail: "Response time guaranteed kurang dari 2 jam, dedicated hotline +62 21-1234-5678"
    },
    {
      icon: FileText,
      title: "Template Dokumen Premium",
      description: "500+ template profesional dari kuasa hukum terkemuka dan firma hukum",
      detail: "Power of attorney, contracts, motion papers, dan legal documents lainnya"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard Bisnis",
      description: "Insight mendalam tentang performance praktik hukum Anda",
      detail: "Revenue tracking, client retention, case success rate, dan business intelligence"
    },
    {
      icon: Award,
      title: "Certificate of Expertise",
      description: "Sertifikasi kompetensi dalam penggunaan AI untuk praktik hukum modern",
      detail: "Certificate resmi dari Pasalku.ai yang diakui oleh asosiasi hukum Indonesia"
    },
    {
      icon: Briefcase,
      title: "White Label Solutions",
      description: "Solusi kustom untuk firma hukum Anda dengan branding sendiri",
      detail: "API integration, custom workflows, dan personalized legal tech solutions"
    }
  ]

  const pricingTiers = [
    {
      name: "Professional Basic",
      price: "Rp 497.000",
      period: "per bulan",
      target: "Pengacara Individu",
      features: [
        "Semua fitur Premium",
        "250 konsultasi per bulan",
        "Priority support 24/7",
        "Basic networking access",
        "100GB storage",
        "Professional templates"
      ],
      recommended: false
    },
    {
      name: "Professional Pro",
      price: "Rp 997.000",
      period: "per bulan",
      target: "Kantor Hukum Kecil",
      features: [
        "Semua fitur Professional Basic",
        "1000 konsultasi per bulan",
        "Dedicated account manager",
        "Full networking platform",
        "500GB storage",
        "Premium templates + custom",
        "Business analytics dashboard",
        "API access"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "per firma",
      target: "Firma Hukum Besar",
      features: [
        "Consultation unlimited",
        "Custom AI model training",
        "Multiple user management",
        "Enterprise-grade security",
        "Unlimited storage",
        "White label solutions",
        "Priority SLA 1 jam response",
        "Sertifikasi dan pelatihan tim"
      ],
      recommended: false
    }
  ]

  const verificationSteps = [
    {
      step: 1,
      title: "Data Pribadi",
      description: "Informasi personal dan kontak",
      completed: false
    },
    {
      step: 2,
      title: "Kredensial Profesional",
      description: "STR, NIK Advokat, dll",
      completed: false
    },
    {
      step: 3,
      title: "Verifikasi Dokumen",
      description: "Upload dokumen legalitas",
      completed: false
    },
    {
      step: 4,
      title: "Konfirmasi Pembayaran",
      description: "Setup auto-payment",
      completed: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <UltraSimpleNavbar onLogin={handleLogin} />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Upgrade ke Professional
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Tingkatkan praktik hukum Anda dengan fitur eksklusif untuk profesional,
              networking dengan rekan seprofesi, dan tools canggih yang disesuaikan untuk kebutuhan kantor hukum modern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold"
              >
                Mulai Upgrade Professional
              </Button>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold">
                  Tanyakan Tim Sales
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Professional Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            {professionalBenefits.map((benefit, index) => (
              <motion.div key={benefit.title}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                        <p className="text-gray-700 mb-3">{benefit.description}</p>
                        <p className="text-gray-600 text-sm">{benefit.detail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Pricing Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                Paket Profesional
              </h2>
              <p className="text-lg text-gray-600">
                Pilih paket yang sesuai dengan skala praktik hukum Anda
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <motion.div key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-1 text-sm font-bold">
                        <Star className="w-4 h-4 mr-1" />
                        RECOMMENDED
                      </Badge>
                    </div>
                  )}

                  <Card className={`h-full backdrop-blur-sm bg-white/90 border-0 shadow-xl ${
                    tier.recommended ? 'ring-2 ring-purple-300 border-purple-200' : ''
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</CardTitle>
                      <p className="text-purple-600 font-medium mb-4">{tier.target}</p>
                      <div className="mb-4">
                        <div className="text-4xl font-black text-gray-900 mb-1">{tier.price}</div>
                        <div className="text-gray-600">{tier.period}</div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => setShowForm(true)}
                        className={`w-full ${
                          tier.recommended
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                        } text-white py-3 font-semibold`}
                      >
                        {tier.name === 'Enterprise' ? 'Hubungi Sales' : 'Pilih Paket'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Professional Registration Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={() => setShowForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Upgrade ke Professional Account</h2>
                      <button
                        onClick={() => setShowForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Verification Steps */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Proses Verifikasi Professional</h3>
                      <div className="space-y-4">
                        {verificationSteps.map((step, index) => (
                          <div key={step.step} className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              verificationStep > step.step
                                ? 'bg-green-500 text-white'
                                : verificationStep === step.step
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                            }`}>
                              {verificationStep > step.step ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-sm font-semibold">{step.step}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{step.title}</h4>
                              <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Step Form */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      {verificationStep === 1 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">Data Pribadi</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Nama Lengkap" />
                            <Input placeholder="EProfessional" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="No. Telepon" />
                            <Input placeholder="Nama Kantor Hukum (Opsional)" />
                          </div>
                          <div className="flex justify-end">
                            <Button
                              onClick={() => setVerificationStep(2)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Selanjutnya
                            </Button>
                          </div>
                        </div>
                      )}

                      {verificationStep === 2 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">Kredensial Profesional</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="NIK Advokat / Pengacara" />
                            <Input placeholder="Nomor STR (Surat Tanda Registrasi)" />
                          </div>
                          <Input placeholder="Jurusan Pendidikan (S1 Hukum)" />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setVerificationStep(1)}
                            >
                              Kembali
                            </Button>
                            <Button
                              onClick={() => setVerificationStep(3)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Selanjutnya
                            </Button>
                          </div>
                        </div>
                      )}

                      {verificationStep === 3 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">Upload Dokumen Verifikasi</h4>
                          <div className="space-y-3">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">Upload SK Pengangkatan Advokat</p>
                              <p className="text-sm text-gray-400">File PDF, max 10MB</p>
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                              <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">Upload SIUP/Izin Kantor Hukum (Opsional)</p>
                              <p className="text-sm text-gray-400">File PDF, max 10MB</p>
                            </div>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <p className="text-yellow-800 text-sm">
                              📝 Proses verifikasi memakan waktu 1-2 hari kerja. Dokumen Anda akan diperiksa keasliannya.
                            </p>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setVerificationStep(2)}
                            >
                              Kembali
                            </Button>
                            <Button
                              onClick={() => setVerificationStep(4)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Lanjut ke Pembayaran
                            </Button>
                          </div>
                        </div>
                      )}

                      {verificationStep === 4 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">Konfirmasi Pembayaran</h4>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                            <p className="text-green-800 font-semibold">Paket Professional Pro</p>
                            <p className="text-green-700">Rp 997.000 per bulan</p>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Pembayaran akan diproses setelah dokumen Anda diverifikasi. Anda akan mendapatkan akses
                            penuh ke fitur professional dalam waktu 24 jam setelah konfirmasi pembayaran.
                          </p>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setVerificationStep(3)}
                            >
                              Kembali
                            </Button>
                            <Button
                              onClick={() => setShowForm(false)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Konfirmasi Upgrade
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <EnhancedFooter />
    </div>
  )
}