'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Briefcase, 
  Users, 
  Scale, 
  Home,
  Clock,
  Star,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'

type Scenario = {
  id: string
  title: string
  description: string
  category: 'kontrak' | 'ketenagakerjaan' | 'perdata' | 'properti'
  difficulty: 'Mudah' | 'Menengah' | 'Sulit'
  duration: string
  xpReward: number
  icon: typeof Briefcase
  completed?: boolean
  rating?: number
  participants: number
}

const scenarios: Scenario[] = [
  {
    id: 'negosiasi-kontrak-kerja',
    title: 'Negosiasi Kontrak Kerja',
    description: 'Simulasi negosiasi kontrak kerja antara pekerja dan perusahaan. Pelajari strategi negosiasi gaji, benefit, dan klausul penting.',
    category: 'ketenagakerjaan',
    difficulty: 'Mudah',
    duration: '15-20 menit',
    xpReward: 150,
    icon: Briefcase,
    rating: 4.8,
    participants: 2847
  },
  {
    id: 'penanganan-phk',
    title: 'Penanganan Kasus PHK',
    description: 'Hadapi skenario PHK dari perspektif HR dan karyawan. Pahami hak, kewajiban, dan prosedur yang benar.',
    category: 'ketenagakerjaan',
    difficulty: 'Menengah',
    duration: '20-25 menit',
    xpReward: 200,
    icon: Users,
    rating: 4.6,
    participants: 1923
  },
  {
    id: 'sengketa-jual-beli',
    title: 'Mediasi Sengketa Jual-Beli',
    description: 'Selesaikan sengketa antara penjual dan pembeli dalam transaksi online. Latih kemampuan mediasi dan problem solving.',
    category: 'perdata',
    difficulty: 'Menengah',
    duration: '25-30 menit',
    xpReward: 250,
    icon: Scale,
    rating: 4.7,
    participants: 2156
  },
  {
    id: 'sengketa-properti',
    title: 'Sengketa Batas Tanah',
    description: 'Simulasi penyelesaian sengketa batas tanah antara tetangga. Pahami aspek hukum properti dan mediasi.',
    category: 'properti',
    difficulty: 'Sulit',
    duration: '30-35 menit',
    xpReward: 300,
    icon: Home,
    rating: 4.5,
    participants: 1432
  },
  {
    id: 'perjanjian-bisnis',
    title: 'Negosiasi Perjanjian Bisnis',
    description: 'Negosiasi partnership agreement untuk usaha bersama. Pelajari klausul penting dalam perjanjian bisnis.',
    category: 'kontrak',
    difficulty: 'Sulit',
    duration: '30-40 menit',
    xpReward: 350,
    icon: TrendingUp,
    rating: 4.9,
    participants: 3201
  },
  {
    id: 'wanprestasi-kontrak',
    title: 'Penyelesaian Wanprestasi',
    description: 'Hadapi kasus wanprestasi kontrak dan pelajari langkah hukum yang tepat untuk penyelesaiannya.',
    category: 'kontrak',
    difficulty: 'Menengah',
    duration: '20-25 menit',
    xpReward: 200,
    icon: Scale,
    rating: 4.6,
    participants: 1789
  }
]

const categoryLabels = {
  kontrak: 'Hukum Kontrak',
  ketenagakerjaan: 'Ketenagakerjaan',
  perdata: 'Hukum Perdata',
  properti: 'Hukum Properti'
}

const difficultyColors = {
  Mudah: 'bg-green-500/10 text-green-700 dark:text-green-400',
  Menengah: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  Sulit: 'bg-red-500/10 text-red-700 dark:text-red-400'
}

export default function SimulasiPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('semua')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('semua')

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'semua' || scenario.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'semua' || scenario.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              🎮 Simulasi Skenario Hukum
            </h1>
            <p className="text-lg text-muted-foreground">
              Latih kemampuan hukum Anda melalui simulasi interaktif berbasis skenario nyata. 
              Buat keputusan, lihat konsekuensinya, dan dapatkan feedback dari AI.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari simulasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  <option value="semua">Semua Kategori</option>
                  <option value="kontrak">Hukum Kontrak</option>
                  <option value="ketenagakerjaan">Ketenagakerjaan</option>
                  <option value="perdata">Hukum Perdata</option>
                  <option value="properti">Hukum Properti</option>
                </select>
              </div>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              >
                <option value="semua">Semua Tingkat</option>
                <option value="Mudah">Mudah</option>
                <option value="Menengah">Menengah</option>
                <option value="Sulit">Sulit</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredScenarios.length} simulasi
            </p>
          </div>
        </div>
      </section>

      {/* Scenarios Grid */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {filteredScenarios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              Tidak ada simulasi yang sesuai dengan filter Anda
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('semua')
                setSelectedDifficulty('semua')
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <scenario.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={difficultyColors[scenario.difficulty]}>
                          {scenario.difficulty}
                        </Badge>
                        {scenario.completed && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                            ✓ Selesai
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{scenario.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {categoryLabels[scenario.category]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {scenario.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{scenario.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{scenario.rating} • {scenario.participants.toLocaleString()} peserta</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-primary">
                        <TrendingUp className="h-4 w-4" />
                        <span>+{scenario.xpReward} XP</span>
                      </div>
                    </div>

                    <Button asChild className="w-full mt-4">
                      <Link href={`/sumber-daya/simulasi/${scenario.id}`}>
                        {scenario.completed ? 'Main Lagi' : 'Mulai Simulasi'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold">
              Butuh Bantuan Hukum Personal?
            </h2>
            <p className="text-muted-foreground">
              Konsultasikan kasus Anda dengan AI Legal Assistant kami untuk mendapatkan guidance yang lebih spesifik.
            </p>
            <Button asChild size="lg">
              <Link href="/chat">
                Mulai Konsultasi
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
