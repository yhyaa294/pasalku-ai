import { FC } from 'react'

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
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 nav-glass-enhanced rounded-2xl px-4 md:px-8 py-3 md:py-4 legal-shadow animate-slide-in-bottom hover-lift">
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative perspective-container">
            <div className="w-8 h-8 md:w-10 md:h-10 wood-texture rounded-lg flex items-center justify-center shadow-lg animate-hologram">
              <span className="text-white text-xs md:text-sm">⚖</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full flex items-center justify-center animate-cyber-pulse">
              <span className="text-white text-xs">✨</span>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-primary animate-text-shimmer">
            Pasalku.ai
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 md:gap-6 text-xs md:text-sm font-medium">
          <a href="#features" className="hover:text-primary transition-all duration-300 hover:scale-110">
            Fitur
          </a>
          <a href="#how-it-works" className="hover:text-primary transition-all duration-300 hover:scale-110">
            Cara Kerja
          </a>
          <a href="#pricing" className="hover:text-primary transition-all duration-300 hover:scale-110">
            Harga
          </a>
          <a href="#faq" className="hover:text-primary transition-all duration-300 hover:scale-110">
            FAQ
          </a>
          <a href="#supported-areas" className="hover:text-primary transition-all duration-300 hover:scale-110">
            Area Hukum
          </a>
          <a href="#why-us" className="hover:text-primary transition-all duration-300 hover:scale-110">
            Mengapa Kami
          </a>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-xs text-gray-600">
                {userRole === 'public' && '👤 User'}
                {userRole === 'legal_professional' && '⚖️ Professional'}
                {userRole === 'admin' && '👑 Admin'}
              </span>
              <button
                onClick={onChatClick}
                className="px-4 py-2 bg-primary wood-texture text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                💬 Chat AI
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="px-4 py-2 bg-primary wood-texture text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              🔐 Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
