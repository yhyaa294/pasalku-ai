'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import { SubscriptionPlans } from './SubscriptionPlans'
import { PaymentForm } from './PaymentForm'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

type PaymentStep = 'select-plan' | 'payment' | 'processing' | 'success' | 'error'

interface PaymentPageProps {
  onPaymentStart?: () => void
  onPaymentSuccess?: (data: any) => void
  onPaymentError?: (error: string) => void
}

export function PaymentPage({
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError
}: PaymentPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stripe = useStripe()
  const elements = useElements()

  const [currentStep, setCurrentStep] = useState<PaymentStep>('select-plan')
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  // Check for plan from URL
  useEffect(() => {
    const planFromUrl = searchParams.get('plan')
    if (planFromUrl) {
      setSelectedPlan(planFromUrl)
      setCurrentStep('payment')
    }
  }, [searchParams])

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    setCurrentStep('payment')
    onPaymentStart?.()
  }

  const handlePaymentSuccess = (data: any) => {
    setPaymentData(data)
    setCurrentStep('success')
    onPaymentSuccess?.(data)
  }

  const handlePaymentError = (error: string) => {
    setError(error)
    setCurrentStep('error')
    onPaymentError?.(error)
  }

  const handleBackToPlans = () => {
    setCurrentStep('select-plan')
    setSelectedPlan('')
    setError('')
  }

  const handleTryAgain = () => {
    setCurrentStep('payment')
    setError('')
  }

  const getPlanDetails = (planId: string) => {
    const plans = {
      consultation_basic: {
        amount: 2500, // $25.00 in cents
        currency: 'usd',
        description: 'Basic Legal Consultation'
      },
      premium_monthly: {
        amount: 9900, // $99.00 in cents
        currency: 'usd',
        description: 'Premium Monthly Subscription'
      },
      enterprise_yearly: {
        amount: 99900, // $999.00 in cents
        currency: 'usd',
        description: 'Enterprise Yearly Subscription'
      }
    }
    return plans[planId as keyof typeof plans] || plans.consultation_basic
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'select-plan':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Select the perfect plan for your legal consultation needs
              </p>
            </div>
            <SubscriptionPlans
              selectedPlan={selectedPlan}
              onPlanSelect={handlePlanSelect}
            />
          </div>
        )

      case 'payment':
        const planDetails = getPlanDetails(selectedPlan)
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBackToPlans}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Plans
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
              <p className="text-muted-foreground">
                Secure payment powered by Stripe
              </p>
            </div>

            <PaymentForm
              amount={planDetails.amount}
              currency={planDetails.currency}
              description={planDetails.description}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        )

      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h2 className="text-xl font-semibold">Processing Payment...</h2>
            <p className="text-muted-foreground text-center">
              Please don't close this window while we process your payment.
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your payment. Your legal consultation access is now active.
              </p>
              {paymentData && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm">
                  <p><strong>Payment ID:</strong> {paymentData.paymentIntentId}</p>
                  <p><strong>Amount:</strong> ${(paymentData.amount / 100).toFixed(2)}</p>
                  <p><strong>Currency:</strong> {paymentData.currency.toUpperCase()}</p>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/consult')}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Start Consultation
              </button>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
              <p className="text-muted-foreground mb-6 max-w-md">
                We couldn't process your payment. Please try again or contact support if the problem persists.
              </p>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-sm mb-6">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleTryAgain}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleBackToPlans}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Choose Different Plan
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {renderStep()}
      </div>
    </div>
  )
}