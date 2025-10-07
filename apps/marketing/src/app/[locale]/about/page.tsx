'use client'

import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CTASection } from '@/components/marketing/CTASection'
import {
  VehicleDiagnosticsViz,
  DriverSafetyViz,
  AnalyticsDashboardViz,
  GPSTrackingViz,
  GeofenceViz,
  RouteOptimizationViz
} from '@/components/visualizations'
import { useRef } from 'react'

export default function AboutPage() {
  const t = useTranslations('about')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const stats = [
    {
      label: 'Active Vehicles',
      value: '50K+',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'Countries',
      value: '45+',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Uptime',
      value: '99.9%',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'CO₂ Saved',
      value: '2M tons',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      )
    },
  ]

  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Founded with a bold vision to revolutionize fleet management through intelligent automation',
      metric: '5 team members',
      color: 'from-teal-500/20 to-emerald-500/20'
    },
    {
      year: '2021',
      title: 'Breaking Ground',
      description: 'Reached 1,000 vehicles tracked, proving our technology works at scale',
      metric: '1K vehicles',
      color: 'from-emerald-500/20 to-cyan-500/20'
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Expanded operations to 20+ countries across 4 continents',
      metric: '20+ countries',
      color: 'from-cyan-500/20 to-teal-500/20'
    },
    {
      year: '2023',
      title: 'AI Revolution',
      description: 'Launched predictive analytics and ML-powered route optimization',
      metric: '10K vehicles',
      color: 'from-teal-400/20 to-emerald-400/20'
    },
    {
      year: '2024',
      title: 'Industry Leader',
      description: 'Trusted by Fortune 500 companies managing over 50,000 vehicles globally',
      metric: '50K+ vehicles',
      color: 'from-primary/30 to-emerald-500/30'
    },
  ]

  const values = [
    {
      title: 'Innovation First',
      description: 'We push boundaries with cutting-edge technology that transforms how fleets operate. From AI-powered predictive maintenance to real-time optimization algorithms.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      visualization: <VehicleDiagnosticsViz />,
      gradient: 'from-teal-500/10 via-transparent to-transparent',
    },
    {
      title: 'Reliability & Trust',
      description: '99.9% uptime guarantee. Your fleet never stops, and neither do we. Built on enterprise-grade infrastructure that scales with your needs.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      visualization: <DriverSafetyViz />,
      gradient: 'from-emerald-500/10 via-transparent to-transparent',
    },
    {
      title: 'Customer Success',
      description: 'Your success is our success. Dedicated support teams and continuous innovation driven by your feedback. We grow when you grow.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      visualization: <AnalyticsDashboardViz />,
      gradient: 'from-cyan-500/10 via-transparent to-transparent',
    },
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: '15+ years in logistics tech. Former VP at a Fortune 500 transport company.',
      avatar: 'SC',
      gradient: 'from-teal-500 via-emerald-500 to-cyan-500',
      borderGradient: 'from-teal-500/50 to-emerald-500/50'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO',
      bio: 'AI/ML expert. Built real-time systems at scale for millions of devices.',
      avatar: 'MR',
      gradient: 'from-emerald-500 via-cyan-500 to-teal-500',
      borderGradient: 'from-emerald-500/50 to-cyan-500/50'
    },
    {
      name: 'Emily Johnson',
      role: 'VP Engineering',
      bio: 'Led engineering teams at top tech companies. Passionate about clean architecture.',
      avatar: 'EJ',
      gradient: 'from-cyan-500 via-teal-400 to-emerald-400',
      borderGradient: 'from-cyan-500/50 to-teal-500/50'
    },
    {
      name: 'David Park',
      role: 'Head of Product',
      bio: 'Product strategist with a track record of launching category-defining products.',
      avatar: 'DP',
      gradient: 'from-teal-400 via-emerald-400 to-cyan-400',
      borderGradient: 'from-teal-400/50 to-emerald-400/50'
    },
  ]

  return (
    <>
      {/* Hero with 3D Perspective */}
      <section className="relative overflow-hidden py-32 md:py-40">
        {/* Sophisticated Grid Background */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#3DD5AC08_1px,transparent_1px),linear-gradient(to_bottom,#3DD5AC08_1px,transparent_1px)] bg-[size:4rem_4rem]"
            style={{
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)'
            }}
          />
        </div>

        {/* Animated Gradient Orbs with Blur */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute left-[20%] top-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/30 to-emerald-500/30 blur-[120px]"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute right-[15%] top-[30%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-[100px]"
            animate={{
              x: [0, -40, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-5xl">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex justify-center"
            >
              <div className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-primary/30 bg-primary/5 px-6 py-3 backdrop-blur-xl">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <div className="relative flex items-center gap-3">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(61,213,172,0.5)]"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-primary">
                    Transforming fleet management since 2020
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Hero Title with Gradient */}
            <motion.h1
              className="mb-8 text-center text-6xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                Building the future
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                of fleet intelligence
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-16 max-w-3xl text-center text-xl leading-relaxed text-muted-foreground md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We're on a mission to transform fleet operations through intelligent automation,
              real-time insights, and sustainable innovation that drives measurable results.
            </motion.p>

            {/* Stats Grid with Icons */}
            <motion.div
              className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 p-8 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(61,213,172,0.3), rgba(16,185,129,0.3))',
                      padding: '1px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      opacity: 0,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                      {stat.icon}
                    </div>
                    <div className="mb-2 text-4xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section with Parallax */}
      <section ref={containerRef} className="relative py-32 md:py-40">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Mission with Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="sticky top-32">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Our Mission
                </div>

                <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                  Empower fleets to operate{' '}
                  <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                    smarter, faster, greener
                  </span>
                </h2>

                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  Every vehicle on the road represents an opportunity. An opportunity to save fuel,
                  reduce emissions, improve safety, and deliver better service. We built this platform
                  to unlock that opportunity for every fleet, everywhere.
                </p>

                <div className="overflow-hidden rounded-3xl border border-border/40">
                  <GPSTrackingViz />
                </div>
              </div>
            </motion.div>

            {/* Vision with Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="sticky top-32">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 backdrop-blur-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Our Vision
                </div>

                <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                  A world where every fleet is{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    connected & optimized
                  </span>
                </h2>

                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  We envision a future where AI and automation handle the complexity, letting you focus
                  on what matters: growing your business and delivering exceptional service. Where every
                  decision is data-driven and every mile is optimized.
                </p>

                <div className="overflow-hidden rounded-3xl border border-border/40">
                  <RouteOptimizationViz />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline - Redesigned */}
      <section className="relative overflow-hidden border-y border-border/40 py-32 md:py-40">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="container">
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-5xl font-bold">Our Journey</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              From a bold idea to an industry-leading platform
            </p>
          </motion.div>

          <div className="relative mx-auto max-w-6xl">
            {/* Vertical Progress Line */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:left-1/2" />

            <div className="space-y-24">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  className={`relative flex items-center gap-12 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 flex items-center justify-center md:left-1/2 md:-translate-x-1/2">
                    <motion.div
                      className="relative flex h-16 w-16 items-center justify-center"
                      whileInView={{ scale: [0.8, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      {/* Outer Glow */}
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${milestone.color} blur-xl`}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                      />

                      {/* Center Node */}
                      <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 pl-24 md:pl-0 ${i % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <motion.div
                      className="group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-8 backdrop-blur-sm md:p-10"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${milestone.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                      <div className="relative">
                        {/* Year Badge */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {milestone.year}
                        </div>

                        <h3 className="mb-3 text-3xl font-bold">{milestone.title}</h3>
                        <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                          {milestone.description}
                        </p>

                        {/* Metric */}
                        <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          {milestone.metric}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden flex-1 md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values with Premium Cards */}
      <section className="py-32 md:py-40">
        <div className="container">
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-5xl font-bold">What Drives Us</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              The principles that guide everything we build
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <motion.div
                  className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-8 backdrop-blur-sm"
                  whileHover={{ y: -12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Hover Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                  <div className="relative">
                    {/* Icon */}
                    <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-primary">
                      {value.icon}
                    </div>

                    <h3 className="mb-4 text-2xl font-bold">{value.title}</h3>
                    <p className="mb-8 leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>

                    {/* Visualization */}
                    <motion.div
                      className="overflow-hidden rounded-2xl border border-border/30"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      {value.visualization}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team with 3D Cards */}
      <section className="border-t border-border/40 py-32 md:py-40">
        <div className="container">
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-5xl font-bold">Meet the Team</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              The brilliant minds building the future of fleet management
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <motion.div
                  className="relative h-full overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-8 backdrop-blur-sm"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    {/* Avatar with Gradient Border */}
                    <div className="relative mx-auto mb-6 h-40 w-40">
                      {/* Rotating Border */}
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} p-[3px] opacity-70`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      >
                        <div className="h-full w-full rounded-full bg-background" />
                      </motion.div>

                      {/* Avatar Content */}
                      <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-gradient-to-br from-card to-background">
                        <span className={`bg-gradient-to-br ${member.gradient} bg-clip-text text-4xl font-bold text-transparent`}>
                          {member.avatar}
                        </span>
                      </div>

                      {/* Glow */}
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-20 blur-2xl`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>

                    {/* Info */}
                    <h4 className="mb-2 text-center text-xl font-bold">{member.name}</h4>
                    <p className={`mb-4 text-center text-sm font-semibold bg-gradient-to-r ${member.borderGradient} bg-clip-text text-transparent`}>
                      {member.role}
                    </p>
                    <p className="text-center text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to transform your fleet?"
        description="Join industry leaders who trust us to power their fleet operations."
        primaryCTA={{ text: 'Get Started', href: '/contact' }}
        secondaryCTA={{ text: 'Request Demo', href: '/demo' }}
      />
    </>
  )
}
