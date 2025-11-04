'use client'

import { FC } from 'react'
import { 
  Brain, 
  Shield, 
  Zap, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  MessageSquare,
  Lock,
  Globe,
  Award
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FeaturesSectionProps {
  className?: string
}

export const ModernFeaturesSection: FC<FeaturesSectionProps> = ({ className }) => {
  const features = [
    {
      icon: Brain,
      title: "AI Cerdas 94.1%",
      description: "Kecerdasan buatan tingkat lanjut dengan akurasi 94.1% dalam menganalisis kasus hukum Indonesia",
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      badge: "Terdepan"
    },
    {
      icon: Shield,
      title: "PDPA Compliant",
      description: "Keamanan data terjamin dengan standar PDPA Indonesia dan enkripsi end-to-end",
      color: "text-success-600", 
      bgColor: "bg-success-50",
      badge: "Aman"
    },
    {
      icon: Zap,
      title: "Response 0.3 Detik",
      description: "Jawaban instan dengan teknologi AI yang dioptimasi untuk kecepatan maksimal",
      color: "text-accent-600",
      bgColor: "bg-accent-50", 
      badge: "Cepat"
    },
    {
      icon: FileText,
      title: "Analisis Dokumen",
      description: "Analisis otomatis kontrak, perjanjian, dan dokumen hukum dengan presisi tinggi",
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      badge: "Komprehensif"
    },
    {
      icon: Users,
      title: "50,000+ Pengguna",
      description: "Dipercaya oleh puluhan ribu pengguna aktif dari berbagai kalangan profesional",
      color: "text-secondary-600",
      bgColor: "bg-secondary-50",
      badge: "Terpercaya"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Konsultasi kapan saja, di mana saja tanpa batas waktu dan biaya tersembunyi",
      color: "text-warning-600",
      bgColor: "bg-warning-50",
      badge: "Selalu Ada"
    }
  ]

  const stats = [
    { number: "94.1%", label: "Akurasi AI", icon: TrendingUp },
    { number: "50K+", label: "Pengguna Aktif", icon: Users },
    { number: "0.3s", label: "Response Time", icon: Zap },
    { number: "24/7", label: "Tersedia", icon: Clock }
  ]

  return (
    <section className={`py-20 bg-gradient-to-b from-white to-secondary-50 ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary-100 text-primary-800 hover:bg-primary-200 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            Fitur Unggulan
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 font-display">
            Teknologi AI Hukum
            <span className="block text-primary-600">Terdepan di Indonesia</span>
          </h2>
          
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Platform kami menggabungkan kecerdasan buatan tingkat lanjut dengan 
            pengetahuan hukum Indonesia yang komprehensif untuk memberikan solusi 
            hukum yang akurat dan terjangkau.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="card-modern group cursor-pointer border-0 shadow-lg hover:shadow-2xl bg-white rounded-2xl overflow-hidden"
            >
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <Badge variant="secondary" className="bg-secondary-100 text-secondary-700 text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-secondary-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                  <span>Coba sekarang</span>
                  <Zap className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Dipercaya oleh Profesional di Seluruh Indonesia
            </h3>
            <p className="text-primary-100 text-lg">
              Bergabunglah dengan puluhan ribu pengguna yang telah merasakan kemudahan konsultasi hukum modern
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-1">
                  {stat.number}
                </div>
                <div className="text-primary-100 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 text-secondary-600">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-success-600" />
              <span>Enkripsi Bank-Level</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-primary-600" />
              <span>Cakupan Seluruh Indonesia</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-accent-600" />
              <span>Berlisensi & Tersertifikasi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
