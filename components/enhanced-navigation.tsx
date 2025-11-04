
import { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogIn,
  CreditCard,
  Phone,
  FileText,
  BookOpen,
  HelpCircle,
  Home,
  Star,
  Building,
  Users,
  Award,
  MessageSquare,
  Shield
} from 'lucide-react'
import { DarkModeToggleIcon } from './dark-mode-toggle'

// Navigation item types
interface NavItem {
  name: string
  href?: string
  external?: boolean
  onClick?: () => void
  children?: NavItem[]
  icon?: FC<{ className?: string }>
}

interface EnhancedNavigationProps {
  isAuthenticated: boolean
  userRole: 'public' | 'legal_professional' | 'admin'
  onLogin?: () => void
  onChatClick?: () => void
}

export const EnhancedNavigation: FC<EnhancedNavigationProps> = ({
  isAuthenticated,
  userRole,
  onLogin,
  onChatClick
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileDropdowns, setMobileDropdowns] = useState<Set<string>>(new Set())

  // Enhanced navigation structure
  const navigationItems: NavItem[] = [
    {
      name: 'Beranda',
      href: '/',
      icon: Home
    },
    {
      name: 'Fitur',
      href: '/features',
      icon: Star
    },
    {
      name: 'Academy',
      href: '/academy',
      icon: BookOpen
    },
    {
      name: 'Harga',
      href: '/pricing',
      icon: CreditCard
    },
    {
      name: 'Tentang',
      href: '/about',
      icon: Building
    },
    {
      name: 'FAQ',
      href: '/faq',
      icon: HelpCircle
    },
    {
      name: 'Kontak',
      href: '/contact',
      icon: Phone
    }
  ]

  useEffect(() => {
    // CRITICAL: Prevent scroll listener during SSR
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      // Double-check window exists
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 20)
      }
    }
    
    // Small delay to ensure hydration is complete
    const timeoutId = setTimeout(() => {
      handleScroll() // Initial call
      window.addEventListener('scroll', handleScroll, { passive: true })
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Simple scrollspy: works on homepage where sections exist - PROTECTED
  useEffect(() => {
    // CRITICAL: Prevent DOM access during SSR
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const sectionIds = ['hero', 'features', 'how-it-works', 'pricing', 'testimonials', 'faq', 'cta']
    
    const handler = () => {
      // Triple-check all browser APIs exist
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      if (!window.location || window.location.pathname !== '/') return
      
      let current = ''
      try {
        for (const id of sectionIds) {
          const el = document.getElementById(id)
          if (!el) continue
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 200) {
            current = id
            break
          }
        }
        setActiveSection(current)
      } catch (error) {
        // Silently handle DOM errors
      }
    }
    
    // Delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handler() // Initial call
      window.addEventListener('scroll', handler, { passive: true })
    }, 200)
    
    return () => {
      clearTimeout(timeoutId)
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handler)
      }
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('http') || href.includes('.com') || href.includes('.net')) return // External links

    e.preventDefault()

    if (typeof document === 'undefined') return

    // Handle internal section links (#) or same-page hash (/#[id])
    const hasHashOnly = href.startsWith('#')
    const isSamePageHash = href.startsWith('/#')
    const hash = hasHashOnly ? href : (isSamePageHash ? href.substring(1) : '')

    if (hasHashOnly || isSamePageHash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setIsMobileMenuOpen(false)
        return
      }
    }

    // If on homepage, map certain routes to in-page sections
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const map: Record<string, string> = {
        '/features': '#features',
        '/pricing': '#pricing',
        '/academy': '#academy'
      }
      const mapped = map[href]
      if (mapped) {
        const target = document.querySelector(mapped)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setIsMobileMenuOpen(false)
          return
        }
      }
    }

    // Fallback: navigate normally
    router.push(href)
  }

  const toggleMobileDropdown = (key: string) => {
    const newSet = new Set(mobileDropdowns)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setMobileDropdowns(newSet)
  }

  const createRipple = (event: React.MouseEvent) => {
    // CRITICAL: Prevent DOM manipulation during SSR
    if (typeof document === 'undefined') return
    
    try {
      const button = event.currentTarget as HTMLElement
      const circle = document.createElement("span")
      const diameter = Math.max(button.clientWidth, button.clientHeight)
      const radius = diameter / 2

      const rect = button.getBoundingClientRect()
      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${event.clientX - rect.left - radius}px`
      circle.style.top = `${event.clientY - rect.top - radius}px`
      circle.classList.add("ripple-effect")

      const ripple = button.getElementsByClassName("ripple-effect")[0]
      if (ripple) ripple.remove()

      button.appendChild(circle)
    } catch (error) {
      // Silently handle DOM manipulation errors
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-200/30'
            : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
        } dark:bg-slate-900/80 dark:backdrop-blur-xl dark:shadow-xl dark:border-b dark:border-gray-700`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                <motion.div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden bg-white p-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Image
                    src="/assets/logos/logo_pasalku.jpg.png"
                    alt="Pasalku.ai Logo"
                    width={40}
                    height={40}
                    priority
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <div className="text-xl font-black text-gray-900 dark:text-gray-100 bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Pasalku.ai
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full motion-safe:animate-pulse shadow-sm"></div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-6 mr-8">
                {navigationItems.map((item, index) => (
                  <div key={item.name} className="relative group">
                    {/* Main Navigation Item */}
                    <div className="flex items-center gap-1">
                      {item.children ? (
                        <button
                          onMouseEnter={() => setOpenDropdown(item.name)}
                          onMouseLeave={() => setOpenDropdown(null)}
                          className="relative flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-800"
                        >
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.name}</span>
                          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                      ) : (
                        <Link
                          href={item.href || '#'}
                          onClick={(e) => item.href && handleNavClick(e, item.href)}
                          className={`relative flex items-center gap-1 font-medium transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-800 ${
                            (item.href === '/#' + activeSection || (item.href === '/features' && activeSection === 'features') || (item.href === '/pricing' && activeSection === 'pricing'))
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400'
                          }`}
                        >
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.name}</span>
                          <span className="absolute -bottom-1 left-2 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-4/5"></span>
                        </Link>
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {item.children && openDropdown === item.name && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          onMouseEnter={() => setOpenDropdown(item.name)}
                          onMouseLeave={() => setOpenDropdown(null)}
                          className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-gray-200/50 dark:border-gray-700 backdrop-blur-sm overflow-hidden z-50"
                        >
                          <div className="py-2">
                            {item.children.map((child, childIndex) => (
                              <motion.div
                                key={child.name}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: childIndex * 0.1 }}
                              >
                                <Link
                                  href={child.href || '#'}
                                  onClick={(e) => child.href && handleNavClick(e, child.href)}
                                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors duration-200"
                                >
                                  {child.icon && <child.icon className="w-4 h-4 text-orange-500" />}
                                  <span className="font-medium">{child.name}</span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-3">
                {/* Dark Mode Toggle */}
                <div className="mr-2">
                  <DarkModeToggleIcon />
                </div>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={onChatClick}
                      onMouseDown={createRipple}
                      className="relative px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden"
                    >
                      Mulai Konsultasi Gratis
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-orange-500 hover:text-orange-600 rounded-lg transition-all duration-300"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      onMouseDown={createRipple}
                      className="relative px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden"
                    >
                      Daftar Gratis
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg mt-4 border border-gray-200/50 dark:border-gray-700 shadow-lg overflow-hidden"
              >
                <div className="py-2">
                  {navigationItems.map((item, index) => (
                    <div key={item.name}>
                      {/* Mobile Menu Item */}
                      <div className="flex items-center">
                        {item.children ? (
                          <button
                            onClick={() => toggleMobileDropdown(item.name)}
                            className="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {item.icon && <item.icon className="w-4 h-4" />}
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <motion.div
                              animate={{ rotate: mobileDropdowns.has(item.name) ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </button>
                        ) : (
                          <Link
                            href={item.href || '#'}
                            onClick={(e) => {
                              item.href && handleNavClick(e, item.href)
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            {item.icon && <item.icon className="w-4 h-4" />}
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        )}
                      </div>

                      {/* Mobile Dropdown Items */}
                      {item.children && mobileDropdowns.has(item.name) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-orange-50/50 dark:bg-slate-800/50"
                        >
                          {item.children.map((child, childIndex) => (
                            <Link
                              key={child.name}
                              href={child.href || '#'}
                              onClick={(e) => {
                                child.href && handleNavClick(e, child.href)
                                setIsMobileMenuOpen(false)
                              }}
                              className="flex items-center gap-3 px-8 py-3 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              {child.icon && <child.icon className="w-4 h-4 text-orange-400" />}
                              <span>{child.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}

                  {/* Mobile Auth Buttons */}
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                    {isAuthenticated ? (
                      <div className="px-4 py-2">
                        <Link
                          href="/dashboard"
                          className="block w-full px-4 py-2 text-center text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            onChatClick?.()
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                        >
                          Mulai Konsultasi Gratis
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-2 space-y-2">
                        <Link
                          href="/login"
                          className="block w-full px-4 py-2 text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Masuk
                        </Link>
                        <Link
                          href="/register"
                          className="block w-full px-4 py-2 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Daftar Gratis
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Styles */}
      <style jsx>{`
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}