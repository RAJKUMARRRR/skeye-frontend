import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface TestimonialAuthor {
  name: string
  title: string
  company: string
  avatar: string
}

export interface TestimonialProps {
  quote: string
  author: TestimonialAuthor
  rating?: number
  className?: string
}

export function Testimonial({
  quote,
  author,
  rating,
  className,
}: TestimonialProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="pt-6">
        {rating && (
          <div className="mb-4 flex gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={cn(
                  'h-5 w-5',
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                )}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}
        <blockquote className="text-lg italic text-foreground">
          "{quote}"
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium text-muted-foreground">
                {author.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold">{author.name}</p>
            <p className="text-sm text-muted-foreground">
              {author.title}, {author.company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Grid container for testimonials
export function TestimonialGrid({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
      className
    )}>
      {children}
    </div>
  )
}
