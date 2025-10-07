'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { useState } from 'react'

// Blog posts data with enhanced metadata
const blogPosts = [
  {
    id: 1,
    title: '10 Ways to Reduce Fleet Fuel Costs',
    description: 'Discover proven strategies to optimize fuel consumption and reduce operating costs for your fleet.',
    excerpt: 'Learn how leading fleet managers are cutting fuel costs by up to 30% through smart route optimization, driver training, and predictive maintenance.',
    category: 'Cost Optimization',
    date: '2025-01-15',
    readTime: '5 min',
    slug: 'reduce-fleet-fuel-costs',
    author: {
      name: 'Sarah Chen',
      avatar: 'SC',
      role: 'Fleet Operations Expert'
    },
    gradient: 'from-teal-500/20 to-emerald-500/20',
    featured: true,
    icon: (
      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'The Complete Guide to Fleet Geofencing',
    description: 'Learn how to implement and leverage geofencing technology for better fleet security and efficiency.',
    excerpt: 'Master geofencing strategies to automate workflows, improve security, and boost operational efficiency.',
    category: 'Technology',
    date: '2025-01-10',
    readTime: '8 min',
    slug: 'guide-to-fleet-geofencing',
    author: {
      name: 'Michael Rodriguez',
      avatar: 'MR',
      role: 'Technology Lead'
    },
    gradient: 'from-emerald-500/20 to-cyan-500/20',
    featured: false,
    icon: (
      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Best Practices for Preventive Maintenance',
    description: 'Keep your fleet running smoothly with these preventive maintenance strategies and schedules.',
    excerpt: 'Prevent costly breakdowns and extend vehicle lifespan with data-driven maintenance scheduling.',
    category: 'Maintenance',
    date: '2025-01-05',
    readTime: '6 min',
    slug: 'preventive-maintenance-best-practices',
    author: {
      name: 'Emily Johnson',
      avatar: 'EJ',
      role: 'Maintenance Specialist'
    },
    gradient: 'from-cyan-500/20 to-teal-500/20',
    featured: false,
    icon: (
      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'AI-Powered Route Optimization',
    description: 'How machine learning is revolutionizing fleet routing and logistics planning.',
    excerpt: 'Reduce delivery times by 25% and save thousands in fuel costs with AI-driven route optimization.',
    category: 'Innovation',
    date: '2025-01-03',
    readTime: '7 min',
    slug: 'ai-route-optimization',
    author: {
      name: 'David Park',
      avatar: 'DP',
      role: 'AI Product Lead'
    },
    gradient: 'from-teal-400/20 to-emerald-400/20',
    featured: false,
    icon: (
      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Electric Fleet Transition Guide',
    description: 'Everything you need to know about transitioning your fleet to electric vehicles.',
    excerpt: 'Navigate the EV transition with confidence: costs, charging infrastructure, and ROI analysis.',
    category: 'Sustainability',
    date: '2024-12-28',
    readTime: '10 min',
    slug: 'electric-fleet-transition',
    author: {
      name: 'Sarah Chen',
      avatar: 'SC',
      role: 'Fleet Operations Expert'
    },
    gradient: 'from-emerald-400/20 to-cyan-400/20',
    featured: false,
    icon: (
      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Driver Safety Scoring Systems',
    description: 'Implement effective driver safety programs that reduce accidents and insurance costs.',
    excerpt: 'Build a culture of safety with real-time scoring, gamification, and positive reinforcement.',
    category: 'Safety',
    date: '2024-12-20',
    readTime: '6 min',
    slug: 'driver-safety-scoring',
    author: {
      name: 'Michael Rodriguez',
      avatar: 'MR',
      role: 'Technology Lead'
    },
    gradient: 'from-cyan-400/20 to-teal-400/20',
    featured: false,
    icon: (
      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

const categories = ['All', 'Cost Optimization', 'Technology', 'Maintenance', 'Innovation', 'Sustainability', 'Safety']

export default function BlogPage() {
  const t = useTranslations('blog')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)
  const filteredPosts = selectedCategory === 'All'
    ? regularPosts
    : regularPosts.filter(post => post.category === selectedCategory)

  return (
    <>
      {/* Hero Section with Featured Post */}
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

        {/* Gradient Orb */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Fleet Management Insights
            </div>

            <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                Fleet
              </span>{' '}
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Expert strategies, industry trends, and practical tips to optimize your fleet operations
            </p>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href={`/blog/${featuredPost.slug}`}>
                <motion.div
                  className="group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${featuredPost.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                  <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:gap-16">
                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Featured
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                          {featuredPost.category}
                        </span>
                      </div>

                      <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                        {featuredPost.title}
                      </h2>

                      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                        {featuredPost.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-sm font-bold text-primary">
                            {featuredPost.author.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{featuredPost.author.name}</div>
                            <div className="text-xs text-muted-foreground">{featuredPost.author.role}</div>
                          </div>
                        </div>

                        <div className="h-4 w-px bg-border" />

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {featuredPost.readTime}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual */}
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="flex h-64 w-64 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-emerald-500/10 p-16 text-primary backdrop-blur-sm"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {featuredPost.icon}
                      </motion.div>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="absolute bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border/40 py-8">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            {categories.map((category, i) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            layout
          >
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <motion.article
                    className="group relative h-full overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-8 backdrop-blur-sm"
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {/* Hover Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                    <div className="relative flex h-full flex-col">
                      {/* Image/Icon */}
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-500/10 p-4 text-primary backdrop-blur-sm">
                        {post.icon}
                      </div>

                      {/* Category Badge */}
                      <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        {post.category}
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">
                        {post.description}
                      </p>

                      {/* Meta Footer */}
                      <div className="flex items-center justify-between border-t border-border/40 pt-6">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-xs font-bold text-primary">
                            {post.author.avatar}
                          </div>
                          <div className="text-sm font-medium">{post.author.name}</div>
                        </div>

                        {/* Read Time */}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.readTime}
                        </div>
                      </div>

                      {/* Arrow on Hover */}
                      <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-emerald-500/10 text-primary">
                <svg className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold">No posts found</h3>
              <p className="text-muted-foreground">
                Try selecting a different category or check back soon for new content.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-border/40 bg-gradient-to-b from-transparent via-primary/5 to-transparent py-20 md:py-32">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Stay Updated
            </div>

            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Get fleet insights delivered
            </h2>

            <p className="mb-8 text-lg text-muted-foreground">
              Join 10,000+ fleet managers receiving weekly tips, strategies, and industry news
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 rounded-full border border-border/40 bg-card/50 px-6 text-sm backdrop-blur-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-80"
              />
              <motion.button
                className="h-12 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
