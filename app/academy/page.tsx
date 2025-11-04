'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, BookOpen, Trophy } from 'lucide-react'

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
               Pasalku Academy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Belajar hukum dengan cara yang menyenangkan melalui quest, gamifikasi, dan simulasi kasus interaktif
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/chat">Mulai Belajar</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sumber-daya/kamus">Kamus Hukum</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 border rounded-lg">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Learning Tracks</h3>
              <p className="text-muted-foreground">
                Jalur pembelajaran terstruktur dari pemula hingga mahir
              </p>
            </div>
            <div className="text-center space-y-4 p-6 border rounded-lg">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Interactive Quests</h3>
              <p className="text-muted-foreground">
                Selesaikan quest dan dapatkan XP untuk naik level
              </p>
            </div>
            <div className="text-center space-y-4 p-6 border rounded-lg">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Achievements</h3>
              <p className="text-muted-foreground">
                Raih prestasi dan bersaing di leaderboard
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Siap Memulai Perjalanan Belajar Anda?
          </h2>
          <p className="text-lg text-muted-foreground">
            Bergabunglah dengan ribuan pengguna yang sudah belajar hukum dengan cara yang lebih efektif
          </p>
          <Button asChild size="lg">
            <Link href="/chat">Mulai Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
