import * as React from 'react'
import { TouchableOpacity, Text, type TouchableOpacityProps } from 'react-native'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-blue-500',
        destructive: 'bg-red-500',
        outline: 'border border-gray-300 bg-transparent',
        secondary: 'bg-gray-500',
        ghost: 'bg-transparent',
      },
      size: {
        default: 'h-12 px-4 py-3',
        sm: 'h-10 px-3 py-2',
        lg: 'h-14 px-6 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const buttonTextVariants = cva('text-center font-medium', {
  variants: {
    variant: {
      default: 'text-white',
      destructive: 'text-white',
      outline: 'text-gray-900',
      secondary: 'text-white',
      ghost: 'text-gray-900',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
  title: string
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ className, variant, size, title, ...props }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        <Text className={cn(buttonTextVariants({ variant, size }))}>{title}</Text>
      </TouchableOpacity>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
