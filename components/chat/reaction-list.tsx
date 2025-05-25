'use client'

import { cn } from '@/lib/utils'

/**
 * Props for the ReactionList component
 */
interface ReactionListProps {
  /** Array of reactions to display */
  reactions: {
    emoji: string
    count: number
    users: string[]
  }[]
  /** Function called when a reaction is clicked */
  onReactionClick: (emoji: string) => void
}

/**
 * Component for displaying a list of reactions on a message
 */
export function ReactionList({ reactions, onReactionClick }: ReactionListProps) {
  return (
    <div className="mt-1 flex flex-wrap justify-start gap-1">
      {reactions.map((reaction, index) => (
        <button
          key={index}
          onClick={() => onReactionClick(reaction.emoji)}
          className={cn(
            'flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs',
            reaction.users.includes('current-user')
              ? 'bg-primary/20 dark:bg-primary/30'
              : 'bg-gray-100 dark:bg-gray-800',
          )}
        >
          <span>{reaction.emoji}</span>
          <span className="text-gray-600 dark:text-gray-300">{reaction.count}</span>
        </button>
      ))}
    </div>
  )
}
