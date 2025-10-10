'use client';

import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { StatisticsSection } from '@/components/statistics-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { CTASection } from '@/components/cta-section';
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-blue-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4+')] opacity-40" />
      </div>

      {/* Legal-themed floating elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[
          { emoji: "⚖️", label: "Keadilan" },
          { emoji: "📜", label: "Konstitusi" },
          { emoji: "🏛️", label: "Mahkamah" },
          { emoji: "📚", label: "Peraturan" },
          { emoji: "🔍", label: "Investigasi" },
          { emoji: "⚔️", label: "Advokasi" },
          { emoji: "📋", label: "Dokumentasi" },
          { emoji: "🕯️", label: "Kebenaran" },
          { emoji: "⚡", label: "Cepat" },
          { emoji: "🛡️", label: "Proteksi" },
          { emoji: "🎯", label: "Akurat" },
          { emoji: "🌟", label: "Terpercaya" }
        ].map((item, i) => {
          const positions = [
            { left: "8%", top: "15%" },
            { left: "85%", top: "12%" },
            { left: "20%", top: "65%" },
            { left: "75%", top: "35%" },
            { left: "40%", top: "8%" },
            { left: "12%", top: "82%" },
            { left: "88%", top: "68%" },
            { left: "55%", top: "22%" },
            { left: "28%", top: "48%" },
            { left: "72%", top: "88%" },
            { left: "5%", top: "32%" },
            { left: "92%", top: "52%" }
          ];

          return (
            <div
              key={i}
              className="absolute group cursor-pointer"
              style={{
                left: positions[i]?.left || `${Math.floor(i * 7.5) * 10}%`,
                top: positions[i]?.top || `${Math.floor(i * 3.5) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${18 + (i * 3)}s`,
              }}
            >
              <div className="text-3xl animate-float hover:scale-110 transition-transform duration-300">
                {item.emoji}
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.label}
              </div>
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
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection onGetStarted={handleChatClick} />
      </main>

      <Footer />

      {/* Enhanced Chat Interface */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-4 flex justify-between items-center">
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

      {/* Enhanced Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 z-40 hover:shadow-xl group"
          aria-label="Buka Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            AI
          </div>
        </button>
      )}
    </div>
  )
}
