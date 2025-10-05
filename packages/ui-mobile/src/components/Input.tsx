import * as React from 'react'
import { TextInput, type TextInputProps } from 'react-native'
import { cn } from '../lib/utils'

export interface InputProps extends TextInputProps {}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
