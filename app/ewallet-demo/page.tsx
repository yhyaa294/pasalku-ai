'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import UnifiedEwalletPayment from '@/components/UnifiedEwalletPayment';

export default function EwalletDemoPage() {
  const [amount, setAmount] = useState<string>('50000');
  const [orderId, setOrderId] = useState<string>(`PASALKU-${Date.now()}`);
  const [description, setDescription] = useState<string>('Pasalku AI Premium Subscription');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handlePaymentSuccess = (transaction: any) => {
    setPaymentResult({
      success: true,
      transaction,
      timestamp: new Date().toISOString(),
    });
    setShowPayment(false);
  };

  const handlePaymentFailure = (error: string) => {
    setPaymentResult({
      success: false,
      error,
      timestamp: new Date().toISOString(),
    });
  };

  const resetDemo = () => {
    setPaymentResult(null);
    setShowPayment(false);
    setOrderId(`PASALKU-${Date.now()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CreditCard className="h-6 w-6" />
              E-wallet Payment Integration Demo
            </CardTitle>
            <CardDescription>
              Test Indonesian e-wallet payments with GoPay, OVO, DANA, and ShopeePay
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure your payment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (IDR)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="PASALKU-123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Payment description"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowPayment(true)}
                  className="flex-1"
                  disabled={!amount || !orderId}
                >
                  Start Payment
                </Button>
                <Button
                  onClick={resetDemo}
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Result */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Result</CardTitle>
              <CardDescription>
                {paymentResult ? 'Latest payment attempt' : 'No payment attempts yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {paymentResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <Badge variant={paymentResult.success ? 'default' : 'destructive'}>
                      {paymentResult.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>

                  {paymentResult.success ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>Provider:</strong> {paymentResult.transaction?.provider}</p>
                      <p><strong>Order ID:</strong> {paymentResult.transaction?.order_id}</p>
                      <p><strong>Amount:</strong> Rp {paymentResult.transaction?.amount?.toLocaleString('id-ID')}</p>
                      <p><strong>Status:</strong> {paymentResult.transaction?.status}</p>
                      <p><strong>Timestamp:</strong> {new Date(paymentResult.timestamp).toLocaleString('id-ID')}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <p><strong>Error:</strong> {paymentResult.error}</p>
                      <p><strong>Timestamp:</strong> {new Date(paymentResult.timestamp).toLocaleString('id-ID')}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <Clock className="h-8 w-8 mr-2" />
                  <span>Waiting for payment...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Interface */}
        {showPayment && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Interface</CardTitle>
              <CardDescription>
                Complete your payment using the selected e-wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UnifiedEwalletPayment
                amount={parseInt(amount)}
                orderId={orderId}
                description={description}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
            </CardContent>
          </Card>
        )}

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Supported E-wallet Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">GoPay</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• QR Code Payment</li>
                  <li>• Real-time Status</li>
                  <li>• Webhook Support</li>
                  <li>• Active ✅</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">OVO</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Push to Pay</li>
                  <li>• Instant Transfer</li>
                  <li>• Mobile Optimized</li>
                  <li>• Coming Soon</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">DANA</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• QR Code Payment</li>
                  <li>• Fast Checkout</li>
                  <li>• High Success Rate</li>
                  <li>• Coming Soon</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">ShopeePay</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• QR Code Payment</li>
                  <li>• Shopee Ecosystem</li>
                  <li>• Instant Processing</li>
                  <li>• Coming Soon</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}