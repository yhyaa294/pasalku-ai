import { NextRequest, NextResponse } from 'next/server';

// Mock GoPay service for demonstration
// In production, this would integrate with actual GoPay API
class MockGoPayService {
  static async create_qr_payment(amount: number, order_id: string, description: string, expiry_minutes: number) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful response
    return {
      success: true,
      qr_id: `QR-${Date.now()}`,
      qr_string: `00020101021126740014BR.CO.GOPAY.WWW011893600914123456789002152050000000000303UME51440014BR.CO.GOPAY.WWW0215ID10212345678900303UME5204549953033605406${amount}5802ID5914PASALKU AI DEMO6007JAKARTA61051234562250125${order_id}6304ABCD`,
      qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=QR-${Date.now()}`,
      amount: amount,
      order_id: order_id,
      expiry_time: new Date(Date.now() + expiry_minutes * 60 * 1000).toISOString(),
      status: "PENDING"
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, order_id, description, expiry_minutes } = body;

    // Validate required fields
    if (!amount || !order_id) {
      return NextResponse.json(
        { error: 'Amount and order_id are required' },
        { status: 400 }
      );
    }

    // Initialize GoPay service
    const result = await MockGoPayService.create_qr_payment(
      parseInt(amount),
      order_id,
      description || 'Pasalku AI Payment',
      expiry_minutes || 15
    );

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: 'Payment creation failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('GoPay QR creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}