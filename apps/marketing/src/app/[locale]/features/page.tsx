import { useTranslations } from 'next-intl'
import { FeatureCard, FeatureGrid } from '@/components/marketing/FeatureCard'
import { CTASection } from '@/components/marketing/CTASection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features | Fleet Management Platform',
  description: 'Comprehensive fleet management features including real-time tracking, geofencing, maintenance management, and advanced analytics.',
}

export default function FeaturesPage() {
  const t = useTranslations('features')

  const trackingFeatures = [
    { title: 'Real-Time GPS Tracking', description: 'Monitor all vehicles with precision GPS tracking updated every 30 seconds.' },
    { title: 'Location History', description: 'Access complete location history with playback functionality.' },
    { title: 'Vehicle Clustering', description: 'Intelligent clustering for managing large fleets.' },
  ]

  const geofencingFeatures = [
    { title: 'Custom Zones', description: 'Create circular or polygon geofences with drag-and-drop ease.' },
    { title: 'Entry/Exit Alerts', description: 'Automated alerts when vehicles enter or exit zones.' },
    { title: 'Time-Based Rules', description: 'Set time restrictions for geofence triggers.' },
  ]

  const maintenanceFeatures = [
    { title: 'Automated Scheduling', description: 'Schedule maintenance based on mileage, engine hours, or time.' },
    { title: 'Service History', description: 'Complete maintenance records for every vehicle.' },
    { title: 'Predictive Alerts', description: 'Get notified before maintenance is due.' },
  ]

  const analyticsFeatures = [
    { title: 'Fuel Analytics', description: 'Track fuel consumption and identify inefficiencies.' },
    { title: 'Driver Behavior', description: 'Monitor speeding, harsh braking, and aggressive driving.' },
    { title: 'Custom Reports', description: 'Generate detailed reports on any metric that matters.' },
  ]

  return (
    <>
      {/* Header */}
      <section className="border-b bg-muted/50 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Vehicle Tracking */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Real-Time Vehicle Tracking
          </h2>
          <FeatureGrid>
            {trackingFeatures.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={<div className="text-2xl">📍</div>}
                {...feature}
              />
            ))}
          </FeatureGrid>
        </div>
      </section>

      {/* Geofencing */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Smart Geofencing
          </h2>
          <FeatureGrid>
            {geofencingFeatures.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={<div className="text-2xl">🎯</div>}
                {...feature}
              />
            ))}
          </FeatureGrid>
        </div>
      </section>

      {/* Maintenance */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Maintenance Management
          </h2>
          <FeatureGrid>
            {maintenanceFeatures.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={<div className="text-2xl">🔧</div>}
                {...feature}
              />
            ))}
          </FeatureGrid>
        </div>
      </section>

      {/* Analytics */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Advanced Analytics
          </h2>
          <FeatureGrid>
            {analyticsFeatures.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={<div className="text-2xl">📊</div>}
                {...feature}
              />
            ))}
          </FeatureGrid>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to see these features in action?"
        description="Request a personalized demo to explore how our platform can transform your fleet operations."
        primaryCTA={{ text: 'Request Demo', href: '/demo' }}
        secondaryCTA={{ text: 'View Pricing', href: '/pricing' }}
      />
    </>
  )
}
