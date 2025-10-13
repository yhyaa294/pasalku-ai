import { NextRequest, NextResponse } from 'next/server';

// Temporary implementation - will be replaced with actual unified service
const availableProviders = ['gopay', 'ovo', 'dana', 'shopeepay'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, amount, order_id, description, expiry_minutes } = body;

    // Validate required fields
    if (!provider || !amount || !order_id) {
      return NextResponse.json(
        {
          error: 'Provider, amount, and order_id are required',
          available_providers: availableProviders
        },
        { status: 400 }
      );
    }

    // Validate provider
    if (!availableProviders.includes(provider.toLowerCase())) {
      return NextResponse.json(
        {
          error: `Unsupported provider: ${provider}`,
          available_providers: availableProviders
        },
        { status: 400 }
      );
    }

    // For now, redirect to specific provider endpoint
    // In production, this would use the unified service
    const providerEndpoints: Record<string, string> = {
      gopay: '/api/payments/gopay/qr',
      ovo: '/api/payments/ovo/push',
      dana: '/api/payments/dana/qr',
      shopeepay: '/api/payments/shopeepay/qr'
    };

    const endpoint = providerEndpoints[provider.toLowerCase()];

    return NextResponse.json({
      success: true,
      message: `Redirecting to ${provider} payment`,
      provider,
      endpoint,
      amount: parseInt(amount),
      order_id,
      description: description || 'Pasalku AI Payment',
      expiry_minutes: expiry_minutes || 15
    });

  } catch (error) {
    console.error('Unified e-wallet payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to list available providers
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      providers: availableProviders,
      details: {
        gopay: { name: "GoPay", status: "active", features: ["QR Payment", "Webhook"] },
        ovo: { name: "OVO", status: "coming_soon", features: ["Push to Pay"] },
        dana: { name: "DANA", status: "coming_soon", features: ["QR Payment"] },
        shopeepay: { name: "ShopeePay", status: "coming_soon", features: ["QR Payment"] }
      }
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}