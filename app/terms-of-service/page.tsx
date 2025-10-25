'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedNavigation } from '@/components/enhanced-navigation'
import { Badge } from '@/components/ui/badge'
import { EnhancedFooter } from '@/components/enhanced-footer'
import {
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  DollarSign,
  Users,
  Database
} from 'lucide-react'

export default function TermsOfServicePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public')

  const handleLogin = () => window.location.href = '/login'
  const handleChatClick = () => window.location.href = '/chat'

  const keyTerms = [
    {
      icon: Users,
      title: "Penggunaan untuk Tujuan Hukum",
      description: "Platform ini dirancang secara eksklusif untuk konsultasi dan analisis hukum yang sah.",
      highlight: "Hanya boleh digunakan untuk keperluan hukum yang sah dan etis."
    },
    {
      icon: Shield,
      title: "Tidak Menggantikan Pengacara",
      description: "Sistem AI kami memberikan nasihat umum dan tidak menggantikan konsultan hukum profesional.",
      highlight: "Selalu konsultasi dengan pengacara untuk kasus spesifik."
    },
    {
      icon: Scale,
      title: "Tidak Mengikat Secara Hukum",
      description: "Informasi yang diberikan AI adalah estimasi dan tidak memiliki kekuatan hukum yang mengikat.",
      highlight: "AI memberikan panduan, bukan putusan hukum final."
    },
    {
      icon: DollarSign,
      title: "Pembayaran Sebagaimana Diharapkan",
      description: "Semua biaya langganan harus dibayar sesuai dengan paket yang dipilih dan ketentuan yang berlaku.",
      highlight: "Pembayaran tepat waktu menjamin akses kontinyu ke layanan."
    }
  ]

  const serviceLevels = [
    {
      name: "Gratis",
      features: [
        "5 konsultasi per bulan",
        "Support via email",
        "Akses dasar semua fitur AI",
        "Uptime 99.5% SLA",
        "Tidak ada jaminan respons waktu"
      ],
      limitations: [
        "Limited ke aksesitas fitur premium",
        "Tidak ada SLA binding",
        "Support response dalam 72 jam"
      ]
    },
    {
      name: "Premium",
      features: [
        "50 konsultasi per bulan",
        "Support prioritas 24/7",
        "Akses semua fitur AI",
        "Uptime 99.9% SLA",
        "Response dalam 12 jam kerja",
        "Dashboard analytics"
      ],
      limitations: [
        "Penyimpanan maksimal 2GB",
        "Tidak ada custom integrations"
      ]
    },
    {
      name: "Professional",
      features: [
        "Konsultasi tak terbatas",
        "Support dedicated account manager",
        "Semua fitur enterprise",
        "Uptime 99.99% SLA",
        "Response dalam 4 jam",
        "Custom integrations",
        "API access",
        "Penyimpanan unlimited"
      ],
      limitations: [
        "Biaya monthly sesuai kontrak"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <EnhancedNavigation
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogin={handleLogin}
        onChatClick={handleChatClick}
      />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Syarat & Ketentuan Penggunaan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Ketentuan penggunaan platform Pasalku.ai yang wajib dipahami dan disetujui
              oleh setiap pengguna sebelum mulai menggunakan layanan kami.
            </p>
            <Badge className="bg-green-100 text-green-800">
              ✅ Efektif mulai: 1 Februari 2024
            </Badge>
          </motion.div>

          {/* Key Terms Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {keyTerms.map((term, index) => (
              <motion.div
                key={term.title}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl border-0">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                      <term.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {term.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3">{term.description}</p>
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                      <p className="text-blue-800 text-sm font-medium">{term.highlight}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Service Level Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                Tingkatan Layanan
              </h2>
              <p className="text-gray-600">
                Hak dan kewajiban yang berbeda untuk setiap paket langganan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {serviceLevels.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card className={`backdrop-blur-sm bg-white/90 border-0 shadow-lg ${
                    service.name === 'Premium' ? 'ring-2 ring-purple-300' : ''
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900">{service.name}</CardTitle>
                      {service.name === 'Premium' && (
                        <Badge className="bg-purple-100 text-purple-800 mt-2">Most Popular</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Fitur Utama
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {service.limitations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Keterbatasan
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {service.limitations.map((limitation, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Detailed Terms Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                  Syarat & Ketentuan Lengkap Pasalku.ai
                </CardTitle>
                <p className="text-gray-600 text-center">
                  Dokumen ini merupakan kontrak hukum antara Anda dan Pasalku.ai
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Penerimaan Syarat</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Dengan mengakses dan menggunakan platform Pasalku.ai, Anda secara eksplisit menyetujui untuk terikat
                    oleh syarat dan ketentuan yang tercantum di sini. Jika Anda tidak setuju dengan semua ketentuan ini,
                    Anda dilarang menggunakan platform ini dan harus segera menghentikan akses Anda.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Definisi</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-800">"Platform"</span> berarti situs web, aplikasi, dan layanan AI Pasalku.ai
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">"Pengguna"</span> berarti individu atau entitas yang menggunakan platform
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">"Content"</span> berarti teks, dokumen, pertanyaan konsultasi yang diupload oleh pengguna
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">"Pihak Ketiga"</span> berarti pengacara, konsultan hukum, atau penyedia layanan profesional
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Kelayakan Pengguna</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Persyaratan Umum:</h4>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Berusia minimal 18 tahun atau memiliki persetujuan orangtua/wali hukum</li>
                          <li>• Berwenang secara hukum untuk menandatangani kontrak</li>
                          <li>• Menggunakan platform hanya untuk tujuan hukum yang sah</li>
                          <li>• Tidak memiliki catatan pelanggaran hukum yang relevan</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Layanan yang Disediakan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Fitur Utama:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>✓ Konsultasi AI hukum</li>
                        <li>✓ Analisis dokumen otomatis</li>
                        <li>✓ Riset hukum canggih</li>
                        <li>✓ Knowledge base hukum Indonesia</li>
                        <li>✓ Dashboard analytics pengguna</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Dukungan:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>✓ Live chat support</li>
                        <li>✓ Email support</li>
                        <li>✓ Documentation lengkap</li>
                        <li>✓ Community forum</li>
                        <li>✓ Regular updates</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Kewajiban Pengguna</h3>
                  <p className="text-gray-700 mb-4">Dalam menggunakan platform ini, Anda setuju untuk:</p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Kewajiban Penting
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Memberikan informasi yang benar dan akurat saat registrasi</li>
                      <li>• Menjaga kerahasiaan kata sandi dan informasi akun</li>
                      <li>• Tidak menggunakan platform untuk kegiatan ilegal atau melanggar hukum</li>
                      <li>• Tidak mengupload konten yang melanggar hak cipta atau berbahaya</li>
                      <li>• Bertanggung jawab atas semua aktivitas yang dilakukan dengan akun Anda</li>
                      <li>• Membayar semua biaya langganan sesuai dengan paket yang dipilih</li>
                      <li>• Menghormati hak kekayaan intelektual Pasalku.ai dan pihak ketiga</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Hak Kekayaan Intelektual</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Platform Pasalku.ai, termasuk tetapi tidak terbatas pada algoritma AI, design interface, database,
                    dan konten edukasi, dilindungi oleh hak cipta dan hak kekayaan intelektual. Anda tidak diperkenankan untuk:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li>• Menyalin, mengubah, atau mendistribusikan platform atau bagiannya</li>
                    <li>• Mengakses kode sumber atau reverse engineering teknologi</li>
                    <li>• Menggunakan nama merek atau logo Pasalku.ai tanpa izin</li>
                    <li>• Menciptakan layanan serupa berdasarkan technology stacks kami</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Keterbatasan Tanggung Jawab</h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        Penting untuk Dipahami
                      </h4>
                      <div className="text-gray-700 text-sm space-y-2">
                        <p>• Platform ini memberikan informasi umum dan tidak menggantikan nasihat hukum profesional</p>
                        <p>• Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan informasi ini</p>
                        <p>• Akurasi AI berkisar 94.1% tetapi dapat berbeda untuk kasus kompleks</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Pasalku.ai disediakan "sebagaimana adanya" tanpa jaminan apapun. Kami tidak bertanggung jawab
                      atas kerugian langsung, tidak langsung, khusus, atau konsekuensial dari penggunaan platform ini.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Pembatalan dan Penghentian</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Anda dapat membatalkan langganan kapan saja dari dashboard akun Anda. Pembatalan akan efektif
                    pada akhir periode billing saat ini. Kami memerlukan waktu 30 hari untuk memproses penghapusan
                    data pengguna sesuai dengan PDPA.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Alasan Penghentian Layanan:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Penggunaan yang melanggar ketentuan</li>
                      <li>• Pembayaran yang tidak tepat waktu</li>
                      <li>• Aktivitas yang mencurigakan atau illegal</li>
                      <li>• Pelanggaran hak kekayaan intelektual</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Hukum yang Berlaku</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Syarat dan ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Indonesia.
                    Setiap perselisihan yang terkait dengan penggunaan platform akan diselesaikan
                    melalui pengadilan negeri Jakarta Selatan sebagai forum yang kompeten.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">10. Perubahan Syarat</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diberitahukan
                    melalui email atau notifikasi di platform minimal 30 hari sebelum efektif berlaku.
                    Penggunaan berkelanjutan platform setelah perubahan berarti Anda menyetujui syarat baru.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">Version History</span>
                    </div>
                    <p className="text-purple-700 text-sm">
                      Versi 1.0 - Efektif 1 Februari 2024. Akan diperbarui sesuai dengan regulasi hukum yang berubah.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">11. Kontak dan Dukungan</h3>
                  <p className="text-gray-700 mb-4">
                    Untuk pertanyaan tentang syarat dan ketentuan ini, silakan hubungi:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Pertanyaan Umum:</h4>
                      <p className="text-gray-700 text-sm">support@pasalku.ai</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Penegakan Syarat:</h4>
                      <p className="text-gray-700 text-sm">legal@pasalku.ai</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-green-50 px-6 py-3 rounded-full border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Syah dan Mengikat Hukum</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-3">
                      Dokumen ini telah disusun sesuai dengan ketentuan hukum Indonesia dan dapat digunakan sebagai
                      bukti dalam proses hukum jika diperlukan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <EnhancedFooter />
    </div>
  )
}
