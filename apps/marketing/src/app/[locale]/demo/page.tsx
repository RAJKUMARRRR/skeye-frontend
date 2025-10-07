'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

// Multi-step form for better UX
const STEPS = [
  { id: 'contact', title: 'Contact Info', description: 'Let\'s start with the basics' },
  { id: 'company', title: 'Company Details', description: 'Tell us about your business' },
  { id: 'schedule', title: 'Schedule Demo', description: 'Pick your preferred time' },
]

export default function DemoPage() {
  const t = useTranslations('demo')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    fleetSize: '',
    industry: '',
    requirements: '',
    preferredDate: '',
    preferredTime: '',
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
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.fullName && formData.email
    }
    if (currentStep === 1) {
      return formData.company && formData.fleetSize
    }
    return true
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-20 md:py-32">
        {/* Animated Background Pattern */}
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
            className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 blur-[120px]"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 blur-[120px]"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 25,
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
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Schedule Your Personal Demo
              </div>

              {/* Headline */}
              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                  See Your Fleet
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Transform in Real-Time
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground md:text-2xl">
                Join 1,000+ fleet managers who've already optimized their operations. Get a personalized 30-minute demo tailored to your business needs.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Setup in 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>SOC 2 certified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof - Customer Logos */}
      <section className="border-b border-border/40 bg-muted/30 py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="mb-8 text-sm font-medium text-muted-foreground">
              TRUSTED BY LEADING FLEET OPERATORS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {['TransportCo', 'LogisticsPro', 'FleetFirst', 'DeliveryMax', 'RouteOpt'].map((company, i) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xl font-bold text-muted-foreground/40"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Form Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Left Column - Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8 lg:col-span-2"
              >
                <div>
                  <h2 className="mb-4 text-3xl font-bold">What You'll Get</h2>
                  <p className="text-muted-foreground">
                    Our fleet experts will guide you through a personalized demo experience
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      ),
                      title: '30-Minute Live Demo',
                      description: 'Interactive walkthrough of features tailored to your fleet size and industry'
                    },
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      title: 'Custom ROI Analysis',
                      description: 'See your potential cost savings and efficiency gains calculated in real-time'
                    },
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      ),
                      title: 'Implementation Plan',
                      description: 'Detailed roadmap for deploying the platform across your fleet'
                    },
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      ),
                      title: '30-Day Free Trial',
                      description: 'Full platform access with dedicated onboarding support'
                    },
                  ].map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold">{benefit.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-6 backdrop-blur-sm"
                >
                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-primary text-primary" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    "The demo was incredibly insightful. Within 30 minutes, we saw exactly how the platform would save us $50K annually in fuel costs alone."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-sm font-bold text-primary">
                      MR
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Michael Rodriguez</div>
                      <div className="text-xs text-muted-foreground">Fleet Director, TransportCo</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Multi-step Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-3"
              >
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

                      <h3 className="mb-3 text-3xl font-bold">You're All Set! 🎉</h3>
                      <p className="mb-6 text-lg text-muted-foreground">
                        Check your email for a calendar invite. We'll see you soon!
                      </p>

                      <div className="space-y-3">
                        <div className="rounded-xl bg-muted/50 p-4 text-left">
                          <div className="mb-1 text-sm font-medium text-muted-foreground">What happens next?</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              <span>You'll receive a calendar invite within 5 minutes</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              <span>A demo specialist will prepare a custom presentation</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              <span>You'll get instant access to our resource library</span>
                            </li>
                          </ul>
                        </div>

                        <Button
                          size="lg"
                          onClick={() => setSubmitStatus('idle')}
                          className="w-full"
                        >
                          Schedule Another Demo
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm"
                    >
                      {/* Progress Bar */}
                      <div className="border-b border-border/40 bg-card/50 px-8 py-6">
                        <div className="mb-4 flex items-center justify-between text-sm">
                          <span className="font-medium">Step {currentStep + 1} of {STEPS.length}</span>
                          <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-emerald-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="p-8 md:p-12">
                        {/* Step Title */}
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-8"
                        >
                          <h3 className="mb-2 text-2xl font-bold">{STEPS[currentStep].title}</h3>
                          <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
                        </motion.div>

                        {/* Step Content */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            {/* Step 1: Contact Info */}
                            {currentStep === 0 && (
                              <>
                                <div className="space-y-3">
                                  <Label htmlFor="fullName" className="text-sm font-medium">
                                    Full Name *
                                  </Label>
                                  <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="h-12 rounded-xl border-border/40 bg-card/50 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                    className="h-12 rounded-xl border-border/40 bg-card/50 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div className="space-y-3">
                                  <Label htmlFor="phone" className="text-sm font-medium">
                                    Phone Number (Optional)
                                  </Label>
                                  <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                    className="h-12 rounded-xl border-border/40 bg-card/50 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>
                              </>
                            )}

                            {/* Step 2: Company Details */}
                            {currentStep === 1 && (
                              <>
                                <div className="space-y-3">
                                  <Label htmlFor="company" className="text-sm font-medium">
                                    Company Name *
                                  </Label>
                                  <Input
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    placeholder="Acme Transport Co."
                                    className="h-12 rounded-xl border-border/40 bg-card/50 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div className="space-y-3">
                                  <Label htmlFor="fleetSize" className="text-sm font-medium">
                                    Fleet Size *
                                  </Label>
                                  <select
                                    id="fleetSize"
                                    name="fleetSize"
                                    value={formData.fleetSize}
                                    onChange={handleChange}
                                    required
                                    className="h-12 w-full rounded-xl border border-border/40 bg-card/50 px-4 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  >
                                    <option value="">Select fleet size</option>
                                    <option value="1-10">1-10 vehicles</option>
                                    <option value="11-50">11-50 vehicles</option>
                                    <option value="51-100">51-100 vehicles</option>
                                    <option value="101-500">101-500 vehicles</option>
                                    <option value="500+">500+ vehicles</option>
                                  </select>
                                </div>

                                <div className="space-y-3">
                                  <Label htmlFor="industry" className="text-sm font-medium">
                                    Industry (Optional)
                                  </Label>
                                  <select
                                    id="industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="h-12 w-full rounded-xl border border-border/40 bg-card/50 px-4 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  >
                                    <option value="">Select industry</option>
                                    <option value="transportation">Transportation</option>
                                    <option value="logistics">Logistics</option>
                                    <option value="construction">Construction</option>
                                    <option value="utilities">Utilities</option>
                                    <option value="government">Government</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>

                                <div className="space-y-3">
                                  <Label htmlFor="requirements" className="text-sm font-medium">
                                    What challenges are you facing? (Optional)
                                  </Label>
                                  <Textarea
                                    id="requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="e.g., High fuel costs, lack of real-time visibility, inefficient routing..."
                                    className="rounded-xl border-border/40 bg-card/50 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>
                              </>
                            )}

                            {/* Step 3: Schedule */}
                            {currentStep === 2 && (
                              <>
                                <div className="space-y-3">
                                  <Label htmlFor="preferredDate" className="text-sm font-medium">
                                    Preferred Date
                                  </Label>
                                  <Input
                                    id="preferredDate"
                                    name="preferredDate"
                                    type="date"
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="h-12 rounded-xl border-border/40 bg-card/50 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div className="space-y-3">
                                  <Label className="text-sm font-medium">
                                    Preferred Time Slot
                                  </Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((time) => (
                                      <motion.button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, preferredTime: time }))}
                                        className={`rounded-xl border p-3 text-sm font-medium transition-all ${
                                          formData.preferredTime === time
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border/40 bg-card/50 hover:border-primary/40'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        {time}
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>

                                <div className="rounded-xl bg-primary/10 p-4">
                                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Pro Tip
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Most demos take 30 minutes. We'll send a calendar invite with a video conferencing link immediately after you submit.
                                  </p>
                                </div>
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex gap-3">
                          {currentStep > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              onClick={handleBack}
                              className="flex-1"
                            >
                              Back
                            </Button>
                          )}

                          {currentStep < STEPS.length - 1 ? (
                            <Button
                              type="button"
                              size="lg"
                              onClick={handleNext}
                              disabled={!isStepValid()}
                              className="flex-1"
                            >
                              Continue
                              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              size="lg"
                              disabled={isSubmitting || !isStepValid()}
                              className="flex-1 shadow-lg shadow-primary/25"
                            >
                              {isSubmitting ? (
                                <>
                                  <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Scheduling...
                                </>
                              ) : (
                                <>
                                  Schedule My Demo
                                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Privacy Notice */}
                        <p className="mt-4 text-center text-xs text-muted-foreground">
                          By submitting, you agree to our{' '}
                          <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                          . We'll never share your information.
                        </p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
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
              <h2 className="mb-4 text-4xl font-bold">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our demos
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  q: 'How long does the demo take?',
                  a: 'Most demos are 30 minutes, but we can adjust based on your schedule and needs.'
                },
                {
                  q: 'Can I see my own data in the demo?',
                  a: 'Yes! If you provide sample data beforehand, we can show you the platform with your actual fleet information.'
                },
                {
                  q: 'Is there any cost or obligation?',
                  a: 'Absolutely not. The demo is completely free with no strings attached.'
                },
                {
                  q: 'What if I need to reschedule?',
                  a: 'No problem! Just use the link in your calendar invite to pick a new time.'
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
