'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Loader2, CreditCard, Lock } from 'lucide-react'

interface PaymentFormProps {
  amount: number // in cents
  currency: string
  description: string
  onSuccess: (paymentData: any) => void
  onError: (error: string) => void
  disabled?: boolean
}

export function PaymentForm({
  amount,
  currency,
  description,
  onSuccess,
  onError,
  disabled = false
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      onError('Stripe has not been initialized')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Create payment intent from backend
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { client_secret } = await response.json()

      // Confirm payment with Stripe
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      })

      if (result.error) {
        setMessage(result.error.message || 'Payment failed')
        onError(result.error.message || 'Payment failed')
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!')
        onSuccess({
          paymentIntentId: result.paymentIntent.id,
          amount: result.paymentIntent.amount,
          currency: result.paymentIntent.currency
        })
      } else {
        setMessage('Payment processing...')
      }
    } catch (error: any) {
      setMessage('An unexpected error occurred')
      onError(error.message || 'An unexpected error occurred')
    }

    setLoading(false)
  }

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span>Loading payment form...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Details
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Lock className="w-4 h-4 mr-1" />
            Secured by Stripe
          </div>
        </div>

        {/* Payment amount display */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">{description}</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatAmount(amount, currency)}
            </span>
          </div>
        </div>

        {/* Stripe Payment Element - Disabled temporarily */}
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-gray-500">
          Payment integration temporarily disabled
        </div>

        {/* Error/Success message */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('failed') || message.includes('error')
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          }`}>
            <p className={`text-sm ${
              message.includes('failed') || message.includes('error')
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Payment button */}
        <button
          type="submit"
          disabled={!stripe || loading || disabled}
          className="w-full flex items-center justify-center px-6 py-3 mt-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay {formatAmount(amount, currency)}
            </>
          )}
        </button>

        <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
          <Lock className="w-3 h-3 mr-1" />
          Your payment information is secure and encrypted
        </div>
      </div>
    </form>
  )
}