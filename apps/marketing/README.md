# Fleet Management Platform - Marketing Website

Enterprise-grade marketing website built with Next.js 14, featuring multi-language support, SEO optimization, and production-ready components.

## Features

- **Next.js 14 App Router**: Latest Next.js with server components and streaming
- **Multi-language Support**: 5 languages (English, Spanish, French, German, Hindi) with next-intl
- **SEO Optimized**: Meta tags, structured data, sitemap, robots.txt
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation
- **Accessible**: WCAG 2.1 Level AA compliant
- **Performance**: Lighthouse scores >90

## Tech Stack

- **Framework**: Next.js 14.2.0
- **UI Components**: shadcn/ui (custom implementation)
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Forms**: React Hook Form + Zod validation (ready for integration)
- **Analytics**: Google Analytics integration utilities

## Project Structure

```
apps/marketing/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── pricing/       # Pricing page
│   │   │   ├── features/      # Features page
│   │   │   ├── about/         # About page
│   │   │   ├── contact/       # Contact page
│   │   │   ├── demo/          # Demo request page
│   │   │   ├── blog/          # Blog pages
│   │   │   └── layout.tsx     # Locale layout
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   ├── robots.ts          # Robots configuration
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Root redirect
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── marketing/         # Marketing-specific components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   └── Testimonial.tsx
│   │   └── ui/                # Base UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── accordion.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       ├── label.tsx
│   │       └── select.tsx
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   ├── seo.ts             # SEO utilities
│   │   └── analytics.ts       # Analytics tracking
│   ├── i18n.ts                # i18n configuration
│   └── middleware.ts          # Locale detection middleware
├── messages/                   # Translation files
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   ├── de.json
│   └── hi.json
├── public/                     # Static assets
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── vercel.json                # Deployment configuration
└── package.json
```

## Pages

### Implemented Pages

1. **Homepage (/)**: Hero section, features overview, testimonials, CTAs
2. **Pricing (/pricing)**: 4 pricing tiers, FAQ accordion
3. **Features (/features)**: Detailed feature showcase
4. **About (/about)**: Company info, mission, team
5. **Contact (/contact)**: Contact form with validation
6. **Demo (/demo)**: Demo request form
7. **Blog (/blog)**: Blog listing page

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- Compatible with the monorepo structure

### Installation

```bash
# From repository root
yarn install

# Or from marketing app directory
cd apps/marketing
yarn install
```

### Development

```bash
# Start development server
yarn dev

# Development server runs on http://localhost:3000
# Default locale redirect to /en
```

### Build

```bash
# Production build
yarn build

# Start production server
yarn start

# Type checking
yarn type-check

# Linting
yarn lint
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=fleetmanagement.com

# Google Site Verification (optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
```

### Locales

Supported languages are configured in `src/i18n.ts`:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)

All UI text is externalized in `messages/[locale].json` files.

## Components

### Marketing Components

#### CTASection
Call-to-action sections with primary and secondary buttons.

```tsx
<CTASection
  title="Ready to get started?"
  description="Join thousands of companies"
  primaryCTA={{ text: "Start Trial", href: "/demo" }}
  secondaryCTA={{ text: "View Pricing", href: "/pricing" }}
  variant="gradient"
/>
```

#### FeatureCard
Feature showcase cards with icons and descriptions.

```tsx
<FeatureCard
  icon={<Icon />}
  title="Real-Time Tracking"
  description="Monitor your fleet in real-time"
  category="Tracking"
  link={{ text: "Learn More", href: "/features" }}
/>
```

#### Testimonial
Customer testimonial cards with ratings.

```tsx
<Testimonial
  quote="This platform transformed our operations"
  author={{
    name: "John Doe",
    title: "Fleet Manager",
    company: "TransportCo",
    avatar: "/avatars/john.jpg"
  }}
  rating={5}
/>
```

### UI Components

All base UI components follow shadcn/ui patterns:
- Button (variants: default, outline, ghost, link)
- Card (with Header, Content, Footer)
- Badge (variants: default, secondary, outline)
- Accordion (for FAQ sections)
- Form inputs (Input, Textarea, Select, Label)

## SEO

### Meta Tags

All pages include comprehensive meta tags:
- Title and description
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Language alternates (hreflang)

### Structured Data

JSON-LD structured data implemented:
- Organization schema
- Website schema
- Product schema
- Breadcrumb schema

### Performance

- Image optimization with Next.js Image
- Code splitting by route
- Static generation for all pages
- Optimized CSS with Tailwind

## Internationalization

### Adding a New Locale

1. Add locale to `src/i18n.ts`:
```typescript
export const locales = ['en', 'es', 'fr', 'de', 'hi', 'ja'] as const
```

2. Create translation file:
```bash
cp messages/en.json messages/ja.json
```

3. Translate content in `messages/ja.json`

4. Update sitemap and SEO alternates

### Using Translations

```tsx
import { useTranslations } from 'next-intl'

function Component() {
  const t = useTranslations('navigation')
  return <div>{t('features')}</div>
}
```

## Forms

### Contact Form

Includes validation for:
- Name (required, min 2 chars)
- Email (required, valid format)
- Subject selection (required)
- Message (required, 10-1000 chars)

### Demo Request Form

Includes fields for:
- Full name, email, company (required)
- Phone, industry (optional)
- Fleet size (required, dropdown)
- Additional requirements (textarea)

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

Configuration in `vercel.json` includes:
- Security headers
- Locale redirects
- Build optimization

### Build Output

```bash
yarn build
```

Generates optimized static pages:
- All locale pages pre-rendered
- Automatic code splitting
- Optimized images and fonts

## Analytics

Track key events:
- Page views
- Demo requests
- Contact form submissions
- Plan selections
- Language changes

Integration ready for:
- Google Analytics
- Plausible Analytics
- Custom analytics providers

## Accessibility

WCAG 2.1 Level AA compliance:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support
- Color contrast compliance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Targets

- Lighthouse Performance: >90
- First Contentful Paint: <1.8s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Time to Interactive: <3.5s

## Contributing

### Code Style

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Component Development

1. Create component in `src/components/`
2. Add TypeScript interfaces
3. Include accessibility attributes
4. Test responsive behavior
5. Add to Storybook (if applicable)

## License

Proprietary - Fleet Management Platform

## Support

For questions or issues:
- Documentation: `/docs`
- Support: support@fleetmanagement.com
- GitHub Issues: [repository]/issues

---

Built with ❤️ by the Fleet Management Platform Team
