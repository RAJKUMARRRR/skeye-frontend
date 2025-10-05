export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  hi: 'हिन्दी',
} as const

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export const RTL_LANGUAGES: SupportedLanguage[] = []

export function isRTL(language: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(language)
}

export function getLanguageName(code: SupportedLanguage): string {
  return SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE]
}
