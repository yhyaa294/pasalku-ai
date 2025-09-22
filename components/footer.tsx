import { FC } from 'react'
import { Mail, Phone, MapPin, Instagram, Github, Globe } from 'lucide-react'

interface FooterProps {
  className?: string
}

export const Footer: FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 wood-texture rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚖</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Pasalku.ai</h3>
                <p className="text-gray-300 text-sm">AI Legal Assistant Indonesia</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform AI terdepan untuk konsultasi hukum di Indonesia.
              Didirikan oleh Muhammad Syarifuddin Yahya untuk memberikan
              analisis hukum yang akurat dan mudah dipahami.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/pasalku.ai?igsh=bG5yZXJydXZzYjh4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title="Instagram Pasalku.ai"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/syarfddn_yhya?igsh=MWtmazRpM21sOWpwaw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title="Instagram Co-Founder"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.tiktok.com/@syarfddn.yhya?_t=ZS-8zwLasbkEkL&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title="TikTok"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://github.com/yhyaa294"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://wa.me/qr/CVP4ARA4UH54H1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title="WhatsApp QR"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Fitur Utama
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Harga & Paket
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Areas */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Area Hukum</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Hukum Pidana
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Hukum Perdata
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Hukum Bisnis
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Hukum Keluarga
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Hukum Properti
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Hubungi Kami</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div className="flex flex-col">
                  <a
                    href="mailto:Yahya@pasalku.ai"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Yahya@pasalku.ai
                  </a>
                  <a
                    href="mailto:Pasalku.ai@gmail.com"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Pasalku.ai@gmail.com
                  </a>
                  <a
                    href="mailto:syarifuddinudin526@gmail.com"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    syarifuddinudin526@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div className="flex flex-col">
                  <a
                    href="tel:+6285183104294"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    +62 851-8310-4294
                  </a>
                  <a
                    href="tel:+6282330919114"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    +62 823-3091-9114
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div className="text-gray-300">
                  <p>Jl. Teknologi No. 123</p>
                  <p>Jakarta Pusat, 10230</p>
                  <p>Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 Pasalku.ai. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
