'use client';

import { UltraSimpleNavbar } from '@/components/ultra-simple-navbar';
import HeroSection from '@/components/hero/HeroSection';
import SocialProofBar from '@/components/sections/SocialProofBar';
import FeaturesShowcase from '@/components/sections/FeaturesShowcase';
import TestimonialCarousel from '@/components/sections/TestimonialCarousel';
import FinalCTA from '@/components/sections/FinalCTA';
import { WhyThisAISection } from '@/components/why-this-ai-section';
import { ZigzagHowItWorks } from '@/components/zigzag-how-it-works';
import { PowerfulPricingSection } from '@/components/powerful-pricing-section';
import { FloatingCustomerService, FloatingMusicToggle } from '@/components/floating-widgets';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic imports for heavy components
const FAQSection = dynamic(() => import('@/components/faq-section').then(m => m.FAQSection), {
  ssr: false,
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <div className="text-gray-500 animate-pulse">Loading FAQ...</div>
    </div>
  )
});

const TestimonialsSection = dynamic(() => import('@/components/testimonials-section').then(m => m.TestimonialsSection), {
  ssr: false,
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <div className="text-gray-500 animate-pulse">Loading Testimonials...</div>
    </div>
  )
});

export default function PasalkuLandingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check authentication status
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
      }
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Ultra Simple Navbar */}
      <UltraSimpleNavbar onLogin={handleLogin} />

      {/* Main Content */}
      <main>
        {/* NEW HERO SECTION - Animated Gradient with Live Demo */}
        <HeroSection />

        {/* Social Proof Bar - Stats + Live Activity */}
        <SocialProofBar />

        {/* NEW FEATURES SHOWCASE - Interactive with Demos */}
        <FeaturesShowcase />

        {/* Why This AI Section - Alasan terciptanya AI ini */}
        <WhyThisAISection />

        {/* How It Works - Zigzag pattern dengan nomor dan gambar */}
        <ZigzagHowItWorks />

        {/* Pricing Section - 3 opsi: Gratis, 99k, 395k */}
        <PowerfulPricingSection />

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-900">
          <FAQSection />
        </section>

        {/* NEW Testimonials Section - Interactive Carousel */}
        <TestimonialCarousel />

        {/* NEW Final CTA Section - Countdown + Urgency */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <EnhancedFooter />

      {/* Floating Widgets */}
      {isMounted && (
        <>
          {/* Customer Service AI Aura - Bottom Right */}
          <FloatingCustomerService />
          
          {/* Music Toggle - Bottom Left */}
          <FloatingMusicToggle />
        </>
      )}

      {/* Smooth Scroll Script */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
}
