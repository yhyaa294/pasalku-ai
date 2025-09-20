import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Pasalku.ai - Asisten Informasi Hukum Berbasis AI",
  description:
    "Hadapi masalah hukum dengan lebih tenang dan percaya diri. Dapatkan informasi hukum yang tepercaya dari AI assistant.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
