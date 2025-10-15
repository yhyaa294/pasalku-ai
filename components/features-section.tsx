import { FC } from 'react'
import { 
  Brain, FileText, Shield, Globe, Users, Database, CheckCircle, MessageSquare, Award,
  Search, BookOpen, Bell, Lock, Zap, TrendingUp, Calendar, Video, Download,
  FileCheck, Calculator, PieChart, Settings, Share2, Archive, Edit, ClipboardCheck
} from 'lucide-react'

interface FeaturesSectionProps {
  className?: string
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ className = '' }) => {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Konsultasi',
      description: 'Chat interaktif dengan AI untuk konsultasi hukum secara real-time.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      description: 'Upload dan analisis dokumen hukum secara otomatis dengan AI.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Database,
      title: 'Legal Knowledge Base',
      description: 'Akses database lengkap peraturan perundang-undangan Indonesia.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FileCheck,
      title: 'Document Templates',
      description: 'Template dokumen hukum siap pakai untuk berbagai kebutuhan.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Calendar,
      title: 'Case Management',
      description: 'Kelola kasus hukum dengan timeline dan tracking yang jelas.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Search,
      title: 'Legal Research',
      description: 'Riset hukum mendalam dengan AI untuk temukan preseden relevan.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Terhubung dengan profesional hukum terverifikasi.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: PieChart,
      title: 'Analytics Dashboard',
      description: 'Dashboard analytics lengkap untuk track usage dan insights.',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: ClipboardCheck,
      title: 'Compliance Checker',
      description: 'Cek kepatuhan dokumen terhadap regulasi yang berlaku.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Notifikasi pintar untuk deadline, update kasus, dan reminder.',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Video,
      title: 'Video Consultation',
      description: 'Konsultasi video langsung dengan profesional hukum.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Lock,
      title: 'Secure Document Storage',
      description: 'Penyimpanan dokumen terenkripsi dengan keamanan tingkat tinggi.',
      color: 'from-gray-600 to-gray-800'
    },
    {
      icon: BookOpen,
      title: 'Legal Glossary',
      description: 'Kamus istilah hukum Indonesia yang lengkap dan mudah dipahami.',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      icon: TrendingUp,
      title: 'Legal Trend Analysis',
      description: 'Analisis tren hukum dan perubahan regulasi terbaru.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Download,
      title: 'Export & Reporting',
      description: 'Export hasil konsultasi dan riset dalam berbagai format.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Share2,
      title: 'Collaboration Tools',
      description: 'Kolaborasi dengan tim untuk mengelola kasus bersama.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Calculator,
      title: 'Legal Fee Calculator',
      description: 'Estimasi biaya hukum untuk berbagai jenis layanan legal.',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Archive,
      title: 'Case Archive',
      description: 'Arsip kasus dengan sistem pencarian dan filtering cepat.',
      color: 'from-slate-500 to-gray-600'
    },
    {
      icon: Edit,
      title: 'Document Editor',
      description: 'Editor dokumen online untuk draft dan revisi dokumen hukum.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Akses cepat ke fitur yang sering digunakan dengan shortcut.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Settings,
      title: 'Custom Workflows',
      description: 'Buat workflow custom sesuai kebutuhan praktik hukum Anda.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Keamanan data tingkat enterprise dengan enkripsi end-to-end.',
      color: 'from-red-500 to-rose-500'
    },
    {
      icon: Award,
      title: 'Professional Verification',
      description: 'Verifikasi profesional hukum dengan badge kredensial.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'Multi-Platform Access',
      description: 'Akses dari web, mobile app (iOS & Android), dan desktop.',
      color: 'from-teal-500 to-emerald-500'
    },
  ]

  return (
    <section id="features" className={`py-16 md:py-32 px-4 scroll-animate bg-gradient-to-b from-slate-50 via-white to-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 animate-text-shimmer">
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">24+ Fitur</span> Lengkap
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Semua yang Anda butuhkan untuk mengelola kebutuhan hukum dalam satu platform
          </p>
        </div>

        {/* Grid 4 kolom untuk desktop, 2 untuk tablet, 1 untuk mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 scroll-animate-scale"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
              
              <div className="relative">
                {/* Icon with gradient background */}
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-base font-bold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Dan masih banyak fitur lainnya yang terus kami kembangkan 🚀
          </p>
        </div>
      </div>
    </section>
  )
}
