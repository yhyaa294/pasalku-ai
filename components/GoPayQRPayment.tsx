'use client';

import React, { useState, useEffect } from 'react';
import { GoPayPaymentHandler, GoPayQRRequest, PaymentStatus, UnifiedTransaction } from '@/lib/gopay-payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, QrCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatCurrency, generateOrderId } from '@/lib/gopay-payment';

interface GoPayQRPaymentProps {
  amount: number;
  orderId?: string;
  description?: string;
  onSuccess?: (transaction: UnifiedTransaction) => void;
  onFailure?: (error: string) => void;
  onStatusUpdate?: (status: PaymentStatus) => void;
}

export const GoPayQRPayment: React.FC<GoPayQRPaymentProps> = ({
  amount,
  orderId,
  description = 'Pasalku AI Payment',
  onSuccess,
  onFailure,
  onStatusUpdate,
}) => {
  const [paymentHandler] = useState(() => new GoPayPaymentHandler());
  const [qrData, setQrData] = useState<UnifiedTransaction | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate QR code on mount
  useEffect(() => {
    generateQR();
  }, [amount, orderId]);

  const generateQR = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const request: GoPayQRRequest = {
        amount,
        orderId: orderId || generateOrderId(),
        description,
        expiryMinutes: 15,
      };

      const response = await paymentHandler.requestQRCode(request);

      if (response.success) {
        const transaction = paymentHandler.createUnifiedTransaction(response);
        setQrData(transaction);
        startPolling(response.qrId!);
      } else {
        setError(response.error || 'Failed to generate QR code');
        onFailure?.(response.error || 'Failed to generate QR code');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onFailure?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = (qrId: string) => {
    setIsPolling(true);

    paymentHandler.pollStatus(qrId, {
      maxAttempts: 60, // 5 minutes with 5s intervals
      intervalMs: 5000,
      onStatusUpdate: (status) => {
        setPaymentStatus(status);
        onStatusUpdate?.(status);

        if (status.status === 'SUCCESS') {
          setIsPolling(false);
          onSuccess?.(paymentHandler.createUnifiedTransaction({
            success: true,
            qrId: status.qrId,
            status: status.status,
            orderId: qrData?.orderId,
            amount: qrData?.amount,
          }));
        } else if (status.status === 'FAILED' || status.status === 'EXPIRED' || status.status === 'TIMEOUT') {
          setIsPolling(false);
          onFailure?.(`Payment ${status.status.toLowerCase()}`);
        }
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'default';
      case 'FAILED':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Payment Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateQR} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          GoPay QR Payment
        </CardTitle>
        <CardDescription>
          Amount: {formatCurrency(amount)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Generating QR Code...</span>
          </div>
        )}

        {qrData && !isLoading && (
          <>
            {/* QR Code Display */}
            <div className="flex justify-center">
              {qrData.qrUrl ? (
                <img
                  src={qrData.qrUrl}
                  alt="GoPay QR Code"
                  className="w-48 h-48 border rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 border rounded-lg flex items-center justify-center bg-gray-100">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Payment Instructions */}
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open GoPay app on your phone</li>
                <li>Scan the QR code above</li>
                <li>Complete the payment</li>
              </ol>
            </div>

            {/* Payment Status */}
            {paymentStatus && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(paymentStatus.status)}
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge variant={getStatusBadgeVariant(paymentStatus.status)}>
                  {paymentStatus.status}
                </Badge>
              </div>
            )}

            {/* Polling Indicator */}
            {isPolling && (
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Waiting for payment...</span>
              </div>
            )}

            {/* Order Details */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Order ID: {qrData.orderId}</p>
              {qrData.metadata?.expiryTime && (
                <p>
                  Expires: {new Date(qrData.metadata.expiryTime).toLocaleTimeString()}
                </p>
              )}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={generateQR}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Refresh QR'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoPayQRPayment;