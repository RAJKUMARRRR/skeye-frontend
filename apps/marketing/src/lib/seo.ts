import type { Metadata } from 'next'

const siteConfig = {
  name: 'Fleet Management Platform',
  description: 'Enterprise-grade fleet management solution with real-time GPS tracking, geofencing, maintenance management, and advanced analytics.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://fleetmanagement.com',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/fleetmanagement',
    github: 'https://github.com/fleetmanagement',
  },
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: {
  title: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const url = `${siteConfig.url}${path}`

  return {
    title,
    description: description || siteConfig.description,
    applicationName: siteConfig.name,
    keywords: [
      'fleet management',
      'GPS tracking',
      'vehicle tracking',
      'fleet analytics',
      'geofencing',
      'maintenance management',
      'route optimization',
      'driver management',
      'fleet monitoring',
      'real-time tracking',
    ],
    authors: [
      {
        name: 'Fleet Management Platform',
        url: siteConfig.url,
      },
    ],
    creator: 'Fleet Management Platform',
    publisher: 'Fleet Management Platform',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        en: `${url}/en`,
        es: `${url}/es`,
        fr: `${url}/fr`,
        de: `${url}/de`,
        hi: `${url}/hi`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title,
      description: description || siteConfig.description,
      url,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
      creator: '@fleetmanagement',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}

// Structured Data Generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Fleet Street',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'Customer Support',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Spanish', 'French', 'German', 'Hindi'],
    },
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.github,
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  }
}

export function generateProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '29',
      highPrice: 'Custom',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '250',
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export { siteConfig }
