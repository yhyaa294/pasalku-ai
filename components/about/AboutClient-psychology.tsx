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
  ArrowRight,
  Mail,
  Linkedin,
  Twitter,
  CheckCircle
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
      title: 'Official Launch',
      description: 'Peluncuran resmi Pasalku.ai untuk publik dengan fitur lengkap.',
      icon: Trophy
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mb-6">
              <span>💡</span> Tentang Kami
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Demokratisasi <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Akses Hukum</span> di Indonesia
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kami percaya bahwa setiap orang berhak mendapat keadilan dan pemahaman hukum yang jelas, tanpa hambatan biaya atau kompleksitas bahasa.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER STORY SECTION - PSYCHOLOGY: Liking, Storytelling, Authority */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-bold mb-6">
              <span>👤</span> Dari Pendiri
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Cerita di Balik <span className="text-purple-600">Pasalku.ai</span>
            </h2>
          </div>

          {/* Founder Card - PROMINENT PLACEMENT */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 mb-12">
            <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
              {/* Founder Photo */}
              <div className="md:col-span-1">
                <div className="relative">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-8xl shadow-2xl">
                    👨‍💼
                  </div>
                  {/* Authority Badges */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg">
                      🎓 Tech Expert
                    </div>
                    <div className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-bold shadow-lg">
                      ⚖️ Legal Tech
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Info */}
              <div className="md:col-span-2">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Yahya</h3>
                <p className="text-lg text-purple-600 font-semibold mb-4">Founder & CEO, Pasalku.ai</p>
                
                {/* Credentials - AUTHORITY */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-900 font-medium">Background Teknologi</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-lg">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-900 font-medium">Legal Tech Innovator</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg">
                    <Trophy className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-900 font-medium">Award Winner</span>
                  </div>
                </div>

                {/* Direct Contact - ACCESSIBILITY */}
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:yahya@pasalku.ai" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Mail className="w-5 h-5" />
                    <span>yahya@pasalku.ai</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </div>

            {/* PERSONAL STORY - HERO'S JOURNEY */}
            <div className="space-y-6 text-gray-700 leading-relaxed">
              {/* Paragraph 1: The Problem I Faced */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <span>😰</span> Masalah yang Saya Alami
                </h4>
                <p className="text-gray-800">
                  "Saya pernah mengalami sendiri betapa sulitnya mendapat bantuan hukum yang terjangkau. Ketika menghadapi masalah kontrak bisnis, saya harus membayar jutaan rupiah hanya untuk konsultasi awal. Lebih parah lagi, penjelasan yang diberikan penuh dengan istilah hukum yang sulit dipahami. Saya merasa seperti orang awam yang tersesat di hutan belantara hukum."
                </p>
              </div>

              {/* Paragraph 2: The Moment of Realization */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                  <span>💡</span> Momen Pencerahan
                </h4>
                <p className="text-gray-800">
                  "Saat itulah saya menyadari: teknologi AI yang saya kuasai bisa menjadi solusi untuk masalah ini. Bayangkan jika setiap orang bisa mendapat penjelasan hukum yang jelas, dalam bahasa sederhana, kapan saja mereka butuh - tanpa harus mengeluarkan jutaan rupiah. Teknologi AI sudah cukup matang untuk membuat ini menjadi kenyataan."
                </p>
              </div>

              {/* Paragraph 3: The Mission */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span>🚀</span> Misi Kami
                </h4>
                <p className="text-gray-800">
                  "Pasalku.ai lahir dari keyakinan bahwa <strong>setiap orang berhak mendapat keadilan</strong>. Kami tidak hanya membangun platform teknologi - kami membangun jembatan antara masyarakat dan sistem hukum yang selama ini terasa jauh dan mahal. Setiap fitur yang kami kembangkan, setiap algoritma yang kami tulis, didorong oleh satu tujuan: <strong>membuat hukum dapat diakses oleh semua orang</strong>."
                </p>
              </div>

              {/* Personal Commitment */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span>🤝</span> Komitmen Personal
                </h4>
                <p className="text-gray-800">
                  "Saya secara personal terlibat dalam pengembangan setiap fitur. Feedback Anda penting bagi saya. Jika Anda memiliki pertanyaan, saran, atau bahkan kritik - saya ingin mendengarnya langsung. <strong>Email saya selalu terbuka: yahya@pasalku.ai</strong>. Mari kita bangun masa depan akses hukum yang lebih baik, bersama-sama."
                </p>
              </div>
            </div>

            {/* CTA - Direct Connection */}
            <div className="mt-8 text-center">
              <a 
                href="mailto:yahya@pasalku.ai"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Mail className="w-5 h-5" />
                Hubungi Saya Langsung
              </a>
              <p className="text-sm text-gray-500 mt-3">
                Saya membaca dan merespons setiap email secara personal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Misi Kami</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Memberikan akses hukum yang mudah, cepat, dan terjangkau untuk setiap orang di Indonesia melalui teknologi AI yang inovatif.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Demokratisasi akses informasi hukum</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Menyederhanakan bahasa hukum yang kompleks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Memberdayakan masyarakat dengan pengetahuan</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Visi Kami</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Menjadi platform legal tech terdepan di Indonesia yang mengubah cara masyarakat berinteraksi dengan sistem hukum.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Platform #1 untuk konsultasi hukum AI</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Melayani jutaan pengguna di seluruh Indonesia</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Standar baru dalam akses keadilan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tim <span className="text-blue-600">Kami</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kombinasi expertise teknologi, hukum, dan customer success untuk melayani Anda dengan sempurna
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-6xl mb-4 text-center">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{member.name}</h3>
                <p className="text-sm text-blue-600 font-semibold mb-3 text-center">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{member.description}</p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Perjalanan <span className="text-purple-600">Kami</span>
            </h2>
            <p className="text-xl text-gray-600">
              Dari ide hingga menjadi platform yang melayani ribuan pengguna
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 text-center">
                  <div className="text-sm font-bold text-blue-600">{milestone.month}</div>
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
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bergabunglah Dalam Revolusi Hukum Digital
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Kami percaya bahwa akses ke layanan hukum berkualitas adalah hak setiap individu.
              Bergabunglah dengan kami dalam misi demokratisasi pengetahuan hukum di Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-all">
                  Hubungi Kami
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold rounded-full">
                  Mulai Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <EnhancedFooter />
    </div>
  )
}

