import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import "./globals.css"

const Analytics = dynamic(() => import("@vercel/analytics/react").then((mod) => ({ default: mod.Analytics })), {
  ssr: false,
})

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
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
