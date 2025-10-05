import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '../../../i18n/request'
import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import type { Metadata } from 'next'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: React.ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: {
    default: 'Fleet Management Platform | Real-Time Vehicle Tracking & Analytics',
    template: '%s | Fleet Management Platform'
  },
  description: 'Enterprise-grade fleet management solution with real-time GPS tracking, geofencing, maintenance management, and advanced analytics. Reduce costs and improve efficiency.',
  keywords: ['fleet management', 'GPS tracking', 'vehicle tracking', 'fleet analytics', 'geofencing', 'maintenance management'],
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  // Providing all messages to the client
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
