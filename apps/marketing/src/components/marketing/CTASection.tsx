import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface CTASectionProps {
  title: string
  description?: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  variant?: 'default' | 'gradient' | 'outlined'
  className?: string
}

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = 'default',
  className,
}: CTASectionProps) {
  const gradientClass = variant === 'gradient'
    ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'
    : variant === 'outlined'
    ? 'border-2'
    : ''

  return (
    <section className={cn('py-20', className)}>
      <div className="container">
        <Card className={cn('border-primary/20', gradientClass)}>
          <CardContent className="p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                {title}
              </h2>
              {description && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {description}
                </p>
              )}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href={primaryCTA.href}>{primaryCTA.text}</Link>
                </Button>
                {secondaryCTA && (
                  <Button size="lg" variant="outline" asChild>
                    <Link href={secondaryCTA.href}>{secondaryCTA.text}</Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
