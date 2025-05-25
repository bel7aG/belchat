import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | null | undefined
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * A reusable component for displaying user status indicators
 */
export function StatusIndicator({ status, className, size = 'md' }: StatusIndicatorProps) {
  if (!status || status === 'offline') return null

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: '',
  }

  return (
    <div
      className={cn(
        'absolute bottom-0 right-0 rounded-full border-2 border-background',
        sizeClasses[size],
        statusColors[status],
        className,
      )}
    />
  )
}
