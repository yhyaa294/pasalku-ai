/**
 * GoPay QR Payment Handler
 * TypeScript module for handling GoPay QR payments with unified transaction interface
 */

export interface GoPayQRRequest {
  amount: number;
  orderId: string;
  description?: string;
  expiryMinutes?: number;
}

export interface GoPayQRResponse {
  success: boolean;
  qrId?: string;
  qrString?: string;
  qrUrl?: string;
  amount?: number;
  orderId?: string;
  expiryTime?: string;
  status?: string;
  error?: string;
}

export interface PaymentStatus {
  success: boolean;
  qrId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'TIMEOUT';
  transactionId?: string;
  paidAmount?: number;
  paidAt?: string;
  metadata?: Record<string, any>;
  error?: string;
}

export interface UnifiedTransaction {
  provider: string;
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  qrCode?: string;
  qrUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookCallback {
  qrId: string;
  status: string;
  transactionId?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

export class GoPayPaymentHandler {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = '/api/payments/gopay', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GOPAY_API_KEY || '';
  }

  /**
   * Request QR code for payment
   */
  async requestQRCode(request: GoPayQRRequest): Promise<GoPayQRResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: request.amount,
          order_id: request.orderId,
          description: request.description || 'Pasalku AI Payment',
          expiry_minutes: request.expiryMinutes || 15,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create QR code',
        };
      }

      return {
        success: true,
        qrId: data.qr_id,
        qrString: data.qr_string,
        qrUrl: data.qr_url,
        amount: data.amount,
        orderId: data.order_id,
        expiryTime: data.expiry_time,
        status: data.status,
      };
    } catch (error) {
      console.error('GoPay QR request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check payment status
   */
  async checkStatus(qrId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${qrId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          qrId,
          status: 'FAILED',
          error: data.error || 'Failed to check status',
        };
      }

      return {
        success: true,
        qrId,
        status: data.status,
        transactionId: data.transaction_id,
        paidAmount: data.paid_amount,
        paidAt: data.paid_at,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('GoPay status check failed:', error);
      return {
        success: false,
        qrId,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Poll payment status with automatic retries
   */
  async pollStatus(
    qrId: string,
    options: {
      maxAttempts?: number;
      intervalMs?: number;
      onStatusUpdate?: (status: PaymentStatus) => void;
    } = {}
  ): Promise<PaymentStatus> {
    const { maxAttempts = 60, intervalMs = 5000, onStatusUpdate } = options;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.checkStatus(qrId);

      // Call status update callback if provided
      if (onStatusUpdate) {
        onStatusUpdate(status);
      }

      // Return if payment is completed (success, failed, or expired)
      if (status.status !== 'PENDING') {
        return status;
      }

      // Wait before next poll
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    // Timeout reached
    return {
      success: false,
      qrId,
      status: 'TIMEOUT',
      error: 'Payment polling timeout',
    };
  }

  /**
   * Handle webhook callback from GoPay
   */
  async handleWebhook(callback: WebhookCallback): Promise<{
    success: boolean;
    action: string;
    qrId: string;
    transactionId?: string;
    reason?: string;
  }> {
    try {
      // Process webhook data
      const { qrId, status, transactionId, failureReason } = callback;

      switch (status) {
        case 'SUCCESS':
          // Payment completed successfully
          return {
            success: true,
            action: 'payment_completed',
            qrId,
            transactionId,
          };

        case 'FAILED':
          // Payment failed
          return {
            success: true,
            action: 'payment_failed',
            qrId,
            reason: failureReason,
          };

        default:
          // Other status updates
          return {
            success: true,
            action: 'status_update',
            qrId,
          };
      }
    } catch (error) {
      console.error('Webhook handling failed:', error);
      return {
        success: false,
        action: 'error',
        qrId: callback.qrId,
      };
    }
  }

  /**
   * Create unified transaction object
   */
  createUnifiedTransaction(data: GoPayQRResponse): UnifiedTransaction {
    return {
      provider: 'gopay',
      transactionId: data.qrId || '',
      orderId: data.orderId || '',
      amount: data.amount || 0,
      currency: 'IDR',
      status: data.status || 'PENDING',
      qrCode: data.qrString,
      qrUrl: data.qrUrl,
      metadata: {
        expiryTime: data.expiryTime,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Convert GoPay status to unified status
   */
  static normalizeStatus(gopayStatus: string): string {
    switch (gopayStatus) {
      case 'SUCCESS':
        return 'completed';
      case 'FAILED':
        return 'failed';
      case 'PENDING':
        return 'pending';
      case 'EXPIRED':
        return 'expired';
      default:
        return 'unknown';
    }
  }
}

// Default export
export default GoPayPaymentHandler;

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateOrderId = (prefix: string = 'PASALKU'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};