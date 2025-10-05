'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '../../../i18n/request'
import { cn } from '@/lib/utils'

const languageNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  hi: 'हिन्दी',
}

const languageFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  hi: '🇮🇳',
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        aria-label="Change language"
      >
        <span>{languageFlags[locale]}</span>
        <span className="hidden sm:inline">{languageNames[locale]}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-md border bg-popover p-1 shadow-md group-hover:block">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn(
              'flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-muted',
              locale === loc && 'bg-muted font-medium'
            )}
          >
            <span>{languageFlags[loc]}</span>
            <span>{languageNames[loc]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
