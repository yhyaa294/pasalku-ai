'use client'

import Link from 'next/link'
import { 
  MessageSquare, FileText, Database, FileCheck, Calendar, Search, Users, PieChart, 
  ClipboardCheck, Bell, Video, Lock, BookOpen, TrendingUp, Download, Share2, 
  Calculator, Archive, Edit, Zap, Settings, Shield, Award, Globe, ArrowRight
} from 'lucide-react'
import { EnhancedFooter } from '@/components/enhanced-footer'

export default function FeaturesPage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Konsultasi',
      description: 'Chat interaktif dengan AI untuk konsultasi hukum secara real-time.',
      detailDescription: 'Ajukan pertanyaan hukum Anda dalam bahasa Indonesia yang natural. AI kami menggunakan teknologi NLP (Natural Language Processing) untuk memahami konteks dan memberikan jawaban yang akurat dengan referensi pasal dan undang-undang yang relevan.',
      features: [
        'Multi-turn conversation - Tanya jawab berkelanjutan',
        'Context awareness - AI memahami konteks percakapan',
        'Bahasa natural Indonesia - Tidak perlu istilah legal',
        'Citation ke pasal/UU - Referensi hukum yang jelas'
      ],
      useCases: ['Konsultasi hukum umum', 'Penjelasan pasal', 'Interpretasi UU'],
      color: 'from-blue-500 to-cyan-500',
      availability: 'Semua paket'
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      description: 'Upload dan analisis dokumen hukum secara otomatis dengan AI.',
      detailDescription: 'Upload dokumen dalam format PDF, DOCX, atau gambar. AI kami akan menganalisis struktur dokumen, mengekstrak informasi penting, mengidentifikasi risiko, dan memberikan rekomendasi.',
      features: [
        'Support PDF/DOCX/Image - Multiple format dokumen',
        'OCR untuk gambar - Scan dokumen fisik',
        'Named Entity Recognition - Identifikasi nama, tanggal, lokasi',
        'Risk assessment - Deteksi potensi masalah hukum'
      ],
      useCases: ['Analisis kontrak', 'Review surat perjanjian', 'Scan dokumen lama'],
      color: 'from-purple-500 to-pink-500',
      availability: 'Premium & Professional'
    },
    {
      icon: Database,
      title: 'Legal Knowledge Base',
      description: 'Akses database lengkap peraturan perundang-undangan Indonesia.',
      detailDescription: 'Database hukum Indonesia yang terupdate meliputi KUHP, KUHPerdata, UU Ketenagakerjaan, dan peraturan lainnya. Dilengkapi dengan search engine yang powerful dan sistem bookmark.',
      features: [
        'Peraturan terupdate - Database selalu up-to-date',
        'Search & filter cepat - Temukan pasal dengan mudah',
        'Bookmark & notes - Simpan pasal favorit',
        'Glossary hukum - Kamus istilah hukum Indonesia'
      ],
      useCases: ['Riset hukum', 'Cari pasal spesifik', 'Belajar hukum'],
      color: 'from-green-500 to-emerald-500',
      availability: 'Semua paket'
    },
    {
      icon: FileCheck,
      title: 'Document Templates',
      description: 'Template dokumen hukum siap pakai untuk berbagai kebutuhan.',
      detailDescription: '30+ template dokumen hukum profesional yang bisa di-customize sesuai kebutuhan Anda. Termasuk kontrak, surat kuasa, perjanjian, dan dokumen legal lainnya.',
      features: [
        '30+ template dokumen - Lengkap untuk berbagai keperluan',
        'Customizable fields - Sesuaikan dengan kebutuhan',
        'Download PDF/DOCX - Export dalam format pilihan',
        'Legal compliance - Sesuai dengan hukum Indonesia'
      ],
      useCases: ['Buat kontrak kerja', 'Surat kuasa', 'Perjanjian bisnis'],
      color: 'from-orange-500 to-red-500',
      availability: 'Premium & Professional'
    },
    {
      icon: Calendar,
      title: 'Case Management',
      description: 'Kelola kasus hukum dengan timeline dan tracking yang jelas.',
      detailDescription: 'Dashboard case management untuk melacak progress kasus, deadline, dokumen terkait, dan komunikasi. Visualisasi timeline memudahkan Anda melihat status kasus.',
      features: [
        'Timeline visualization - Lihat progress dengan jelas',
        'Document storage - Simpan semua dokumen kasus',
        'Reminder & alerts - Notifikasi deadline penting',
        'Collaboration tools - Kerja sama dengan tim'
      ],
      useCases: ['Kelola multiple kasus', 'Track deadline', 'Organisasi dokumen'],
      color: 'from-indigo-500 to-blue-500',
      availability: 'Professional'
    },
    {
      icon: Search,
      title: 'Legal Research',
      description: 'Riset hukum mendalam dengan AI untuk temukan preseden relevan.',
      detailDescription: 'Tools riset hukum yang powerful dengan AI-powered search. Temukan yurisprudensi, analisis kasus serupa, dan insights hukum yang relevan dengan kasus Anda.',
      features: [
        'Case law search - Cari putusan pengadilan',
        'Jurisprudence analysis - Analisis preseden',
        'Legal trends - Tren peraturan terbaru',
        'Export research - Simpan hasil riset'
      ],
      useCases: ['Cari preseden', 'Riset mendalam', 'Analisis kasus'],
      color: 'from-yellow-500 to-orange-500',
      availability: 'Professional'
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Terhubung dengan profesional hukum terverifikasi.',
      detailDescription: 'Platform untuk terhubung dengan lawyer dan profesional hukum yang terverifikasi. Konsultasi langsung, video call, dan sistem rating untuk transparansi.',
      features: [
        'Verified lawyers - Profesional terverifikasi',
        'Direct messaging - Chat langsung',
        'Video consultation - Konsultasi video',
        'Rating & reviews - Sistem feedback transparan'
      ],
      useCases: ['Cari lawyer', 'Konsultasi profesional', 'Second opinion'],
      color: 'from-pink-500 to-rose-500',
      availability: 'Premium & Professional'
    },
    {
      icon: PieChart,
      title: 'Analytics Dashboard',
      description: 'Dashboard analytics lengkap untuk track usage dan insights.',
      detailDescription: 'Dashboard comprehensive dengan visualisasi data usage, spending analysis, dan AI-powered insights untuk optimasi penggunaan platform.',
      features: [
        'Usage statistics - Track aktivitas Anda',
        'AI insights - Rekomendasi berbasis data',
        'Cost analysis - Monitor pengeluaran',
        'Export reports - Download laporan lengkap'
      ],
      useCases: ['Monitor usage', 'Budget tracking', 'Performance analysis'],
      color: 'from-teal-500 to-cyan-500',
      availability: 'Professional'
    },
    {
      icon: ClipboardCheck,
      title: 'Compliance Checker',
      description: 'Cek kepatuhan dokumen terhadap regulasi yang berlaku.',
      detailDescription: 'Automated compliance checking untuk memastikan dokumen dan kontrak Anda sesuai dengan peraturan perundang-undangan Indonesia yang berlaku.',
      features: [
        'Auto compliance scan - Scan otomatis',
        'Regulation mapping - Pemetaan regulasi',
        'Risk scoring - Skor risiko compliance',
        'Recommendations - Saran perbaikan'
      ],
      useCases: ['Audit kontrak', 'Check compliance', 'Risk mitigation'],
      color: 'from-red-500 to-orange-500',
      availability: 'Professional'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Notifikasi pintar untuk deadline, update kasus, dan reminder.',
      detailDescription: 'Sistem notifikasi cerdas yang mengingatkan Anda tentang deadline penting, update kasus, perubahan regulasi, dan reminder lainnya.',
      features: [
        'Smart reminders - Pengingat cerdas',
        'Case updates - Update realtime',
        'Regulation alerts - Notif perubahan UU',
        'Custom scheduling - Atur jadwal sendiri'
      ],
      useCases: ['Deadline tracking', 'Stay updated', 'Never miss important dates'],
      color: 'from-violet-500 to-purple-500',
      availability: 'Semua paket'
    },
    {
      icon: Video,
      title: 'Video Consultation',
      description: 'Konsultasi video langsung dengan profesional hukum.',
      detailDescription: 'Fitur video consultation dengan HD quality untuk konsultasi langsung dengan lawyer. Termasuk screen sharing dan recording untuk dokumentasi.',
      features: [
        'HD video call - Kualitas video jernih',
        'Screen sharing - Bagikan layar',
        'Session recording - Rekam konsultasi',
        'Scheduling system - Atur jadwal mudah'
      ],
      useCases: ['Konsultasi remote', 'Meeting dengan lawyer', 'Group consultation'],
      color: 'from-blue-500 to-indigo-500',
      availability: 'Premium & Professional'
    },
    {
      icon: Lock,
      title: 'Secure Document Storage',
      description: 'Penyimpanan dokumen terenkripsi dengan keamanan tingkat tinggi.',
      detailDescription: 'Cloud storage aman dengan enkripsi end-to-end untuk menyimpan dokumen legal Anda. Backup otomatis dan version control tersedia.',
      features: [
        'End-to-end encryption - Keamanan maksimal',
        'Auto backup - Backup otomatis',
        'Version control - Track perubahan dokumen',
        'Access control - Atur siapa yang bisa akses'
      ],
      useCases: ['Simpan dokumen penting', 'Backup otomatis', 'Secure sharing'],
      color: 'from-gray-600 to-gray-800',
      availability: 'Premium & Professional'
    },
    {
      icon: BookOpen,
      title: 'Legal Glossary',
      description: 'Kamus istilah hukum Indonesia yang lengkap dan mudah dipahami.',
      detailDescription: 'Database lengkap istilah hukum Indonesia dengan penjelasan yang mudah dipahami. Dilengkapi dengan contoh penggunaan dan ilustrasi.',
      features: [
        '1000+ istilah hukum - Kamus lengkap',
        'Simple explanations - Bahasa mudah dipahami',
        'Example usage - Contoh penggunaan',
        'Quick search - Pencarian cepat'
      ],
      useCases: ['Belajar istilah hukum', 'Reference cepat', 'Edukasi'],
      color: 'from-amber-500 to-yellow-500',
      availability: 'Semua paket'
    },
    {
      icon: TrendingUp,
      title: 'Legal Trend Analysis',
      description: 'Analisis tren hukum dan perubahan regulasi terbaru.',
      detailDescription: 'Insights tentang tren peraturan, perubahan UU terbaru, dan prediksi perkembangan hukum di Indonesia dengan AI-powered analysis.',
      features: [
        'Trend detection - Deteksi tren hukum',
        'Regulatory updates - Update regulasi',
        'Prediction model - Prediksi perubahan',
        'Industry insights - Insights per industri'
      ],
      useCases: ['Stay ahead', 'Business planning', 'Risk anticipation'],
      color: 'from-green-500 to-teal-500',
      availability: 'Professional'
    },
    {
      icon: Download,
      title: 'Export & Reporting',
      description: 'Export hasil konsultasi dan riset dalam berbagai format.',
      detailDescription: 'Export hasil konsultasi, riset, dan analisis dalam format PDF, DOCX, atau Excel. Termasuk custom report builder untuk kebutuhan spesifik.',
      features: [
        'Multiple formats - PDF, DOCX, Excel',
        'Custom templates - Template report sendiri',
        'Branded exports - Tambah logo perusahaan',
        'Batch export - Export multiple files'
      ],
      useCases: ['Buat laporan', 'Share hasil', 'Documentation'],
      color: 'from-indigo-500 to-purple-500',
      availability: 'Premium & Professional'
    },
    {
      icon: Share2,
      title: 'Collaboration Tools',
      description: 'Kolaborasi dengan tim untuk mengelola kasus bersama.',
      detailDescription: 'Tools kolaborasi untuk tim hukum. Share dokumen, assign tasks, comments, dan real-time collaboration untuk efisiensi kerja tim.',
      features: [
        'Team workspace - Ruang kerja tim',
        'Document sharing - Bagikan dokumen',
        'Task assignment - Assign tugas',
        'Real-time collab - Kolaborasi realtime'
      ],
      useCases: ['Team collaboration', 'Project management', 'Shared workspace'],
      color: 'from-cyan-500 to-blue-500',
      availability: 'Professional'
    },
    {
      icon: Calculator,
      title: 'Legal Fee Calculator',
      description: 'Estimasi biaya hukum untuk berbagai jenis layanan legal.',
      detailDescription: 'Kalkulator biaya hukum yang membantu Anda memperkirakan budget untuk berbagai layanan legal seperti pembuatan kontrak, konsultasi, hingga litigasi.',
      features: [
        'Fee estimation - Estimasi biaya',
        'Service comparison - Bandingkan layanan',
        'Budget planning - Rencana budget',
        'Transparent pricing - Harga transparan'
      ],
      useCases: ['Budget planning', 'Cost estimation', 'Price comparison'],
      color: 'from-emerald-500 to-green-500',
      availability: 'Semua paket'
    },
    {
      icon: Archive,
      title: 'Case Archive',
      description: 'Arsip kasus dengan sistem pencarian dan filtering cepat.',
      detailDescription: 'Sistem arsip digital untuk menyimpan semua kasus lama dengan metadata lengkap. Search dan filter cepat untuk menemukan kasus historical.',
      features: [
        'Unlimited storage - Penyimpanan unlimited',
        'Advanced search - Pencarian canggih',
        'Tag & categorize - Organisasi dengan tag',
        'Quick retrieval - Akses cepat'
      ],
      useCases: ['Archive old cases', 'Historical reference', 'Data organization'],
      color: 'from-slate-500 to-gray-600',
      availability: 'Professional'
    },
    {
      icon: Edit,
      title: 'Document Editor',
      description: 'Editor dokumen online untuk draft dan revisi dokumen hukum.',
      detailDescription: 'Online document editor dengan fitur legal-specific seperti clause library, version comparison, dan comment threads untuk collaborative editing.',
      features: [
        'Online editor - Edit langsung di browser',
        'Clause library - Library klausul standar',
        'Version compare - Bandingkan versi',
        'Comment threads - Diskusi dalam dokumen'
      ],
      useCases: ['Draft dokumen', 'Collaborative editing', 'Document review'],
      color: 'from-orange-500 to-amber-500',
      availability: 'Premium & Professional'
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Akses cepat ke fitur yang sering digunakan dengan shortcut.',
      detailDescription: 'Command palette dan keyboard shortcuts untuk akses cepat ke semua fitur. Customize shortcut sesuai workflow Anda.',
      features: [
        'Command palette - Quick access menu',
        'Keyboard shortcuts - Shortcut keyboard',
        'Custom commands - Buat command sendiri',
        'Quick templates - Template cepat'
      ],
      useCases: ['Speed up workflow', 'Power user features', 'Productivity boost'],
      color: 'from-yellow-500 to-orange-500',
      availability: 'Semua paket'
    },
    {
      icon: Settings,
      title: 'Custom Workflows',
      description: 'Buat workflow custom sesuai kebutuhan praktik hukum Anda.',
      detailDescription: 'Workflow automation builder untuk membuat proses otomatis sesuai kebutuhan. Termasuk conditional logic, integrations, dan triggers.',
      features: [
        'Workflow builder - Visual builder',
        'Automation rules - Aturan otomatis',
        'Integration support - Integrasi apps',
        'Custom triggers - Trigger custom'
      ],
      useCases: ['Automate tasks', 'Custom process', 'Integration workflows'],
      color: 'from-purple-500 to-indigo-500',
      availability: 'Professional'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Keamanan data tingkat enterprise dengan enkripsi end-to-end.',
      detailDescription: 'Security features tingkat enterprise termasuk 2FA, SSO, audit logs, dan compliance dengan standar keamanan data internasional.',
      features: [
        'End-to-end encryption - Enkripsi penuh',
        '2FA & SSO - Keamanan login',
        'Audit logs - Log aktivitas',
        'GDPR compliant - Standar internasional'
      ],
      useCases: ['Data protection', 'Compliance', 'Enterprise security'],
      color: 'from-red-500 to-rose-500',
      availability: 'Professional'
    },
    {
      icon: Award,
      title: 'Professional Verification',
      description: 'Verifikasi profesional hukum dengan badge kredensial.',
      detailDescription: 'Program verifikasi untuk lawyer dan profesional hukum. Proses verifikasi ketat dengan background check dan validasi kredensial.',
      features: [
        'KYC verification - Verifikasi identitas',
        'Credential check - Validasi kredensial',
        'Professional badge - Badge terverifikasi',
        'Trust score - Skor kepercayaan'
      ],
      useCases: ['Lawyer verification', 'Build trust', 'Professional profile'],
      color: 'from-blue-500 to-cyan-500',
      availability: 'Professional'
    },
    {
      icon: Globe,
      title: 'Multi-Platform Access',
      description: 'Akses dari web, mobile app (iOS & Android), dan desktop.',
      detailDescription: 'Platform available di semua device. Sync data realtime across devices dengan cloud technology untuk seamless experience.',
      features: [
        'Web app - Browser based',
        'iOS & Android app - Native mobile apps',
        'Desktop app - Windows & Mac',
        'Cloud sync - Sync otomatis'
      ],
      useCases: ['Work anywhere', 'Multi-device', 'Always accessible'],
      color: 'from-teal-500 to-emerald-500',
      availability: 'Semua paket'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Fitur Lengkap Pasalku.ai
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              24+ fitur powerful untuk semua kebutuhan hukum Anda dalam satu platform
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:scale-105"
            >
              Lihat Paket & Harga
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-lg ${
                index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Icon & Title */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold whitespace-nowrap">
                      {feature.availability}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {feature.detailDescription}
                  </p>

                  {/* Features List */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Fitur Utama:</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Use Cases:</h4>
                    <div className="flex flex-wrap gap-2">
                      {feature.useCases.map((useCase, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-orange-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
            Siap Mencoba Semua Fitur Ini?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Mulai gratis dan rasakan kemudahan akses hukum dengan teknologi AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:scale-105"
            >
              Daftar Gratis Sekarang
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-orange-300 transition-all hover:shadow-lg"
            >
              Lihat Harga
            </Link>
          </div>
        </div>
      </div>

      <EnhancedFooter />
    </div>
  )
}
