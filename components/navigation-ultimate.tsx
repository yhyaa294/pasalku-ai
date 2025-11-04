'use client'

import { FC, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Menu, X, Home, MessageSquare, CreditCard, User, Phone,
  Zap, Shield, Star, ChevronUp, Search, Bell, Settings,
  ArrowRight, Sparkles, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface UltimateNavigationProps {
  isAuthenticated: boolean
  userRole: 'public' | 'legal_professional' | 'admin'
  onLogin?: () => void
  onChatClick?: () => void
}

export const UltimateNavigation: FC<UltimateNavigationProps> = ({
  isAuthenticated,
  userRole,
  onLogin,
  onChatClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const router = useRouter()
  const navRef = useRef<HTMLElement>(null)
  
  const { scrollY } = useScroll()
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1])
  const navBlur = useTransform(scrollY, [0, 100], [10, 20])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20
      setIsScrolled(scrolled)
      setShowFloatingButton(window.scrollY > 300)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mainNavItems = [
    { id: 'home', name: 'Beranda', href: '/', icon: Home, color: 'text-primary-600' },
    { id: 'konsultasi', name: 'Konsultasi', href: '/konsultasi', icon: MessageSquare, color: 'text-accent-600', badge: 'AI' },
    { id: 'pricing', name: 'Harga', href: '/pricing', icon: CreditCard, color: 'text-success-600' },
    { id: 'profile', name: 'Profil', href: '/profile', icon: User, color: 'text-secondary-600' }
  ]

  const quickActions = [
    { name: 'Konsultasi Cepat', icon: Zap, action: onChatClick, color: 'bg-primary-600' },
    { name: 'Cari Dokumen', icon: Search, action: () => router.push('/documents'), color: 'bg-accent-600' },
    { name: 'Notifikasi', icon: Bell, action: () => router.push('/notifications'), color: 'bg-success-600' }
  ]

  // Gesture handling for mobile menu
  const handleSwipeDown = () => {
    if (window.scrollY < 100) {
      setIsMobileMenuOpen(true)
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        ref={navRef}
        style={{ 
          opacity: navOpacity,
          backdropFilter: `blur(${navBlur}px)`
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 shadow-2xl border-b border-secondary-200/50' 
            : 'bg-white/80 border-b border-secondary-100/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo with Animation */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </motion.div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-secondary-900 font-display group-hover:text-primary-600 transition-colors">
                    Pasalku.ai
                  </div>
                  <div className="text-xs text-secondary-600 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Hukum Indonesia
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {mainNavItems.slice(0, 3).map((item) => (
                <motion.div key={item.id} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-secondary-50 ${item.color}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions - Desktop */}
              <div className="hidden lg:flex items-center space-x-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className={`p-2 rounded-xl ${action.color} text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <action.icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>

              {/* CTA Button */}
              <div className="hidden lg:block">
                {isAuthenticated ? (
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={onLogin}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 animate-buttonPulse"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Mulai Gratis
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-secondary-700 hover:bg-secondary-100 transition-all duration-300"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-secondary-200 shadow-2xl z-50"
            >
              <div className="px-4 py-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Akurasi AI", value: "94.1%", icon: TrendingUp, color: "text-primary-600" },
                    { label: "Pengguna", value: "50K+", icon: Star, color: "text-accent-600" },
                    { label: "Response", value: "0.3s", icon: Zap, color: "text-success-600" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-3 bg-secondary-50 rounded-xl"
                    >
                      <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                      <div className="text-sm font-bold text-secondary-900">{stat.value}</div>
                      <div className="text-xs text-secondary-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation Items */}
                <div className="space-y-2">
                  {mainNavItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 p-4 rounded-xl hover:bg-secondary-50 transition-all duration-300 ${item.color}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge className="bg-primary-100 text-primary-800 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        action.action?.()
                        setIsMobileMenuOpen(false)
                      }}
                      className={`p-4 rounded-xl ${action.color} text-white text-center transition-all duration-300 hover:scale-105`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <action.icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">{action.name}</div>
                    </motion.button>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {isAuthenticated ? (
                    <Button
                      onClick={() => {
                        router.push('/dashboard')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-medium shadow-lg"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Buka Dashboard
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        onLogin?.()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-medium shadow-lg animate-buttonPulse"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Mulai Konsultasi Gratis
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-white/95 backdrop-blur-xl border-t border-secondary-200 shadow-2xl"
        >
          <div className="grid grid-cols-4 px-2 py-2">
            {mainNavItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  router.push(item.href)
                }}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={activeTab === item.id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="w-5 h-5 mb-1" />
                </motion.div>
                <span className="text-xs font-medium">{item.name}</span>
                {item.badge && activeTab === item.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="bg-primary-600 text-white text-xs px-1.5 py-0.5">
                      {item.badge}
                    </Badge>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            onClick={onChatClick}
            className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-2xl flex items-center justify-center z-40 animate-buttonPulse"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 left-4 lg:bottom-24 lg:right-8 w-12 h-12 bg-secondary-600 text-white rounded-full shadow-xl flex items-center justify-center z-40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-20"></div>
      <div className="lg:hidden h-16"></div> {/* Bottom nav spacer */}
    </>
  )
}
