'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EnhancedFooter } from '@/components/enhanced-footer'
import {
  Target,
  Users,
  Trophy,
  Heart,
  Brain,
  Zap,
  Globe,
  Award,
  TrendingUp,
  Shield,
  Rocket,
  Building2,
  ArrowRight
} from 'lucide-react'

export default function AboutPage() {

  const stats = [
    { label: 'Fitur AI', value: '50+', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { label: 'Waktu Respons', value: '<30 detik', icon: Zap, color: 'from-orange-500 to-red-500' },
    { label: 'Pengguna Terlayani', value: '1000+', icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Database Hukum', value: 'Lengkap', icon: Target, color: 'from-blue-500 to-cyan-500' }
  ]

  const teamMembers = [
    {
      name: 'Tim Developer',
      role: 'Development Team',
      description: 'Tim pengembang yang berdedikasi membangun platform AI untuk akses hukum yang lebih baik.',
      image: '👥',
      expertise: 'Full-Stack Development & AI'
    },
    {
      name: 'Tim Legal',
      role: 'Legal Advisory',
      description: 'Ahli hukum yang memastikan akurasi informasi dan kepatuhan regulasi.',
      image: '⚖️',
      expertise: 'Legal Compliance & Research'
    },
    {
      name: 'Tim AI',
      role: 'AI Engineering',
      description: 'Spesialis AI dan machine learning yang mengoptimalkan sistem.',
      image: '🤖',
      expertise: 'AI/ML Engineering'
    },
    {
      name: 'Tim Support',
      role: 'Customer Success',
      description: 'Tim dukungan yang siap membantu pengguna 24/7.',
      image: '💬',
      expertise: 'User Support & Success'
    }
  ]

  const milestones = [
    {
      year: '2024',
      month: 'Q1',
      title: 'Inisiasi Proyek',
      description: 'Memulai pengembangan platform konsultasi hukum berbasis AI untuk Indonesia.',
      icon: Rocket
    },
    {
      year: '2024',
      month: 'Q2',
      title: 'Pengembangan Core System',
      description: 'Membangun sistem AI dan database hukum Indonesia yang komprehensif.',
      icon: Brain
    },
    {
      year: '2024',
      month: 'Q3',
      title: 'Beta Testing',
      description: 'Peluncuran versi beta untuk testing dan mendapatkan feedback pengguna.',
      icon: Users
    },
    {
      year: '2024',
      month: 'Q4',
      title: 'Platform Launch',
      description: 'Peluncuran platform lengkap dengan fitur-fitur AI untuk akses hukum masyarakat.',
      icon: Globe
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Keamanan & Privasi',
      description: 'Kami menjaga data pengguna dengan sistem keamanan yang handal dan enkripsi yang kuat.'
    },
    {
      icon: Heart,
      title: 'Akses untuk Semua',
      description: 'Memberikan akses informasi hukum yang mudah dipahami untuk seluruh masyarakat Indonesia.'
    },
    {
      icon: Brain,
      title: 'Teknologi Terdepan',
      description: 'Menggunakan teknologi AI terkini untuk memberikan jawaban yang cepat dan akurat.'
    },
    {
      icon: Award,
      title: 'Kualitas Terpercaya',
      description: 'Berkomitmen memberikan informasi hukum yang akurat dengan referensi yang jelas.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">Pasalku.ai</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/features">
                <Button variant="ghost">Fitur</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost">FAQ</Button>
              </Link>
              <Link href="/chat">
                <Button>Mulai Konsultasi</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

  <div className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Tentang Pasalku.ai
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Kami membawa revolusi dalam dunia hukum Indonesia melalui kekuatan kecerdasan buatan.
              Misi kami adalah membuat layanan hukum dapat diakses oleh semua orang dengan murah, cepat, dan akurat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-medium">
                  Mulai Konsultasi
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-medium">
                  Lihat Fitur Lengkap
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl text-center p-6 border-0">
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission & Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            {/* Mission */}
            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Misi Kami</h3>
                    <p className="text-blue-100">Mission Statement</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  "Mengedepankan transformasi digital dalam dunia hukum Indonesia melalui platform AI yang menggabungkan kecerdasan buatan terdepan dunia dengan pengetahuan hukum lokal yang mendalam."
                </p>
                <p className="text-gray-600">
                  Kami berkomitmen untuk memberikan akses ke layanan hukum berkualitas tinggi bagi semua kalangan sosial di Indonesia, memastikan bahwa setiap orang dapat memahami dan mendapatkan bantuan hukum yang mereka butuhkan dengan cepat dan akurat.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Visi Kami</h3>
                    <p className="text-purple-100">Vision Statement</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  "Menjadi pelopor revolusi digital dalam sistem hukum Indonesia yang membuat layanan hukum dapat diakses, terjangkau, dan dapat dipahami oleh seluruh masyarakat."
                </p>
                <p className="text-gray-600">
                  Dalam visi ini, kami melihat masa depan dimana teknologi AI menjadi bagian integral dalam praktek hukum, memungkinkan semua lapisan masyarakat untuk mendapatkan konsultasi hukum berkualitas tinggi tanpa hambatan ekonomi atau geografis.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Nilai-Nilai Kami
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Kami dibangun di atas fondasi nilai-nilai yang kuat yang memandu setiap keputusan dan inovasi kami.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="h-full backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl border-0">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${index % 2 === 0 ? 'from-blue-500 to-purple-500' : 'from-green-500 to-teal-500'} flex-shrink-0`}>
                          <value.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Tim Kami
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Dibangun oleh tim multidisipliner yang menggabungkan keahlian hukum, teknologi AI, dan pengalaman bisnis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card className="text-center backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl border-0 group">
                    <CardContent className="p-8">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {member.image}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{member.description}</p>
                      <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {member.expertise}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                Perjalanan Perkembangan
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Dari ide sederhana yang lahir dari Gap Analysis sistem hukum Indonesia, menjadi platform AI hukum paling komprehensif di dunia.
              </p>
            </div>

            <div className="relative">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={`${milestone.year}-${milestone.month}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex items-center gap-8 mb-12"
                >
                  <div className="w-20 flex-shrink-0 text-right">
                    <div className="text-lg font-bold text-blue-600">{milestone.month}</div>
                    <div className="text-2xl font-black text-gray-900">{milestone.year}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <milestone.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-0.5 h-16 bg-gradient-to-b from-blue-500 to-purple-500 mx-auto mt-4"></div>
                  </div>
                  <div className="flex-1">
                    <Card className="backdrop-blur-sm bg-white/90 hover:bg-white/95 transition-all duration-300 hover:shadow-lg border-0">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Bergabunglah Dalam Revolusi Hukum Digital
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Kami percaya bahwa akses ke layanan hukum berkualitas adalah hak setiap individu.
              Bergabunglah dengan kami dalam misi demokratisasi pengetahuan hukum di Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium">
                  Hubungi Kami
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-medium">
                  Mulai Sekarang
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <EnhancedFooter />
    </div>
  )
}

// Import statement for useState (missing in the code)
import { useState } from 'react'