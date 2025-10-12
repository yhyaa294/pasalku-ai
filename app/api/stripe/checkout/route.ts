import { NextRequest, NextResponse } from 'next/server'

// Create Stripe checkout session (subscription) with graceful env checks
export async function POST(req: NextRequest) {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = await req.json()

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe belum dikonfigurasi' }, { status: 501 })
    }

    if (!priceId) {
      return NextResponse.json({ error: 'priceId wajib diisi' }, { status: 400 })
    }

    // Import stripe only if key exists
    const stripeModule = await import('stripe')
    const stripe = new stripeModule.default(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-06-20',
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${baseUrl}/pricing?status=success`,
      cancel_url: cancelUrl || `${baseUrl}/pricing?status=cancel`,
      customer_email: customerEmail,
    })

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: error?.message || 'Gagal membuat checkout session' }, { status: 500 })
  }
}
