'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Premium skeleton loader for the MessageList component
 * Precisely mirrors the actual MessageList layout and design
 */
export function MessageListSkeleton() {
  // Generate different message configurations for a realistic appearance
  const messages = [
    { hasReactions: true, hasImage: false, messageLength: 'medium' },
    { hasReactions: false, hasImage: false, messageLength: 'short' },
    { hasReactions: false, hasImage: true, messageLength: 'medium' },
    { hasReactions: true, hasImage: false, messageLength: 'long' },
  ]

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 duration-500 animate-in">
      <div className="w-full space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex gap-3">
            {/* Avatar */}
            <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />

            {/* Message Content */}
            <div className="flex max-w-[75%] flex-col items-start">
              {/* Sender name and time */}
              <div className="mb-1 flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>

              {/* Message bubble */}
              <div className="overflow-hidden rounded-2xl bg-gray-100/80 p-4 dark:bg-white/5">
                {/* Text message */}
                <Skeleton
                  className={cn(
                    message.messageLength === 'short'
                      ? 'w-[120px]'
                      : message.messageLength === 'medium'
                        ? 'w-[200px]'
                        : 'w-[280px]',
                    message.hasImage ? 'mb-2 h-10' : 'h-16',
                  )}
                />

                {/* Image preview if applicable */}
                {message.hasImage && <Skeleton className="h-[150px] w-[250px] rounded-xl" />}
              </div>

              {/* Reactions */}
              {message.hasReactions && (
                <div className="mt-1 flex gap-1">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-10 rounded-full" />
                  {Math.random() > 0.5 && <Skeleton className="h-6 w-8 rounded-full" />}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
