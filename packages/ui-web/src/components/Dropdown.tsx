import * as React from 'react'
import { cn } from '../lib/utils'

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, trigger, open, onOpenChange, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open ?? false)

    React.useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open)
      }
    }, [open])

    const handleToggle = () => {
      const newState = !isOpen
      setIsOpen(newState)
      onOpenChange?.(newState)
    }

    return (
      <div className="relative" ref={ref}>
        <div onClick={handleToggle}>{trigger}</div>
        {isOpen && (
          <div
            className={cn(
              'absolute right-0 z-50 mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
              className
            )}
            {...props}
          >
            {children}
          </div>
        )}
      </div>
    )
  }
)
Dropdown.displayName = 'Dropdown'

const DropdownItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
        className
      )}
      {...props}
    />
  )
)
DropdownItem.displayName = 'DropdownItem'

export { Dropdown, DropdownItem }
