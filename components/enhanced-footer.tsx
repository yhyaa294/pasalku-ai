'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  FileText,
  Shield,
  Award,
  Users,
  Heart,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import { motion } from 'framer-motion'

export function EnhancedFooter() {
  const footerSections = [
    {
      title: 'Produk & Fitur',
      links: [
        { name: 'Konsultasi AI', href: '/', description: 'AI consultation service' },
        { name: 'Fitur Lengkap', href: '/features', description: 'All platform features' },
        { name: 'Paket Harga', href: '/pricing', description: 'Pricing plans' },
        { name: 'Profesional', href: '/professional-upgrade', description: 'Professional upgrade' },
        { name: 'Dashboard', href: '/dashboard', description: 'User dashboard' }
      ]
    },
    {
      title: 'Informasi & Dukungan',
      links: [
        { name: 'Tentang Kami', href: '/about', description: 'About Pasalku.ai' },
        { name: 'Blog & Artikel', href: '/blog', description: 'Legal articles' },
        { name: 'FAQ', href: '/faq', description: 'Frequently asked questions' },
        { name: 'Kontak Kami', href: '/contact', description: 'Contact support' },
        { name: 'Live Chat', href: '#', description: 'Instant support', external: true },
        { name: 'Security Report', href: '/security-report', description: 'Platform security status' }
      ]
    },
    {
      title: 'Hukum & Kepatuhan',
      links: [
        { name: 'Kebijakan Privasi', href: '/privacy-policy', description: 'Privacy policy' },
        { name: 'Syarat & Ketentuan', href: '/terms-of-service', description: 'Terms of service' },
        { name: 'PDPA Compliance', href: '/privacy-policy#compliance', description: 'Data protection' },
        { name: 'Legal Documentation', href: '/terms-of-service', description: 'Legal docs' },
        { name: 'Security Center', href: '/about#security', description: 'Security info' }
      ]
    }
  ]

  const contactInfo = {
    address: 'Jl. Sudirman Jakarta Selatan\nJawa Barat 12345, Indonesia',
    phone: '+62 21 1234 5678',
    email: 'support@pasalku.ai',
    hours: 'Senin - Jumat: 09:00 - 17:00 WIB'
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-600' }
  ]

  const certifications = [
    { icon: Shield, name: 'ISO 27001', description: 'Security Certified' },
    { icon: Award, name: 'PDPA Compliant', description: 'Data Protection' },
    { icon: FileText, name: 'AI Ethics', description: 'Ethical Standards' },
    { icon: Users, name: '50K+ Users', description: 'Trusted Platform' }
  ]

  const bottomLinks = [
    { name: 'Kebijakan Cookie', href: '/privacy-policy#cookies' },
    { name: 'Accessibility', href: '/about#accessibility' },
    { name: 'API Documentation', href: '/features#api' },
    { name: 'Status Sistem', href: '/about#monitoring' },
    { name: 'Security Report', href: '/security-report' },
    { name: 'Partnership Program', href: '/partnerships' }
  ]

  return (
    <footer className="bg-gradient-to-br from-secondary via-secondary to-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='rgba(255,255,255,0.1)'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <span className="text-3xl">⚖️</span>
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold">Pasalku.ai</div>
                    <div className="text-sm text-blue-200">Solusi AI Hukum Indonesia</div>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  Platform kecerdasan buatan hukum pertama di Indonesia yang menggabungkan teknologi terdepan
                  dengan pemahaman mendalam tentang hukum Indonesia. Dipercaya oleh 50,000+ pengguna aktif.
                </p>

                {/* Certifications */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={cert.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <cert.icon className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">{cert.name}</div>
                        <div className="text-xs text-gray-300">{cert.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      {contactInfo.address.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-300" />
                    <a href="tel:+622112345678" className="text-sm text-gray-300 hover:text-white transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-300" />
                    <a href="mailto:support@pasalku.ai" className="text-sm text-gray-300 hover:text-white transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      {contactInfo.hours}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-white">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                        {link.external && <ExternalLink className="w-3 h-3" />}
                      </Link>
                      <div className="text-xs text-gray-400 mt-1">{link.description}</div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Stay Connected dengan Pasalku.ai</h3>
              <p className="text-gray-300 mb-6">
                Dapatkan update terbaru tentang teknologi hukum, tips praktis, dan informasi penting
                langsung ke inbox Anda. Kami hargai privasi Anda - unsubscribe kapan saja.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <input
                  type="email"
                  placeholder="Masukkan email Anda..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary"
                  aria-label="Email untuk newsletter"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary">
                  Subscribe
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>50,000+ subscribers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Privacy guaranteed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Bottom Links */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {bottomLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 hidden sm:inline">Follow us:</span>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`text-gray-400 ${social.color} transition-colors p-2 rounded-full hover:bg-white/10`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <p className="text-gray-400 text-sm text-center lg:text-left">
                  © 2024 Pasalku.ai. All rights reserved. | Made with 💙 for Justice in Indonesia
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Version 2.0.0</span>
                  <Separator orientation="vertical" className="h-4 bg-gray-600" />
                  <span>Last updated: February 2024</span>
                  <Separator orientation="vertical" className="h-4 bg-gray-600" />
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    All systems operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}