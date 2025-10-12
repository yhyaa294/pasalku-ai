'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnhancedNavigation } from '@/components/enhanced-navigation'
import Link from 'next/link'
import {
  Brain,
  MessageSquare,
  FileText,
  BookOpen,
  Users,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  Star
} from 'lucide-react'

export default function FeaturesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public')
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const handleLogin = () => window.location.href = '/login'
  const handleChatClick = () => window.location.href = '/chat'

  const featureCategories = [
    {
      id: 'ai-consultation',
      title: 'AI Konsultasi Hukum',
      description: 'Konsultasi hukum canggih dengan dual AI intelligence',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      features: [
        {
          name: 'Strategic Assessment Intelligence',
          description: 'Analisis strategis kompleks menggunakan Ark + Groq AI fusion',
          benefits: ['94.1% akurasi', 'Multi-angkuts integration', 'Real-time consensus'],
          demo: 'Consultation Demo',
          plan: 'Premium'
        },
        {
          name: 'Adaptive Persona System',
          description: 'AI personas yang otomatis beradaptasi pada situasi negosiasi',
          benefits: ['4 Personality modes', 'Context awareness', 'Dynamic switching'],
          demo: 'Persona Demo',
          plan: 'Professional'
        },
        {
          name: 'Reasoning Chain Analyzer',
          description: 'Deteksi fallacy logis dalam argumen hukum',
          benefits: ['15 fallacy patterns', 'Logic validation', 'Counter-argument generation'],
          demo: 'Reasoning Demo',
          plan: 'Professional'
        }
      ]
    },
    {
      id: 'document-analysis',
      title: 'Document Intelligence',
      description: 'Analisis dokumen hukum canggih dengan AI vision & NLP',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      features: [
        {
          name: 'Contract Intelligence Engine',
          description: 'Analisis kontrak praktik hukum dengan akurasi 87%',
          benefits: ['Risk assessment', 'Optimization suggestions', 'Compliance checking'],
          demo: 'Contract Demo',
          plan: 'Professional'
        },
        {
          name: 'Smart Document OCR',
          description: 'Pengenalan karakter canggih untuk dokumen hukum',
          benefits: ['96% accuracy', 'Handwriting recognition', 'Multi-language support'],
          demo: 'OCR Demo',
          plan: 'Premium'
        },
        {
          name: 'Sentiment Analysis Engine',
          description: 'Analisis tone dan sentiment dalam dokumen hukum',
          benefits: ['8 mood categories', 'Conflict detection', 'Communication optimization'],
          demo: 'Sentiment Demo',
          plan: 'Professional'
        }
      ]
    },
    {
      id: 'legal-research',
      title: 'Legal Research Assistant',
      description: 'Asisten riset hukum otomatis dengan database komprehensif',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      features: [
        {
          name: 'Automated Research Engine',
          description: 'Riset hukum otomatis dengan precedent discovery',
          benefits: ['89% relevance score', 'Cross-jurisdiction search', 'Citation verification'],
          demo: 'Research Demo',
          plan: 'Professional'
        },
        {
          name: 'Knowledge Graph Analytics',
          description: 'Analisis hubungan antar peraturan hukum Indonesia',
          benefits: ['Semantic search', 'Relationship mapping', 'Predictive connections'],
          demo: 'Knowledge Demo',
          plan: 'Professional'
        },
        {
          name: 'Legal Forecasting',
          description: 'Prediksi outcome kasus dengan 87% akurasi',
          benefits: ['Historical analysis', 'Success prediction', 'Risk assessment'],
          demo: 'Forecast Demo',
          plan: 'Professional'
        }
      ]
    }
  ]

  const advancedFeatures = [
    {
      name: 'Virtual Court Simulation',
      description: 'Simulasi persidangan dengan AI praetor dan avokat',
      benefits: ['Realistic proceedings', 'Performance feedback', 'Courtroom training'],
      status: 'Lambda',
      icon: Users
    },
    {
      name: 'Multi-Party Negotiation Mediator',
      description: 'Mediasi negosiasi multiparty dengan analisis kepentingan',
      benefits: ['Win-win calculation', 'Stakeholder mapping', 'Coalition analysis'],
      status: 'Lambda',
      icon: Shield
    },
    {
      name: 'Legal Business Intelligence',
      description: 'Dashboard analytics untuk pengelolaan praktik hukum',
      benefits: ['Revenue forecasting', 'Performance metrics', 'Client retention analysis'],
      status: 'Lambda',
      icon: TrendingUp
    },
    {
      name: 'AI Voice Assistant',
      description: 'Asisten suara natural untuk konsultasi hukum',
      benefits: ['Natural conversations', 'Multi-language voice', 'Conference integration'],
      status: 'Beta',
      icon: MessageSquare
    }
  ]

  const performanceStats = [
    { metric: 'AI Accuracy', value: '94.1%', trend: '+16.8%' },
    { metric: 'Response Time', value: '<200ms', trend: '-15.2%' },
    { metric: 'User Satisfaction', value: '97%', trend: '+23.4%' },
    { metric: 'Risk Reduction', value: '87%', trend: '+12.3%' }
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Semua Fitur AI Kami
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Temukan kecanggihan 96+ fitur AI hukum kami yang didukung oleh teknologi dual AI
              terdepan dunia. Dari konsultasi sederhana sampai analisis enterprise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-medium">
                  Mulai Konsultasi Gratis
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-medium">
                  Lihat Paket Harga
                </Button>
              </Link>
            </div>

            {/* Performance Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {performanceStats.map((stat, index) => (
                <motion.div
                  key={stat.metric}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50"
                >
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.metric}</div>
                  <div className="flex items-center text-green-600 text-xs mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Feature Categories Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs defaultValue="ai-consultation" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                {featureCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-3 px-6 py-4 rounded-lg text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{category.title}</div>
                      <div className="text-xs opacity-75">Direkomendasikan</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {featureCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {category.features.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-all duration-300 hover:shadow-xl border-0 overflow-hidden group">
                          <CardHeader className="relative">
                            <div className="flex items-start justify-between">
                              <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} mb-4`}>
                                <Brain className="w-6 h-6 text-white" />
                              </div>
                              <Badge className={`text-xs ${
                                feature.plan === 'Gratis' ? 'bg-green-100 text-green-800' :
                                feature.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {feature.plan}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {feature.name}
                            </CardTitle>
                            <p className="text-gray-600 mt-2 leading-relaxed">
                              {feature.description}
                            </p>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            {/* Benefits */}
                            <div className="space-y-2">
                              {feature.benefits.map((benefit, benefitIndex) => (
                                <div key={benefitIndex} className="flex items-center gap-3">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{benefit}</span>
                                </div>
                              ))}
                            </div>

                            {/* Demo Button */}
                            <button
                              onClick={() => setActiveDemo(feature.demo)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 hover:border-blue-300 rounded-lg transition-all group"
                            >
                              <Play className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">Lihat Demo</span>
                            </button>

                            {/* Plan Link */}
                            <div className="pt-2">
                              <Link href={`/pricing`}>
                                <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50">
                                  Upgrade ke {feature.plan}
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>

          {/* Advanced Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Fitur Advanced & Enterprise
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Teknologi AI hukum paling mutakhir untuk kantor hukum dan perusahaan enterprise.
                Fitur-fitur ini didasarkan pada permintaan pengguna dan teknologi terkini.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {advancedFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-all duration-300 hover:shadow-xl border-0 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{feature.name}</h3>
                            <Badge className={`text-xs ${
                              feature.status === 'Gamma' ? 'bg-green-100 text-green-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              <Sparkles className="w-3 h-3 mr-1" />
                              {feature.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center gap-3">
                            <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <Link href="/contact" className="block mt-4">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          Minta Akses Beta
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Demo Modal */}
          <AnimatePresence>
            {activeDemo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setActiveDemo(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Demo {activeDemo}</h3>
                    <p className="text-gray-600 mb-6">
                      Demo interaktif untuk fitur ini sedang dipersiapkan.
                      Hubungi kami untuk jadwalkan demonstrasi khusus!
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setActiveDemo(null)} className="flex-1">
                        Tutup
                      </Button>
                      <Link href="/contact" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                          Jadwalkan Demo
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Siap Jelajahi Semua Fitur Kami?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Dari fitur dasar gratis sampai solusi enterprise canggih,
              kami punya yang sesuai dengan kebutuhan hukum Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  Mulai Gratisan Sekarang
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold">
                  Lihat Semua Paket
                </Button>
              </Link>
            </div>
          </motion.div>
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
                Platform AI hukum dengan fitur paling lengkap dan canggih di Indonesia.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Fitur Unggulan</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/features#ai-consultation" className="hover:text-white transition-colors">Konsultasi AI</a></li>
                <li><a href="/features#document-analysis" className="hover:text-white transition-colors">Analisis Dokumen</a></li>
                <li><a href="/features#legal-research" className="hover:text-white transition-colors">Riset Hukum</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Artikel Teknologi</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Kontak Kami</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Status Sistem</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Semua Sistem Online</span>
                </div>
                <div className="text-sm text-gray-400">
                  Response Time: <20ms<br/>
                  AI Accuracy: 94.1%<br/>
                  Uptime: 99.9%
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}