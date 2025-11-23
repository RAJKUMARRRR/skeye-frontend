'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

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
      {/* Premium Header */}
      <section className="relative border-b border-border/40 bg-gradient-to-b from-muted/30 to-background py-20 overflow-hidden">
        <div className="container relative z-10">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t('title')}
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('subtitle')}
            </motion.p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        </div>
      </section>

      {/* Premium Pricing Cards */}
      <section className="py-24 relative">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card
                  className={
                    tier.popular
                      ? 'relative border-primary/50 bg-card/50 backdrop-blur-sm shadow-2xl glow card-hover h-full'
                      : 'card-hover bg-card/50 backdrop-blur-sm border-border/50 h-full'
                  }
                >
                  {tier.popular && tier.badge && (
                    <motion.div
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: i * 0.1 + 0.3 }}
                    >
                      <Badge className="px-4 py-1.5 bg-gradient-to-r from-primary to-accent shadow-lg">
                        {tier.badge}
                      </Badge>
                    </motion.div>
                  )}
                  <CardHeader className="pb-8">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription className="text-base">{tier.description}</CardDescription>
                    <div className="mt-6">
                      <motion.span
                        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: i * 0.1 + 0.2 }}
                      >
                        {tier.price}
                      </motion.span>
                      {tier.price !== 'Custom' && tier.price !== '$0' && (
                        <span className="text-muted-foreground ml-1">/month</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature, j) => (
                        <motion.li
                          key={j}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + j * 0.05 + 0.3 }}
                        >
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <MagneticButton className="w-full" strength={0.2}>
                      <Button
                        className={tier.popular ? 'w-full button-shine shadow-lg' : 'w-full'}
                        variant={tier.popular ? 'default' : 'outline'}
                        size="lg"
                        asChild
                      >
                        <Link href={tier.href}>{tier.cta}</Link>
                      </Button>
                    </MagneticButton>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background grid */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>
      </section>

      {/* Premium FAQ Section */}
      <section className="border-t border-border/40 bg-muted/30 py-24 relative">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.h2
              className="mb-16 text-center text-3xl font-bold md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t('faq.title')}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem
                      value={`item-${i}`}
                      className="border border-border/50 bg-card/50 backdrop-blur-sm rounded-lg px-6 data-[state=open]:shadow-lg transition-shadow"
                    >
                      <AccordionTrigger value={`item-${i}`} className="text-left hover:no-underline py-5">
                        <span className="font-semibold">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent value={`item-${i}`} className="text-muted-foreground pb-5 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>

        {/* Subtle background */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      </section>
    </>
  )
}
