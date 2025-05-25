'use client'

import { UsersIcon, Phone, Video } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StatusIndicator } from '@/components/status-indicator'
import type { Conversation } from '@/lib/mock-data'
import { ThemeToggle } from '@/components/theme-toggle'
import { useUserStore } from '@/stores/user-store'
import { useMemo } from 'react'
import { getUserStatus } from '@/lib/user-utils'

/**
 * Props for the ChatHeader component
 */
interface ChatHeaderProps {
  /** The conversation to display in the header */
  conversation: Conversation
  /** Function to initiate a call */
  onInitiateCall: (type: 'audio' | 'video') => void
}

/**
 * Component for the chat room header
 */
export function ChatHeader({ conversation, onInitiateCall }: ChatHeaderProps) {
  const getUserById = useUserStore((state) => state.getUserById)

  // For direct conversations, get the other user's data
  const otherUserId =
    conversation.type === 'direct' ? conversation.participants.find((id) => id !== 'current-user') : null
  const otherUser = otherUserId ? getUserById(otherUserId) : null

  const { statusText } = getUserStatus(otherUser)
  // For group conversations, override the status text
  const displayStatusText = conversation.type === 'group' ? `${conversation.participants.length} members` : statusText

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {conversation.type === 'direct' ? (
          <div className="relative">
            <Avatar>
              <AvatarImage src={conversation.avatar || '/mock-image.svg'} alt={conversation.name} />
              <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <StatusIndicator status={otherUser?.status} />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <UsersIcon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div>
          <h2 className="font-medium text-gray-800 dark:text-white">{conversation.name}</h2>

          <p className="text-xs text-muted-foreground">{displayStatusText}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onInitiateCall('audio')}>
          <Phone className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => onInitiateCall('video')}>
          <Video className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => onInitiateCall('video')}>
          <ThemeToggle />
        </Button>
      </div>
    </div>
  )
}
