import Link from 'next/link'
import { Metadata } from 'next'

import { academyLeaderboard, type LeaderboardEntry } from '@/components/academy/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Medal, Trophy } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Leaderboard Pasalku Academy',
  description:
    'Lihat peringkat learner terbaik Pasalku Academy, raih posisi puncak dengan menyelesaikan quest dan simulasi AI.'
}

export default function AcademyLeaderboardPage() {
  const topThree = academyLeaderboard.slice(0, 3)
  const others = academyLeaderboard.slice(3)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/academy/dashboard">← Dashboard</Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Leaderboard Pasalku Academy</h1>
              <p className="text-sm text-muted-foreground">
                Pantau posisi Anda dan motivasi diri mengejar XP tertinggi.
              </p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/academy/quests">Mulai Quest Baru</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
        <section>
          <Card>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">Top 3 Champions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Selamat untuk para peraih peringkat tertinggi minggu ini!
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {topThree.map((entry, index) => (
                  <LeaderboardPodium key={entry.rank} entry={entry} placement={index + 1} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Daftar Peringkat Lengkap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {academyLeaderboard.map((entry) => (
                <LeaderboardRow key={entry.rank} entry={entry} />
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

type LeaderboardPodiumProps = {
  entry: LeaderboardEntry
  placement: 1 | 2 | 3
}

function LeaderboardPodium({ entry, placement }: LeaderboardPodiumProps) {
  const iconMap: Record<LeaderboardPodiumProps['placement'], React.ReactNode> = {
    1: <Trophy className="h-10 w-10 text-yellow-400" aria-hidden="true" />,
    2: <Medal className="h-9 w-9 text-slate-300" aria-hidden="true" />,
    3: <Award className="h-9 w-9 text-amber-500" aria-hidden="true" />
  }

  const accentClass =
    placement === 1
      ? 'from-yellow-500/20 via-primary/10 to-background'
      : placement === 2
        ? 'from-slate-300/20 via-background to-muted'
        : 'from-amber-500/20 via-background to-muted'

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background p-6 text-center shadow-sm">
      <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${accentClass} flex items-center justify-center`}>{iconMap[placement]}</div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-foreground">{entry.name}</p>
        <p className="text-sm text-muted-foreground">{entry.level}</p>
      </div>
      <Badge variant="secondary" className="bg-primary/10 text-primary">
        {entry.xp.toLocaleString('id-ID')} XP
      </Badge>
    </div>
  )
}

type LeaderboardRowProps = {
  entry: LeaderboardEntry
}

function LeaderboardRow({ entry }: LeaderboardRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-primary">#{entry.rank}</span>
        <div>
          <p className="text-sm font-semibold text-foreground">{entry.name}</p>
          <p className="text-xs text-muted-foreground">{entry.level}</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-muted-foreground">{entry.xp.toLocaleString('id-ID')} XP</span>
    </div>
  )
}
