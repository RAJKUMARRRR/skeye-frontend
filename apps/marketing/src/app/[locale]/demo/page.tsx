'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function DemoPage() {
  const t = useTranslations('demo')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    fleetSize: '',
    industry: '',
    requirements: '',
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
      setFormData({
        fullName: '',
        email: '',
        company: '',
        phone: '',
        fleetSize: '',
        industry: '',
        requirements: '',
      })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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

      {/* Demo Request Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Demo Request Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Request Your Personal Demo</CardTitle>
                  <CardDescription>
                    Fill out the form and our team will reach out to schedule your demo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t('form.fullName')} *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('form.email')} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company">{t('form.company')} *</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('form.phone')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fleetSize">{t('form.fleetSize')} *</Label>
                        <Select
                          id="fleetSize"
                          name="fleetSize"
                          value={formData.fleetSize}
                          onChange={handleChange}
                          required
                        >
                          <option value="">{t('form.fleetSize')}</option>
                          <option value="1-10">{t('form.fleetSizes.1-10')}</option>
                          <option value="11-50">{t('form.fleetSizes.11-50')}</option>
                          <option value="51-100">{t('form.fleetSizes.51-100')}</option>
                          <option value="101-500">{t('form.fleetSizes.101-500')}</option>
                          <option value="500+">{t('form.fleetSizes.500+')}</option>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">{t('form.industry')}</Label>
                        <Select
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                        >
                          <option value="">{t('form.industry')}</option>
                          <option value="transportation">{t('form.industries.transportation')}</option>
                          <option value="logistics">{t('form.industries.logistics')}</option>
                          <option value="construction">{t('form.industries.construction')}</option>
                          <option value="utilities">{t('form.industries.utilities')}</option>
                          <option value="government">{t('form.industries.government')}</option>
                          <option value="other">{t('form.industries.other')}</option>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements">{t('form.requirements')}</Label>
                      <Textarea
                        id="requirements"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about your specific requirements..."
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        Thank you! We'll be in touch within 24 hours to schedule your demo.
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : t('form.submit')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('benefits.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">✓</div>
                    <p className="text-sm text-muted-foreground">
                      {t('benefits.demo')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">✓</div>
                    <p className="text-sm text-muted-foreground">
                      {t('benefits.consultation')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">✓</div>
                    <p className="text-sm text-muted-foreground">
                      {t('benefits.trial')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">✓</div>
                    <p className="text-sm text-muted-foreground">
                      {t('benefits.setup')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
