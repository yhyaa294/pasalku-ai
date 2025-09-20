import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { StatisticsSection } from '@/components/statistics-section'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { PricingSection } from '@/components/pricing-section'
import { useEffect, useState } from 'react'

// Chat interface component
import { ChatInterface } from '@/components/chat-interface'

export default function PasalkuLandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'public' | 'legal_professional' | 'admin'>('public')
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Enhanced scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
        }
      })
    }, observerOptions)

    // Observe all scroll-animate elements
    const animateElements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
    )
    animateElements.forEach((el) => observer.observe(el))

    // Cleanup
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated background elements */}
      <div className="matrix-bg">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="matrix-char animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          >
            {["§", "¶", "©", "®", "™", "⚖", "⚡", "🏛"][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle animate-levitate"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <Navigation
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogin={() => setIsAuthenticated(true)}
        onChatClick={() => setShowChat(true)}
      />

      <HeroSection onGetStarted={() => setShowChat(true)} />

      <StatisticsSection />

      <FeaturesSection />

      <HowItWorksSection />

      <PricingSection />

      {/* Chat Interface - sesuai dengan backend architecture */}
      {showChat && (
        <ChatInterface
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          onClose={() => setShowChat(false)}
          onLoginRequired={() => {
            // Handle login requirement
            alert('Silakan login terlebih dahulu untuk menggunakan fitur chat AI')
          }}
        />
      )}
    </div>
  )
}
