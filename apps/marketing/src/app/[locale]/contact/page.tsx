'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    fleetSize: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', fleetSize: '', subject: '', message: '' })
        setSubmitStatus('idle')
      }, 3000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const contactMethods = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Us',
      subtitle: 'Our team responds within 2 hours',
      value: 'support@fleetmanagement.com',
      action: 'mailto:support@fleetmanagement.com',
      gradient: 'from-teal-500/20 to-emerald-500/20'
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Call Us',
      subtitle: 'Mon-Fri 9AM-6PM PST',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
      gradient: 'from-emerald-500/20 to-cyan-500/20'
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Visit Us',
      subtitle: 'Come say hello',
      value: '123 Fleet Street, SF CA 94105',
      action: 'https://maps.google.com',
      gradient: 'from-cyan-500/20 to-teal-500/20'
    },
  ]

  const subjects = [
    {
      value: 'sales',
      label: 'Sales Inquiry',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      value: 'support',
      label: 'Technical Support',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      value: 'demo',
      label: 'Request Demo',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      value: 'partnership',
      label: 'Partnership',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      value: 'general',
      label: 'General Question',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ]

  const formProgress = Object.values(formData).filter(v => v !== '').length / 6 * 100

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#3DD5AC08_1px,transparent_1px),linear-gradient(to_bottom,#3DD5AC08_1px,transparent_1px)] bg-[size:4rem_4rem]"
            style={{
              maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)'
            }}
          />
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 blur-[100px]"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-[100px]"
            animate={{
              x: [0, -50, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Average response time: 2 hours
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                  Let's talk about your
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  fleet needs
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl">
                Our fleet management experts are here to help you optimize operations, reduce costs, and scale efficiently.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact Methods */}
      <section className="border-b border-border/40 py-16">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {contactMethods.map((method, i) => (
              <motion.a
                key={method.title}
                href={method.action}
                target={method.action.startsWith('http') ? '_blank' : undefined}
                rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    {method.icon}
                  </div>

                  <h3 className="mb-2 text-xl font-bold">{method.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{method.subtitle}</p>
                  <p className="font-medium text-primary">{method.value}</p>
                </div>

                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold">Send us a message</h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and our team will get back to you within 2 hours during business hours.
              </p>

              {/* Progress Bar */}
              <div className="mx-auto mt-8 max-w-md">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Form completion</span>
                  <span className="font-semibold text-primary">{Math.round(formProgress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${formProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {submitStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-12 text-center backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20"
                  >
                    <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>

                  <h3 className="mb-3 text-3xl font-bold">Message sent!</h3>
                  <p className="mb-6 text-lg text-muted-foreground">
                    Thank you for reaching out. We'll get back to you within 2 hours.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setSubmitStatus('idle')}
                      className="border-border/60"
                    >
                      Send another message
                    </Button>
                    <Button asChild>
                      <a href="/blog">Read our blog</a>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-8 backdrop-blur-sm md:p-12"
                >
                  <div className="space-y-8">
                    {/* Name & Email Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="h-12 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/50 focus-visible:border-border/60 focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Work Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@company.com"
                          className="h-12 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/50 focus-visible:border-border/60 focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    {/* Company & Fleet Size Row */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="company" className="text-sm font-medium">
                          Company Name
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Transport Co."
                          className="h-12 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/50 focus-visible:border-border/60 focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="fleetSize" className="text-sm font-medium">
                          Fleet Size
                        </Label>
                        <select
                          id="fleetSize"
                          name="fleetSize"
                          value={formData.fleetSize}
                          onChange={handleChange}
                          className="h-12 w-full rounded-xl border border-border/40 bg-background/50 px-4 text-sm backdrop-blur-sm transition-all duration-300 focus:border-border/60 focus:bg-background focus:outline-none focus:ring-0"
                        >
                          <option value="">Select fleet size</option>
                          <option value="1-10">1-10 vehicles</option>
                          <option value="11-50">11-50 vehicles</option>
                          <option value="51-100">51-100 vehicles</option>
                          <option value="100+">100+ vehicles</option>
                        </select>
                      </div>
                    </div>

                    {/* Subject Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">What can we help you with? *</Label>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => (
                          <motion.button
                            key={subject.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, subject: subject.value }))}
                            className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                              formData.subject === subject.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border/40 bg-card/50 hover:border-primary/40'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary transition-transform group-hover:scale-110">
                                {subject.icon}
                              </div>
                              <span className="text-sm font-medium">{subject.label}</span>
                            </div>
                            {formData.subject === subject.value && (
                              <motion.div
                                layoutId="subject-indicator"
                                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                              >
                                ✓
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Tell us more about your needs *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="I'm interested in learning more about..."
                        className="rounded-xl border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/50 focus-visible:border-border/60 focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.message.length} / 500 characters
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full rounded-xl text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending message...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Send Message
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        )}
                      </Button>
                      <p className="mt-4 text-center text-sm text-muted-foreground">
                        By submitting this form, you agree to our{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-transparent via-primary/5 to-transparent py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold">Quick answers</h2>
              <p className="text-lg text-muted-foreground">
                Common questions about getting in touch
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  q: 'How quickly will I hear back?',
                  a: 'Our team typically responds within 2 hours during business hours (9AM-6PM PST, Mon-Fri).'
                },
                {
                  q: 'Can I schedule a demo?',
                  a: 'Absolutely! Select "Request Demo" as your subject and we\'ll set up a personalized walkthrough.'
                },
                {
                  q: 'Do you offer custom pricing?',
                  a: 'Yes, we tailor our pricing based on fleet size and specific needs. Contact sales for a custom quote.'
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Yes! We offer a 30-day free trial with full access to all features. No credit card required.'
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm"
                >
                  <h3 className="mb-2 font-semibold text-foreground">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
