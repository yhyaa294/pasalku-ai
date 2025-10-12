'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EnhancedNavigation } from '@/components/enhanced-navigation'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  TrendingUp,
  Brain,
  Shield,
  Users as UsersIcon,
  Search,
  Filter
} from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public')
  const [activeFilter, setActiveFilter] = useState('semua')
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogin = () => window.location.href = '/login'
  const handleChatClick = () => window.location.href = '/chat'

  const blogFilters = [
    { id: 'semua', name: 'Semua Artikel', count: 24 },
    { id: 'ai-technology', name: 'AI & Teknologi', count: 8 },
    { id: 'legal-updates', name: 'Update Hukum', count: 6 },
    { id: 'case-studies', name: 'Studi Kasus', count: 4 },
    { id: 'tips-tricks', name: 'Tips & Trik', count: 3 },
    { id: 'platform-updates', name: 'Update Platform', count: 3 }
  ]

  const featuredArticle = {
    id: 'dual-ai-revolution',
    title: 'Revolusi Dual AI: BytePlus Ark + Groq Mengubah Konsultasi Hukum Indonesia',
    excerpt: 'Pelajari bagaimana penggabungan dua AI terdepan dunia memberikan akurasi 94.1% dalam analisis hukum Indonesia, menjadikan Paslakku.ai sebagai platform AI hukum terdepan di dunia.',
    category: 'AI & Teknologi',
    author: 'Ahmad Syarifuddin Yahya',
    date: 'February 15, 2024',
    readTime: '8 min read',
    image: '🤖',
    featured: true
  }

  const blogArticles = [
    {
      id: 'contract-intelligence-2024',
      title: 'Contract Intelligence Engine: Bagaimana AI Mengoptimalkan Kontrak dengan 87% Akurasi',
      excerpt: 'Jelajahi fitur Contract Intelligence Engine yang telah direvolusionerkan dengan teknologi AI terkini.',
      category: 'AI & Teknologi',
      author: 'Dr. Sarah Andini',
      date: 'February 12, 2024',
      readTime: '6 min read',
      image: '📋',
      popular: true
    },
    {
      id: 'new-civil-law-changes',
      title: 'KUH Perdata: Perubahan Terbaru yang Harus Diketahui Warga Negara',
      excerpt: 'Panduan lengkap tentang revisi terbaru Kitab Undang-Undang Hukum Perdata yang mempengaruhi hak-hak sipil.',
      category: 'Update Hukum',
      author: 'Prof. Hendrawan Yudhistira',
      date: 'February 10, 2024',
      readTime: '10 min read',
      image: '📜',
      trending: true
    },
    {
      id: 'startup-legal-guide',
      title: 'Panduan Lengkap Hukum untuk Startup: Mulai dari Legalitas Hingga IPO',
      excerpt: 'Langkah-langkah penting yang harus dipersiapkan startup Indonesia untuk menghindari masalah hukum.',
      category: 'Tips & Trik',
      author: 'Maya Sari Putri',
      date: 'February 8, 2024',
      readTime: '12 min read',
      image: '🚀'
    },
    {
      id: 'adaptive-persona-in-negotiation',
      title: 'Studi Kasus: Bagaimana Adaptive Persona Negotiation Mengubah Hasil Perundingan',
      excerpt: 'Kasus nyata implementasi AI dikalahkan negotiating profesional dari 4 persona berbeda.',
      category: 'Studi Kasus',
      author: 'AI Research Team',
      date: 'February 5, 2024',
      readTime: '15 min read',
      image: '🎭',
      popular: true
    },
    {
      id: 'pdpa-compliance-guide',
      title: 'Memahami PDPA: Kepatuhan Data Pribadi dalam Era Digital',
      excerpt: 'Penjelasan lengkap tentang Personal Data Protection Act dan implementasinya di Indonesia.',
      category: 'Update Hukum',
      author: 'Legal Compliance Team',
      date: 'February 3, 2024',
      readTime: '8 min read',
      image: '🛡️'
    },
    {
      id: 'platform-v2-release',
      title: 'Pasalku.ai V2.0: Fitur Sentiment Analysis dan Quick Legal Assessments',
      excerpt: 'Highlights fitur terbaru pada versi 2.0 yang memungkinkan analisis emosi dokumen dan assessmen cepat.',
      category: 'Update Platform',
      author: 'Product Team',
      date: 'February 1, 2024',
      readTime: '5 min read',
      image: '✨'
    }
  ]

  const filteredArticles = blogArticles.filter(article => {
    const matchesFilter = activeFilter === 'semua' || blogFilters.find(f => f.id === activeFilter)?.name.includes(article.category)
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const popularTopics = [
    { name: 'AI di Dunia Hukum', count: 12, color: 'from-blue-500 to-cyan-500' },
    { name: 'KUH Perdata', count: 8, color: 'from-purple-500 to-pink-500' },
    { name: 'Hukum Startup', count: 6, color: 'from-green-500 to-emerald-500' },
    { name: 'PDPA Compliance', count: 9, color: 'from-orange-500 to-red-500' },
    { name: 'Contract Management', count: 7, color: 'from-pink-500 to-rose-500' }
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
              Blog & Artikel Pasalku.ai
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Temukan insights terbaru tentang hukum Indonesia, inovasi teknologi AI,
              dan panduan praktis untuk mengatasi masalah hukum modern.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </motion.div>

          {/* Featured Article */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="overflow-hidden backdrop-blur-sm bg-white/90 border-0 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-12 flex items-center justify-center">
                  <div className="text-8xl">{featuredArticle.image}</div>
                </div>

                {/* Content Side */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      ⭐ Featured Article
                    </Badge>
                    <Badge variant="outline">{featuredArticle.category}</Badge>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredArticle.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>

                  <Link href={`/blog/${featuredArticle.id}`}>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Category Filters */}
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Kategori
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {blogFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ${
                        activeFilter === filter.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{filter.name}</span>
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Topics */}
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Topik Populer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {popularTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {topic.count}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Articles Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-all duration-300 hover:shadow-xl border-0 overflow-hidden group">
                      {/* Article Image */}
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <div className="text-4xl">{article.image}</div>
                      </div>

                      <CardContent className="p-6">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3">
                          {article.trending && (
                            <Badge className="bg-red-100 text-red-800">
                              🔥 Trending
                            </Badge>
                          )}
                          {article.popular && (
                            <Badge className="bg-green-100 text-green-800">
                              📈 Popular
                            </Badge>
                          )}
                          <Badge variant="outline">{article.category}</Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {article.date}
                            </span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>

                        {/* Read More */}
                        <Link href={`/blog/${article.id}`}>
                          <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                            Baca Artikel
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {filteredArticles.length > 0 && (
                <div className="text-center mt-12">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3">
                    Muat Artikel Lainnya
                  </Button>
                </div>
              )}
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
                Portal edukasi hukum dengan konten terbaru tentang AI dan perkembangan hukum Indonesia.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Artikel Terbaru</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Dual AI Revolution</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contract Intelligence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Adaptive Persona Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">PDPA Compliance</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Kategori</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">AI & Teknologi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Update Hukum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Studi Kasus</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tips & Trik</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Bergabung Menulis</h3>
              <div className="space-y-3 text-gray-300">
                <p>Adakah insight menarik tentang hukum atau AI yang ingin Anda bagi?</p>
                <Link href="/contact">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 w-full">
                    Ajukan Artikel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}