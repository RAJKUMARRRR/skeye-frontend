import * as React from 'react'
import { View, Text, TouchableOpacity, type ViewProps } from 'react-native'
import { cn } from '../lib/utils'

const List = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('', className)} {...props} />
  )
)
List.displayName = 'List'

interface ListItemProps extends ViewProps {
  onPress?: () => void
}

const ListItem = React.forwardRef<View, ListItemProps>(
  ({ className, onPress, ...props }, ref) => {
    const Component = onPress ? TouchableOpacity : View
    return (
      <Component
        ref={ref}
        className={cn('border-b border-gray-200 py-3', className)}
        onPress={onPress}
        {...props}
      />
    )
  }
)
ListItem.displayName = 'ListItem'

const ListItemText = React.forwardRef<Text, ViewProps>(
  ({ className, ...props }, ref) => (
    <Text ref={ref} className={cn('text-base', className)} {...props} />
  )
)
ListItemText.displayName = 'ListItemText'

export { List, ListItem, ListItemText }
