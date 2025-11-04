'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Lock, 
  Sparkles, 
  Crown,
  Zap,
  X,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'
import { useFeatureGate, useQuotaCheck, getUpgradeMessage, getRemainingQuota, UserSubscription } from '@/lib/paywall'

type PaywallModalProps = {
  feature: string
  description: string
  tier: 'pro' | 'enterprise'
  onClose?: () => void
  benefits?: string[]
}

export function PaywallModal({ feature, description, tier, onClose, benefits }: PaywallModalProps) {
  const router = useRouter()

  const defaultBenefits = [
    'Unlimited AI conversations',
    'AI Document Analyzer',
    'Premium templates',
    'Priority support',
    'No watermarks'
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        <Card className="border-primary/50">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
          
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <Badge className="w-fit mx-auto mb-2 bg-primary/10 text-primary">
              {tier === 'pro' ? <Zap className="h-3 w-3 mr-1" /> : <Crown className="h-3 w-3 mr-1" />}
              {tier === 'pro' ? 'Pro Feature' : 'Enterprise Feature'}
            </Badge>
            <CardTitle className="text-2xl">{feature}</CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="text-sm font-semibold">Dengan upgrade ke {tier === 'pro' ? 'Pro' : 'Enterprise'}, Anda mendapat:</div>
              {(benefits || defaultBenefits).map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-3">
              <Button 
                onClick={() => router.push('/pricing')} 
                className="w-full" 
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Sekarang
              </Button>
              <Button 
                onClick={() => router.push('/pricing')} 
                variant="outline" 
                className="w-full"
              >
                Lihat Semua Paket
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

type QuotaWarningProps = {
  type: 'chat' | 'documentsAnalyze' | 'documentsGenerate' | 'simulations'
  subscription: UserSubscription
  onUpgrade?: () => void
}

export function QuotaWarning({ type, subscription, onUpgrade }: QuotaWarningProps) {
  const router = useRouter()
  const remaining = getRemainingQuota(subscription, type)

  const labels = {
    chat: 'chat',
    documentsAnalyze: 'analisis dokumen',
    documentsGenerate: 'generate dokumen',
    simulations: 'simulasi'
  }

  if (remaining === 'unlimited' || (typeof remaining === 'number' && remaining > 3)) {
    return null
  }

  if (remaining === 0) {
    return (
      <Card className="border-red-500/50 bg-red-500/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 flex-shrink-0">
              <Lock className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="font-semibold text-red-900 dark:text-red-100">
                Kuota {labels[type]} habis
              </div>
              <p className="text-sm text-red-800 dark:text-red-200">
                Anda telah mencapai batas {labels[type]} untuk paket Free. Upgrade ke Pro untuk unlimited access.
              </p>
              <Button
                onClick={() => onUpgrade ? onUpgrade() : router.push('/pricing')}
                size="sm"
                className="mt-2"
              >
                <Zap className="h-4 w-4 mr-2" />
                Upgrade ke Pro
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-yellow-500/50 bg-yellow-500/10">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="font-semibold text-yellow-900 dark:text-yellow-100">
              Kuota {labels[type]} hampir habis
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Anda memiliki {remaining} {labels[type]} tersisa. Upgrade untuk unlimited access.
            </p>
            <Button
              onClick={() => onUpgrade ? onUpgrade() : router.push('/pricing')}
              variant="outline"
              size="sm"
              className="mt-2 border-yellow-600 hover:bg-yellow-500/10"
            >
              Lihat Paket Pro
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type FeatureLockedBannerProps = {
  feature: string
  tier: 'pro' | 'enterprise'
}

export function FeatureLockedBanner({ feature, tier }: FeatureLockedBannerProps) {
  const router = useRouter()

  return (
    <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{feature}</h3>
          <p className="text-sm text-muted-foreground">
            Fitur ini tersedia untuk pengguna {tier === 'pro' ? 'Pro' : 'Enterprise'}
          </p>
        </div>
        <Button onClick={() => router.push('/pricing')}>
          <Sparkles className="h-4 w-4 mr-2" />
          Upgrade ke {tier === 'pro' ? 'Pro' : 'Enterprise'}
        </Button>
      </div>
    </div>
  )
}

type FeatureGateProps = {
  feature: keyof UserSubscription['features']
  fallback?: ReactNode
  children: ReactNode
}

export function FeatureGate({ feature, fallback, children }: FeatureGateProps) {
  const { hasAccess, loading } = useFeatureGate(feature)

  if (loading) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg" />
  }

  if (!hasAccess) {
    return <>{fallback || <FeatureLockedBanner feature={String(feature)} tier="pro" />}</>
  }

  return <>{children}</>
}
