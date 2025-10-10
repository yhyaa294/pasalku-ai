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
        {/* Enhanced Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                AI Legal Assistant Terpercaya
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Konsultasi Hukum
                <span className="block text-blue-600">Cerdas & Cepat</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Dapatkan jawaban hukum Indonesia yang akurat dengan teknologi AI terkini.
                Semua jawaban disertai sumber hukum terverifikasi dan disclaimer profesional.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button
                  onClick={handleChatClick}
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center">
                    Mulai Konsultasi
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>

                <button className="group text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                  <span className="flex items-center">
                    Pelajari Lebih Lanjut
                    <svg className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sumber Hukum Terverifikasi
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6.906-6.906L12 8.5l6.906 2.594M12 8.5L5.094 11.094M12 8.5v-2m0 2l6.906-2.594M5.094 11.094L12 8.5m0 0l6.906 2.594M12 15v2m0-2l-6.906-2.594M12 15l6.906 2.594" />
                  </svg>
                  AI yang Akurat
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6.906-6.906L12 8.5l6.906 2.594M12 8.5L5.094 11.094M12 8.5v-2m0 2l6.906-2.594M5.094 11.094L12 8.5m0 0l6.906 2.594M12 15v2m0-2l-6.906-2.594M12 15l6.906 2.594" />
                  </svg>
                  Privasi Terjamin
                </div>
              </div>
            </div>
          </div>
        </section>

        <StatisticsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
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
