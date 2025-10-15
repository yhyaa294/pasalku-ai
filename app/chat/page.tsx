'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedChatInterface from '@/components/EnhancedChatInterface';

export default function ChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user');
    if (!userData) {
      // Allow guest access
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
    } catch (error) {
      console.error('Auth error:', error);
      setIsAuthenticated(false);
      setUserRole('public');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLoginRequired = () => {
    router.push('/login');
  };

  const handleClose = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <EnhancedChatInterface
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onClose={handleClose}
        onLoginRequired={handleLoginRequired}
      />
    </div>
  );
}
