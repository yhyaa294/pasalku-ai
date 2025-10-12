'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedNavigation } from '@/components/enhanced-navigation'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function ContactPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', category: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  const handleLogin = () => window.location.href = '/login'
  const handleChatClick = () => window.location.href = '/chat'

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telepon',
      description: 'Hubungi kami langsung',
      contact: '+62 21 1234 5678',
      hours: 'Senin-Jumat 09:00-17:00',
      action: 'tel:+622112345678'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Konsultasi langsung dengan AI hukum',
      contact: 'Mulai Chat Gratis',
      hours: '24/7',
      action: () => handleChatClick()
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Kirim email untuk inquiry umum',
      contact: 'support@pasalku.ai',
      hours: 'Balas dalam 24 jam',
      action: 'mailto:support@pasalku.ai'
    },
    {
      icon: Building2,
      title: 'Kantor',
      description: 'Kunjungi kantor kami',
      contact: 'Jakarta Selatan',
      hours: 'Senin-Jumat 09:00-17:00',
      action: null
    }
  ]

  const inquiryCategories = [
    'Support Teknis',
    'Pertanyaan Produk',
    'Kerjasama Kantor hukum',
    'Media & Partnership',
    'Feedback & Saran',
    'Laporan Bug',
    'Lainnya'
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Hubungi Kami
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kami siap membantu Anda dengan segala pertanyaan tentang Pasalku.ai.
              Tim kami berkomitmen memberikan dukungan terbaik untuk kebutuhan hukum Anda.
            </p>
          </motion.div>

          {/* Contact Methods Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl cursor-pointer border-0 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-3">{method.description}</p>
                    <p className="font-medium text-blue-600 mb-2">{method.contact}</p>
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{method.hours}</span>
                    </div>
                    {method.action ? (
                      typeof method.action === 'string' ? (
                        <a
                          href={method.action}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium"
                        >
                          Hubungi Kami
                        </a>
                      ) : (
                        <button
                          onClick={method.action}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 text-sm font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Mulai Chat</span>
                        </button>
                      )
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Send className="w-6 h-6 text-blue-600" />
                    Kirim Pesan kepada Kami
                  </CardTitle>
                  <p className="text-gray-600">
                    Salah satu tim kami akan segera menghubungi Anda.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@contoh.com"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subjek *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Judul pesan"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori *
                        </label>
                        <select
                          id="category"
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih kategori</option>
                          {inquiryCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Pesan *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Jelaskan pertanyaan atau kebutuhan Anda secara detail..."
                        className="w-full resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 text-lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Mengirim...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          <span>Kirim Pesan</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Submit Status */}
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                        submitStatus === 'success'
                          ? 'bg-green-50 text-green-800 border border-green-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {submitStatus === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {submitStatus === 'success'
                          ? 'Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.'
                          : 'Terjadi kesalahan. Silakan coba lagi.'
                        }
                      </span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Information Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              {/* Office Information */}
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    Kantor Pusat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Pasalku.ai Headquarters</p>
                        <p className="text-gray-600">Jl. Sudirman Jakarta Selatan<br />Jawa Barat 12345, Indonesia</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Jam Operasional</p>
                        <p className="text-gray-600">Senin - Jumat: 09:00 - 17:00 WIB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Kunjungan</p>
                        <p className="text-gray-600">Janji bertemu terlebih dahulu</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick FAQ */}
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-purple-600" />
                    Pertanyaan Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Berapa lama waktu balasan email?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Kami biasanya membalas dalam 1-2 jam kerja untuk pertanyaan prioritas.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Apakah consultation gratis?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Konsultasi awal via chat gratis untuk user terdaftar.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Bagaimana cara kerjasama dengan kantor hukum?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Hubungi tim partnership kami melalui email partnership@pasalku.ai
                      </p>
                    </div>
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
                Solusi AI hukum paling canggih untuk masyarakat Indonesia.
              </p>
              <p className="text-sm text-gray-400">
                © 2024 Pasalku.ai. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/" className="hover:text-white transition-colors">Konsultasi AI</a></li>
                <li><a href="/features" className="hover:text-white transition-colors">Fitur Lengkap</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Paket Harga</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">Tentang Kami</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Kontak Kami</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog & Artikel</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@pasalku.ai</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+62 21 1234 5678</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Jakarta Selatan</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}