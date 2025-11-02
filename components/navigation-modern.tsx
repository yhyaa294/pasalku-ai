'use client'

import { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  User,
  LogIn,
  CreditCard,
  Phone,
  FileText,
  BookOpen,
  Home,
  Star,
  Building,
  MessageSquare,
  Shield,
  ChevronDown,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DarkModeToggleIcon } from './dark-mode-toggle'

interface NavigationProps {
  isAuthenticated: boolean
  userRole: 'public' | 'legal_professional' | 'admin'
  onLogin?: () => void
  onChatClick?: () => void
}

export const ModernNavigation: FC<NavigationProps> = ({
  isAuthenticated,
  userRole,
  onLogin,
  onChatClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mainNav = [
    { name: 'Beranda', href: '/', icon: Home },
    { 
      name: 'Layanan', 
      href: '#', 
      icon: Star,
      dropdown: [
        { name: 'Konsultasi Hukum', href: '/konsultasi', icon: MessageSquare },
        { name: 'Analisis Dokumen', href: '/documents', icon: FileText },
        { name: 'Risk Calculator', href: '/risk-calculator', icon: Shield }
      ]
    },
    { name: 'Fitur', href: '/features', icon: Zap },
    { name: 'Harga', href: '/pricing', icon: CreditCard },
    { name: 'Tentang', href: '/about', icon: Building },
    { name: 'Kontak', href: '/contact', icon: Phone }
  ]

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-secondary-200' 
          : 'bg-white/80 backdrop-blur-sm border-b border-secondary-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-secondary-900 font-display">Pasalku.ai</div>
                  <div className="text-xs text-secondary-600">AI Hukum Indonesia</div>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {mainNav.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-1 text-secondary-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-secondary-200 overflow-hidden"
                          >
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="flex items-center space-x-3 px-4 py-3 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                              >
                                <dropdownItem.icon className="w-4 h-4" />
                                <span>{dropdownItem.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="flex items-center space-x-1 text-secondary-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <div className="hidden sm:block">
                <DarkModeToggleIcon />
              </div>

              {/* CTA Button */}
              <div className="hidden lg:block">
                {isAuthenticated ? (
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={onLogin}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-secondary-700 hover:bg-secondary-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden bg-white border-b border-secondary-200"
            >
              <div className="px-4 py-6 space-y-4">
                {mainNav.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-secondary-900 font-medium">
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        <div className="ml-6 space-y-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="flex items-center space-x-3 text-secondary-600 hover:text-primary-600 py-2 transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <dropdownItem.icon className="w-4 h-4" />
                              <span>{dropdownItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        className="flex items-center space-x-3 text-secondary-700 hover:text-primary-600 py-2 font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile CTA */}
                <div className="pt-6 border-t border-secondary-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <DarkModeToggleIcon />
                    <Badge variant="secondary" className="bg-primary-100 text-primary-800">
                      <Zap className="w-3 h-3 mr-1" />
                      AI Powered
                    </Badge>
                  </div>
                  
                  {isAuthenticated ? (
                    <Button
                      onClick={() => {
                        router.push('/dashboard')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        onLogin?.()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Masuk / Daftar
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-20"></div>
    </>
  )
}
