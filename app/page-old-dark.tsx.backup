"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Zap, 
  Shield, 
  Star,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  Globe,
  Award,
  ChevronRight,
  Play,
  Sparkles,
  Brain,
  Target,
  BarChart3,
  Lock,
  Check,
  ChevronDown,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export default function NewLightLandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* TODO 1: HEADER/NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Pasalku.ai</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#beranda" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                Beranda
              </Link>
              <Link href="#fitur" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Fitur
              </Link>
              <Link href="#harga" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Harga
              </Link>
              <Link href="#tentang" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Tentang
              </Link>
              <Link href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                FAQ
              </Link>
              <Link href="#kontak" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Kontak
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Masuk
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30">
                Daftar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* TODO 2: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-violet-50/30 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-violet-200">
                <Sparkles className="mr-1 h-3 w-3" />
                Platform AI Hukum #1 di Indonesia
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Konsultasi Hukum Jadi
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                  Lebih Mudah
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Platform konsultasi hukum berbasis AI yang membantu Anda mendapatkan jawaban legal dalam hitungan detik. Akurat, cepat, dan terpercaya.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl shadow-violet-500/30 text-base">
                  <Zap className="mr-2 h-5 w-5" />
                  Mulai Gratis Sekarang
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-violet-200 text-violet-700 hover:bg-violet-50">
                  <Play className="mr-2 h-5 w-5" />
                  Lihat Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Gratis untuk memulai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Respons {'<'}30 detik</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-500" />
                  <span className="text-sm text-gray-600">Data terenkripsi</span>
                </div>
              </div>
            </div>

            {/* Right: Floating Cards (Glassmorphism) */}
            <div className="relative h-[500px] hidden lg:block">
              {/* Card 1: AI Legal Assistant */}
              <Card className="absolute top-0 right-0 w-80 p-6 bg-white/80 backdrop-blur-lg border border-violet-100 shadow-2xl shadow-violet-500/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">AI Legal Assistant</h3>
                    <p className="text-xs text-gray-500">Powered by GPT-4</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-violet-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-violet-600">24/7</div>
                    <div className="text-xs text-gray-600">Aktif</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{'<'}30s</div>
                    <div className="text-xs text-gray-600">Respons</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-xs text-gray-600">Akurasi</div>
                  </div>
                </div>
              </Card>

              {/* Card 2: Auto Citations */}
              <Card className="absolute bottom-20 left-0 w-64 p-5 bg-white/80 backdrop-blur-lg border border-orange-100 shadow-xl shadow-orange-500/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <h4 className="font-semibold text-gray-900">Auto Citations</h4>
                </div>
                <p className="text-sm text-gray-600">Referensi pasal otomatis dari 1000+ UU Indonesia</p>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </Card>

              {/* Card 3: Predictions */}
              <Card className="absolute bottom-0 right-20 w-72 p-5 bg-white/80 backdrop-blur-lg border border-pink-100 shadow-xl shadow-pink-500/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-pink-500" />
                  <h4 className="font-semibold text-gray-900">Case Predictions</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Win Rate</span>
                    <span className="font-bold text-pink-600">87%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* TODO 3: PROBLEM SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Mengapa Kami Ada
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Masalah Akses Hukum di Indonesia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Data menunjukkan kesenjangan besar dalam akses dan pemahaman hukum di masyarakat Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem Card 1 */}
            <Card className="p-8 bg-white border-none shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
              <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">#96/142</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Akses Terbatas</h3>
              <p className="text-gray-600 mb-4">
                Indonesia peringkat 96 dari 142 negara dalam Rule of Law Index. Akses ke layanan hukum masih sangat terbatas.
              </p>
              <p className="text-xs text-gray-500">
                Sumber: World Justice Project 2023
              </p>
            </Card>

            {/* Problem Card 2 */}
            <Card className="p-8 bg-white border-none shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
              <div className="h-16 w-16 rounded-2xl bg-yellow-100 flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">56.82</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pemahaman Rendah</h3>
              <p className="text-gray-600 mb-4">
                Indeks literasi hukum Indonesia hanya 56.82 dari 100. Mayoritas masyarakat tidak memahami hak hukum mereka.
              </p>
              <p className="text-xs text-gray-500">
                Sumber: BPS & Kemenkumham 2022
              </p>
            </Card>

            {/* Problem Card 3 */}
            <Card className="p-8 bg-white border-none shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
              <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">73%</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Biaya Mahal</h3>
              <p className="text-gray-600 mb-4">
                73% responden menganggap biaya sebagai penghalang utama mengakses layanan hukum profesional.
              </p>
              <p className="text-xs text-gray-500">
                Sumber: Survey Nasional Akses Hukum 2023
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* TODO 4: FEATURES SECTION */}
      <section id="fitur" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              50+ Fitur AI Powerful
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fitur Lengkap untuk Semua Kebutuhan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform all-in-one dengan teknologi AI terdepan untuk menyelesaikan semua masalah hukum Anda
            </p>
          </div>

          {/* Main Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* AI Chat Card */}
            <Card className="p-8 bg-gradient-to-br from-violet-600 to-purple-600 border-none shadow-2xl shadow-violet-500/30 rounded-3xl text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="relative z-10">
                <MessageSquare className="h-12 w-12 mb-6" />
                <h3 className="text-3xl font-bold mb-4">AI Chat Konsultasi</h3>
                <p className="text-violet-100 mb-6 text-lg">
                  Konsultasi hukum interaktif dengan AI yang memahami konteks dan memberikan solusi yang tepat
                </p>
                <div className="flex gap-3">
                  <Badge className="bg-white/20 text-white border-white/30">24/7 Available</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">Real-time</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">Smart</Badge>
                </div>
              </div>
            </Card>

            {/* Document Analysis Card */}
            <Card className="p-8 bg-gradient-to-br from-pink-500 to-purple-600 border-none shadow-2xl shadow-pink-500/30 rounded-3xl text-white overflow-hidden relative">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32" />
              <div className="relative z-10">
                <FileText className="h-12 w-12 mb-6" />
                <h3 className="text-3xl font-bold mb-4">Document Analysis</h3>
                <p className="text-pink-100 mb-6 text-lg">
                  Analisis dokumen legal otomatis dengan AI untuk review kontrak, surat, dan dokumen hukum lainnya
                </p>
                <div className="flex gap-3">
                  <Badge className="bg-white/20 text-white border-white/30">Auto Detection</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">Fast</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">Secure</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'Legal Knowledge Base', desc: '1000+ UU Indonesia' },
              { icon: FileText, title: 'Document Templates', desc: 'Template siap pakai' },
              { icon: TrendingUp, title: 'Case Prediction', desc: 'Prediksi outcome' },
              { icon: Shield, title: 'Data Encryption', desc: 'Keamanan tingkat enterprise' },
              { icon: Users, title: 'Multi-User', desc: 'Kolaborasi tim' },
              { icon: Award, title: 'Legal Citation', desc: 'Referensi pasal otomatis' },
              { icon: Zap, title: 'Instant Answer', desc: 'Respons {'<'}30 detik' },
              { icon: Lock, title: 'PDPA Compliant', desc: 'Sesuai regulasi' }
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all rounded-2xl group">
                <feature.icon className="h-10 w-10 text-violet-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TODO 5: HOW IT WORKS */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja Pasalku.ai
            </h2>
            <p className="text-xl text-gray-600">
              4 langkah sederhana untuk mendapatkan solusi hukum Anda
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 via-pink-500 to-green-500" style={{ top: '80px' }} />

            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto relative z-10">
                  01
                </div>
                <div className="flex justify-center mb-4">
                  <MessageSquare className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Tanyakan Pertanyaan Anda
                </h3>
                <p className="text-gray-600 text-center">
                  Jelaskan masalah hukum Anda dengan bahasa sehari-hari
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border-2 border-violet-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto relative z-10">
                  02
                </div>
                <div className="flex justify-center mb-4">
                  <Brain className="h-12 w-12 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  AI Memproses & Menganalisis
                </h3>
                <p className="text-gray-600 text-center">
                  AI kami menganalisis dengan 1000+ referensi hukum
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto relative z-10">
                  03
                </div>
                <div className="flex justify-center mb-4">
                  <FileText className="h-12 w-12 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Dapatkan Jawaban Lengkap
                </h3>
                <p className="text-gray-600 text-center">
                  Jawaban detail dengan referensi pasal dan solusi konkret
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto relative z-10">
                  04
                </div>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Lanjutkan atau Simpan
                </h3>
                <p className="text-gray-600 text-center">
                  Tindak lanjut dengan pertanyaan lebih lanjut atau simpan hasilnya
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TODO 6: PRICING SECTION */}
      <section id="harga" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Harga Transparan
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pilih Paket Anda
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mulai gratis, upgrade kapan saja sesuai kebutuhan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-2 border-gray-200 rounded-3xl hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratis</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">Rp 0</span>
                <span className="text-gray-600">/bulan</span>
              </div>
              <Button className="w-full mb-8" variant="outline">
                Mulai Sekarang
              </Button>
              <ul className="space-y-4">
                {[
                  '10 pertanyaan per bulan',
                  'Akses knowledge base dasar',
                  'Respons dalam 24 jam',
                  'Community support'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Premium Plan - HIGHLIGHTED */}
            <Card className="p-8 border-4 border-violet-500 rounded-3xl relative shadow-2xl shadow-violet-500/20 transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-1">
                  <Star className="mr-1 h-3 w-3 fill-white" />
                  Paling Populer
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Rp 97K
                </span>
                <span className="text-gray-600">/bulan</span>
              </div>
              <Button className="w-full mb-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                Pilih Premium
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <ul className="space-y-4">
                {[
                  'Unlimited pertanyaan',
                  'Akses full knowledge base',
                  'Respons instant ({'<'}30s)',
                  'Document analysis (10/bulan)',
                  'Priority support',
                  'Export PDF hasil konsultasi'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Professional Plan */}
            <Card className="p-8 border-2 border-gray-200 rounded-3xl hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">Rp 397K</span>
                <span className="text-gray-600">/bulan</span>
              </div>
              <Button className="w-full mb-8" variant="outline">
                Hubungi Sales
              </Button>
              <ul className="space-y-4">
                {[
                  'Semua fitur Premium',
                  'Unlimited document analysis',
                  'API access',
                  'Multi-user (5 seats)',
                  'Dedicated account manager',
                  'Custom integrations',
                  'SLA 99.9% uptime'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* TODO 7: FAQ SECTION */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-gray-600">
              Temukan jawaban untuk pertanyaan umum tentang Pasalku.ai
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Apa itu Pasalku.ai?',
                a: 'Pasalku.ai adalah platform konsultasi hukum berbasis AI yang membantu Anda mendapatkan jawaban legal yang akurat dalam hitungan detik. Kami menggunakan teknologi AI terdepan yang dilatih dengan 1000+ peraturan perundang-undangan Indonesia.'
              },
              {
                q: 'Apakah jawaban dari AI dapat dipercaya?',
                a: 'Ya! AI kami memiliki tingkat akurasi 94% dan selalu memberikan referensi pasal hukum yang relevan. Namun, untuk kasus yang sangat kompleks atau kritis, kami tetap menyarankan konsultasi dengan pengacara profesional.'
              },
              {
                q: 'Berapa biaya menggunakan Pasalku.ai?',
                a: 'Kami menawarkan paket Gratis untuk memulai (10 pertanyaan/bulan), Premium Rp 97.000/bulan (unlimited), dan Professional Rp 397.000/bulan untuk tim dan bisnis. Anda bisa upgrade atau downgrade kapan saja.'
              },
              {
                q: 'Apakah data saya aman?',
                a: 'Sangat aman! Kami menggunakan enkripsi tingkat enterprise (AES-256) dan compliant dengan PDPA (Personal Data Protection Act). Data Anda tidak akan pernah dibagikan ke pihak ketiga tanpa izin Anda.'
              },
              {
                q: 'Apakah Pasalku.ai bisa menggantikan pengacara?',
                a: 'Tidak sepenuhnya. Pasalku.ai sangat bagus untuk konsultasi awal, pemahaman hukum dasar, dan kasus-kasus sederhana. Untuk kasus kompleks yang memerlukan representasi di pengadilan, Anda tetap memerlukan pengacara profesional.'
              },
              {
                q: 'Bagaimana cara memulai?',
                a: 'Sangat mudah! Cukup klik tombol "Daftar Gratis", buat akun dengan email Anda, dan langsung tanyakan pertanyaan hukum Anda. Tidak perlu kartu kredit untuk paket Gratis.'
              }
            ].map((faq, idx) => (
              <Card 
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.q}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TODO 8: FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-5xl font-bold mb-6">
              Mulai Konsultasi Hukum Anda Sekarang
            </h2>
            <p className="text-2xl text-violet-100 mb-12">
              Bergabung dengan 50.000+ pengguna yang sudah merasakan kemudahan konsultasi hukum dengan AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 shadow-2xl text-lg px-8 py-6">
                <Zap className="mr-2 h-6 w-6" />
                Mulai Gratis Sekarang
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                <Play className="mr-2 h-6 w-6" />
                Lihat Demo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-violet-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg">Gratis untuk memulai</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                <span className="text-lg">Respons {'<'}30 detik</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <span className="text-lg">Tanpa komitmen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TODO 9: FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Column 1: Branding & Social */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="text-2xl font-bold text-white">Pasalku.ai</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Platform konsultasi hukum berbasis AI yang membuat akses hukum lebih mudah, cepat, dan terjangkau untuk semua orang di Indonesia.
              </p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-lg bg-gray-800 hover:bg-violet-600 flex items-center justify-center transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-lg bg-gray-800 hover:bg-violet-600 flex items-center justify-center transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-lg bg-gray-800 hover:bg-violet-600 flex items-center justify-center transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-lg bg-gray-800 hover:bg-violet-600 flex items-center justify-center transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Navigasi</h4>
              <ul className="space-y-3">
                {['Beranda', 'Fitur', 'Harga', 'Tentang Kami', 'Blog', 'FAQ', 'Kontak', 'Kebijakan Privasi', 'Syarat & Ketentuan'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Hubungi Kami</h4>
              <ul className="space-y-4">
                <li>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-violet-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-medium mb-1">Email Sales</div>
                      <a href="mailto:sales@pasalku.ai" className="text-gray-400 hover:text-violet-400">
                        sales@pasalku.ai
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-violet-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-medium mb-1">Email Support</div>
                      <a href="mailto:support@pasalku.ai" className="text-gray-400 hover:text-violet-400">
                        support@pasalku.ai
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-violet-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-medium mb-1">WhatsApp</div>
                      <a href="tel:+6281234567890" className="text-gray-400 hover:text-violet-400">
                        +62 812-3456-7890
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-violet-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-medium mb-1">Alamat</div>
                      <p className="text-gray-400">
                        Jl. Sudirman No. 123<br />
                        Jakarta Pusat 10220<br />
                        Indonesia
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2025 Pasalku.ai. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm">
                Made with ❤️ in Indonesia
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
