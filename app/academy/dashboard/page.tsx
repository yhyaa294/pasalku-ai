import Link from 'next/link'
import { Metadata } from 'next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Star, Target, TrendingUp, Trophy, GraduationCap, Sparkles } from 'lucide-react'

import {
  academyAchievements,
  academyQuests,
  type Achievement,
  type Quest
} from '@/components/academy/data'

export const metadata: Metadata = {
  title: 'Pasalku Academy Dashboard',
  description: 'Pantau perjalanan belajar hukum Anda melalui quest, level, dan pencapaian Pasalku Academy.'
}

type QuickAction = {
  href: string
  label: string
  icon: React.ElementType
}

const user = {
  fullName: 'Rizki Fadillah',
  learningTrack: 'beginner',
  level: 24,
  xp: 1875,
  achievementsUnlocked: 17
} as const

const quests: (Quest & { completed?: boolean })[] = academyQuests.map((quest, index) => ({
  ...quest,
  completed: index === 0
}))

const achievements: Achievement[] = academyAchievements.slice(0, 3)

const quickActions: QuickAction[] = [
  { href: '/academy/quests', label: 'Lihat Semua Quest', icon: Target },
  { href: '/academy/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/academy/ai-tutor', label: 'AI Tutor Chat', icon: Sparkles }
]

const trackLabels: Record<typeof user.learningTrack, string> = {
  beginner: 'Pemula'
}

export default function AcademyDashboardPage() {
  const completedQuests = quests.filter((quest) => quest.completed).length
  const totalQuests = quests.length
  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0
  const levelProgress = user.xp % 100
  const xpToNextLevel = 100 - levelProgress

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary text-primary-foreground p-2">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Pasalku Academy</h1>
              <p className="text-sm text-muted-foreground">Dashboard Pembelajaran</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/pricing">Upgrade Paket</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="space-y-3">
          <h2 className="text-3xl font-bold">Selamat datang, {user.fullName}! 👋</h2>
          <p className="text-muted-foreground">
            Jalur Pembelajaran saat ini:{' '}
            <span className="font-semibold text-foreground">{trackLabels[user.learningTrack]}</span>
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Level Anda"
            value={user.level.toString()}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
            description={`Tinggal ${xpToNextLevel} XP lagi menuju level ${user.level + 1}`}
          />
          <MetricCard
            title="Total XP"
            value={user.xp.toLocaleString('id-ID')}
            icon={<Star className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
            progressValue={levelProgress}
          />
          <MetricCard
            title="Quest Selesai"
            value={`${completedQuests}/${totalQuests}`}
            icon={<Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
            description={`${completionRate}% completion rate`}
          />
          <MetricCard
            title="Achievement"
            value={user.achievementsUnlocked.toString()}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
            description="Badges berhasil dibuka"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quest Tersedia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quests.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">Belum ada quest untuk Anda saat ini.</p>
              )}
              {quests.slice(0, 5).map((quest) => (
                <div
                  key={quest.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold leading-tight text-foreground">{quest.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {quest.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{quest.category}</Badge>
                      <span>+{quest.xpReward} XP</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    {quest.completed ? (
                      <Badge variant="default">Selesai</Badge>
                    ) : (
                      <Button size="sm" asChild>
                        <Link href={`/academy/quests/${quest.id}`}>Mulai</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {quests.length > 5 && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/academy/quests">Lihat Semua Quest</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievement Terakhir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">Belum ada achievement yang terbuka.</p>
                )}
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {achievement.badgeType === 'gold' && '🥇'}
                      {achievement.badgeType === 'silver' && '🥈'}
                      {achievement.badgeType === 'bronze' && '🥉'}
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <Button key={action.href} variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href={action.href}>
                      <action.icon className="h-4 w-4" aria-hidden="true" />
                      {action.label}
                    </Link>
                  </Button>
                ))}
                <Button variant="default" className="w-full justify-start gap-2" asChild>
                  <Link href="/academy">Kembali ke Landing Academy</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

type MetricCardProps = {
  title: string
  value: string
  icon: React.ReactNode
  description?: string
  progressValue?: number
}

function MetricCard({ title, value, icon, description, progressValue }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {typeof progressValue === 'number' && <Progress value={progressValue} className="h-2" />}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
