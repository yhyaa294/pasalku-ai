import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  Scale,
  Users
} from 'lucide-react'

export type Stat = {
  value: string
  label: string
  description: string
}

export type LearningTrack = {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan'
}

export type Quest = {
  id: string
  slug: string
  icon: LucideIcon
  title: string
  description: string
  category: string
  difficulty: 'Mudah' | 'Menengah' | 'Sulit'
  xp: number
  xpReward: number
  requiredLevel: number
  progress?: number
  locked?: boolean
}

export type Achievement = {
  id: string
  title: string
  description: string
  status: 'unlocked' | 'locked'
  badgeType?: 'gold' | 'silver' | 'bronze'
}

export type Testimonial = {
  name: string
  role: string
  content: string
}

export type LeaderboardEntry = {
  rank: number
  name: string
  level: string
  xp: number
}

export const academyStats: Stat[] = [
  { value: '50.000+', label: 'Learner Aktif', description: 'Mahasiswa & profesional hukum' },
  { value: '100+', label: 'Quest Interaktif', description: 'Berbagai kategori hukum' },
  { value: '95%', label: 'Tingkat Kepuasan', description: 'Rating rata-rata pengguna' },
  { value: '20+', label: 'Partner Kampus', description: 'Fakultas hukum terkemuka' }
]

export const academyLearningTracks: LearningTrack[] = [
  {
    icon: GraduationCap,
    title: 'Track Pemula',
    description: 'Untuk warga negara yang ingin memahami hak dan kewajiban dasar.',
    features: ['Hak & Kewajiban Warga Negara', 'Kontrak Sehari-hari', 'Perlindungan Konsumen'],
    difficulty: 'Pemula'
  },
  {
    icon: Briefcase,
    title: 'Track Profesional',
    description: 'Untuk praktisi hukum yang ingin meningkatkan kemampuan.',
    features: ['Advanced Legal Research', 'Client Management', 'Court Procedure Mastery'],
    difficulty: 'Lanjutan'
  },
  {
    icon: Building2,
    title: 'Track Bisnis',
    description: 'Untuk entrepreneur yang membutuhkan pemahaman hukum bisnis.',
    features: ['Corporate Law Essentials', 'IP & Patent Strategy', 'Merger & Acquisition Basics'],
    difficulty: 'Menengah'
  }
]

export const academyQuestCategories = [
  'Semua Kategori',
  'Hukum Perdata',
  'Hukum Pidana',
  'Hak Konsumen',
  'Hukum Bisnis'
] as const

export const academyQuests: Quest[] = [
  {
    id: 'quest-1320-kuhperdata',
    slug: 'memahami-pasal-1320-kuhperdata',
    icon: Scale,
    title: 'Memahami Pasal 1320 KUHPerdata',
    description: 'Pelajari empat syarat sah perjanjian dan praktekkan analisis kontrak sederhana untuk memastikan kepatuhan hukum.',
    category: 'Hukum Perdata',
    difficulty: 'Mudah',
    xp: 100,
    xpReward: 120,
    requiredLevel: 5,
    progress: 0.75
  },
  {
    id: 'quest-analisis-kasus-pencemaran',
    slug: 'analisis-kasus-pencemaran-nama-baik',
    icon: FileText,
    title: 'Analisis Kasus Pencemaran Nama Baik',
    description: 'Simulasikan strategi pembelaan berdasarkan UU ITE dan KUHP lengkap dengan drafting pledoi dan bukti digital.',
    category: 'Hukum Pidana',
    difficulty: 'Menengah',
    xp: 250,
    xpReward: 260,
    requiredLevel: 12,
    progress: 0.3
  },
  {
    id: 'quest-hak-konsumen-online',
    slug: 'hak-konsumen-transaksi-online',
    icon: Users,
    title: 'Hak Konsumen dalam Transaksi Online',
    description: 'Identifikasi hak-hak penting konsumen, susun template pengaduan, dan evaluasi mitigasi sengketa e-commerce.',
    category: 'Hak Konsumen',
    difficulty: 'Mudah',
    xp: 150,
    xpReward: 150,
    requiredLevel: 3,
    progress: 0.5
  },
  {
    id: 'quest-merger-akuisisi',
    slug: 'merger-dan-akuisisi-perusahaan',
    icon: Briefcase,
    title: 'Merger & Akuisisi Perusahaan',
    description: 'Pahami tahapan hukum penting dalam proses M&A di Indonesia dan lakukan analisis due diligence dasar.',
    category: 'Hukum Bisnis',
    difficulty: 'Sulit',
    xp: 500,
    xpReward: 520,
    requiredLevel: 20,
    locked: true
  }
]

export const academyAchievements: Achievement[] = [
  { id: 'ach-legal-master', title: 'Legal Master', description: 'Selesaikan 100 quest', status: 'unlocked', badgeType: 'gold' },
  { id: 'ach-quick-learner', title: 'Quick Learner', description: 'Selesaikan 50 quest', status: 'unlocked', badgeType: 'silver' },
  { id: 'ach-first-steps', title: 'First Steps', description: 'Selesaikan 10 quest', status: 'unlocked', badgeType: 'bronze' },
  { id: 'ach-supreme-justice', title: 'Supreme Justice', description: 'Capai level 100', status: 'locked' },
  { id: 'ach-case-master', title: 'Case Master', description: 'Menang 20 simulasi kasus', status: 'locked' }
]

export const academyTestimonials: Testimonial[] = [
  {
    name: 'Rizki Fadillah',
    role: 'Mahasiswa Hukum UI',
    content:
      'Platform ini benar-benar membantu saya memahami materi hukum dengan cara yang menyenangkan. Sistem gamifikasi membuat belajar tidak membosankan!'
  },
  {
    name: 'Sarah Wulandari',
    role: 'Advokat Junior',
    content:
      'AI tutor sangat membantu untuk memahami kasus-kasus kompleks. Penjelasannya mudah dipahami dan kontekstual dengan kondisi di Indonesia.'
  },
  {
    name: 'Bambang Susilo',
    role: 'Entrepreneur',
    content:
      'Sebagai pebisnis, saya sangat terbantu dengan track Business Law. Sekarang saya lebih percaya diri dalam membuat keputusan bisnis.'
  }
]

export const academyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Ahmad Rizki', level: 'Legal Master', xp: 15_420 },
  { rank: 2, name: 'Siti Nurhaliza', level: 'Law Expert', xp: 14_250 },
  { rank: 3, name: 'Budi Santoso', level: 'Law Expert', xp: 13_890 },
  { rank: 4, name: 'Dewi Lestari', level: 'Legal Scholar', xp: 12_100 },
  { rank: 5, name: 'Eko Prasetyo', level: 'Legal Scholar', xp: 11_550 }
]
