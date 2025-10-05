export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
  }
}

export const themes: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '59 130 246',
      primaryForeground: '255 255 255',
      secondary: '100 116 139',
      secondaryForeground: '255 255 255',
      accent: '34 197 94',
      accentForeground: '255 255 255',
      destructive: '239 68 68',
      destructiveForeground: '255 255 255',
    },
  },
  acme: {
    id: 'acme',
    name: 'ACME Company',
    colors: {
      primary: '220 38 38',
      primaryForeground: '255 255 255',
      secondary: '100 116 139',
      secondaryForeground: '255 255 255',
      accent: '251 146 60',
      accentForeground: '255 255 255',
      destructive: '239 68 68',
      destructiveForeground: '255 255 255',
    },
  },
  techfleet: {
    id: 'techfleet',
    name: 'TechFleet',
    colors: {
      primary: '37 99 235',
      primaryForeground: '255 255 255',
      secondary: '100 116 139',
      secondaryForeground: '255 255 255',
      accent: '14 165 233',
      accentForeground: '255 255 255',
      destructive: '239 68 68',
      destructiveForeground: '255 255 255',
    },
  },
  greenlogistics: {
    id: 'greenlogistics',
    name: 'Green Logistics',
    colors: {
      primary: '21 128 61',
      primaryForeground: '255 255 255',
      secondary: '100 116 139',
      secondaryForeground: '255 255 255',
      accent: '132 204 22',
      accentForeground: '255 255 255',
      destructive: '239 68 68',
      destructiveForeground: '255 255 255',
    },
  },
}

/**
 * Apply theme to document root
 */
export function applyTheme(themeId: string) {
  const theme = themes[themeId]
  if (!theme) return

  document.documentElement.setAttribute('data-theme', themeId)

  // Optionally update CSS variables programmatically
  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVarName, value)
  })
}

/**
 * Toggle dark mode
 */
export function toggleDarkMode() {
  const html = document.documentElement
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    localStorage.setItem('theme-mode', 'light')
  } else {
    html.classList.add('dark')
    localStorage.setItem('theme-mode', 'dark')
  }
}

/**
 * Initialize theme from localStorage
 */
export function initializeTheme() {
  const savedMode = localStorage.getItem('theme-mode')
  const savedTheme = localStorage.getItem('theme-id')

  if (savedMode === 'dark') {
    document.documentElement.classList.add('dark')
  }

  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme)
  }
}
