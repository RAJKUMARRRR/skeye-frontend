'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type AccordionContextType = {
  value: string | undefined
  onValueChange: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined)

interface AccordionProps {
  type: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, defaultValue, value, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const currentValue = value !== undefined ? value : internalValue

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(currentValue === newValue ? '' : newValue)
      }
      onValueChange?.(currentValue === newValue ? '' : newValue)
    }

    return (
      <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = 'Accordion'

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    data-state={value}
    className={cn('border-b', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const isOpen = context?.value === value

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => context?.onValueChange(value)}
      className={cn(
        'flex w-full flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 transition-transform duration-200"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const isOpen = context?.value === value

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
})
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
