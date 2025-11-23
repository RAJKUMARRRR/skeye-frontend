'use client'

import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'
import React, { useRef, useState } from 'react'

interface MagneticButtonProps extends Omit<HTMLMotionProps<'button'>, 'onMouseMove' | 'onMouseLeave' | 'animate' | 'transition'> {
  children: React.ReactNode
  strength?: number
}

export const MagneticButton = ({
  children,
  className,
  strength = 0.3,
  ...props
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return

    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * strength
    const y = (clientY - (top + height / 2)) * strength
    setPosition({ x, y })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}
