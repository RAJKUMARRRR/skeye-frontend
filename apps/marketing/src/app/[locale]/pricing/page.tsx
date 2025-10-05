import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | Fleet Management Platform',
  description: 'Simple, transparent pricing for fleets of all sizes. Choose from Trial, Basic, Professional, or Enterprise plans.',
}

export default function PricingPage() {
  const t = useTranslations('pricing')

  const pricingTiers = [
    {
      name: t('tiers.trial.name'),
      price: t('tiers.trial.price'),
      description: t('tiers.trial.description'),
      features: [
        t('tiers.trial.features.0'),
        t('tiers.trial.features.1'),
        t('tiers.trial.features.2'),
        t('tiers.trial.features.3'),
        t('tiers.trial.features.4'),
      ],
      cta: t('tiers.trial.cta'),
      href: '/demo',
      popular: false,
    },
    {
      name: t('tiers.basic.name'),
      price: t('tiers.basic.price'),
      description: t('tiers.basic.description'),
      features: [
        t('tiers.basic.features.0'),
        t('tiers.basic.features.1'),
        t('tiers.basic.features.2'),
        t('tiers.basic.features.3'),
        t('tiers.basic.features.4'),
        t('tiers.basic.features.5'),
      ],
      cta: t('tiers.basic.cta'),
      href: '/demo',
      popular: false,
    },
    {
      name: t('tiers.pro.name'),
      price: t('tiers.pro.price'),
      description: t('tiers.pro.description'),
      features: [
        t('tiers.pro.features.0'),
        t('tiers.pro.features.1'),
        t('tiers.pro.features.2'),
        t('tiers.pro.features.3'),
        t('tiers.pro.features.4'),
        t('tiers.pro.features.5'),
        t('tiers.pro.features.6'),
        t('tiers.pro.features.7'),
      ],
      cta: t('tiers.pro.cta'),
      href: '/demo',
      popular: true,
      badge: t('tiers.pro.badge'),
    },
    {
      name: t('tiers.enterprise.name'),
      price: t('tiers.enterprise.price'),
      description: t('tiers.enterprise.description'),
      features: [
        t('tiers.enterprise.features.0'),
        t('tiers.enterprise.features.1'),
        t('tiers.enterprise.features.2'),
        t('tiers.enterprise.features.3'),
        t('tiers.enterprise.features.4'),
        t('tiers.enterprise.features.5'),
        t('tiers.enterprise.features.6'),
        t('tiers.enterprise.features.7'),
      ],
      cta: t('tiers.enterprise.cta'),
      href: '/contact',
      popular: false,
    },
  ]

  const faqs = [
    {
      question: t('faq.questions.0.question'),
      answer: t('faq.questions.0.answer'),
    },
    {
      question: t('faq.questions.1.question'),
      answer: t('faq.questions.1.answer'),
    },
    {
      question: t('faq.questions.2.question'),
      answer: t('faq.questions.2.answer'),
    },
    {
      question: t('faq.questions.3.question'),
      answer: t('faq.questions.3.answer'),
    },
    {
      question: t('faq.questions.4.question'),
      answer: t('faq.questions.4.answer'),
    },
    {
      question: t('faq.questions.5.question'),
      answer: t('faq.questions.5.answer'),
    },
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

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier, i) => (
              <Card
                key={i}
                className={
                  tier.popular
                    ? 'relative border-primary shadow-xl'
                    : ''
                }
              >
                {tier.popular && tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1">
                      {tier.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.price !== 'Custom' && tier.price !== '$0' && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-0.5 h-4 w-4 text-primary"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={tier.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {t('faq.title')}
            </h2>
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger value={`item-${i}`} className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent value={`item-${i}`} className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  )
}
