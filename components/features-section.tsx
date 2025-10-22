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
      // BEFORE: 'Chat interaktif dengan AI untuk konsultasi hukum secara real-time.'
      description: 'Dapatkan Jawaban Cepat & Terstruktur dalam Bahasa yang Anda Pahami - Tanpa Jargon Hukum yang Membingungkan',
      color: 'from-blue-500 to-cyan-500',
      benefit: 'Hemat waktu berjam-jam riset',
      socialProof: '10,000+ konsultasi/bulan',
      beforeAfter: {
        before: 'Bingung mencari informasi',
        after: 'Jawaban jelas dalam 30 detik'
      }
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      // BEFORE: 'Upload dan analisis dokumen hukum secara otomatis dengan AI.'
      description: 'Pahami Isi Dokumen Rumit dalam Sekejap dan Temukan Potensi Risiko Sebelum Terlambat',
      color: 'from-purple-500 to-pink-500',
      benefit: 'Hindari kesalahan mahal',
      socialProof: '5,000+ dokumen dianalisis',
      beforeAfter: {
        before: 'Tidak paham isi kontrak',
        after: 'Mengerti setiap klausul penting'
      }
    },
    {
      icon: Database,
      title: 'Legal Knowledge Base',
      // BEFORE: 'Akses database lengkap peraturan perundang-undangan Indonesia.'
      description: 'Temukan Pasal yang Melindungi Hak Anda dengan Pencarian Cerdas - Hemat Waktu Berjam-jam Riset Manual',
      color: 'from-green-500 to-emerald-500',
      benefit: 'Akses informasi kapan saja',
      socialProof: '50,000+ pasal tersedia',
      beforeAfter: {
        before: 'Cari pasal berjam-jam',
        after: 'Temukan dalam hitungan detik'
      }
    },
    {
      icon: FileCheck,
      title: 'Document Templates',
      description: 'Buat Dokumen Hukum Profesional dalam Menit - Tidak Perlu Bayar Mahal untuk Template Dasar',
      color: 'from-orange-500 to-red-500',
      benefit: 'Hemat jutaan rupiah',
      socialProof: '200+ template siap pakai',
      beforeAfter: {
        before: 'Bayar Rp 500rb per dokumen',
        after: 'Gratis unlimited template'
      }
    },
    {
      icon: Calendar,
      title: 'Case Management',
      description: 'Kelola Semua Kasus Anda di Satu Tempat - Jangan Pernah Lupa Deadline atau Dokumen Penting Lagi',
      color: 'from-indigo-500 to-blue-500',
      benefit: 'Organisasi sempurna',
      socialProof: '3,000+ kasus dikelola',
      beforeAfter: {
        before: 'Dokumen berserakan',
        after: 'Semua terorganisir rapi'
      }
    },
    {
      icon: Search,
      title: 'Legal Research',
      description: 'Temukan Preseden Relevan Otomatis - AI Melakukan Riset yang Biasanya Butuh Hari dalam Hitungan Menit',
      color: 'from-yellow-500 to-orange-500',
      benefit: 'Riset 10x lebih cepat',
      socialProof: '1,000+ preseden ditemukan',
      beforeAfter: {
        before: 'Riset 3-5 hari',
        after: 'Hasil dalam 5 menit'
      }
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Terhubung dengan Ahli Hukum Terverifikasi Saat Anda Butuh Bantuan Lebih Lanjut',
      color: 'from-pink-500 to-rose-500',
      benefit: 'Akses ke expert',
      socialProof: '500+ profesional terdaftar',
      beforeAfter: {
        before: 'Tidak tahu harus ke mana',
        after: 'Langsung ke ahli yang tepat'
      }
    },
    {
      icon: PieChart,
      title: 'Analytics Dashboard',
      description: 'Lihat Progress dan Insight Kasus Anda - Buat Keputusan Berdasarkan Data, Bukan Tebakan',
      color: 'from-teal-500 to-cyan-500',
      benefit: 'Keputusan lebih baik',
      socialProof: 'Real-time insights',
      beforeAfter: {
        before: 'Tidak tahu status kasus',
        after: 'Monitor progress real-time'
      }
    },
    {
      icon: ClipboardCheck,
      title: 'Compliance Checker',
      description: 'Pastikan Dokumen Anda Sesuai Regulasi - Hindari Masalah Hukum Sebelum Terjadi',
      color: 'from-red-500 to-orange-500',
      benefit: 'Cegah masalah hukum',
      socialProof: '95% akurasi deteksi',
      beforeAfter: {
        before: 'Takut ada yang salah',
        after: 'Yakin 100% compliant'
      }
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Jangan Pernah Lewatkan Deadline Penting - Reminder Otomatis untuk Semua yang Perlu Anda Lakukan',
      color: 'from-violet-500 to-purple-500',
      benefit: 'Tidak ada yang terlewat',
      socialProof: 'Notifikasi real-time',
      beforeAfter: {
        before: 'Lupa deadline penting',
        after: 'Selalu on-time'
      }
    },
    {
      icon: Video,
      title: 'Video Consultation',
      description: 'Konsultasi Tatap Muka Virtual dengan Profesional - Lebih Personal dari Chat, Lebih Murah dari Kantor',
      color: 'from-blue-500 to-indigo-500',
      benefit: 'Konsultasi personal',
      socialProof: 'HD video quality',
      beforeAfter: {
        before: 'Harus ke kantor',
        after: 'Konsultasi dari rumah'
      }
    },
    {
      icon: Lock,
      title: 'Secure Document Storage',
      description: 'Dokumen Anda Aman dengan Enkripsi Tingkat Bank - Privasi dan Keamanan adalah Prioritas Kami',
      color: 'from-gray-600 to-gray-800',
      benefit: 'Keamanan maksimal',
      socialProof: 'Enkripsi 256-bit',
      beforeAfter: {
        before: 'Khawatir data bocor',
        after: 'Tidur nyenyak, data aman'
      }
    },
    {
      icon: BookOpen,
      title: 'Legal Glossary',
      description: 'Pahami Istilah Hukum dengan Penjelasan Sederhana - Tidak Ada Lagi Bahasa yang Membingungkan',
      color: 'from-amber-500 to-yellow-500',
      benefit: 'Belajar sambil jalan',
      socialProof: '5,000+ istilah dijelaskan',
      beforeAfter: {
        before: 'Bingung istilah hukum',
        after: 'Paham setiap kata'
      }
    },
    {
      icon: TrendingUp,
      title: 'Legal Trend Analysis',
      description: 'Tetap Update dengan Perubahan Hukum Terbaru - Jangan Sampai Ketinggalan Regulasi Penting',
      color: 'from-green-500 to-teal-500',
      benefit: 'Selalu up-to-date',
      socialProof: 'Update harian',
      beforeAfter: {
        before: 'Ketinggalan info penting',
        after: 'Selalu tahu yang terbaru'
      }
    },
    {
      icon: Download,
      title: 'Export & Reporting',
      description: 'Download Hasil Konsultasi dalam Format Apapun - PDF, Word, atau Excel Sesuai Kebutuhan Anda',
      color: 'from-indigo-500 to-purple-500',
      benefit: 'Fleksibilitas maksimal',
      socialProof: 'Multiple formats',
      beforeAfter: {
        before: 'Susah share hasil',
        after: 'Export dalam 1 klik'
      }
    },
    {
      icon: Share2,
      title: 'Collaboration Tools',
      description: 'Kerja Tim Lebih Mudah - Bagikan Kasus dan Kolaborasi dengan Rekan Anda Secara Real-time',
      color: 'from-cyan-500 to-blue-500',
      benefit: 'Teamwork efisien',
      socialProof: 'Real-time sync',
      beforeAfter: {
        before: 'Kerja sendiri-sendiri',
        after: 'Kolaborasi seamless'
      }
    },
    {
      icon: Calculator,
      title: 'Legal Fee Calculator',
      description: 'Tahu Perkiraan Biaya Sebelum Mulai - Tidak Ada Lagi Kejutan Tagihan yang Mengejutkan',
      color: 'from-emerald-500 to-green-500',
      benefit: 'Transparansi biaya',
      socialProof: 'Estimasi akurat',
      beforeAfter: {
        before: 'Takut biaya membengkak',
        after: 'Budget jelas dari awal'
      }
    },
    {
      icon: Archive,
      title: 'Case Archive',
      description: 'Akses Riwayat Kasus Kapan Saja - Semua Data Tersimpan Aman dan Mudah Dicari',
      color: 'from-slate-500 to-gray-600',
      benefit: 'Riwayat lengkap',
      socialProof: 'Unlimited storage',
      beforeAfter: {
        before: 'Lupa kasus lama',
        after: 'Semua tercatat rapi'
      }
    },
    {
      icon: Edit,
      title: 'Document Editor',
      description: 'Edit Dokumen Langsung di Platform - Tidak Perlu Aplikasi Lain, Semua dalam Satu Tempat',
      color: 'from-orange-500 to-amber-500',
      benefit: 'All-in-one solution',
      socialProof: 'Rich text editor',
      beforeAfter: {
        before: 'Buka tutup aplikasi',
        after: 'Edit langsung di sini'
      }
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Akses Fitur Favorit dalam Sekejap - Shortcut Pintar untuk Workflow yang Lebih Cepat',
      color: 'from-yellow-500 to-orange-500',
      benefit: 'Produktivitas 2x',
      socialProof: 'Keyboard shortcuts',
      beforeAfter: {
        before: 'Klik berkali-kali',
        after: '1 shortcut, done'
      }
    },
    {
      icon: Settings,
      title: 'Custom Workflows',
      description: 'Sesuaikan Platform dengan Cara Kerja Anda - Bukan Anda yang Menyesuaikan, Tapi Platform yang Menyesuaikan',
      color: 'from-purple-500 to-indigo-500',
      benefit: 'Personalisasi penuh',
      socialProof: 'Fully customizable',
      beforeAfter: {
        before: 'Workflow kaku',
        after: 'Sesuai kebutuhan Anda'
      }
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Data Anda Dilindungi dengan Standar Tertinggi - Kami Lebih Peduli Privasi Anda daripada Apapun',
      color: 'from-red-500 to-rose-500',
      benefit: 'Privasi terjamin',
      socialProof: 'ISO 27001 certified',
      beforeAfter: {
        before: 'Ragu share data sensitif',
        after: 'Percaya 100% aman'
      }
    },
    {
      icon: Award,
      title: 'Professional Verification',
      description: 'Hanya Ahli Terverifikasi di Platform Kami - Kualitas dan Kredibilitas Terjamin',
      color: 'from-blue-500 to-cyan-500',
      benefit: 'Kualitas terjamin',
      socialProof: 'Verified professionals',
      beforeAfter: {
        before: 'Tidak tahu kredibilitas',
        after: 'Yakin dengan ahlinya'
      }
    },
    {
      icon: Globe,
      title: 'Multi-Platform Access',
      description: 'Akses dari Mana Saja, Kapan Saja - Web, Mobile, atau Desktop, Semua Tersinkronisasi',
      color: 'from-teal-500 to-emerald-500',
      benefit: 'Fleksibilitas total',
      socialProof: 'iOS, Android, Web',
      beforeAfter: {
        before: 'Terikat satu device',
        after: 'Akses dari mana saja'
      }
    },
  ]

  return (
  <section id="features" className={`py-20 md:py-32 px-4 bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 dark:border dark:border-green-800/50 text-sm font-bold mb-6">
            <span>💡</span> Solusi, Bukan Sekadar Fitur
          </div>
          {/* BENEFIT-ORIENTED TITLE */}
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">Solusi Praktis</span> <span className="dark:text-gray-100">untuk Masalah Anda</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Bukan hanya tools, tapi <span className="text-blue-600 dark:text-blue-400 font-semibold">hasil nyata</span> yang mengubah cara Anda menangani masalah hukum
          </p>
        </div>

        {/* Bento Grid Layout - Modern & Interactive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Featured Large Cards - TOP 2 */}
          <div className="md:col-span-2 lg:col-span-2 bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{features[0].title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{features[0].description}</p>
              </div>
            </div>
            {/* BEFORE/AFTER Micro-story */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-red-50 dark:bg-red-950/40 rounded-xl p-3 border border-red-200 dark:border-red-900/50">
                <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">❌ Dulu:</div>
                <div className="text-sm text-red-800 dark:text-red-300">{features[0].beforeAfter.before}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/40 rounded-xl p-3 border border-green-200 dark:border-green-900/50">
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">✅ Sekarang:</div>
                <div className="text-sm text-green-800 dark:text-green-300">{features[0].beforeAfter.after}</div>
              </div>
            </div>
            {/* SOCIAL PROOF */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full motion-safe:animate-pulse"></div>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{features[0].socialProof}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">{features[0].benefit}</div>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2 bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 group">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{features[1].title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{features[1].description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-red-50 dark:bg-red-950/40 rounded-xl p-3 border border-red-200 dark:border-red-900/50">
                <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">❌ Dulu:</div>
                <div className="text-sm text-red-800 dark:text-red-300">{features[1].beforeAfter.before}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/40 rounded-xl p-3 border border-green-200 dark:border-green-900/50">
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">✅ Sekarang:</div>
                <div className="text-sm text-green-800 dark:text-green-300">{features[1].beforeAfter.after}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full motion-safe:animate-pulse"></div>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">{features[1].socialProof}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">{features[1].benefit}</div>
            </div>
          </div>

          {/* Medium Cards - Next 6 */}
          {features.slice(2, 8).map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                {feature.description}
              </p>
              {/* Benefit Badge */}
              <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-2">
                💎 {feature.benefit}
              </div>
              {/* Social Proof */}
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
                {feature.socialProof}
              </div>
            </div>
          ))}

          {/* Small Cards - Remaining */}
          {features.slice(8).map((feature, index) => (
            <div
              key={index}
              className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold mb-1 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                {feature.description}
              </p>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{feature.socialProof}</div>
            </div>
          ))}
        </div>

        {/* VALUE PROPOSITION - Bottom Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-8 md:p-12 border border-blue-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Mengapa Memilih Pasalku.ai?
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Bukan sekadar platform, tapi <span className="text-blue-600 dark:text-blue-400 font-semibold">partner</span> yang membantu Anda menyelesaikan masalah hukum dengan lebih <span className="text-purple-600 dark:text-purple-400 font-semibold">cepat, mudah, dan terjangkau</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">10x</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Lebih Cepat dari Cara Tradisional</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">90%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Lebih Murah dari Konsultasi Biasa</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">24/7</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Tersedia Kapan Saja Anda Butuh</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Modern */}
        <div className="mt-16 text-center">
          <a href="/features" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <span>Jelajahi Semua Solusi</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            Dan masih banyak fitur lainnya yang terus kami kembangkan untuk Anda 🚀
          </p>
        </div>
      </div>
    </section>
  )
}
