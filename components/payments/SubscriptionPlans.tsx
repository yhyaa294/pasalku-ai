'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Award, Loader2 } from 'lucide-react'
import { useStripe } from '@stripe/react-stripe-js'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'one_time' | 'month' | 'year'
  description: string
}

interface SubscriptionPlansProps {
  selectedPlan?: string
  onPlanSelect: (planId: string) => void
}

export function SubscriptionPlans({ selectedPlan, onPlanSelect }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const stripe = useStripe()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/payments/subscription-plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans)
      } else {
        // Fallback plans if API fails
        setPlans([
          {
            id: 'consultation_basic',
            name: 'Basic Consultation',
            price: 2500, // $25.00
            currency: 'usd',
            interval: 'one_time',
            description: 'One-time legal consultation'
          },
          {
            id: 'premium_monthly',
            name: 'Premium Monthly',
            price: 9900, // $99.00
            currency: 'usd',
            interval: 'month',
            description: 'Unlimited consultations for one month'
          },
          {
            id: 'enterprise_yearly',
            name: 'Enterprise Yearly',
            price: 99900, // $999.00
            currency: 'usd',
            interval: 'year',
            description: 'Complete legal assistance package'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, interval: string) => {
    const usdAmount = (price / 100).toFixed(2)

    switch (interval) {
      case 'one_time':
        return `$${usdAmount}`
      case 'month':
        return `$${usdAmount}/mo`
      case 'year':
        const monthly = (price / 100 / 12).toFixed(0)
        return `$${usdAmount}/yr ($${monthly}/mo)`
      default:
        return `$${usdAmount}`
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'premium_monthly':
        return 'from-purple-500 to-pink-500'
      case 'enterprise_yearly':
        return 'from-green-500 to-teal-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const isPopular = (planId: string) => planId === 'premium_monthly'

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading plans...</span>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative glass-card rounded-3xl p-6 md:p-8 border transition-all duration-300 hover-lift cursor-pointer ${
            selectedPlan === plan.id
              ? 'border-primary shadow-2xl scale-105 ring-2 ring-primary/50'
              : 'border-border hover:shadow-xl'
          }`}
          onClick={() => onPlanSelect(plan.id)}
        >
          {isPopular(plan.id) && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full text-white text-sm font-bold animate-cyber-pulse">
                🔥 MOST POPULAR
              </div>
            </div>
          )}

          <div
            className={`w-16 h-16 bg-gradient-to-r ${getPlanColor(plan.id)} rounded-xl flex items-center justify-center mb-4 legal-shadow`}
          >
            <Award className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-bold mb-2 text-primary">
            {plan.name}
          </h3>

          <div className="mb-4">
            <span className="text-4xl font-black">
              {formatPrice(plan.price, plan.interval)}
            </span>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {plan.description}
          </p>

          <div className="space-y-3 mb-6">
            {/* Feature list - you can customize this */}
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm">AI-Powered Legal Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm">Case Law Research</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm">Document Review</span>
            </div>
            {(plan.interval === 'month' || plan.interval === 'year') && (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">Unlimited Consultations</span>
              </div>
            )}
          </div>

          <div className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
            selectedPlan === plan.id
              ? 'bg-primary text-white shadow-lg'
              : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white'
          }`}>
            {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
          </div>
        </div>
      ))}
    </div>
  )
}