import { FC, useState, useEffect } from 'react'

interface NavigationProps {
  isAuthenticated: boolean
  userRole: 'public' | 'legal_professional' | 'admin'
  onLogin: () => void
  onChatClick: () => void
}

export const Navigation: FC<NavigationProps> = ({
  isAuthenticated,
  userRole,
  onLogin,
  onChatClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const createRipple = (event: React.MouseEvent) => {
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
    if (ripple) {
      ripple.remove()
    }

    button.appendChild(circle)
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-xl border-b border-gray-200/30 shadow-gray-900/5'
        : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none hover:scale-105 transition-transform duration-300"
               onClick={() => window.location.href = '/'}
               onMouseDown={createRipple}>
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">⚖️</span>
            </div>
            <div className="text-xl font-black text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Pasalku.ai
            </div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-sm"></div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <a
                href="/"
                className="relative text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 group"
                onClick={(e) => handleNavClick(e, '#hero')}
              >
                Beranda
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#features"
                className="relative text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 group"
                onClick={(e) => handleNavClick(e, '#how-it-works')}
              >
                Fitur
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#about-us"
                className="relative text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 group"
                onClick={(e) => handleNavClick(e, '#testimonials')}
              >
                Tentang Kami
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#contact"
                className="relative text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 group"
                onClick={(e) => handleNavClick(e, '#footer')}
              >
                Kontak
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <a
                    href="/dashboard"
                    className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 hover:bg-gray-50 rounded-lg"
                  >
                    Dashboard
                  </a>
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
                  <button
                    onClick={onLogin}
                    className="px-4 py-2 border border-gray-600 text-gray-900 font-medium hover:bg-gray-50 rounded-lg transition-colors duration-300 hover:border-orange-500 hover:text-orange-600"
                  >
                    Daftar
                  </button>
                  <button
                    onClick={onChatClick}
                    onMouseDown={createRipple}
                    className="relative px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden"
                  >
                    Masuk
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={onChatClick}
              onMouseDown={createRipple}
              className="relative px-4 py-2 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors duration-300 hover:scale-105 overflow-hidden"
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Ripple Effect Styles (injected via global CSS, or add to your CSS) */}
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
    </nav>
  )
}
