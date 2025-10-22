'use client';

import { EnhancedNavigation } from '@/components/enhanced-navigation';
import { HeroSection } from '@/components/hero-section';
import { StatisticsSection } from '@/components/statistics-section';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Performance: split below-the-fold sections into separate chunks
const FeaturesSection = dynamic(() => import('@/components/features-section').then(m => m.FeaturesSection), {
  ssr: true,
  loading: () => <section className="py-20 bg-white dark:bg-slate-950" aria-busy="true" />
});
const HowItWorksSection = dynamic(() => import('@/components/how-it-works-section').then(m => m.HowItWorksSection), {
  ssr: true,
  loading: () => <section className="py-20 bg-gray-50 dark:bg-slate-900" aria-busy="true" />
});
const PricingSection = dynamic(() => import('@/components/pricing-section').then(m => m.PricingSection), {
  ssr: true,
  loading: () => <section className="py-20 bg-white dark:bg-slate-950" aria-busy="true" />
});
const FAQSection = dynamic(() => import('@/components/faq-section').then(m => m.FAQSection), {
  ssr: true,
  loading: () => <section className="py-20 bg-gray-50 dark:bg-slate-900" aria-busy="true" />
});
const TestimonialsSection = dynamic(() => import('@/components/testimonials-section').then(m => m.TestimonialsSection), {
  ssr: true,
  loading: () => <section className="py-20 bg-white dark:bg-slate-950" aria-busy="true" />
});
const CTASection = dynamic(() => import('@/components/cta-section').then(m => m.CTASection), {
  ssr: true,
  loading: () => <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600" aria-busy="true" />
});

export default function PasalkuLandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public');
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'bot' | 'user', text: string }>>([
    {
      type: 'bot',
      text: 'Halo! 👋 Selamat datang di Pasalku.ai!\n\nSaya **Asisten Info Platform** yang siap membantu Anda mengenal Pasalku.ai.\n\n📌 Saya bisa jawab tentang:\n• Apa itu Pasalku.ai\n• Fitur & paket harga\n• Cara menggunakan\n• Keamanan data\n\n⚠️ **Catatan:** Untuk konsultasi hukum, silakan klik tombol "Mulai Konsultasi Hukum" di bawah ya! 😊'
    }
  ]);

  // Handler functions - defined early to avoid hoisting issues
  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleGetStarted = () => {
    // CTA buttons should go to register page
    window.location.href = '/register';
  };

  const handleConsultationClick = () => {
    // All consultation buttons should redirect to login first
    window.location.href = '/login';
  };

  const handleChatClick = () => {
    if (isAuthenticated) {
      setShowChat(true);
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: chatMessage }]);
    
    // Simulate bot response with scope limitation
    setTimeout(() => {
      const lowerMsg = chatMessage.toLowerCase();
      
      // Keywords untuk mendeteksi pertanyaan hukum (BLOCKED)
      const legalKeywords = [
        'hukum', 'pasal', 'undang', 'kontrak', 'gugat', 'perkara', 
        'advokat', 'pengacara', 'pidana', 'perdata', 'perceraian',
        'warisan', 'tanah', 'sertifikat', 'sengketa', 'kasus',
        'tuntut', 'lapor', 'polisi', 'pengadilan', 'hakim'
      ];
      
      const isLegalQuestion = legalKeywords.some(keyword => lowerMsg.includes(keyword));
      
      // Jika bertanya tentang hukum, redirect ke konsultasi
      if (isLegalQuestion) {
        const response = '⚠️ Maaf, saya hanya asisten info platform. Untuk pertanyaan hukum, silakan:\n\n🚀 Klik tombol "Mulai Konsultasi Hukum" di bawah untuk akses AI Legal Assistant penuh yang bisa menjawab pertanyaan hukum Anda dengan akurat! 😊';
        setMessages(prev => [...prev, { type: 'bot', text: response }]);
        setChatMessage('');
        return;
      }

      // Responses untuk info platform (ALLOWED)
      const responses: { [key: string]: string } = {
        'tentang': '🤖 **Pasalku.ai** adalah platform konsultasi hukum berbasis AI terkini di Indonesia!\n\n✅ Solusi hukum cepat & akurat\n✅ Teknologi AI terdepan\n✅ Mudah & terjangkau\n✅ 24/7 tersedia\n\nKami membantu Anda memahami hak-hak hukum dengan cara yang modern!',
        
        'fitur': '✨ **Fitur Utama Kami:**\n\n🤖 AI Legal Assistant 24/7\n📄 Analisis Dokumen Otomatis\n🔍 Riset Hukum Cerdas\n📊 Prediksi Kasus AI\n💼 Legal Templates\n📚 Knowledge Base Lengkap\n\n...dan 40+ fitur lainnya! 🚀',
        
        'harga': '💰 **Paket Kami:**\n\n🆓 **Gratis** - Fitur dasar\n💼 **Professional** - Rp 199K/bulan\n👑 **Premium** - Rp 499K/bulan\n\nSemua paket bisa dicoba GRATIS! Tanpa kartu kredit. 😊',
        
        'cara': '🎯 **Cara Menggunakan:**\n\n1️⃣ Daftar akun gratis\n2️⃣ Pilih fitur yang dibutuhkan\n3️⃣ Chat dengan AI atau upload dokumen\n4️⃣ Dapatkan solusi instan!\n\nMudah & cepat! ⚡',
        
        'keamanan': '🔒 **Keamanan Data:**\n\n✅ Enkripsi end-to-end\n✅ Server aman di Indonesia\n✅ Tidak dibagikan ke pihak ketiga\n✅ Compliance GDPR & PDPA\n\nData Anda 100% aman! 🛡️',
        
        'default': 'Terima kasih! 😊\n\nSaya bisa bantu info tentang:\n📌 Apa itu Pasalku.ai\n📌 Fitur & kemampuan\n📌 Harga & paket\n📌 Cara menggunakan\n📌 Keamanan data\n\nAtau klik "Mulai Konsultasi Hukum" untuk chat dengan AI Legal Assistant! �'
      };

      let response = responses.default;
      
      if (lowerMsg.includes('apa itu') || lowerMsg.includes('pasalku') || lowerMsg.includes('tentang')) {
        response = responses['tentang'];
      } else if (lowerMsg.includes('fitur') || lowerMsg.includes('kemampuan') || lowerMsg.includes('bisa apa')) {
        response = responses['fitur'];
      } else if (lowerMsg.includes('harga') || lowerMsg.includes('paket') || lowerMsg.includes('biaya') || lowerMsg.includes('pricing')) {
        response = responses['harga'];
      } else if (lowerMsg.includes('cara') || lowerMsg.includes('gunakan') || lowerMsg.includes('pakai') || lowerMsg.includes('mulai')) {
        response = responses['cara'];
      } else if (lowerMsg.includes('aman') || lowerMsg.includes('privasi') || lowerMsg.includes('data') || lowerMsg.includes('keamanan')) {
        response = responses['keamanan'];
      }

      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);

    setChatMessage('');
  };

  const handleQuickOption = (option: string) => {
    // Add user message directly
    setMessages(prev => [...prev, { type: 'user', text: option }]);
    
    // Simulate bot response for quick options
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        'apa itu pasalku': '🤖 **Selamat datang di Pasalku.ai!**\n\nKami adalah platform konsultasi hukum berbasis AI terkini di Indonesia. Dengan teknologi AI terdepan, kami membantu Anda:\n\n✅ Memahami hak-hak hukum dengan mudah\n✅ Mendapat solusi cepat & akurat\n✅ Hemat biaya konsultasi\n✅ Akses 24/7 kapan saja\n\nVisi kami: Membuat akses hukum jadi mudah untuk semua orang! 🚀',
        
        'fitur': '✨ **Fitur-fitur Kami:**\n\n🤖 **AI Legal Assistant**\n   Chat dengan AI hukum 24/7\n\n📄 **Document Analyzer**\n   Analisis kontrak & dokumen otomatis\n\n🔍 **Legal Research**\n   Riset pasal & peraturan lengkap\n\n📊 **Case Predictor**\n   Prediksi hasil kasus dengan AI\n\n💼 **Legal Templates**\n   Template dokumen legal siap pakai\n\n📚 **Knowledge Base**\n   Artikel & panduan hukum lengkap\n\n...dan 40+ fitur lainnya! 🎯',
        
        'harga': '💰 **Paket Harga Kami:**\n\n🆓 **Gratis Forever**\n   • 10 pertanyaan/bulan\n   • Fitur dasar AI Chat\n   • Knowledge Base akses\n\n💼 **Professional - Rp 199K/bulan**\n   • Unlimited pertanyaan\n   • Document analysis\n   • Priority support\n   • Export dokumen\n\n👑 **Premium - Rp 499K/bulan**\n   • Semua fitur Pro\n   • Case prediction AI\n   • Lawyer consultation\n   • Custom templates\n\n✨ Coba GRATIS tanpa kartu kredit! 😊',
        
        'default': 'Terima kasih! Silakan pilih opsi lain atau ketik pertanyaan Anda. 😊'
      };

      const lowerMsg = option.toLowerCase();
      let response = responses.default;
      
      if (lowerMsg.includes('apa itu') || lowerMsg.includes('pasalku')) {
        response = responses['apa itu pasalku'];
      } else if (lowerMsg.includes('fitur')) {
        response = responses['fitur'];
      } else if (lowerMsg.includes('harga') || lowerMsg.includes('paket')) {
        response = responses['harga'];
      }

      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  useEffect(() => {
    setIsMounted(true);
    // Check authentication status - only on client side
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  // Avoid hydration mismatch by not conditionally rendering different content

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 overflow-x-hidden relative text-dark-primary">
      {/* Premium Subtle Background with Animation */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"></div>
        
        {/* Subtle animated orbs */}
        <div className="hidden md:block motion-reduce:hidden absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl smooth-float anim-duration-8s"></div>
        <div className="hidden md:block motion-reduce:hidden absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl smooth-float anim-duration-10s anim-delay-2s"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20 bg-dot-pattern"></div>
      </div>
      
      {/* Floating icons - subtle - only render after hydration */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden md:block motion-reduce:hidden" suppressHydrationWarning>
        {isMounted && ['⚖️', '📜', '🔍', '💼', '✨', '🎓'].map((icon, i) => (
          <div
            key={i}
            className={`absolute text-2xl opacity-10 smooth-float float-pos-${i + 1} anim-delay-${['1-5s', '3s', '4-5s', '6s', '7-5s', '9s'][i]} anim-duration-6s`}
          >
            {icon}
          </div>
        ))}
      </div>

      <EnhancedNavigation
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogin={handleLogin}
        onChatClick={handleChatClick}
      />

      <main className="relative z-10">
        <HeroSection onGetStarted={handleGetStarted} />
        
        {/* Statistics Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-900">
          <StatisticsSection />
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <FeaturesSection />
          <div className="text-center mt-8">
            <Link href="/features" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:shadow-lg">
              Jelajahi 96+ Fitur →
            </Link>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-900">
          <HowItWorksSection />
        </section>
        
        {/* Pricing Section */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <PricingSection />
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-900">
          <FAQSection />
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <TestimonialsSection />
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <CTASection onGetStarted={handleGetStarted} />
        </section>
      </main>

      <EnhancedFooter />

      {/* Mini Customer Service Chat */}
      <div suppressHydrationWarning>
        {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">🤖</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-bold text-base">Asisten Info Platform</h3>
                <p className="text-xs opacity-90">Online • Tanya seputar Pasalku.ai</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:rotate-90"
              aria-label="Tutup chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div className="h-[calc(100%-120px)] overflow-y-auto p-4 bg-gray-50">
            {/* Messages */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 mb-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🤖</span>
                  </div>
                )}
                <div className="flex-1 max-w-[85%]">
                  <div className={`rounded-2xl p-4 shadow-sm ${
                    msg.type === 'bot' 
                      ? 'bg-white rounded-tl-sm' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-tr-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">{msg.type === 'bot' ? 'Baru saja' : 'Terkirim'}</span>
                </div>
              </div>
            ))}

            {/* Quick Options - Only show initially */}
            {messages.length === 1 && (
              <div className="space-y-2 animate-fade-in mt-4 anim-delay-0-2s">
                <p className="text-xs text-gray-500 font-medium px-2">Pilihan Cepat:</p>
                
                <button
                   type="button"
                   onClick={() => handleQuickOption('Apa itu Pasalku.ai?')}
                   className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-3 transition-all duration-200 hover:shadow-md group"
                   aria-label="Tanya tentang Pasalku.ai"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">💡</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Apa itu Pasalku.ai?</p>
                      <p className="text-xs text-gray-500">Kenali platform kami</p>
                    </div>
                  </div>
                </button>

                <button
                   type="button"
                   onClick={() => handleQuickOption('Fitur apa saja yang tersedia?')}
                   className="w-full text-left bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl p-3 transition-all duration-200 hover:shadow-md group"
                   aria-label="Lihat fitur yang tersedia"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Fitur Apa Saja?</p>
                      <p className="text-xs text-gray-500">Lihat kemampuan AI kami</p>
                    </div>
                  </div>
                </button>

                <button
                   type="button"
                   onClick={() => handleQuickOption('Berapa harga paket?')}
                   className="w-full text-left bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl p-3 transition-all duration-200 hover:shadow-md group"
                   aria-label="Cek harga paket"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">💰</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Harga & Paket</p>
                      <p className="text-xs text-gray-500">Cek pricing kami</p>
                    </div>
                  </div>
                </button>

                <button
                   type="button"
                   onClick={() => handleQuickOption('Cara menggunakan platform?')}
                   className="w-full text-left bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl p-3 transition-all duration-200 hover:shadow-md group"
                   aria-label="Cara menggunakan"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Cara Menggunakan?</p>
                      <p className="text-xs text-gray-500">Panduan step-by-step</p>
                    </div>
                  </div>
                </button>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-gray-50 px-2 text-gray-500">Untuk Konsultasi Hukum</span>
                  </div>
                </div>

                <button
                   type="button"
                   onClick={handleChatClick}
                   className="w-full text-left bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl p-4 transition-all duration-200 hover:shadow-lg group border-2 border-blue-400"
                   aria-label="Mulai konsultasi hukum"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">🚀</span>
                    <div>
                      <p className="text-base font-bold">Mulai Konsultasi Hukum</p>
                      <p className="text-xs opacity-90">Akses AI Legal Assistant Lengkap</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tanya tentang platform..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Kirim pesan"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Premium Animated Floating Chat Button with Tooltip */}
      <div suppressHydrationWarning>
        {!showChat && (
        <div className="fixed bottom-6 right-6 z-40 group">
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Mulai Konsultasi AI
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
          
          {/* Button */}
          <button
            onClick={() => setShowChat(true)}
            className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 smooth-float animate-gradient-x"
            aria-label="Buka Chat"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="relative z-10 group-hover:scale-110 transition-transform duration-300"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            
            {/* Multiple pulse rings */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 motion-safe:animate-ping opacity-20"></span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 motion-safe:animate-pulse opacity-10 anim-delay-0-5s"></span>
            
            {/* Glow effect */}
            <span className="absolute inset-0 rounded-full blur-md bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></span>
            
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full motion-safe:animate-pulse border-2 border-white"></span>
          </button>
        </div>
        )}
      </div>
    </div>
  )
}
