import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Pasalku.ai - AI Hukum Indonesia Terdepan | Akurasi 94.1% | Konsultasi Hukum Cerdas",
  description: "Platform kecerdasan buatan hukum pertama di Indonesia dengan akurasi 94.1%. Konsultasi hukum instan gratis, analisis dokumen otomatis, knowledge base hukum lengkap. PDPA compliant & enterprise-ready.",
  keywords: [
    "AI hukum Indonesia", "konsultasi hukum online", "analisis kontrak AI", "legal tech Indonesia",
    "platform hukum digital", "AI advokat", "konsultasi hukum gratis", "pasalku.ai",
    "legal intelligence", "contract analysis", "PDPA compliant", "hukum Indonesia 2024",
    "asisten hukum AI", "legal AI Indonesia", "kecerdasan buatan hukum"
  ],
  authors: [
    { name: "Ahmad Syarifuddin Yahya", url: "https://pasalku.ai/team/ceo" },
    { name: "Pasalku.ai Team" }
  ],
  creator: "Pasalku.ai",
  publisher: "Pasalku.ai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Pasalku.ai - AI Hukum Indonesia | Akurasi 94.1% | Konsultasi Cerdas",
    description: "Platform AI hukum pertama di Indonesia dengan akurasi 94.1%. Konsultasi hukum instan gratis, analisis dokumen otomatis, dan knowledge base hukum lengkap.",
    url: "https://pasalku.ai",
    siteName: "Pasalku.ai",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pasalku.ai - AI Hukum Indonesia Terdepan"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pasalku.ai - AI Hukum Indonesia | Akurasi 94.1%",
    description: "Platform AI hukum pertama di Indonesia dengan akurasi 94.1%. Konsultasi hukum instan gratis.",
    images: ["/og-image.jpg"],
    creator: "@pasalku_ai",
    site: "@pasalku_ai",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
    yandex: "your-yandex-verification",
    yahoo: "your-yahoo-verification",
  },
  category: "legal technology",
  classification: "Legal AI Platform, Legal Consulting, Document Analysis",
  other: {
    "revisit-after": "1 day",
    "distribution": "global",
    "rating": "general"
  },
  generator: "Pasalku.ai Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
