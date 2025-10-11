import { Card } from '../Card'
import { cn } from '../../lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantClasses = {
  default: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  success: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
  warning: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400',
  danger: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
}

export function StatCard({
  label,
  value,
  icon,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn('rounded-lg p-2', variantClasses[variant])}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  )
}
