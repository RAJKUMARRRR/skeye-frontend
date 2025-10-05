import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import { format } from 'date-fns'
import { MDXContent } from '@/components/mdx/MDXContent'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: {
    slug: string
    locale: string
  }
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = allPosts.find((post) => post.slug === params.slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug)

  if (!post || !post.published) {
    notFound()
  }

  const t = await getTranslations('blog')

  return (
    <article className="container max-w-4xl py-16">
      {/* Header */}
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {format(new Date(post.date), 'MMMM dd, yyyy')}
          </time>
          <span>•</span>
          <span>{post.category}</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground">{post.description}</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-lg font-semibold">
              {post.author.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">{post.author}</div>
            <div className="text-sm text-muted-foreground">
              {t('author')}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXContent code={post.body.code} />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-2xl font-semibold">
              {post.author.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold">{post.author}</h3>
            <p className="text-sm text-muted-foreground">
              {t('aboutAuthor')}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
