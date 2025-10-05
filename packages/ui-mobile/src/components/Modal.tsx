import * as React from 'react'
import { Modal as RNModal, View, TouchableOpacity, type ModalProps as RNModalProps } from 'react-native'
import { cn } from '../lib/utils'

interface ModalProps extends RNModalProps {
  onClose?: () => void
}

const Modal = React.forwardRef<View, ModalProps>(
  ({ className, onClose, children, ...props }, ref) => {
    return (
      <RNModal transparent animationType="fade" {...props}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <TouchableOpacity className="absolute inset-0" onPress={onClose} />
          <View
            ref={ref}
            className={cn('w-11/12 max-w-lg rounded-lg bg-white p-6 shadow-lg', className)}
          >
            {children}
          </View>
        </View>
      </RNModal>
    )
  }
)
Modal.displayName = 'Modal'

export { Modal }
