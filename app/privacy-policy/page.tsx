'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedNavigation } from '@/components/enhanced-navigation'
import { Badge } from '@/components/ui/badge'
import { EnhancedFooter } from '@/components/enhanced-footer'
import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  Cookie,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function PrivacyPolicyPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public')

  const handleLogin = () => window.location.href = '/login'
  const handleChatClick = () => window.location.href = '/chat'

  const sections = [
    {
      icon: Shield,
      title: "Pengumpulan Data",
      content: "Kami mengumpulkan informasi pribadi yang Anda berikan secara langsung saat menggunakan layanan kami.",
      details: [
        "Nama, email, nomor telepon untuk akun pengguna",
        "Konten konsultasi dan percakapan dengan AI",
        "Dokumen yang diupload untuk analisis",
        "Data teknis (IP address, browser, device info)"
      ]
    },
    {
      icon: Lock,
      title: "Keamanan Data",
      content: "Data Anda dienkripsi dan dilindungi dengan protokol keamanan enterprise-grade.",
      details: [
        "Enkripsi AES-256 untuk data saat transit dan penyimpanan",
        "Multi-layer authentication untuk akses sistem",
        "Regular security audits oleh tim keamanan independen",
        "Data backup terotentikasi dan encrypted"
      ]
    },
    {
      icon: Eye,
      title: "Penggunaan Data",
      content: "Data Anda digunakan secara ekslusif untuk memberikan dan meningkatkan layanan AI hukum.",
      details: [
        "Memproses permintaan konsultasi hukum Anda",
        "Mentrain model AI untuk akurasi yang lebih baik",
        "Deteksi dan pencegahan penyalahgunaan platform",
        "Peningkatan fitur berdasarkan pola penggunaan"
      ]
    },
    {
      icon: Users,
      title: "Berbagi Data",
      content: "Kami TIDAK menjual, menyewakan, atau membagikan data pribadi Anda ke pihak ketiga.",
      details: [
        "Hanya dalam keadaan darurat hukum dengan surat perintah resmi",
        "Dengan persetujuan eksplisit Anda untuk keperluan profesional",
        "Tidak ada data dijual untuk keperluan marketing",
        "Partner terpercaya hanya mendapat data anonymized"
      ]
    }
  ]

  const complianceMeasures = [
    {
      title: "PDPA Compliance",
      description: "Personal Data Protection Act (Indonesia) - Kami mematuhi semua regulasi perlindungan data pribadi Indonesia.",
      status: "Fully Compliant",
      color: "green"
    },
    {
      title: "GDPR Compatible",
      description: "Meskipun tidak berlaku langsung di Indonesia, sistem kami dirancang untuk memenuhi standar GDPR internasional.",
      status: "GDPR Ready",
      color: "blue"
    },
    {
      title: "Data Retention",
      description: "Data konsultasi disimpan maksimal 3 tahun atau sesuai regulasi hukum yang berlaku.",
      status: "3 Year Retention",
      color: "purple"
    },
    {
      title: "User Rights",
      description: "Anda memiliki hak penuh atas data pribadi: akses, koreksi, penghapusan, dan portabilitas data.",
      status: "Full Rights",
      color: "orange"
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Pertanggungjawaban penuh atas keamanan dan privasi data Anda adalah prioritas utama kami.
              Kebijakan ini menjelaskan bagaimana kami mengumpul, menggunakan, dan melindungi informasi pribadi Anda.
            </p>
            <Badge className="bg-green-100 text-green-800">
              ✅ Terakhir diperbarui: Februari 2024
            </Badge>
          </motion.div>

          {/* Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl border-0">
                  <CardHeader className="pb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{section.content}</p>
                    <ul className="space-y-2">
                      {section.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Compliance & Standards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                Standar Kepatuhan & Sertifikasi
              </h2>
              <p className="text-gray-600">
                Kami memenuhi standar keamanan tertinggi dalam industri teknologi dan jasa hukum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceMeasures.map((compliance, index) => (
                <motion.div
                  key={compliance.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-3 h-3 mt-2 rounded-full ${
                          compliance.color === 'green' ? 'bg-green-500' :
                          compliance.color === 'blue' ? 'bg-blue-500' :
                          compliance.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{compliance.title}</h3>
                            <Badge className={`text-xs ${
                              compliance.color === 'green' ? 'bg-green-100 text-green-800' :
                              compliance.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                              compliance.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {compliance.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{compliance.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Detailed Privacy Policy Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                  Kebijakan Privasi Lengkap Pasalku.ai
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Pengantar</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Pasalku.ai ("kami," "kami," atau "platform kami") berkomitmen untuk melindungi privasi dan data pribadi pengguna kami.
                    Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan platform AI hukum kami.
                    Dengan menggunakan Pasalku.ai, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Informasi yang Kami Kumpulkan</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Informasi Pribadi:</h4>
                      <p className="text-gray-700">Nama, alamat email, nomor telepon, informasi profesional (jika berlaku)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Konten Pengguna:</h4>
                      <p className="text-gray-700">Pertanyaan konsultasi hukum, dokumen yang diupload, percakapan dengan AI</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Informasi Teknis:</h4>
                      <p className="text-gray-700">IP address, jenis browser, device information, log aktivitas</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Penggunaan Data</h3>
                  <p className="text-gray-700 mb-4">Data Anda digunakan secara eksklusif untuk:</p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li>• Memproses permintaan konsultasi hukum dan analisis dokumen</li>
                    <li>• Memperbaiki dan mengembangkan teknologı AI kami</li>
                    <li>• Menyediakan dukungan pelanggan yang efektif</li>
                    <li>• Memastikan keamanan dan pencegahan penyalahgunaan platform</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Berbagi Data dengan Pihak Ketiga</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Kami TIDAK menjual, menyewakan, atau meminjamkan data pribadi Anda ke pihak manapun untuk keperluan komersial.
                    Data hanya dibagikan dalam keadaan berikut:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li>• Dengan persetujuan eksplisit Anda untuk kerjasama profesional hukum</li>
                    <li>• Jika diwajibkan oleh hukum atau surat perintah resmi dari pengadilan</li>
                    <li>• Kepada penyedia layanan tepercaya yang membantu operasional (anonimized)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Hak Anda atas Data</h3>
                  <p className="text-gray-700 mb-4">Anda memiliki hak penuh untuk:</p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li>• <strong>Akses:</strong> Meminta informasi tentang data pribadi yang kami simpan</li>
                    <li>• <strong>Koreksi:</strong> Meminta koreksi data yang tidak akurat atau tidak lengkap</li>
                    <li>• <strong>Hapus:</strong> Meminta penghapusan data pribadi Anda (kecuali wajib disimpan oleh hukum)</li>
                    <li>• <strong>Portabilitas:</strong> Meminta salinan data dalam format yang mudah dibaca</li>
                        <li>• <strong>Pengadian:</strong> Keberatan terhadap pengolahan data tertentu</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Keamanan Data</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Keamanan data adalah prioritas utama kami. Kami menggunakan beberapa lapis perlindungan teknis dan prosedural:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Teknis:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Enkripsi AES-256</li>
                        <li>• HTTPS dengan TLS 1.3+</li>
                        <li>• Two-Factor Authentication</li>
                        <li>• Regular security patches</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Prosedural:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Access control ketat</li>
                        <li>• Regular security audits</li>
                        <li>• Employee training</li>
                        <li>• Incident response plan</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies dan Tracking</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman Anda dan menganalisis penggunaan platform:
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Cookie className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Kesesuaian dengan Preferensi Anda</h4>
                        <p className="text-gray-700 text-sm mt-1">
                          Anda dapat mengontrol penggunaan cookies melalui pengaturan browser Anda.
                          Namun beberapa fitur mungkin tidak berfungsi optimal jika cookies dinonaktifkan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Jangka Waktu Penyimpanan Data</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Data Anda disimpan selama diperlukan untuk memberikan layanan kami, mematuhi persyaratan hukum, dan periode yang wajar untuk keperluan bisnis.
                    Secara umum: data konsultasi disimpan maksimal 3 tahun, data rekening disimpan sesuai ketentuan hukum perpajakan,
                    dan data teknis anonymized disimpan untuk analitik sistem.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Perubahan Kebijakan</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu untuk mencerminkan perubahan dalam praktik kami atau regulasi yang berlaku.
                    Jika ada perubahan material, kami akan memberitahu Anda melalui email atau pemberitahuan di platform.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-gray-800 font-medium">Pemberitahuan</p>
                        <p className="text-gray-700 text-sm mt-1">
                          Tanggal efektif kebijakan ini: 1 Februari 2024. Kebijakan ini telah ditinjau dan diperbarui sesuai dengan PDPA 2022.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">10. Kontak Kami</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Pertanyaan Umum Privasi:</h4>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">privacy@pasalku.ai</span>
                      </div>
                      <p className="text-sm text-gray-600">Kami respon dalam 24 jam kerja</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Permintaan Data Protection:</h4>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">data.protection@pasalku.ai</span>
                      </div>
                      <p className="text-sm text-gray-600">Untuk akses, korrksi, atau penghapusan data</p>
                    </div>
                  </div>
                </div>

                {/* Compliance Badge */}
                <div className="border-t pt-8">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-green-50 px-6 py-3 rounded-full border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">PDPA Fully Compliant Platform</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-3">
                      Platform ini telah diaudit dan bersertifikat mematuhi semua persyaratan PDPA
                      serta standar privasi internasional lainnya.
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
