'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, QrCode, Smartphone, CreditCard } from 'lucide-react';
import GoPayQRPayment from './GoPayQRPayment';

interface EwalletProvider {
  name: string;
  displayName: string;
  status: 'active' | 'coming_soon';
  features: string[];
  icon: React.ReactNode;
}

interface UnifiedEwalletPaymentProps {
  amount: number;
  orderId?: string;
  description?: string;
  onSuccess?: (transaction: any) => void;
  onFailure?: (error: string) => void;
}

export const UnifiedEwalletPayment: React.FC<UnifiedEwalletPaymentProps> = ({
  amount,
  orderId,
  description = 'Pasalku AI Payment',
  onSuccess,
  onFailure,
}) => {
  const [providers, setProviders] = useState<EwalletProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/payments/ewallet');
        const data = await response.json();

        if (data.success) {
          const providerList: EwalletProvider[] = Object.entries(data.details).map(([key, details]: [string, any]) => ({
            name: key,
            displayName: details.name,
            status: details.status,
            features: details.features,
            icon: getProviderIcon(key),
          }));

          setProviders(providerList);

          // Auto-select first active provider
          const activeProvider = providerList.find(p => p.status === 'active');
          if (activeProvider) {
            setSelectedProvider(activeProvider.name);
          }
        } else {
          setError('Failed to load payment providers');
        }
      } catch (err) {
        setError('Network error while loading providers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const getProviderIcon = (providerName: string): React.ReactNode => {
    switch (providerName) {
      case 'gopay':
        return <QrCode className="h-5 w-5 text-green-600" />;
      case 'ovo':
        return <Smartphone className="h-5 w-5 text-purple-600" />;
      case 'dana':
        return <QrCode className="h-5 w-5 text-blue-600" />;
      case 'shopeepay':
        return <CreditCard className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handleProviderPayment = async () => {
    if (!selectedProvider) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/ewallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: selectedProvider,
          amount,
          order_id: orderId || `PASALKU-${Date.now()}`,
          description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // For now, just show success message
        // In production, this would redirect to specific provider component
        onSuccess?.(data);
      } else {
        setError(data.error || 'Payment request failed');
        onFailure?.(data.error || 'Payment request failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onFailure?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && providers.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading payment options...</span>
        </CardContent>
      </Card>
    );
  }

  if (error && providers.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If GoPay is selected, show the specific GoPay component
  if (selectedProvider === 'gopay') {
    return (
      <GoPayQRPayment
        amount={amount}
        orderId={orderId}
        description={description}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    );
  }

  // Generic provider selection interface
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          E-wallet Payment
        </CardTitle>
        <CardDescription>
          Amount: Rp {amount.toLocaleString('id-ID')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Payment Method</label>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger>
              <SelectValue placeholder="Choose payment method" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem
                  key={provider.name}
                  value={provider.name}
                  disabled={provider.status !== 'active'}
                >
                  <div className="flex items-center gap-2">
                    {provider.icon}
                    <span>{provider.displayName}</span>
                    {provider.status !== 'active' && (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Provider Info */}
        {selectedProvider && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {providers.find(p => p.name === selectedProvider)?.icon}
              <span className="font-medium">
                {providers.find(p => p.name === selectedProvider)?.displayName}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              Features: {providers.find(p => p.name === selectedProvider)?.features.join(', ')}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handleProviderPayment}
          disabled={!selectedProvider || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay with ${providers.find(p => p.name === selectedProvider)?.displayName || 'Selected Method'}`
          )}
        </Button>

        {/* Available Providers List */}
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">Available Methods:</p>
          {providers.map((provider) => (
            <div key={provider.name} className="flex items-center justify-between">
              <span>{provider.displayName}</span>
              <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
                {provider.status === 'active' ? 'Active' : 'Coming Soon'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedEwalletPayment;