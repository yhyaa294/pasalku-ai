import { FC } from 'react'
import { 
  Brain, FileText, Shield, Globe, Users, Database, CheckCircle, MessageSquare, Award,
  Search, BookOpen, Bell, Lock, Zap, TrendingUp, Calendar, Video, Download,
  FileCheck, Calculator, PieChart, Settings, Share2, Archive, Edit, ClipboardCheck, ArrowRight
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
    <section id="features" className={`py-20 md:py-32 px-4 bg-gradient-to-b from-white via-blue-50/20 to-white relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mb-6">
            <span>✨</span> 50+ Fitur AI Powerful
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Fitur Lengkap</span> untuk Semua Kebutuhan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Platform all-in-one dengan teknologi AI terdepan untuk solusi hukum Anda
          </p>
        </div>

        {/* Bento Grid Layout - Modern & Interactive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Featured Large Cards */}
          <div className="md:col-span-2 lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 group">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Chat Konsultasi</h3>
                <p className="text-gray-600">Chat interaktif dengan AI untuk konsultasi hukum secara real-time dengan akurasi tinggi</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-blue-600">24/7</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-purple-600">Real-time</div>
                <div className="text-xs text-gray-600">Response</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-green-600">Smart</div>
                <div className="text-xs text-gray-600">AI Powered</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 group">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Document Analysis</h3>
                <p className="text-gray-600">Upload dan analisis dokumen hukum secara otomatis dengan AI canggih</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-purple-600">Auto</div>
                <div className="text-xs text-gray-600">Detection</div>
              </div>
              <div className="bg-pink-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-pink-600">Fast</div>
                <div className="text-xs text-gray-600">Processing</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-purple-600">Secure</div>
                <div className="text-xs text-gray-600">Encrypted</div>
              </div>
            </div>
          </div>

          {/* Medium Cards */}
          {features.slice(2, 8).map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

          {/* Small Cards - Compact */}
          {features.slice(8).map((feature, index) => (
            <div
              key={index}
              className="group bg-white/60 backdrop-blur-lg rounded-xl p-5 border border-gray-200/50 hover:bg-white/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold mb-1 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Modern */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
            <span>Lihat Semua Fitur</span>
            <ArrowRight className="w-5 h-5" />
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Dan masih banyak fitur lainnya yang terus kami kembangkan 🚀
          </p>
        </div>
      </div>
    </section>
  )
}
