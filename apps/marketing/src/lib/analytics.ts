// Analytics tracking utilities

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Google Analytics page view
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Google Analytics event tracking
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track specific events
export const trackDemoRequest = () => {
  event({
    action: 'demo_request',
    category: 'engagement',
    label: 'Demo Request Form',
  })
}

export const trackContactSubmit = () => {
  event({
    action: 'contact_submit',
    category: 'engagement',
    label: 'Contact Form',
  })
}

export const trackPlanSelection = (plan: string) => {
  event({
    action: 'plan_selection',
    category: 'conversion',
    label: plan,
  })
}

export const trackLanguageChange = (language: string) => {
  event({
    action: 'language_change',
    category: 'engagement',
    label: language,
  })
}

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}
