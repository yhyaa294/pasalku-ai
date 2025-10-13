import { NextRequest, NextResponse } from 'next/server';

// Mock GoPay service for demonstration
class MockGoPayService {
  static async handle_webhook(webhookData: any) {
    // Simulate webhook processing
    await new Promise(resolve => setTimeout(resolve, 200));

    const { qr_id, status } = webhookData;

    switch (status) {
      case 'SUCCESS':
        return {
          success: true,
          action: 'payment_completed',
          qr_id,
          transaction_id: `TXN-${Date.now()}`
        };
      case 'FAILED':
        return {
          success: true,
          action: 'payment_failed',
          qr_id,
          reason: 'Payment failed'
        };
      default:
        return {
          success: true,
          action: 'status_update',
          qr_id
        };
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();

    // Log webhook for debugging (remove in production)
    console.log('GoPay Webhook received:', webhookData);

    // Initialize GoPay service
    const result = await MockGoPayService.handle_webhook(webhookData);

    if (result.success) {
      // Return appropriate response based on action
      switch (result.action) {
        case 'payment_completed':
          // Here you would typically:
          // 1. Update database with payment completion
          // 2. Send confirmation email/SMS
          // 3. Update user subscription status
          // 4. Trigger any post-payment workflows

          console.log(`Payment completed for QR: ${result.qr_id}, Transaction: ${result.transaction_id}`);
          break;

        case 'payment_failed':
          // Handle failed payment
          console.log(`Payment failed for QR: ${result.qr_id}, Reason: ${result.reason}`);
          break;

        default:
          console.log(`Status update for QR: ${result.qr_id}, Status: ${webhookData.status}`);
      }

      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully',
        action: result.action
      });
    } else {
      console.error('Webhook processing failed');
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('GoPay webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}