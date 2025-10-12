'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedNavigation } from '@/components/enhanced-navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  HelpCircle,
  MessageSquare,
  CreditCard,
  Shield,
  Users,
  FileText,
  Brain,
  Clock,
  Mail,
  Phone,
  ChevronDown,
  Search
} from 'lucide-react'

export default function FAQPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('semua')

  const handleLogin = () => window.location.href = '/login'
  const handleChatClick = () => window.location.href = '/chat'

  const faqCategories = [
    { id: 'semua', name: 'Semua FAQ', icon: HelpCircle, count: 45 },
    { id: 'consultation', name: 'AI Konsultasi', icon: MessageSquare, count: 12 },
    { id: 'pricing', name: 'Paket & Harga', icon: CreditCard, count: 8 },
    { id: 'features', name: 'Fitur & Teknologi', icon: Brain, count: 10 },
    { id: 'security', name: 'Keamanan & Privasi', icon: Shield, count: 7 },
    { id: 'professional', name: 'Profesional Hukum', icon: Users, count: 5 },
    { id: 'technical', name: 'Dukungan Teknis', icon: FileText, count: 3 }
  ]

  const faqItems = [
    {
      category: 'consultation',
      question: 'Bagaimana Pasalku.ai membantu konsultasi hukum?',
      answer: 'Pasalku.ai menggunakan kecerdasan buatan dual (BytePlus Ark + Groq AI) untuk memberikan konsultasi hukum yang akurat dan dapat diandalkan. Sistem ini menganalisis kasus Anda, memberikan nasihat hukum dasar, dan membantu membuat dokumen hukum sederhana.'
    },
    {
      category: 'consultation',
      question: 'Apakah AI dapat menggantikan pengacara?',
      answer: 'Tidak, AI seperti Pasalku.ai dirancang sebagai alat tambahan untuk membantu, bukan pengganti pengacara manusia. Kami sangat merekomendasikan berkonsultasi dengan pengacara profesional untuk kasus-kasus kompleks atau penting.'
    },
    {
      category: 'consultation',
      question: 'Berapa lama waktu respons AI?',
      answer: 'Pasalku.ai memberikan respons dalam waktu yang sangat cepat, hanya dalam hitungan detik hingga maksimal 30 detik untuk analisis kompleks, tergantung pada tingkat kompleksitas pertanyaan.'
    },
    {
      category: 'consultation',
      question: 'Bahasa apa yang didukung untuk konsultasi?',
      answer: 'Saat ini kami fokus pada bahasa Indonesia untuk memastikan akurasi maksimal dalam konteks hukum Indonesia. Kami sedang mengembangkan dukungan bahasa lainnya.'
    },
    {
      category: 'pricing',
      question: 'Berapa biaya menggunakan Pasalku.ai?',
      answer: 'Kami menawarkan 3 paket: Gratis (5 konsultasi/bulan), Premium (Rp 97.000/bulan), dan Professional (Rp 397.000/bulan). Paket tahunan mendapatkan diskon hingga 25%.'
    },
    {
      category: 'pricing',
      question: 'Dapatkah saya mengubah paket sewaktu-waktu?',
      answer: 'Ya, Anda dapat upgrade atau downgrade paket kapan saja. Perubahan akan berlaku di periode billing berikutnya. Dana akan dikembalikan secara prorata jika downgrade.'
    },
    {
      category: 'pricing',
      question: 'Apakah ada diskon untuk mahasiswa atau profesional hukum?',
      answer: 'Kami memiliki program khusus untuk mahasiswa fakultas hukum (>50% diskon) dan professional hukum yang ingin upgrade (hubungi kami untuk detail spesial pricing).'
    },
    {
      category: 'features',
      question: 'Apa itu Contract Intelligence Engine?',
      answer: 'Fitur premium kami yang menggunakan AI untuk menganalisis kontrak dengan akurasi 87%, mendeteksi risiko, memberikan suggestion optimasi, dan memastikan compliance dengan regulasi Indonesia.'
    },
    {
      category: 'features',
      question: 'Bagaimana cara menggunakan Sentiment Analysis?',
      answer: 'Sentiment Analysis Engine menganalisis tone dan emosi dalam dokumen hukum Anda. Fitur ini membantu mendeteksi bahasa yang bersifat agresif, defensif, atau tidak tepat dalam konteks hukum.'
    },
    {
      category: 'features',
      question: 'Apakah saya bisa upload dokumen pribadi?',
      answer: 'Ya, dalam paket Premium ke atas, Anda dapat upload dokumen privasi hingga 2GB. Semua dokumen dienkripsi dan aman dari akses pihak ketiga. Kami menggunakan teknologi keamanan enterprise untuk melindungi data Anda.'
    },
    {
      category: 'security',
      question: 'Apakah data saya aman di Pasalku.ai?',
      answer: 'Sangat aman. Kami menggunakan enkripsi AES-256, multi-layer security, dan mematuhi PDPA (Personal Data Protection Act). Data Anda tidak pernah dijual ke pihak ketiga dan hanya digunakan untuk memberikan pelayanan terbaik.'
    },
    {
      category: 'security',
      question: 'Siapa yang memiliki akses ke data consultasi saya?',
      answer: 'Hanya Anda yang memiliki akses penuh ke data konsultasi. Tim teknis kami hanya mengakses metadata untuk improvement sistem, namun tidak pernah melihat isi konsultasi Anda secara spesifik.'
    },
    {
      category: 'professional',
      question: 'Bagaimana cara upgrade menjadi Legal Professional?',
      answer: 'Kunjungi halaman Professional Upgrade, upload dokumen verifikasi (bijak usaha/NIB), dan selesaikan proses verifikasi kami. Biasanya memakan waktu 1-2 hari kerja.'
    },
    {
      category: 'professional',
      question: 'Manfaat apa yang diperoleh Legal Professional?',
      answer: 'Priority access, konsultasi unlimited, template dokumen premium, networking dengan profesional hukum lainnya, dan fitur analytics untuk praktik hukum.'
    },
    {
      category: 'technical',
      question: 'Saya lupa password, apa yang harus dilakukan?',
      answer: 'Gunakan fitur "Forgot Password" di halaman login, atau hubungi support@pasalku.ai untuk bantuan manual. Kami akan membantu recover akun Anda dengan verifikasi keamanan.'
    },
    {
      category: 'technical',
      question: 'Apakah aplikasi Pasalku.ai mendukung mobile?',
      answer: 'Ya! Situs web kami fully responsive untuk semua device. Kami sedang mengembangkan aplikasi mobile native untuk pengalaman yang lebih baik.'
    }
  ]

  const filteredFaqs = faqItems.filter((faq) => {
    const matchesCategory = activeCategory === 'semua' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const quickContactOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat langsung dengan AI konsultan kami',
      action: handleChatClick,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Kirim email ke support@pasalku.ai',
      action: () => window.location.href = 'mailto:support@pasalku.ai',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Hubungi Kam눉',
      description: 'Senin-Jumat 09:00-17:00 WIB',
      action: () => window.location.href = '/contact',
      color: 'from-purple-500 to-pink-500'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Pertanyaan Umum (FAQ)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Temukan jawaban atas pertanyaan paling sering diajukan tentang Pasalku.ai.
              Jika tidak menemukan yang Anda cari, hubungi tim dukungan kami.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Kategori FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        activeCategory === category.id
                          ? 'bg-blue-500'
                          : 'bg-gray-100'
                      }`}>
                        <category.icon className={`w-4 h-4 ${
                          activeCategory === category.id ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.count} pertanyaan</div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Support Card */}
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Butuh Bantuan?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickContactOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={option.action}
                      className={`w-full p-3 rounded-lg bg-gradient-to-r ${option.color} text-white hover:opacity-90 transition-all duration-200 text-left`}
                    >
                      <div className="flex items-center gap-3">
                        <option.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium text-sm">{option.title}</div>
                          <div className="text-xs opacity-90">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {activeCategory === 'semua'
                      ? 'Semua Pertanyaan Umum'
                      : faqCategories.find(cat => cat.id === activeCategory)?.name
                    }
                  </CardTitle>
                  <p className="text-gray-600">
                    {filteredFaqs.length} pertanyaan ditemukan
                  </p>
                </CardHeader>
                <CardContent>
                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-2">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`faq-${index}`}
                          className="border border-gray-200 rounded-lg px-4 overflow-hidden"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-4 text-gray-900 font-medium">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-2 text-gray-700 leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-12">
                      <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pertanyaan yang ditemukan</h3>
                      <p className="text-gray-600">
                        Coba ubah kata kunci pencarian atau pilih kategori lain.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Help */}
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg mt-6">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Masih ada pertanyaan?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tim dukungan kami siap membantu Anda. Hubungi kami melalui berbagai kanal yang tersedia.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleChatClick}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                    >
                      Start Live Chat
                    </button>
                    <a
                      href="/contact"
                      className="px-6 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    >
                      Hubungi Kami
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚖️</span>
                </div>
                <span className="text-xl font-bold">Pasalku.ai</span>
              </div>
              <p className="text-gray-300 mb-4">
                FAQ lengkap untuk membantu Anda memahami dan menggunakan semua fitur Pasalku.ai.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="/features" className="hover:text-white transition-colors">Fitur Lengkap</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Paket & Harga</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">Tentang Kami</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Kontak Kami</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog & Artikel</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Status & Statistik</h3>
              <div className="space-y-2 text-gray-300">
                <p>📊 FAQ ter-update setiap bulan</p>
                <p>💬 Live chat: 24/7</p>
                <p>📞 Support: 09:00-17:00 WIB</p>
                <p>🔄 Last update: Februari 2024</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}