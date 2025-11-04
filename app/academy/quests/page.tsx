'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import {
  academyQuests,
  academyQuestCategories,
  type Quest
} from '@/components/academy/data'
import { AcademyQuestCard, isAcademyQuestCategory } from '@/components/academy/QuestCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const filters = academyQuestCategories

export default function AcademyQuestsPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Semua Kategori')

  const quests = useMemo(() => {
    if (activeFilter === 'Semua Kategori') {
      return academyQuests
    }

    return academyQuests.filter((quest) => quest.category === activeFilter)
  }, [activeFilter])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/academy/dashboard">← Dashboard</Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Semua Quest</h1>
              <p className="text-sm text-muted-foreground">{quests.length} quest tersedia</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/academy">Kembali ke Academy</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Tabs
          value={activeFilter}
          onValueChange={(value) => {
            if (isAcademyQuestCategory(value)) {
              setActiveFilter(value)
            }
          }}
        >
          <TabsList className="mb-8 flex w-full flex-wrap justify-start gap-2 bg-transparent p-0">
            {filters.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeFilter} className="space-y-6">
            <QuestGrid quests={quests} />
            {quests.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center text-sm text-muted-foreground">
                  Tidak ada quest di kategori ini.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function QuestGrid({ quests }: { quests: Quest[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {quests.map((quest) => (
        <AcademyQuestCard
          key={quest.id}
          quest={quest}
          actions={[
            {
              type: 'link',
              href: `/academy/quests/${quest.slug}`,
              label: 'Detail Quest',
              variant: 'outline'
            },
            {
              type: 'link',
              href: quest.locked ? '/academy' : `/academy/quests/${quest.slug}/start`,
              label: quest.locked ? 'Buka Syarat' : 'Mulai',
              variant: quest.locked ? 'outline' : 'default'
            }
          ]}
        />
      ))}
    </div>
  )
}
