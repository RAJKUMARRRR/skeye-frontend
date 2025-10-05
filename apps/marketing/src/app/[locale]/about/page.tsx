import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CTASection } from '@/components/marketing/CTASection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Fleet Management Platform',
  description: 'Learn about our mission to revolutionize fleet management through innovative technology and exceptional service.',
}

export default function AboutPage() {
  const t = useTranslations('about')

  const values = [
    {
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
      icon: '💡',
    },
    {
      title: t('values.reliability.title'),
      description: t('values.reliability.description'),
      icon: '🛡️',
    },
    {
      title: t('values.customerSuccess.title'),
      description: t('values.customerSuccess.description'),
      icon: '🎯',
    },
  ]

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      bio: 'Fleet management veteran with 15+ years of industry experience.',
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Technology leader specializing in IoT and real-time systems.',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Product',
      bio: 'Product strategist focused on customer-driven innovation.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP of Customer Success',
      bio: 'Dedicated to ensuring every customer achieves their goals.',
    },
  ]

  return (
    <>
      {/* Hero */}
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

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="mb-4 text-4xl">🚀</div>
                <CardTitle className="text-2xl">{t('mission.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('mission.description')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-4 text-4xl">🔭</div>
                <CardTitle className="text-2xl">{t('vision.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('vision.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            {t('values.title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="mb-4 text-4xl">{value.icon}</div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            {t('team.title')}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted text-4xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-center text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-center">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Want to learn more?"
        description="Get in touch with our team to discuss how we can help your fleet operations."
        primaryCTA={{ text: 'Contact Us', href: '/contact' }}
        secondaryCTA={{ text: 'Request Demo', href: '/demo' }}
      />
    </>
  )
}
