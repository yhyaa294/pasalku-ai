'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedNavigation } from '@/components/enhanced-navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  BookOpen,
  HelpCircle,
  FileText,
  Video,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Send,
  Zap,
  Shield,
  CreditCard,
  Users,
  Brain
} from 'lucide-react'

export default function HelpPage() {
  const [isAuthenticated] = useState(false)
  const [userRole] = useState<'public' | 'legal_professional' | 'admin'>('public')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium',
    message: ''
  })

  const handleLogin = () => window.location.href = '/login'
  const handleChatClick = () => window.location.href = '/chat'

  // Categories
  const categories = [
    { id: 'all', name: 'Semua', icon: BookOpen, count: 45, color: 'blue' },
    { id: 'getting-started', name: 'Memulai', icon: Zap, count: 8, color: 'green' },
    { id: 'features', name: 'Fitur AI', icon: Brain, count: 12, color: 'purple' },
    { id: 'billing', name: 'Tagihan & Paket', icon: CreditCard, count: 7, color: 'orange' },
    { id: 'technical', name: 'Dukungan Teknis', icon: FileText, count: 10, color: 'red' },
    { id: 'security', name: 'Keamanan', icon: Shield, count: 5, color: 'indigo' },
    { id: 'professional', name: 'Profesional Hukum', icon: Users, count: 3, color: 'pink' }
  ]

  // Knowledge Base Articles (truncated for brevity)
  const knowledgeBase = [
    {
      category: 'getting-started',
      title: 'Cara Memulai dengan Pasalku.ai',
      description: 'Panduan lengkap untuk pengguna baru',
      readTime: '5 menit',
      views: 1250,
      helpful: 98
    },
    {
      category: 'features',
      title: 'Menggunakan AI Konsultasi Hukum',
      description: 'Cara mendapatkan hasil terbaik dari konsultasi AI',
      readTime: '8 menit',
      views: 2100,
      helpful: 97
    }
  ]

  // FAQ Data (truncated)
  const faqData = [
    {
      category: 'getting-started',
      question: 'Bagaimana cara memulai menggunakan Pasalku.ai?',
      answer: 'Daftar akun gratis, verifikasi email Anda, dan langsung mulai konsultasi dengan AI kami.'
    }
  ]

  const systemStatus = [
    { service: 'AI Consultation', status: 'operational', uptime: '99.9%' },
    { service: 'Document Analysis', status: 'operational', uptime: '99.8%' }
  ]

  const filteredArticles = knowledgeBase.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Pesan Anda telah dikirim!')
    setContactForm({ name: '', email: '', subject: '', priority: 'medium', message: '' })
  }

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
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Bantuan & Dukungan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Temukan jawaban cepat dan dukungan 24/7 untuk semua kebutuhan Anda
            </p>

            {/* Smart Search */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari artikel atau FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg border-2 rounded-xl shadow-lg"
              />
            </div>

            {/* Quick Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <button
                onClick={handleChatClick}
                className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg"
              >
                <MessageSquare className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg">Live Chat AI</h3>
              </button>

              <button
                onClick={() => window.location.href = 'mailto:support@pasalku.ai'}
                className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg"
              >
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg">Email Support</h3>
              </button>

              <button
                className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg"
              >
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg">Hubungi Kami</h3>
              </button>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span>{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Knowledge Base */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Knowledge Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredArticles.map((article, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer"
                      >
                        <h3 className="font-bold text-gray-900 mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📖 {article.readTime}</span>
                          <span>👁️ {article.views.toLocaleString()}</span>
                          <span>✅ {article.helpful}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <HelpCircle className="w-6 h-6 text-purple-600" />
                    FAQ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {filteredFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* System Status */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-green-600" />
                    Status Sistem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {systemStatus.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium">{service.service}</span>
                      </div>
                      <Badge variant="outline">{service.uptime}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Send className="w-6 h-6 text-blue-600" />
                Hubungi Tim Dukungan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitContact} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nama *</label>
                    <Input
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subjek *</label>
                  <Input
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Masalah teknis / Pertanyaan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pesan *</label>
                  <Textarea
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Jelaskan masalah Anda..."
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700">
                  <Send className="w-5 h-5 mr-2" />
                  Kirim Pesan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
