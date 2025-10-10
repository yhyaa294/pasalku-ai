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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 hidden md:flex items-center justify-between px-8 py-4 legal-shadow animate-slide-in-bottom">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <div className="w-10 h-10 wood-texture rounded-lg flex items-center justify-center shadow-lg animate-hologram">
            <span className="text-white text-lg">⚖</span>
          </div>
          <div className="text-2xl font-black text-primary animate-text-shimmer">
            Pasalku.ai
          </div>
        </div>
        <div className="flex items-center gap-6 text-base font-semibold text-gray-700">
          <a href="/" className="hover:text-primary transition-colors duration-300">
            Beranda
          </a>
          <a href="#features" className="hover:text-primary transition-colors duration-300">
            Fitur
          </a>
          <a href="#about-us" className="hover:text-primary transition-colors duration-300">
            Tentang Kami
          </a>
          <a href="#contact" className="hover:text-primary transition-colors duration-300">
            Kontak
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-300">
          Daftar
        </button>
        <button
          onClick={onLogin}
          className="px-4 py-2 bg-primary wood-texture text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Masuk
        </button>
      </div>
    </nav>
  )
}
