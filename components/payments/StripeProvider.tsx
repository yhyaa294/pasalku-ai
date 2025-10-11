'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ReactNode } from 'react'

// Initialize Stripe with your publishable key
// Note: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY should be set in .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface StripeProviderProps {
  children: ReactNode
}

export function StripeProvider({ children }: StripeProviderProps) {
  const options = {
    // passing the client secret obtained from the server
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Inter:400,500,600&display=swap',
      },
    ],
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#6366f1', // indigo-500
        colorBackground: '#ffffff',
        colorText: '#374151',
        colorDanger: '#dc2626',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '6px',
      },
      rules: {
        '.Input': {
          boxShadow: 'none',
          border: '1px solid #d1d5db',
        },
        '.Input:focus': {
          borderColor: '#6366f1',
          boxShadow: '0 0 0 1px #6366f1',
        },
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}