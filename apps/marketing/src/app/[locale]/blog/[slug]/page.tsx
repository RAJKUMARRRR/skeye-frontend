'use client'

import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import { format } from 'date-fns'
import { MDXContent } from '@/components/mdx/MDXContent'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { useEffect, useState } from 'react'

interface BlogPostPageProps {
  params: {
    slug: string
    locale: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug)
  const [readingProgress, setReadingProgress] = useState(0)

  if (!post || !post.published) {
    notFound()
  }

  const t = useTranslations('blog')

  // Reading progress tracking
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const updateReadingProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', updateReadingProgress)
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [])

  // Related posts (simple logic - same category)
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.category === post.category && p.published)
    .slice(0, 3)

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-primary via-emerald-400 to-cyan-400"
        style={{ scaleX }}
      />

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
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-foreground">{post.category}</span>
              </div>

              {/* Category & Reading Time */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {post.category}
                </span>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={post.date}>
                      {format(new Date(post.date), 'MMMM dd, yyyy')}
                    </time>
                  </div>

                  <div className="h-4 w-px bg-border" />

                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>12 min read</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  {post.title}
                </span>
              </h1>

              {/* Description */}
              <p className="mb-8 text-xl leading-relaxed text-muted-foreground md:text-2xl">
                {post.description}
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-emerald-500/30 blur-lg" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-lg font-bold text-primary">
                      {post.author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{post.author}</div>
                    <div className="text-sm text-muted-foreground">Fleet Operations Expert</div>
                  </div>
                </div>

                {/* Social Share */}
                <div className="hidden items-center gap-2 md:flex">
                  <span className="text-sm text-muted-foreground">Share:</span>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/50 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/50 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/50 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="relative py-16 md:py-24">
        <div className="container">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Sidebar - Table of Contents (sticky) */}
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-24">
                <div className="rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    In This Article
                  </h3>
                  <nav className="space-y-2">
                    <a href="#introduction" className="block text-sm text-muted-foreground transition-colors hover:text-primary">
                      Introduction
                    </a>
                    <a href="#strategies" className="block text-sm text-muted-foreground transition-colors hover:text-primary">
                      10 Key Strategies
                    </a>
                    <a href="#implementation" className="block text-sm text-muted-foreground transition-colors hover:text-primary">
                      Implementation Guide
                    </a>
                    <a href="#results" className="block text-sm text-muted-foreground transition-colors hover:text-primary">
                      Real-World Results
                    </a>
                    <a href="#conclusion" className="block text-sm text-muted-foreground transition-colors hover:text-primary">
                      Conclusion
                    </a>
                  </nav>

                  {/* Reading Progress */}
                  <div className="mt-8 pt-8 border-t border-border/40">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary">{Math.round(readingProgress)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-emerald-400"
                        style={{ width: `${readingProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:bg-gradient-to-r prose-h2:from-foreground prose-h2:to-foreground/70 prose-h2:bg-clip-text prose-h2:text-transparent
                  prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-primary
                  prose-p:text-base prose-p:leading-[1.8] prose-p:text-muted-foreground prose-p:mb-6
                  prose-a:text-primary prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary prose-a:transition-colors
                  prose-strong:text-foreground prose-strong:font-semibold prose-strong:text-primary
                  prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                  prose-pre:bg-gradient-to-br prose-pre:from-card/80 prose-pre:to-card/40 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:shadow-lg prose-pre:backdrop-blur-sm
                  prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary/10 prose-blockquote:to-transparent prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:shadow-sm
                  prose-ul:my-8 prose-ul:space-y-3
                  prose-ol:my-8 prose-ol:space-y-3
                  prose-li:text-muted-foreground prose-li:leading-relaxed
                  prose-li:marker:text-primary
                  prose-hr:border-border/40 prose-hr:my-12
                  prose-table:border-collapse prose-table:w-full prose-table:my-8
                  prose-th:bg-primary/10 prose-th:text-primary prose-th:font-semibold prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-border/40
                  prose-td:p-4 prose-td:border prose-td:border-border/40 prose-td:text-muted-foreground
                  prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-border/40
                  [&>p:first-of-type]:text-xl [&>p:first-of-type]:text-foreground [&>p:first-of-type]:leading-relaxed [&>p:first-of-type]:font-normal
                  [&_ul>li]:relative [&_ul>li]:pl-7
                  [&_ul>li::before]:absolute [&_ul>li::before]:left-0 [&_ul>li::before]:top-[0.6em] [&_ul>li::before]:h-1.5 [&_ul>li::before]:w-1.5 [&_ul>li::before]:rounded-full [&_ul>li::before]:bg-primary
                  [&_ol>li]:relative [&_ol>li]:pl-7
                  [&_h2]:relative [&_h2]:pb-4 [&_h2::after]:absolute [&_h2::after]:bottom-0 [&_h2::after]:left-0 [&_h2::after]:h-1 [&_h2::after]:w-20 [&_h2::after]:bg-gradient-to-r [&_h2::after]:from-primary [&_h2::after]:to-emerald-400 [&_h2::after]:rounded-full
                "
              >
                <MDXContent code={post.body.code} />
              </motion.div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16 border-t border-border/40 pt-8"
                >
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag, i) => (
                      <motion.a
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="group relative overflow-hidden rounded-full bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="relative z-10">#{tag}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Author Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-8 backdrop-blur-sm"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="relative h-20 w-20 shrink-0">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-emerald-500/30 blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-3xl font-bold text-primary">
                      {post.author.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-bold">{post.author}</h3>
                    <p className="mb-4 text-sm font-medium text-primary">Fleet Operations Expert</p>
                    <p className="leading-relaxed text-muted-foreground">
                      {post.author} has over 15 years of experience in fleet management and logistics optimization.
                      Specializing in cost reduction strategies and operational efficiency, they've helped hundreds
                      of companies transform their fleet operations.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border/40 bg-gradient-to-b from-transparent via-primary/5 to-transparent py-16 md:py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold">Continue Reading</h2>
              <p className="text-lg text-muted-foreground">
                More insights to help optimize your fleet operations
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost, i) => (
                <motion.div
                  key={relatedPost.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <motion.article
                      className="group relative h-full overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/90 to-card/50 p-6 backdrop-blur-sm"
                      whileHover={{ y: -8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-emerald-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="relative">
                        <div className="mb-4 text-sm font-medium text-primary">{relatedPost.category}</div>
                        <h3 className="mb-3 text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {relatedPost.description}
                        </p>
                      </div>

                      <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="border-t border-border/40 py-16 md:py-24">
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
              Never Miss an Update
            </div>

            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Get weekly fleet insights
            </h2>

            <p className="mb-8 text-lg text-muted-foreground">
              Join 10,000+ fleet managers receiving expert tips and strategies
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
          </motion.div>
        </div>
      </section>
    </>
  )
}
