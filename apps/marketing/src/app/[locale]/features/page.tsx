'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { CTASection } from '@/components/marketing/CTASection'
import Image from 'next/image'
import {
  GPSTrackingViz,
  GeofenceViz,
  RouteOptimizationViz,
  VehicleDiagnosticsViz,
  DriverSafetyViz,
  AnalyticsDashboardViz
} from '@/components/visualizations'

export default function FeaturesPage() {
  const t = useTranslations('features')

  const features = [
    {
      category: 'Real-Time Tracking',
      title: 'Live vehicle monitoring with precision GPS',
      description: 'Track every vehicle in your fleet with pinpoint accuracy. Our system updates vehicle positions every 10-30 seconds, giving you real-time visibility into your entire operation. See exactly where each vehicle is, where it has been, and where it is going.',
      details: [
        'Sub-meter GPS accuracy with multi-constellation support (GPS, GLONASS, Galileo)',
        'Automatic map updates with intelligent vehicle clustering for large fleets',
        '360° historical playback with speed and route visualization',
        'Real-time traffic overlay and ETA predictions',
        'Mobile-optimized tracking for on-the-go fleet managers',
      ],
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      visualization: <GPSTrackingViz />
    },
    {
      category: 'Geofencing',
      title: 'Create virtual boundaries and automate workflows',
      description: 'Draw custom geofences on the map in seconds. Set up automated alerts and actions when vehicles enter or exit specific areas. Perfect for job sites, customer locations, restricted zones, and service areas.',
      details: [
        'Unlimited geofences with circular, polygon, and corridor shapes',
        'Smart alerts via SMS, email, push notifications, or webhooks',
        'Time-based rules (business hours, weekends, holidays)',
        'Automated reports when vehicles visit customer sites',
        'Integration with dispatch and job management systems',
      ],
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      visualization: <GeofenceViz />
    },
    {
      category: 'Route Optimization',
      title: 'Intelligent routing that saves time and fuel',
      description: 'Plan optimal routes automatically based on traffic, road conditions, vehicle capacity, and time windows. Our AI-powered routing engine considers dozens of variables to create the most efficient routes possible.',
      details: [
        'Multi-stop route optimization with drag-and-drop reordering',
        'Real-time rerouting based on traffic and road closures',
        'Driver skill and vehicle capability matching',
        'Time window constraints and service time estimates',
        'Carbon footprint tracking and sustainability reporting',
      ],
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      visualization: <RouteOptimizationViz />
    },
    {
      category: 'Vehicle Diagnostics',
      title: 'Monitor vehicle health in real-time',
      description: 'Get instant alerts for engine issues, battery problems, and maintenance needs. Our OBD-II integration provides deep insights into vehicle performance, helping you prevent breakdowns before they happen.',
      details: [
        'Real-time diagnostics: engine codes, battery voltage, fuel level, odometer',
        'Predictive maintenance alerts based on manufacturer schedules',
        'Service history tracking with automated reminders',
        'Integration with repair shops and parts suppliers',
        'Custom maintenance rules based on usage patterns',
      ],
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      visualization: <VehicleDiagnosticsViz />
    },
    {
      category: 'Driver Behavior',
      title: 'Improve safety and reduce fuel costs',
      description: 'Monitor driving patterns to identify risky behavior and coaching opportunities. Track speeding, harsh braking, rapid acceleration, cornering, and idling. Reduce accidents, improve fuel efficiency, and lower insurance premiums.',
      details: [
        'Comprehensive safety scoring with customizable thresholds',
        'Instant alerts for dangerous driving (speeding, harsh braking, aggressive acceleration)',
        'Driver leaderboards and gamification to encourage safe driving',
        'Automated coaching workflows and training recommendations',
        'Insurance integration for usage-based insurance discounts',
      ],
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      visualization: <DriverSafetyViz />
    },
    {
      category: 'Reporting & Analytics',
      title: 'Turn data into actionable insights',
      description: 'Access pre-built reports or create custom dashboards that matter to your business. Track KPIs, measure performance, identify trends, and make data-driven decisions. Export to Excel, PDF, or integrate via API.',
      details: [
        'Pre-built reports: mileage, fuel, utilization, maintenance, compliance',
        'Custom report builder with drag-and-drop widgets',
        'Scheduled reports delivered via email',
        'Real-time dashboards with live data visualization',
        'API access for integration with BI tools (Tableau, Power BI, Looker)',
      ],
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      visualization: <AnalyticsDashboardViz />
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 py-24">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Built for modern fleets
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                manage your fleet
              </span>
            </h1>

            <p className="text-xl text-muted-foreground">
              Powerful features that help you track vehicles, optimize routes, reduce costs, and keep drivers safe.
              All in one platform.
            </p>
          </motion.div>
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <div className="space-y-32">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`grid gap-12 lg:grid-cols-2 lg:gap-16 ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-lg border border-border/40 bg-card px-3 py-1.5">
                    <div className="text-primary">{feature.icon}</div>
                    <span className="text-sm font-medium text-muted-foreground">{feature.category}</span>
                  </div>

                  <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    {feature.title}
                  </h2>

                  <p className="mb-8 text-lg text-muted-foreground">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/40">
                    {feature.visualization}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="See these features in action"
        description="Request a personalized demo to explore how our platform can transform your fleet operations."
        primaryCTA={{ text: 'Request Demo', href: '/demo' }}
        secondaryCTA={{ text: 'View Pricing', href: '/pricing' }}
      />
    </>
  )
}
