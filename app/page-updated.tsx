'use client';

import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { StatisticsSection } from '@/components/statistics-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { Footer } from '@/components/footer';
import { useEffect, useState } from 'react';

import ChatInterface from '@/components/ChatInterfaceFixed';

export default function PasalkuLandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Check authentication status
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.isAuthenticated) {
          setIsAuthenticated(true);
          setUserRole('public');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/login';
  };

  const handleChatClick = () => {
    if (isAuthenticated) {
      setShowChat(true);
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-x-hidden relative">
      <Navigation
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogin={handleLogin}
        onChatClick={handleChatClick}
      />

      <main className="relative z-10">
        <HeroSection onGetStarted={handleChatClick} />
        <StatisticsSection />
        <HowItWorksSection />
      </main>

      <Footer />

      {showChat && (
        <ChatInterface
          onClose={() => setShowChat(false)}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          onLoginRequired={handleLogin}
        />
      )}
    </div>
  );
}

