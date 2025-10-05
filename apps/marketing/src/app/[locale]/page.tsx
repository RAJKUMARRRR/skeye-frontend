import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FeatureCard, FeatureGrid } from '@/components/marketing/FeatureCard'
import { Testimonial, TestimonialGrid } from '@/components/marketing/Testimonial'
import { CTASection } from '@/components/marketing/CTASection'

export default function HomePage() {
  const t = useTranslations()

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: t('home.features.tracking.title'),
      description: t('home.features.tracking.description'),
      link: { text: t('common.learnMore'), href: '/features#tracking' },
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a7 7 0 1 0 10 10" />
        </svg>
      ),
      title: t('home.features.geofencing.title'),
      description: t('home.features.geofencing.description'),
      link: { text: t('common.learnMore'), href: '/features#geofencing' },
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      title: t('home.features.maintenance.title'),
      description: t('home.features.maintenance.description'),
      link: { text: t('common.learnMore'), href: '/features#maintenance' },
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <line x1="12" x2="12" y1="20" y2="10" />
          <line x1="18" x2="18" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="16" />
        </svg>
      ),
      title: t('home.features.analytics.title'),
      description: t('home.features.analytics.description'),
      link: { text: t('common.learnMore'), href: '/features#analytics' },
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <rect width="7" height="13" x="6" y="8" rx="1" />
          <path d="M18 8v5M21 8v2" />
          <path d="m3 8 4-4 4 4" />
        </svg>
      ),
      title: t('home.features.mobile.title'),
      description: t('home.features.mobile.description'),
      link: { text: t('common.learnMore'), href: '/features#mobile' },
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M10.5 5H19a2 2 0 0 1 2 2v8.5" />
          <path d="M17 11h-.5" />
          <path d="M19 19H7a2 2 0 0 1-2-2V7" />
          <path d="m2 2 20 20" />
          <circle cx="7.5" cy="15.5" r="5.5" />
        </svg>
      ),
      title: t('home.features.alerts.title'),
      description: t('home.features.alerts.description'),
      link: { text: t('common.learnMore'), href: '/features#alerts' },
    },
  ]

  const testimonials = [
    {
      quote: "This platform has completely transformed how we manage our fleet. Real-time tracking and automated maintenance alerts have saved us countless hours.",
      author: {
        name: "Sarah Johnson",
        title: "Fleet Manager",
        company: "TransportCo",
        avatar: "",
      },
      rating: 5,
    },
    {
      quote: "The analytics dashboard provides insights we never had before. We've reduced fuel costs by 20% in just three months.",
      author: {
        name: "Michael Chen",
        title: "Operations Director",
        company: "LogisticsPro",
        avatar: "",
      },
      rating: 5,
    },
    {
      quote: "Easy to use, powerful features, and excellent customer support. Highly recommended for any fleet operation.",
      author: {
        name: "Emily Rodriguez",
        title: "CEO",
        company: "DeliveryFirst",
        avatar: "",
      },
      rating: 5,
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              {t('home.hero.badge')}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {t('home.hero.description')}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/demo">{t('home.hero.cta.primary')}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">{t('home.hero.cta.secondary')}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-background" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              {t('home.features.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="mt-16">
            <FeatureGrid>
              {features.map((feature, i) => (
                <FeatureCard key={i} {...feature} />
              ))}
            </FeatureGrid>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              {t('home.testimonials.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="mt-16">
            <TestimonialGrid>
              {testimonials.map((testimonial, i) => (
                <Testimonial key={i} {...testimonial} />
              ))}
            </TestimonialGrid>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t('home.cta.title')}
        description={t('home.cta.description')}
        primaryCTA={{ text: t('home.cta.button'), href: '/demo' }}
        secondaryCTA={{ text: t('navigation.pricing'), href: '/pricing' }}
        variant="gradient"
      />
    </>
  )
}
