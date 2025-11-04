// Paywall utility functions and hooks
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export type UserSubscription = {
  tier: SubscriptionTier
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  features: {
    chatLimit: number // -1 for unlimited
    chatUsed: number
    documentsAnalyzeLimit: number
    documentsAnalyzeUsed: number
    documentsGenerateLimit: number
    documentsGenerateUsed: number
    simulationsLimit: number
    simulationsUsed: number
    templatesAccess: number // number of templates
    prioritySupport: boolean
    removeWatermark: boolean
    apiAccess: boolean
    customAI: boolean
  }
}

// Feature flags per tier
export const tierFeatures: Record<SubscriptionTier, Partial<UserSubscription['features']>> = {
  free: {
    chatLimit: 10,
    documentsAnalyzeLimit: 0,
    documentsGenerateLimit: 0,
    simulationsLimit: 3,
    templatesAccess: 5,
    prioritySupport: false,
    removeWatermark: false,
    apiAccess: false,
    customAI: false
  },
  pro: {
    chatLimit: -1, // unlimited
    documentsAnalyzeLimit: 10,
    documentsGenerateLimit: 20,
    simulationsLimit: -1,
    templatesAccess: 50,
    prioritySupport: true,
    removeWatermark: true,
    apiAccess: false,
    customAI: false
  },
  enterprise: {
    chatLimit: -1,
    documentsAnalyzeLimit: -1,
    documentsGenerateLimit: -1,
    simulationsLimit: -1,
    templatesAccess: -1,
    prioritySupport: true,
    removeWatermark: true,
    apiAccess: true,
    customAI: true
  }
}

// Mock function - replace with real API call
export function getUserSubscription(): UserSubscription {
  // This should fetch from your backend/database
  return {
    tier: 'free',
    status: 'active',
    features: {
      chatLimit: 10,
      chatUsed: 7,
      documentsAnalyzeLimit: 0,
      documentsAnalyzeUsed: 0,
      documentsGenerateLimit: 0,
      documentsGenerateUsed: 0,
      simulationsLimit: 3,
      simulationsUsed: 2,
      templatesAccess: 5,
      prioritySupport: false,
      removeWatermark: false,
      apiAccess: false,
      customAI: false
    }
  }
}

// Check if user has access to a feature
export function hasFeatureAccess(
  subscription: UserSubscription,
  feature: keyof UserSubscription['features']
): boolean {
  const featureValue = subscription.features[feature]
  
  // Boolean features
  if (typeof featureValue === 'boolean') {
    return featureValue
  }
  
  // Numeric features (limits)
  return featureValue === -1 || featureValue > 0
}

// Check if user has reached limit
export function hasReachedLimit(
  subscription: UserSubscription,
  limitType: 'chat' | 'documentsAnalyze' | 'documentsGenerate' | 'simulations'
): boolean {
  const limitKey = `${limitType}Limit` as keyof UserSubscription['features']
  const usedKey = `${limitType}Used` as keyof UserSubscription['features']
  
  const limit = subscription.features[limitKey] as number
  const used = subscription.features[usedKey] as number
  
  // Unlimited
  if (limit === -1) return false
  
  // Reached or exceeded limit
  return used >= limit
}

// Get remaining quota
export function getRemainingQuota(
  subscription: UserSubscription,
  limitType: 'chat' | 'documentsAnalyze' | 'documentsGenerate' | 'simulations'
): number | 'unlimited' {
  const limitKey = `${limitType}Limit` as keyof UserSubscription['features']
  const usedKey = `${limitType}Used` as keyof UserSubscription['features']
  
  const limit = subscription.features[limitKey] as number
  const used = subscription.features[usedKey] as number
  
  if (limit === -1) return 'unlimited'
  
  return Math.max(0, limit - used)
}

// React hook for feature gating
export function useFeatureGate(feature: keyof UserSubscription['features']) {
  const [hasAccess, setHasAccess] = useState(false)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch subscription data
    const sub = getUserSubscription()
    setSubscription(sub)
    setHasAccess(hasFeatureAccess(sub, feature))
    setLoading(false)
  }, [feature])

  return { hasAccess, subscription, loading }
}

// React hook for quota checking
export function useQuotaCheck(limitType: 'chat' | 'documentsAnalyze' | 'documentsGenerate' | 'simulations') {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sub = getUserSubscription()
    setSubscription(sub)
    setLoading(false)
  }, [])

  const remaining = subscription ? getRemainingQuota(subscription, limitType) : 0
  const reachedLimit = subscription ? hasReachedLimit(subscription, limitType) : true

  return { subscription, remaining, reachedLimit, loading }
}

// Paywall redirect helper
export function redirectToUpgrade(router: any, reason?: string) {
  const params = reason ? `?reason=${encodeURIComponent(reason)}` : ''
  router.push(`/pricing${params}`)
}

// Get upgrade CTA message
export function getUpgradeMessage(feature: string): string {
  return `Upgrade ke paket Pro untuk akses ${feature}`
}

// Minimum tier required for feature
export function getMinimumTier(feature: keyof UserSubscription['features']): SubscriptionTier {
  if (tierFeatures.pro[feature]) return 'pro'
  if (tierFeatures.enterprise[feature]) return 'enterprise'
  return 'free'
}
