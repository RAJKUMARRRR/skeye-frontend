import * as React from 'react'
import { View, Text, type ViewProps } from 'react-native'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1', {
  variants: {
    variant: {
      default: 'bg-blue-500',
      secondary: 'bg-gray-500',
      destructive: 'bg-red-500',
      outline: 'border border-gray-300 bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-white',
      secondary: 'text-white',
      destructive: 'text-white',
      outline: 'text-gray-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {
  label: string
}

function Badge({ className, variant, label, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      <Text className={cn(badgeTextVariants({ variant }))}>{label}</Text>
    </View>
  )
}

export { Badge, badgeVariants }
