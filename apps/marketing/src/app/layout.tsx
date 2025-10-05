import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fleet Management Platform | Modern Fleet Tracking & Analytics',
  description: 'Enterprise-grade fleet management solution with real-time tracking, geofencing, maintenance management, and advanced analytics.',
  keywords: ['fleet management', 'vehicle tracking', 'GPS tracking', 'fleet analytics', 'geofencing'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
