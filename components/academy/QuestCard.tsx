import Link from 'next/link'

import { academyQuestCategories, type Quest } from '@/components/academy/data'
import { Badge } from '@/components/ui/badge'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export type AcademyQuestCardAction =
  | {
      type: 'link'
      href: string
      label: string
      variant?: ButtonProps['variant']
      size?: ButtonProps['size']
      icon?: React.ReactNode
    }
  | {
      type: 'custom'
      element: React.ReactNode
    }

export type AcademyQuestCardProps = {
  quest: Quest
  actions?: AcademyQuestCardAction[]
  showProgress?: boolean
  progressLabel?: string
  lockedLabel?: string
  className?: string
}

export function AcademyQuestCard({
  quest,
  actions,
  showProgress = true,
  progressLabel = 'Progress',
  lockedLabel = 'Terkunci',
  className
}: AcademyQuestCardProps) {
  const isLocked = quest.locked ?? false
  const progressValue = quest.progress ?? 0

  return (
    <Card className={className ?? 'h-full border border-border/60'}>
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center justify-between gap-3 text-lg">
          <span>{quest.title}</span>
          <Badge variant="outline" className="text-xs">
            {quest.difficulty}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{quest.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{quest.category}</Badge>
          <span>+{quest.xpReward} XP</span>
          <span>Level {quest.requiredLevel}+</span>
        </div>

        {isLocked ? (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {lockedLabel}
          </Badge>
        ) : (
          showProgress && (
            <div className="space-y-2">
              <Progress value={progressValue * 100} className="h-2 bg-muted [&>div]:bg-primary" />
              <p className="text-xs text-muted-foreground">
                {progressLabel} {Math.round(progressValue * 100)}%
              </p>
            </div>
          )
        )}

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {actions.map((action, index) => {
              if (action.type === 'custom') {
                return <span key={index}>{action.element}</span>
              }

              return (
                <Button
                  key={`${action.href}-${action.label}`}
                  asChild
                  size={action.size ?? 'sm'}
                  variant={action.variant ?? (index === actions.length - 1 ? 'default' : 'outline')}
                >
                  <Link href={action.href} className="flex items-center gap-2">
                    {action.icon}
                    {action.label}
                  </Link>
                </Button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function isAcademyQuestCategory(category: string): category is (typeof academyQuestCategories)[number] {
  return academyQuestCategories.includes(category as (typeof academyQuestCategories)[number])
}
