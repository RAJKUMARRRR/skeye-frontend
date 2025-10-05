const { withContentlayer } = require('next-contentlayer2')
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@fleet/ui-web', '@fleet/utils'],

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Internationalization will be handled by next-intl middleware
  experimental: {
    optimizeCss: true,
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
        missing: [
          {
            type: 'header',
            key: 'x-locale',
          },
        ],
      },
    ]
  },
}

module.exports = withContentlayer(withNextIntl(nextConfig))
