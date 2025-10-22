'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EnhancedChatInterface from '@/components/EnhancedChatInterface';

export default function AIChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = searchParams?.get('prefill') || '';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setIsAuthenticated(false);
      setUserRole('public');
      setIsLoading(false);
      return;
    }
    try {
      const user = JSON.parse(userData);
      if (user.isAuthenticated) {
        setIsAuthenticated(true);
        setUserRole(user.role || 'public');
      } else {
        setIsAuthenticated(false);
        setUserRole('public');
      }
    } catch (_) {
      setIsAuthenticated(false);
      setUserRole('public');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoginRequired = () => router.push('/login');
  const handleClose = () => router.push('/');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Memuat AI Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <EnhancedChatInterface
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onClose={handleClose}
        onLoginRequired={handleLoginRequired}
        prefillInput={prefill}
      />
    </div>
  );
}
