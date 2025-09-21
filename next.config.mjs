/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'vercel.app', 'railway.app'],
  },
  experimental: {
    serverActions: true,
  },
  output: 'standalone',
  swcMinify: true,
  reactStrictMode: true,
}

// Pastikan untuk mengekspor konfigurasi
export default nextConfig