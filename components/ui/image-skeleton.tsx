'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ImageSkeletonProps {
  className?: string
  aspectRatio?: 'portrait' | 'landscape' | 'square'
}

export function ImageSkeleton({ className = '', aspectRatio = 'landscape' }: ImageSkeletonProps) {
  const getHeight = () => {
    switch (aspectRatio) {
      case 'portrait':
        return 'h-[400px]'
      case 'landscape':
        return 'h-[220px]'
      case 'square':
        return 'h-[300px]'
      default:
        return 'h-[220px]'
    }
  }

  return (
    <div className={cn('w-full overflow-hidden rounded-lg', getHeight(), className)}>
      <Skeleton className="h-full w-full" />
    </div>
  )
}
