import createMiddleware from 'next-intl/middleware'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { locales } from '../i18n/request'

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',

  // Automatically detect user's preferred locale
  localeDetection: true,
})

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard and admin routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // Run internationalization middleware
  return intlMiddleware(req)
})

export const config = {
  // Match only internationalized pathnames and auth routes
  matcher: [
    '/',
    '/(en|es|fr|de|hi)/:path*',
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ]
}
