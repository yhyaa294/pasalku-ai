'use client';

import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { StatisticsSection } from '@/components/statistics-section';
import { FeaturesSection } from '@/components/features-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { PricingSection } from '@/components/pricing-section';
import { Footer } from '@/components/footer';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    // Enhanced scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all scroll-animate elements
    const animateElements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
    );
    animateElements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => observer.disconnect();
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background text-foreground overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTAwLCAxMTUsIDE5NSwgMC4wOCkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-30" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => {
          const emojis = ["⚖", "⚡", "📜", "⚔️", "🔍", "📚", "🏛️", "⚖️"];
          const positions = [
            { left: "10%", top: "20%" },
            { left: "80%", top: "15%" },
            { left: "25%", top: "60%" },
            { left: "70%", top: "40%" },
            { left: "45%", top: "10%" },
            { left: "15%", top: "80%" },
            { left: "85%", top: "70%" },
            { left: "60%", top: "25%" },
            { left: "30%", top: "45%" },
            { left: "75%", top: "85%" },
            { left: "5%", top: "35%" },
            { left: "90%", top: "55%" },
            { left: "40%", top: "75%" },
            { left: "65%", top: "5%" },
            { left: "20%", top: "90%" },
            { left: "95%", top: "30%" },
            { left: "50%", top: "65%" },
            { left: "35%", top: "15%" },
            { left: "78%", top: "90%" },
            { left: "12%", top: "50%" }
          ];

          return (
            <div
              key={i}
              className="absolute text-emerald-400/20 text-2xl animate-float"
              style={{
                left: positions[i]?.left || `${Math.floor(i * 4.5) * 10}%`,
                top: positions[i]?.top || `${Math.floor(i * 2.5) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${15 + (i * 2)}s`,
              }}
            >
              {emojis[i % emojis.length]}
            </div>
          );
        })}
      </div>

      <Navigation
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogin={handleLogin}
        onChatClick={handleChatClick}
      />

      <main>
        <HeroSection onGetStarted={handleChatClick} />
        <StatisticsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
      </main>

      <Footer />

      {/* Chat Interface */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-full max-w-md h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Pasalku.ai</h3>
              <p className="text-sm opacity-90">Konsultasi Hukum Profesional</p>
              <p className="text-xs opacity-75">Muhammad Syarifuddin Yahya</p>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
          <ChatInterface
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            onClose={() => setShowChat(false)}
            onLoginRequired={() => window.location.href = '/login'}
          />
        </div>
      )}

      {/* Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 z-40 hover:shadow-xl"
          aria-label="Buka Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </div>
  )
}
