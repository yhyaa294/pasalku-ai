import { NextRequest, NextResponse } from 'next/server';

// Define the context type for clarity
interface RouteContext {
  params: {
    qrId: string;
  };
}

/**
 * @swagger
 * /api/payments/gopay/status/{qrId}:
 *   get:
 *     summary: Get GoPay QR payment status
 *     description: Checks the status of a GoPay transaction using the QR ID.
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: qrId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique QR ID of the transaction.
 *     responses:
 *       200:
 *         description: Successful response with transaction status.
 *       404:
 *         description: Transaction not found.
 *       500:
 *         description: Internal server error.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { qrId } = context.params;

  if (!qrId) {
    return NextResponse.json({ error: 'QR ID is required' }, { status: 400 });
  }

  try {
    // This is a placeholder for your actual GoPay status check logic
    const paymentStatus = await getGopayStatus(qrId);

    if (!paymentStatus) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      status: paymentStatus.transaction_status,
    });
  } catch (error) {
    console.error(`[GoPay Status Error] for qrId ${qrId}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Dummy function to simulate fetching GoPay status
async function getGopayStatus(qrId: string) {
    console.log(`Fetching status for QR ID: ${qrId}`);
    
    if (qrId.includes('success')) {
        return { transaction_status: 'success' };
    }
    
    return { transaction_status: 'pending' };
}