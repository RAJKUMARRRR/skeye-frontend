import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Fleet Management Platform',
  description: 'Fleet management insights, tips, trends, and best practices.',
}

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: '10 Ways to Reduce Fleet Fuel Costs',
    description: 'Discover proven strategies to optimize fuel consumption and reduce operating costs for your fleet.',
    category: 'Cost Optimization',
    date: '2025-01-15',
    readTime: '5 min',
    slug: 'reduce-fleet-fuel-costs',
  },
  {
    id: 2,
    title: 'The Complete Guide to Fleet Geofencing',
    description: 'Learn how to implement and leverage geofencing technology for better fleet security and efficiency.',
    category: 'Technology',
    date: '2025-01-10',
    readTime: '8 min',
    slug: 'guide-to-fleet-geofencing',
  },
  {
    id: 3,
    title: 'Best Practices for Preventive Maintenance',
    description: 'Keep your fleet running smoothly with these preventive maintenance strategies and schedules.',
    category: 'Maintenance',
    date: '2025-01-05',
    readTime: '6 min',
    slug: 'preventive-maintenance-best-practices',
  },
]

export default function BlogPage() {
  const t = useTranslations('blog')

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

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.readTime} {t('readTime')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <time className="text-sm text-muted-foreground" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="px-0" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      {t('readMore')} <span aria-hidden="true">→</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
