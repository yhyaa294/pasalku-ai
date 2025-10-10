import { FC, useState } from 'react'
import { Mail, Phone, MapPin, Instagram, Github, Send } from 'lucide-react'

interface FooterProps {
  className?: string
}

export const Footer: FC<FooterProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('')

  return (
    <footer className={`bg-gray-900 text-white relative overflow-hidden ${className}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-orange-400 flex items-center justify-center shadow-lg">
                <span className="text-orange-400 text-2xl">⚖️</span>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Pasalku.ai
                </h3>
                <p className="text-gray-400 text-sm font-medium">Kejelasan Hukum dalam Genggaman</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Asisten AI hukum terpercaya untuk memberikan jawaban akurat,
              cepat, dan mudah dipahami sesuai konteks hukum Indonesia.
            </p>

            {/* Animated Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/pasalku.ai?igsh=bG5yZXJydXZzYjh4"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg hover:shadow-pink-500/30"
                title="Instagram Pasalku.ai"
              >
                <Instagram className="w-5 h-5 text-white group-hover:animate-bounce" />
                <div className="absolute inset-0 rounded-xl bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
              </a>
              <a
                href="https://wa.me/qr/CVP4ARA4UH54H1"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
                title="WhatsApp"
              >
                <svg className="w-5 h-5 text-white group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <div className="absolute inset-0 rounded-xl bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
              </a>
              <a
                href="https://github.com/yhyaa294"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg hover:shadow-gray-500/30"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-white group-hover:animate-bounce" />
                <div className="absolute inset-0 rounded-xl bg-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
              </a>
              <a
                href="https://www.tiktok.com/@syarfddn.yhya?_t=ZS-8zwLasbkEkL&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-br from-pink-600 to-black rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg hover:shadow-pink-500/30"
                title="TikTok"
              >
                <svg className="w-5 h-5 text-white group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <div className="absolute inset-0 rounded-xl bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
              </a>
            </div>
          </div>

          {/* Tautan Cepat Column */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
              Tautan Cepat
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#hero"
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Kontak
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Bantuan
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
              Hubungi Kami
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex flex-col">
                  <a
                    href="mailto:Yahya@pasalku.ai"
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 font-medium"
                  >
                    Yahya@pasalku.ai
                  </a>
                  <a
                    href="mailto:Pasalku.ai@gmail.com"
                    className="text-gray-400 hover:text-orange-300 transition-colors duration-300 text-sm"
                  >
                    Pasalku.ai@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex flex-col">
                  <a
                    href="tel:+6285183104294"
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300 font-medium"
                  >
                    +62 851-8310-4294
                  </a>
                  <a
                    href="tel:+6282330919114"
                    className="text-gray-400 hover:text-green-300 transition-colors duration-300 text-sm"
                  >
                    +62 823-3091-9114
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-gray-300 text-sm leading-relaxed">
                  <p>dsn.krenggan ds.kauman</p>
                  <p className="text-gray-400">kec.ngoro kab.jombang</p>
                  <p className="text-gray-400">jawatimur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
              Tetap Terhubung
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Dapatkan update terbaru tentang perkembangan hukum dan fitur baru Pasalku.ai
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg transition-all duration-300 hover:scale-105 group"
                  title="Berlangganan"
                >
                  <Send className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Dengan berlangganan, Anda menyetujui kebijakan privasi kami.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              Hak Cipta {new Date().getFullYear()} Pasalku.ai.
              <span className="hidden md:inline"> Semua hak dilindungi.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-orange-400 animate-pulse">●</span>
              <span className="text-gray-400 font-medium">Made with ❤️ in Indonesia</span>
              <span className="text-orange-400 animate-pulse">●</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
