import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary - Accent teal color for main CTAs
        default: 'bg-accent text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm hover:shadow',
        // Destructive - Error red for dangerous actions
        destructive: 'bg-error text-white hover:bg-error-600 active:bg-error-700 shadow-sm hover:shadow',
        // Outline - Border style for secondary actions
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 active:border-gray-500',
        // Secondary - Light gray for less prominent actions
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
        // Ghost - Transparent with hover state
        ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        // Link - Text-only button
        link: 'text-accent underline-offset-4 hover:underline hover:text-accent-600',
        // Success - Green for positive actions
        success: 'bg-success text-white hover:bg-success-600 active:bg-success-700 shadow-sm hover:shadow',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
