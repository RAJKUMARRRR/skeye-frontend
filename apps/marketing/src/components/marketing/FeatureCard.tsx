'use client'

import Link from 'next/link'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
  index?: number
}

export function FeatureCard({
  icon,
  title,
  description,
  category,
  link,
  className,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <CardContainer className="w-full">
        <CardBody className="w-full">
          <Card className={cn('card-hover border-border/50 bg-card/50 backdrop-blur-sm', className)}>
            <CardHeader>
              <div className="mb-4 flex items-center justify-between">
                <CardItem translateZ="50">
                  <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {icon}
                  </motion.div>
                </CardItem>
                {category && (
                  <CardItem translateZ="30">
                    <Badge variant="secondary" className="shadow-sm">{category}</Badge>
                  </CardItem>
                )}
              </div>
              <CardItem translateZ="40">
                <CardTitle className="text-xl bg-clip-text">{title}</CardTitle>
              </CardItem>
              <CardItem translateZ="30">
                <CardDescription className="leading-relaxed">{description}</CardDescription>
              </CardItem>
            </CardHeader>
            {link && (
              <CardFooter>
                <CardItem translateZ="40" className="w-full">
                  <Button variant="link" className="px-0 group" asChild>
                    <Link href={link.href}>
                      {link.text}
                      <motion.span
                        className="inline-block ml-1"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        aria-hidden="true"
                      >
                        →
                      </motion.span>
                    </Link>
                  </Button>
                </CardItem>
              </CardFooter>
            )}
          </Card>
        </CardBody>
      </CardContainer>
    </motion.div>
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
