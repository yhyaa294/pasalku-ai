import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pasalku.ai'

  const routes = [
    '/',
    '/pricing',
    '/about',
    '/contact',
    '/features',
    '/faq',
    '/professional-upgrade',
    '/privacy-policy',
    '/terms-of-service',
    '/blog'
  ]

  const now = new Date()

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1.0 : 0.7,
  }))
}
