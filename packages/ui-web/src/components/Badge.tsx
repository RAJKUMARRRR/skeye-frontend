import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border',
  {
    variants: {
      variant: {
        // Default - Teal accent
        default: 'bg-teal-50 text-teal-700 border-teal-200',
        // Success - Green
        success: 'bg-green-50 text-green-700 border-green-200',
        // Warning - Yellow/Amber
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        // Error/Destructive - Red
        destructive: 'bg-red-50 text-red-700 border-red-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        // Info - Blue
        info: 'bg-blue-50 text-blue-700 border-blue-200',
        // Secondary - Gray
        secondary: 'bg-gray-50 text-gray-700 border-gray-200',
        // Outline - Border only
        outline: 'bg-transparent text-gray-700 border-gray-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
