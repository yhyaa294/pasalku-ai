 'use client'

import Link from 'next/link'
import {
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle,
  Github,
  Mail,
  Phone,
  MapPin,
  Globe,
  QrCode
} from 'lucide-react'

const socialLinks = [
  {
    label: 'Instagram Pasalku.ai',
    href: 'https://www.instagram.com/pasalku.ai?igsh=cmozcjFiNTl5cmN0',
    icon: Instagram
  },
  {
    label: 'Instagram Syarfddn Yahya',
    href: 'https://www.instagram.com/syarfddn_yhya?igsh=MWtmazRpM21sOWpwaw==',
    icon: Instagram
  },
  {
    label: 'LinkedIn Pasalku.ai',
    href: 'https://linkedin.com/company/pasalku-ai',
    icon: Linkedin
  },
  {
    label: 'Twitter Pasalku.ai',
    href: 'https://twitter.com/PasalkuAI',
    icon: Twitter
  },
  {
    label: 'Discord Komunitas',
    href: 'https://discord.gg/pasalku-ai',
    icon: MessageCircle
  },
  {
    label: 'GitHub Repository',
    href: 'https://github.com/yhyaa294/pasalku-ai.git',
    icon: Github
  }
]

const quickLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Fitur', href: '/features' },
  { name: 'Tentang Kami', href: '/about' },
  { name: 'Paket & Harga', href: '/pricing' },
  { name: 'Kontak', href: '/contact' },
  { name: 'FAQ & Bantuan', href: '/faq' },
  { name: 'Kebijakan Privasi', href: '/privacy-policy' },
  { name: 'Syarat & Ketentuan', href: '/terms-of-service' }
]

const contactEmails = [
  { label: 'Sales & Umum', value: 'contact@pasalku.ai' },
  { label: 'Sales', value: 'sales@pasalku.ai' },
  { label: 'Enterprise', value: 'enterprise@pasalku.ai' },
  { label: 'Support', value: 'support@pasalku.ai' },
  { label: 'Opsional', value: 'yahya@pasalku.ai' },
  { label: 'Cadangan', value: 'pasalku.ai@gmail.com' }
]

const contactPhones = [
  { label: 'WhatsApp Utama', value: '+62 851-8310-4294' },
  { label: 'WhatsApp Sekunder', value: '+62 823-3091-9114' }
]

export function EnhancedFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white relative overflow-hidden">
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-3xl">⚖️</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">Pasalku.ai</p>
                  <p className="text-sm text-blue-200">Kejelasan hukum dalam genggaman</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-200/80 max-w-xl">
                Platform konsultasi hukum berbasis AI yang membantu Anda memahami hak dan kewajiban hukum 
                dengan mudah. Akses informasi hukum Indonesia dalam bahasa yang jelas dan mudah dipahami.
              </p>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-blue-200/70">Terhubung dengan kami</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/40 hover:bg-white/10"
                    >
                      <social.icon className="h-4 w-4" />
                      <span>{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                <a
                  href="https://pasalku.ai"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-white/40 hover:bg-white/10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-4 w-4" />
                  Website Resmi
                </a>
                <a
                  href="https://wa.me/qr/P3XSW5Q3CNWXD1"
                  className="flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-3 py-2 text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-500/30"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <QrCode className="h-4 w-4" />
                  Scan QR WhatsApp
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-200/80">Navigasi</p>
              <ul className="space-y-3 text-sm text-slate-200/80">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 transition hover:translate-x-1 hover:text-white"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-200/80">Hubungi Kami</p>
                <div className="space-y-3 text-sm text-slate-200/80">
                  {contactEmails.map((email) => (
                    <div key={email.value} className="flex items-start gap-3">
                      <Mail className="mt-1 h-4 w-4 text-blue-200" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-blue-200/70">{email.label}</p>
                        <a
                          href={`mailto:${email.value}`}
                          className="transition hover:text-white"
                        >
                          {email.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3 text-sm text-slate-200/80">
                  <p className="text-xs uppercase tracking-wider text-blue-200/70">Telepon & WhatsApp</p>
                  {contactPhones.map((phone) => (
                    <div key={phone.value} className="flex items-start gap-3">
                      <Phone className="mt-1 h-4 w-4 text-green-200" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-blue-200/70">{phone.label}</p>
                        <a
                          href={`tel:${phone.value.replace(/\s/g, '')}`}
                          className="transition hover:text-white"
                        >
                          {phone.value}
                        </a>
                      </div>
                    </div>
                  ))}
                  <a
                    href="https://wa.me/qr/P3XSW5Q3CNWXD1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-200/40 bg-emerald-500/20 px-3 py-2 text-xs uppercase tracking-wider text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-500/30"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat WhatsApp
                  </a>
                </div>
                <div className="space-y-3 text-sm text-slate-200/80">
                  <p className="text-xs uppercase tracking-wider text-blue-200/70">Alamat Kantor</p>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-4 w-4 text-blue-200" />
                    <div>
                      <p>dsn.krenggan ds.kauman</p>
                      <p>kec. ngoro, kab. jombang</p>
                      <p>Jawa Timur, Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col gap-4 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
              <p>© {currentYear} Pasalku.ai. Semua hak dilindungi. Dibangun untuk membawa kejelasan hukum bagi semua.</p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-200/80">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                  Sistem Aktif
                </span>
                <Link href="/privacy-policy" className="transition hover:text-white">
                  Privasi
                </Link>
                <Link href="/terms-of-service" className="transition hover:text-white">
                  Ketentuan
                </Link>
                <Link href="/faq" className="transition hover:text-white">
                  Bantuan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}