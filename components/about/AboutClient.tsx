'use client'

import React from 'react'
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

export default function AboutClient() {

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
          <div className="text-center mb-16">
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
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={stat.label}>
                <Card className="backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-xl text-center p-6 border-0">
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
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
                  "Mengedepankan transformasi digital dalam dunia hukum Indonesia melalui platform AI yang menggabungkan kecerdasan buatan terdepan dunia dengan pemahaman lokal yang mendalam."
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
          </div>

          {/* Values */}
          <div className="mb-16">
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
                <div key={value.title}>
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
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
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
                <div key={member.name}>
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
                </div>
              ))}
            </div>
          </div>

          {/* Founder / Leadership */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Pendiri & Kepemimpinan
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Cerita di balik Pasalku.ai — siapa yang memulai, mengapa, dan nilai-nilai pribadi yang menginspirasi perjalanan kami.
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-5xl text-white shadow-lg">
                  {/* Placeholder for founder photo or initials */}
                  Y
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">Yahya (Pendiri)</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>

              <div className="md:col-span-2">
                <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      Saya, Yahya, mendirikan Pasalku.ai dengan keyakinan bahwa pengetahuan hukum harus dapat diakses oleh semua orang — bukan hanya para profesional atau mereka yang mampu membayar tarif tinggi.
                      Latar belakang saya di bidang teknologi dan empati terhadap masalah akses keadilan di Indonesia mendorong saya membangun solusi yang menggabungkan AI mutakhir dengan pemahaman lokal.
                    </p>

                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-800 text-lg mb-4">
                      "Kami membangun Pasalku.ai supaya setiap warga negara bisa mendapatkan jawaban hukum yang cepat, akurat, dan mudah dipahami — kapan pun dan di mana pun."
                    </blockquote>

                    <p className="text-gray-600 mb-2">
                      Jika Anda ingin berbicara langsung, hubungi: <a className="text-blue-600 font-medium" href="mailto:founder@pasalku.ai">founder@pasalku.ai</a>
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link href="/contact">
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Hubungi Tim</Button>
                      </Link>
                      <Link href="/press">
                        <Button variant="outline">Permintaan Media & Press</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
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
                <div key={`${milestone.year}-${milestone.month}`} className="flex items-center gap-8 mb-12">
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
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-12 text-white">
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <EnhancedFooter />
    </div>
  )
}