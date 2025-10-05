# Phase 3: Marketing Website UI Requirements

**Feature Branch**: `001-you-are-a`
**Phase**: PHASE 3 (T036-T050)
**Created**: 2025-10-05
**Status**: Component Analysis Complete

## Overview

This document provides a comprehensive analysis of UI requirements for the Fleet Management Platform marketing website, mapping all Phase 3 tasks (T036-T050) to required shadcn/ui components and design patterns.

The marketing website serves as the primary customer acquisition channel, showcasing product features, pricing plans, company information, and lead generation capabilities across 5 languages (English, Spanish, French, German, Hindi).

## Project Context

### Functional Requirements Coverage
- **FR-176**: Intuitive dashboard-driven interface
- **FR-177**: Role-adaptive UI (context: marketing site targets potential customers)
- **FR-178**: Interactive map visualization (feature showcase)
- **FR-179**: Multi-language support (5 languages)
- **FR-180**: WCAG 2.1 Level AA accessibility compliance
- **FR-181**: Contextual help and tooltips
- **FR-182**: Responsive design (desktop, tablet, mobile web)
- **FR-183**: Consistent navigation across modules
- **FR-184**: Loading states for async operations
- **FR-185**: Clear error messages with resolution guidance

### Technical Stack
- **Framework**: Next.js 14 with App Router
- **Internationalization**: next-intl
- **Content**: Contentlayer (MDX for blog)
- **Styling**: Tailwind CSS
- **Component Libraries**: shadcn/ui, Aceternity UI, Origin UI

---

## Component Inventory

### Available Registries
- **@shadcn**: Core UI components
- **@aceternity**: Advanced animated components
- **@originui**: Extended UI component variants
- **@cult**: Additional component library
- **@kibo**: Additional component library
- **@reui**: Additional component library

### Core Components Required

#### Layout & Navigation
- `navigation-menu` [@shadcn] - Main site navigation
- `separator` [@shadcn] - Visual section dividers
- `breadcrumb` [@shadcn] - Navigation context (if needed for nested pages)

#### Content Display
- `card` [@shadcn] - Feature cards, pricing cards, team cards
- `badge` [@shadcn] - Feature tags, plan indicators
- `avatar` [@shadcn] - Team member photos, testimonials
- `accordion` [@shadcn] - FAQ section on pricing page
- `tabs` [@shadcn] - Feature categorization, pricing plan switching
- `table` [@shadcn] - Pricing comparison table
- `separator` [@shadcn] - Content section dividers

#### Forms & Inputs
- `form` [@shadcn] - Form validation wrapper
- `input` [@shadcn] - Text inputs (name, email, company)
- `textarea` [@shadcn] - Message field for contact form
- `select` [@shadcn] - Fleet size selector, country/region selector
- `label` [@shadcn] - Form field labels
- `button` [@shadcn] - CTAs, form submissions

#### Marketing-Specific (Aceternity)
- `hero-parallax` [@aceternity] - Dynamic hero section
- `hero-highlight` [@aceternity] - Highlighted hero text
- `animated-testimonials` [@aceternity] - Customer testimonial carousel
- `3d-card` [@aceternity] - Interactive feature showcase cards
- `card-stack` [@aceternity] - Stacked content presentation

#### Interactive Elements
- `hover-card` [@shadcn] - Tooltip-like information on hover
- `tooltip` [@shadcn] - Contextual help (FR-181)

---

## Feature Breakdown by Task

### T036: Initialize Next.js 14 App
**Description**: Foundation setup for marketing website
**Components Required**: None (infrastructure setup)
**Files Created**:
- `apps/marketing/package.json`
- `apps/marketing/next.config.js`
- `apps/marketing/tsconfig.json`
- `apps/marketing/app/layout.tsx`
- `apps/marketing/app/page.tsx`

**Acceptance Criteria**: Next.js dev server runs on port 3000

---

### T037: Multi-language Support (next-intl)
**Description**: i18n configuration for 5 languages
**Components Required**: None (infrastructure)
**Files Created**:
- `apps/marketing/i18n.ts`
- `apps/marketing/app/[locale]/layout.tsx`

**Implementation Notes**:
- Configure language switcher in navigation
- All component text must be externalized to translation files
- URL structure: `/[locale]/page` pattern

**Acceptance Criteria**: Marketing site switches between 5 languages (English, Spanish, French, German, Hindi)

---

### T038: Homepage (/)
**Description**: Hero section, features overview, CTAs, customer logos
**Route**: `apps/marketing/app/[locale]/page.tsx`

**Components Required**:
1. **Hero Section**
   - `hero-parallax` [@aceternity] OR `hero-highlight` [@aceternity]
   - `button` [@shadcn] - Primary CTA ("Request Demo", "Start Free Trial")
   - `badge` [@shadcn] - "Trusted by 1000+ companies" indicator

2. **Features Overview**
   - `card` [@shadcn] - Feature highlight cards (3-6 cards)
   - `3d-card` [@aceternity] - Interactive feature cards (alternative)
   - `separator` [@shadcn] - Section dividers

3. **Social Proof**
   - Custom logo grid component (customer logos)
   - `animated-testimonials` [@aceternity] - Customer quotes

4. **CTA Section**
   - `button` [@shadcn] - Secondary CTA section
   - Custom component: `CTASection.tsx`

**Content Requirements**:
- Hero headline and subheadline
- 4-6 key benefits of fleet management
- Demo request CTA
- Customer logos (5-10 major clients)
- 2-3 testimonials

**Layout Structure**:
```
├── Hero Section (full viewport)
│   ├── Headline + Subheadline
│   ├── Primary CTA Buttons
│   └── Background gradient/animation
├── Features Overview Section
│   ├── Section Header
│   └── Feature Cards Grid (3-6 cards)
├── Social Proof Section
│   ├── Customer Logos Grid
│   └── Animated Testimonials
└── Final CTA Section
    ├── Compelling message
    └── CTA Buttons
```

**Acceptance Criteria**: Homepage renders with SEO meta tags, responsive design, smooth animations

---

### T039: Pricing Page (/pricing)
**Description**: Subscription tiers (Trial, Basic, Pro, Enterprise)
**Route**: `apps/marketing/app/[locale]/pricing/page.tsx`

**Components Required**:
1. **Pricing Cards**
   - `card` [@shadcn] - One card per plan (4 total)
   - `badge` [@shadcn] - "Most Popular" indicator
   - `button` [@shadcn] - "Choose Plan" CTA
   - `separator` [@shadcn] - Visual dividers within cards

2. **Feature Comparison**
   - `table` [@shadcn] - Detailed feature comparison matrix
   - `tabs` [@shadcn] - Toggle between monthly/yearly pricing

3. **FAQ Section**
   - `accordion` [@shadcn] - Expandable FAQ items (8-12 questions)

**Content Requirements**:
- 4 pricing tiers: Trial, Basic, Pro, Enterprise
- Price points for monthly/yearly billing
- Feature list for each tier
- Feature comparison table (20-30 features)
- FAQ section (8-12 common questions)

**Layout Structure**:
```
├── Pricing Header
│   └── Tabs (Monthly/Yearly Toggle)
├── Pricing Cards Grid (4 columns on desktop)
│   ├── Trial Card
│   ├── Basic Card
│   ├── Pro Card (highlighted)
│   └── Enterprise Card
├── Feature Comparison Table
│   └── Responsive Table with all features
└── FAQ Section
    └── Accordion with questions
```

**Acceptance Criteria**: Pricing page shows all plans (FR-004), responsive pricing cards, interactive comparison table

---

### T040: Features Page (/features)
**Description**: Detailed product features showcase
**Route**: `apps/marketing/app/[locale]/features/page.tsx`

**Components Required**:
1. **Feature Sections**
   - `card` [@shadcn] - Individual feature detail cards
   - `3d-card` [@aceternity] - Interactive feature demonstrations
   - `tabs` [@shadcn] - Feature category navigation
   - `separator` [@shadcn] - Section dividers

2. **Feature Details**
   - `badge` [@shadcn] - Feature category tags
   - `avatar` [@shadcn] - User persona icons (if applicable)
   - `hover-card` [@shadcn] - Additional feature info on hover

**Content Requirements**:
- 5 major feature categories:
  1. Real-time Vehicle Tracking
  2. Geofencing & Alerts
  3. Maintenance Management
  4. Analytics & Reporting
  5. Mobile Application

- Each category needs:
  - Title and description
  - 3-5 sub-features
  - Visual representation (screenshot/diagram)
  - Benefits/value proposition

**Layout Structure**:
```
├── Features Overview Hero
├── Feature Category Navigation (Tabs)
└── Feature Sections (5 major sections)
    ├── Tracking Features
    │   ├── Feature Cards Grid
    │   └── Screenshot/Demo
    ├── Geofencing Features
    ├── Maintenance Features
    ├── Analytics Features
    └── Mobile App Features
```

**Acceptance Criteria**: Features page highlights all major capabilities, smooth scrolling between sections

---

### T041: About Page (/about)
**Description**: Company information, mission, team
**Route**: `apps/marketing/app/[locale]/about/page.tsx`

**Components Required**:
1. **Company Information**
   - `card` [@shadcn] - Mission/Vision/Values cards
   - `separator` [@shadcn] - Section dividers

2. **Team Section**
   - `avatar` [@shadcn] - Team member photos
   - `card` [@shadcn] - Team member bio cards
   - Custom grid layout for team members

**Content Requirements**:
- Company mission statement
- Vision and values (3-5 core values)
- Team section (5-10 team members)
- Company timeline/milestones (optional)
- Office locations/contact info

**Layout Structure**:
```
├── Company Hero Section
├── Mission & Vision Section
│   └── Card Grid
├── Values Section
│   └── Value Cards (3-5 cards)
└── Team Section
    └── Team Member Cards Grid
        ├── Avatar
        ├── Name & Title
        └── Bio
```

**Acceptance Criteria**: About page renders with company information, responsive layout

---

### T042: Contact Page (/contact)
**Description**: Contact form, support information
**Route**: `apps/marketing/app/[locale]/contact/page.tsx`

**Components Required**:
1. **Contact Form**
   - `form` [@shadcn] - Form wrapper with validation
   - `input` [@shadcn] - Name, email, company fields
   - `textarea` [@shadcn] - Message field
   - `select` [@shadcn] - Subject/inquiry type dropdown
   - `label` [@shadcn] - Form labels
   - `button` [@shadcn] - Submit button

2. **Contact Information**
   - `card` [@shadcn] - Contact details card
   - `separator` [@shadcn] - Visual dividers

**Form Fields**:
- Name (required)
- Email (required, validated)
- Company (optional)
- Phone (optional)
- Subject/Inquiry Type (dropdown)
- Message (required)

**Layout Structure**:
```
├── Contact Header
└── Two-Column Layout
    ├── Contact Form (Left)
    │   ├── Form Fields
    │   └── Submit Button
    └── Contact Information (Right)
        ├── Email Address
        ├── Phone Number
        ├── Office Address
        └── Business Hours
```

**Validation Rules**:
- Email format validation
- Required field validation
- Character limits on message field
- Form submission success/error states (FR-184, FR-185)

**Acceptance Criteria**: Contact form submits (can be mocked initially), validation works, error messages display

---

### T043: Blog with Contentlayer (MDX)
**Description**: Blog content management with MDX
**Routes**:
- `apps/marketing/app/[locale]/blog/page.tsx` (list)
- `apps/marketing/app/[locale]/blog/[slug]/page.tsx` (detail)

**Components Required**:
1. **Blog List Page**
   - `card` [@shadcn] - Blog post preview cards
   - `badge` [@shadcn] - Post categories/tags
   - `avatar` [@shadcn] - Author photos
   - `separator` [@shadcn] - Post dividers

2. **Blog Detail Page**
   - `separator` [@shadcn] - Content dividers
   - `avatar` [@shadcn] - Author photo
   - `badge` [@shadcn] - Category badges
   - Typography components (from MDX)

3. **Navigation**
   - Pagination component (custom or from registry)
   - Search/filter (optional for MVP)

**Content Structure** (MDX Frontmatter):
```yaml
title: "Blog Post Title"
description: "Post excerpt"
date: "2025-01-15"
author: "Author Name"
category: "Fleet Management"
tags: ["tracking", "optimization"]
coverImage: "/images/blog/post-1.jpg"
```

**Layout Structure** (List Page):
```
├── Blog Header
├── Featured Post (large card)
└── Blog Post Grid
    └── Post Cards
        ├── Cover Image
        ├── Category Badge
        ├── Title & Excerpt
        ├── Author & Date
        └── Read More Link
```

**Layout Structure** (Detail Page):
```
├── Post Header
│   ├── Title
│   ├── Author Info (Avatar + Name)
│   ├── Date & Read Time
│   └── Category Badges
├── Cover Image
├── Article Content (MDX)
│   └── Rich formatting, code blocks, images
└── Post Footer
    ├── Tags
    └── Share Buttons
```

**Acceptance Criteria**: Blog posts render from MDX files, proper syntax highlighting, responsive images

---

### T044: Marketing Layout (Header, Footer, Navigation)
**Description**: Consistent layout across all marketing pages
**Files**:
- `apps/marketing/components/Header.tsx`
- `apps/marketing/components/Footer.tsx`
- `apps/marketing/components/Navigation.tsx`

**Components Required**:
1. **Header/Navigation**
   - `navigation-menu` [@shadcn] - Main navigation
   - `button` [@shadcn] - CTA buttons in header
   - Language switcher (custom component using `select` or dropdown)
   - Mobile menu (custom hamburger menu)

2. **Footer**
   - `separator` [@shadcn] - Footer sections divider
   - `button` [@shadcn] - Newsletter signup (optional)
   - `input` [@shadcn] - Newsletter email input (optional)

**Header Structure**:
```
Header
├── Logo
├── Navigation Menu
│   ├── Features (dropdown)
│   ├── Pricing
│   ├── About
│   ├── Blog
│   └── Contact
├── Language Switcher
└── CTA Buttons
    ├── Login
    └── Request Demo (primary)
```

**Footer Structure**:
```
Footer
├── Top Section (4-column grid)
│   ├── Product Column
│   │   ├── Features
│   │   ├── Pricing
│   │   └── Integrations
│   ├── Company Column
│   │   ├── About
│   │   ├── Blog
│   │   └── Careers
│   ├── Resources Column
│   │   ├── Documentation
│   │   ├── Support
│   │   └── Status Page
│   └── Legal Column
│       ├── Privacy Policy
│       ├── Terms of Service
│       └── Cookie Policy
├── Separator
└── Bottom Section
    ├── Copyright
    ├── Social Media Icons
    └── Language Selector
```

**Responsive Behavior**:
- Desktop (>1024px): Full navigation visible
- Tablet (768-1024px): Condensed navigation
- Mobile (<768px): Hamburger menu

**Acceptance Criteria**: Responsive navigation with language switcher, consistent across all pages (FR-183)

---

### T045: SEO Optimization (FR-096)
**Description**: Meta tags, sitemap, structured data
**Files**:
- `apps/marketing/app/sitemap.ts`
- `apps/marketing/app/robots.ts`
- `apps/marketing/lib/seo.ts`

**Components Required**: None (SEO utilities and configuration)

**SEO Requirements**:
1. **Meta Tags** (per page)
   - Title (unique, 50-60 characters)
   - Description (150-160 characters)
   - Open Graph tags (og:title, og:description, og:image)
   - Twitter Card tags
   - Canonical URLs
   - Language alternates (hreflang)

2. **Structured Data** (JSON-LD)
   - Organization schema
   - WebSite schema
   - Article schema (blog posts)
   - Product schema (pricing page)
   - BreadcrumbList schema

3. **Sitemap & Robots**
   - Dynamic sitemap generation
   - robots.txt configuration
   - All pages indexed appropriately

**Acceptance Criteria**: Lighthouse SEO score >90

---

### T046: Reusable Marketing Components
**Description**: Custom reusable components for marketing pages
**Files**:
- `apps/marketing/components/CTASection.tsx`
- `apps/marketing/components/FeatureCard.tsx`
- `apps/marketing/components/Testimonial.tsx`

**Components to Build**:

#### 1. CTASection Component
**Base Components**: `button` [@shadcn], `separator` [@shadcn]
```typescript
interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  variant?: 'default' | 'gradient' | 'outlined';
}
```

#### 2. FeatureCard Component
**Base Components**: `card` [@shadcn], `badge` [@shadcn]
```typescript
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category?: string;
  link?: {
    text: string;
    href: string;
  };
}
```

#### 3. Testimonial Component
**Base Components**: `card` [@shadcn], `avatar` [@shadcn]
```typescript
interface TestimonialProps {
  quote: string;
  author: {
    name: string;
    title: string;
    company: string;
    avatar: string;
  };
  rating?: number; // 1-5 stars (optional)
}
```

**Acceptance Criteria**: Components reusable across all marketing pages, fully typed with TypeScript

---

### T047: Image Optimization
**Description**: Performance optimization using Next.js Image
**Components Required**: None (Next.js built-in)

**Implementation**:
- Replace all `<img>` tags with `<Image>` from `next/image`
- Configure image domains in `next.config.js`
- Implement proper sizing and lazy loading
- Use responsive image sizes

**Acceptance Criteria**: Lighthouse Performance score >90

---

### T048: Analytics Tracking
**Description**: Marketing analytics integration
**File**: `apps/marketing/lib/analytics.ts`

**Components Required**: None (tracking utilities)

**Events to Track**:
- Page views
- CTA button clicks
- Form submissions (demo requests, contact)
- Pricing plan selections
- Blog post views
- Language switches

**Acceptance Criteria**: Page views tracked in analytics platform (Google Analytics/Plausible)

---

### T049: Demo Request Form
**Description**: Lead generation form
**Route**: `apps/marketing/app/[locale]/demo/page.tsx`

**Components Required**:
- `form` [@shadcn] - Form wrapper
- `input` [@shadcn] - Name, email, company, phone
- `select` [@shadcn] - Fleet size, industry
- `textarea` [@shadcn] - Additional requirements
- `label` [@shadcn] - Form labels
- `button` [@shadcn] - Submit button
- `card` [@shadcn] - Form container

**Form Fields**:
1. Full Name (required)
2. Email Address (required, validated)
3. Company Name (required)
4. Phone Number (optional)
5. Fleet Size (required, dropdown)
   - Options: 1-10, 11-50, 51-100, 101-500, 500+
6. Industry (optional, dropdown)
   - Options: Transportation, Logistics, Construction, Utilities, Government, Other
7. Additional Requirements (optional, textarea)

**Validation Rules**:
- Email format validation
- Phone number format (if provided)
- Required field validation
- Fleet size must be selected
- Success/error states with toast notifications

**Layout Structure**:
```
Demo Request Page
├── Header Section
│   ├── Title: "Request a Demo"
│   └── Subheadline
└── Two-Column Layout
    ├── Form Card (Left, 60%)
    │   ├── Form Fields
    │   └── Submit Button
    └── Benefits Sidebar (Right, 40%)
        ├── "What to Expect" List
        ├── Testimonial
        └── Contact Info
```

**Acceptance Criteria**: Form collects name, email, company, fleet size; validation works; submission success/error states

---

### T050: Testing & Deployment Configuration
**Description**: Build verification and deployment setup
**Files**: `apps/marketing/vercel.json`, E2E tests

**Components Required**: None (infrastructure)

**Testing Requirements**:
- Static page generation verification
- i18n route testing
- Form submission testing
- Image optimization verification
- SEO meta tags verification

**Deployment Configuration**:
- Vercel environment variables
- Build output optimization
- Static page caching strategy
- Internationalized routing configuration

**Acceptance Criteria**: `yarn build` succeeds, all static pages generated correctly

---

## Component Relationships & Dependencies

### Primary Component Hierarchy

```
App Layout (@shadcn navigation-menu, separator)
├── Header
│   ├── Navigation Menu
│   │   └── Dropdown Menus
│   └── Language Switcher
├── Page Content
│   └── Page-Specific Components
│       ├── Hero Sections (@aceternity hero-parallax, hero-highlight)
│       ├── Feature Cards (@shadcn card, @aceternity 3d-card)
│       ├── Forms (@shadcn form, input, textarea, select, label, button)
│       ├── Testimonials (@aceternity animated-testimonials)
│       ├── Pricing Cards (@shadcn card, badge, tabs, table)
│       ├── Blog Components (@shadcn card, avatar, badge)
│       └── CTAs (custom CTASection with @shadcn button)
└── Footer
    ├── Footer Links Grid
    └── Newsletter Signup (optional)
```

### Data Flow Patterns

1. **Static Content Flow** (Homepage, Features, About)
   - Content defined in translation files (i18n)
   - Components receive translated strings via next-intl
   - No external API calls for MVP

2. **Form Submission Flow** (Contact, Demo Request)
   - User input → Client-side validation (@shadcn form)
   - Submit → Server action/API route (can be mocked)
   - Response → Success/error toast notification
   - Success → Redirect or confirmation message

3. **Blog Content Flow** (MDX)
   - MDX files → Contentlayer processing
   - Static generation at build time
   - Blog list page → filtered/sorted posts
   - Blog detail page → rendered MDX content

4. **Language Switching Flow**
   - User selects language → next-intl locale change
   - Route updates: `/page` → `/[locale]/page`
   - All UI text updates from translation files
   - Preference saved in cookie/localStorage

---

## Layout & Composition Requirements

### Responsive Breakpoints
Following Tailwind CSS defaults:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm to lg)
- **Desktop**: > 1024px (lg+)

### Grid Systems

#### Homepage
- Hero: Full viewport height
- Features: 3-column grid (desktop) → 2-column (tablet) → 1-column (mobile)
- Testimonials: Full-width carousel
- CTA: Centered, max-width container

#### Pricing Page
- Pricing cards: 4-column grid (desktop) → 2-column (tablet) → 1-column (mobile)
- Comparison table: Horizontal scroll on mobile

#### Features Page
- Feature sections: Alternating left/right image + text layout
- Feature cards: 3-column grid → 2-column → 1-column

#### Blog
- Blog list: 3-column grid → 2-column → 1-column
- Blog detail: Single column, max-width 768px

### Spacing & Typography
- Section padding: 80px (desktop), 40px (mobile)
- Card spacing: 24px gap
- Heading hierarchy: h1 (48px) → h2 (36px) → h3 (24px) → h4 (20px)
- Body text: 16px base, 1.5 line-height

---

## Interactive Patterns Needed

### User Interactions

1. **Navigation**
   - Hover states on navigation items
   - Dropdown menus on desktop
   - Mobile hamburger menu with slide-in animation
   - Smooth scroll to sections (anchor links)

2. **Forms**
   - Real-time validation on blur
   - Error message display inline
   - Success/error toast notifications
   - Loading states during submission (FR-184)
   - Disabled state on submit button while processing

3. **Pricing Page**
   - Monthly/yearly toggle with smooth transition
   - Highlighted "Most Popular" plan
   - Hover effects on pricing cards
   - Accordion expand/collapse for FAQ

4. **Homepage**
   - Parallax scrolling effects (hero section)
   - Animated testimonial carousel
   - Auto-play with pause on hover
   - CTA button hover/press animations

5. **Features Page**
   - Tab switching between feature categories
   - Lazy-loaded images on scroll
   - Hover cards for additional details

6. **Blog**
   - Card hover effects (lift, shadow)
   - Tag/category filtering (future enhancement)
   - Read time calculation display

---

## Form Components & Validation Requirements

### Contact Form (T042)

**Fields & Validation**:
```typescript
{
  name: {
    type: 'text',
    required: true,
    minLength: 2,
    maxLength: 100,
    errorMessages: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
    }
  },
  email: {
    type: 'email',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessages: {
      required: 'Email is required',
      pattern: 'Please enter a valid email address',
    }
  },
  company: {
    type: 'text',
    required: false,
    maxLength: 100,
  },
  subject: {
    type: 'select',
    required: true,
    options: ['General Inquiry', 'Sales', 'Support', 'Partnership'],
    errorMessages: {
      required: 'Please select a subject',
    }
  },
  message: {
    type: 'textarea',
    required: true,
    minLength: 10,
    maxLength: 1000,
    errorMessages: {
      required: 'Message is required',
      minLength: 'Message must be at least 10 characters',
      maxLength: 'Message cannot exceed 1000 characters',
    }
  }
}
```

### Demo Request Form (T049)

**Fields & Validation**:
```typescript
{
  fullName: {
    type: 'text',
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    type: 'email',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  company: {
    type: 'text',
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  phone: {
    type: 'tel',
    required: false,
    pattern: /^[\d\s\-\+\(\)]+$/,
  },
  fleetSize: {
    type: 'select',
    required: true,
    options: ['1-10', '11-50', '51-100', '101-500', '500+'],
  },
  industry: {
    type: 'select',
    required: false,
    options: [
      'Transportation',
      'Logistics',
      'Construction',
      'Utilities',
      'Government',
      'Other'
    ],
  },
  requirements: {
    type: 'textarea',
    required: false,
    maxLength: 500,
  }
}
```

### Form Validation Strategy
- **Client-side**: Real-time validation using react-hook-form + zod
- **Server-side**: Additional validation before submission (mocked for MVP)
- **Error Display**: Inline errors below fields (FR-185)
- **Success State**: Toast notification + optional redirect
- **Loading State**: Button disabled with spinner (FR-184)

---

## Accessibility Requirements (FR-180)

### WCAG 2.1 Level AA Compliance

#### Keyboard Navigation
- All interactive elements focusable via Tab
- Logical tab order throughout pages
- Skip to main content link
- Escape key closes modals/dropdowns
- Enter/Space activates buttons

#### Screen Reader Support
- Semantic HTML elements (header, nav, main, footer, article)
- ARIA labels on icon-only buttons
- ARIA live regions for dynamic content (toasts)
- Alt text on all images
- Form labels properly associated with inputs
- Error messages announced to screen readers

#### Visual Accessibility
- Color contrast ratio ≥ 4.5:1 for normal text
- Color contrast ratio ≥ 3:1 for large text
- Focus indicators visible on all interactive elements
- Text resizable up to 200% without breaking layout
- No information conveyed by color alone

#### Component-Specific Accessibility

**Navigation Menu**:
- `aria-expanded` on dropdown triggers
- `aria-current="page"` on active links
- Keyboard arrow navigation for dropdowns

**Forms**:
- `<label>` for every input
- `aria-describedby` for error messages
- `aria-invalid` on fields with errors
- Required fields indicated visually and with `aria-required`

**Accordion (FAQ)**:
- `aria-expanded` on accordion triggers
- `aria-controls` linking trigger to panel
- Unique IDs for each panel

**Tabs (Pricing toggle)**:
- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected` on active tab
- Keyboard arrow navigation

**Carousel (Testimonials)**:
- `aria-label` on carousel
- Play/pause button for auto-play
- Previous/next buttons with clear labels

---

## Special Considerations for Marketing Website

### Performance Optimization
1. **Critical CSS Inlining**: Above-the-fold styles inlined
2. **Image Optimization**: Next.js Image with WebP format, lazy loading
3. **Code Splitting**: Route-based splitting with Next.js
4. **Font Loading**: Self-hosted fonts with font-display: swap
5. **Third-party Scripts**: Deferred loading for analytics

**Target Metrics**:
- Lighthouse Performance: >90
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1

### SEO Considerations
1. **Unique Meta Tags**: Each page has unique title/description
2. **Structured Data**: Organization, Article, Product schemas
3. **Canonical URLs**: Prevent duplicate content issues
4. **Hreflang Tags**: Multi-language support
5. **Internal Linking**: Proper link structure between pages
6. **Sitemap**: Dynamic generation of all routes
7. **Mobile-Friendly**: Responsive design passes Google mobile test

### Internationalization (i18n)
1. **Translation Files**: Organized by page/component
2. **Locale Detection**: Browser preference → URL → default (en)
3. **Language Switcher**: Persistent across pages
4. **RTL Support**: Future consideration for Arabic/Hebrew
5. **Number/Date Formatting**: Locale-specific formatting
6. **Currency**: Display prices in local currencies (future)

### Content Management
1. **Blog**: MDX files in `/content/blog/` directory
2. **Static Content**: Translation JSON files
3. **Images**: Organized in `/public/images/` by page/section
4. **CMS Integration**: Future consideration for non-technical editors

### Analytics & Tracking
1. **Page Views**: Track all page navigations
2. **CTAs**: Track all button clicks (demo, contact, pricing)
3. **Forms**: Track submission attempts and completions
4. **Language Switches**: Track user language preferences
5. **Scroll Depth**: Measure engagement on long pages
6. **Conversion Funnels**: Demo request → Trial signup

### Lead Generation
1. **Demo Form**: Primary lead capture (T049)
2. **Contact Form**: Secondary inquiries (T042)
3. **Newsletter Signup**: Optional footer signup
4. **Pricing CTA**: Direct links to trial signup
5. **Exit Intent**: Future consideration for popup

### Brand Consistency
1. **Color Palette**: Define primary, secondary, accent colors
2. **Typography**: Consistent font families and scales
3. **Spacing System**: 8px base unit for margins/padding
4. **Button Styles**: Primary, secondary, outline variants
5. **Card Styles**: Consistent shadows, borders, hover states
6. **Iconography**: Consistent icon set (Lucide, Heroicons, etc.)

---

## Implementation Priority

### Phase 3A: Foundation (Week 1)
- T036: Next.js setup
- T037: i18n configuration
- T044: Header, Footer, Navigation
- T045: SEO utilities

### Phase 3B: Core Pages (Week 2)
- T038: Homepage
- T039: Pricing page
- T046: Reusable components

### Phase 3C: Secondary Pages (Week 3)
- T040: Features page
- T041: About page
- T042: Contact page
- T049: Demo request form

### Phase 3D: Content & Polish (Week 4)
- T043: Blog setup
- T047: Image optimization
- T048: Analytics
- T050: Testing & deployment

---

## Component Add Commands

### Core Components to Install

```bash
# Layout & Navigation
npx shadcn@latest add navigation-menu
npx shadcn@latest add separator
npx shadcn@latest add breadcrumb

# Content Display
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add accordion
npx shadcn@latest add tabs
npx shadcn@latest add table

# Forms
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add button

# Interactive
npx shadcn@latest add hover-card
npx shadcn@latest add tooltip

# Aceternity (Marketing-specific)
npx shadcn@latest add @aceternity/hero-parallax
npx shadcn@latest add @aceternity/hero-highlight
npx shadcn@latest add @aceternity/animated-testimonials
npx shadcn@latest add @aceternity/3d-card
npx shadcn@latest add @aceternity/card-stack
```

---

## Conclusion

This requirements document provides a comprehensive mapping of all Phase 3 marketing website tasks to required shadcn/ui components. The marketing site will leverage 20+ core components from @shadcn, @aceternity, and @originui registries to create an engaging, accessible, and high-performance customer acquisition platform.

**Key Deliverables**:
- 7 main pages (Home, Pricing, Features, About, Contact, Blog List, Blog Detail, Demo)
- Multi-language support (5 languages)
- SEO-optimized with Lighthouse scores >90
- WCAG 2.1 Level AA accessible
- Fully responsive across devices
- Lead generation forms with validation
- Blog powered by MDX

**Next Steps**:
1. Begin with Phase 3A foundation tasks (T036, T037, T044, T045)
2. Install core shadcn components
3. Develop reusable marketing components (T046)
4. Implement page-by-page following priority order
5. Integrate analytics and SEO optimization
6. Conduct accessibility audit and performance testing
