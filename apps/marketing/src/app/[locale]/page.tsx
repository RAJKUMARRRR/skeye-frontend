'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/marketing/CTASection'
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { motion } from 'framer-motion'

export default function HomePage() {
  const t = useTranslations()

  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Real-Time GPS Tracking',
      description: 'Monitor all vehicles with sub-meter precision. Updates every 10-30 seconds with intelligent clustering for large fleets.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      title: 'Smart Geofencing',
      description: 'Create unlimited virtual boundaries. Get instant alerts when vehicles enter or exit specific zones.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Route Optimization',
      description: 'AI-powered routing that saves time and fuel. Considers traffic, capacity, and time windows automatically.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Vehicle Diagnostics',
      description: 'Real-time health monitoring with predictive maintenance alerts. Prevent breakdowns before they happen.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Driver Safety',
      description: 'Monitor speeding, harsh braking, and aggressive driving. Improve safety scores and reduce insurance costs.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Analytics & Reports',
      description: 'Pre-built and custom dashboards. Export to Excel, PDF, or integrate with your BI tools.',
    },
  ]

  const testimonials = [
    {
      quote: "This platform has completely transformed how we manage our fleet. Real-time tracking and automated maintenance alerts have saved us countless hours and thousands in repair costs.",
      name: "Sarah Johnson",
      designation: "Fleet Manager at TransportCo",
    },
    {
      quote: "The analytics dashboard provides insights we never had before. We've reduced fuel costs by 20% in just three months. The ROI has been incredible.",
      name: "Michael Chen",
      designation: "Operations Director at LogisticsPro",
    },
    {
      quote: "Easy to use, powerful features, and excellent customer support. The mobile app keeps me connected to my fleet 24/7. Highly recommended for any fleet operation.",
      name: "Emily Rodriguez",
      designation: "CEO at DeliveryFirst",
    },
  ]

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '10K+', label: 'Vehicles Tracked' },
    { value: '30%', label: 'Cost Reduction' },
    { value: '<500ms', label: 'Update Speed' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-24 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Real-time fleet intelligence
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6 text-center text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            >
              Fleet management{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  built for scale
                </span>
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-primary/40"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,7 Q50,0 100,7 T200,7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted-foreground md:text-xl"
            >
              Monitor vehicles in real-time, optimize routes with AI, prevent breakdowns with predictive maintenance. Everything you need to run a modern fleet.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <MagneticButton>
                <Button size="lg" className="group relative overflow-hidden bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40" asChild>
                  <Link href="/demo">
                    <span className="relative z-10">Request Demo</span>
                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/60 hover:bg-primary/5" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-1 text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

          {/* Gradient orbs */}
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need in one platform
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features that help you track, optimize, and manage your entire fleet from a single dashboard.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>

                {/* Hover gradient */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button variant="outline" size="lg" className="border-border/60 hover:border-primary/60 hover:bg-primary/5" asChild>
              <Link href="/features">
                View All Features
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border/40 bg-muted/20 py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Trusted by fleet managers worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              See how companies are transforming their operations with our platform.
            </p>
          </motion.div>

          <AnimatedTestimonials testimonials={testimonials} autoplay />
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to optimize your fleet?"
        description="Join thousands of fleet managers who have already made the switch. Start your free trial today."
        primaryCTA={{ text: 'Request Demo', href: '/demo' }}
        secondaryCTA={{ text: 'View Pricing', href: '/pricing' }}
      />
    </>
  )
}
