import { NextRequest, NextResponse } from 'next/server';

// Mock GoPay service for demonstration
class MockGoPayService {
  static async check_payment_status(qrId: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock status response - randomly succeed after some time
    const isSuccess = Math.random() > 0.7; // 30% chance of success
    const statuses = ['PENDING', 'SUCCESS', 'FAILED', 'EXPIRED'];
    const randomStatus = isSuccess ? 'SUCCESS' : statuses[Math.floor(Math.random() * statuses.length)];

    return {
      success: true,
      qr_id: qrId,
      status: randomStatus,
      transaction_id: randomStatus === 'SUCCESS' ? `TXN-${Date.now()}` : null,
      paid_amount: randomStatus === 'SUCCESS' ? 50000 : null,
      paid_at: randomStatus === 'SUCCESS' ? new Date().toISOString() : null,
      metadata: { source: 'pasalku_demo' }
    };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { qrId: string } }
) {
  try {
    const qrId = params.qrId;

    if (!qrId) {
      return NextResponse.json(
        { error: 'QR ID is required' },
        { status: 400 }
      );
    }

    // Initialize GoPay service
    const result = await MockGoPayService.check_payment_status(qrId);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: 'Status check failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('GoPay status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}