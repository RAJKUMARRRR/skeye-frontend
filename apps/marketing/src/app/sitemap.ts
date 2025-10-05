import { MetadataRoute } from 'next'
import { locales } from '../../i18n/request'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fleetmanagement.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/features',
    '/pricing',
    '/about',
    '/contact',
    '/demo',
    '/blog',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Generate entries for each locale
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/blog' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/pricing' || route === '/demo' ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [loc, `${baseUrl}/${loc}${route}`])
          ),
        },
      })
    })
  })

  return sitemapEntries
}
