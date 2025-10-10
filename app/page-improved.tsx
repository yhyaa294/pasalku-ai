'use client';

import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { StatisticsSection } from '@/components/statistics-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { CTASection } from '@/components/cta-section';
import { Footer } from '@/components/footer';
import { useEffect, useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export default function PasalkuLandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public');
  const [showChat, setShowChat] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

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

    // Check welcome popup - show only once
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      // Show welcome popup after a short delay
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
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
    // Direct demo mode - bypass authentication
    console.log("Demo Mode: Direct access to chat from landing page");
    localStorage.setItem('token', 'demo-jwt-token-mvp');
    localStorage.setItem('user', JSON.stringify({
      email: 'demo@pasalku.ai',
      name: 'Pengguna Demo',
      role: 'user',
      isAuthenticated: true
    }));
    window.location.href = '/chat';
  };

  const handleWelcomeClose = () => {
    setShowWelcomePopup(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleWelcomeStart = () => {
    setShowWelcomePopup(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    handleChatClick();
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

      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative transform animate-scale-in border border-orange-200">
            {/* Close button */}
            <button
              onClick={handleWelcomeClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
              aria-label="Tutup popup"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Welcome emoji */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl animate-bounce">👋</span>
              </div>
            </div>

            {/* Welcome message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Selamat Datang di Pasalku.ai!
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Siap mencari kejelasan hukum Anda?
              <span className="block text-orange-600 font-medium animate-pulse">
                Konsultasi gratis sekarang!
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWelcomeStart}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Mulai Sekarang
                </div>
              </button>
              <button
                onClick={handleWelcomeClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium"
              >
                Nanti Saja
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full opacity-20 animate-ping animation-delay-500"></div>
          </div>
        </div>
      )}

      {/* Enhanced Chat Interface Placeholder */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white p-4 flex justify-between items-center">
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
          <div className="flex-1 overflow-hidden">
            <p className="p-4 text-center text-gray-600">Chat interface akan segera dimuat...</p>
          </div>
        </div>
      )}

      {/* Sticky Chat Support Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 z-40 hover:shadow-2xl group animate-bounce hover:animate-none"
          aria-label="Buka Chat Support"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center animate-pulse font-bold shadow-lg">
            AI
          </div>
          {/* Pulsing rings for attention */}
          <div className="absolute inset-0 rounded-full border-2 border-orange-400 opacity-0 group-hover:opacity-50 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border border-yellow-400 opacity-0 group-hover:opacity-30 animate-ping animation-delay-300"></div>
        </button>
      )}

      {/* Loading Spinner (shown briefly on page load) */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full opacity-0 animate-spin"
             style={{ animation: 'spin 1s linear infinite, fadeOut 0.5s ease-in-out 1.5s forwards' }}>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeOut {
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
