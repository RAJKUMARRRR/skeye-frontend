import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  category?: string
  link?: {
    text: string
    href: string
  }
  className?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  category,
  link,
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn('transition-all hover:shadow-lg', className)}>
      <CardHeader>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          {category && (
            <Badge variant="secondary">{category}</Badge>
          )}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {link && (
        <CardFooter>
          <Button variant="link" className="px-0" asChild>
            <Link href={link.href}>
              {link.text} <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Grid container for feature cards
export function FeatureGrid({
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
