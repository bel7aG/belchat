'use client'

import { useState } from 'react'
import { Smile, Paperclip, Pencil, Trash2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Message } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ImageOverlay } from '@/components/ui/image-overlay'
import { StatusIndicator } from '@/components/status-indicator'
import { Button } from '@/components/ui/button'
import { ReactionList } from './reaction-list'
import { useChatStore } from '@/stores/chat-store'
import { useUserStore } from '@/stores/user-store'

import { Textarea } from '../ui/textarea'
/**
 * Props for the MessageItem component
 */
interface MessageItemProps {
  /** The message to display */
  message: Message
  /** Function to handle adding a reaction to a message */
  onAddReaction: (messageId: string, emoji: string) => void
}

/** Available emoji options for reactions */
const emojiOptions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '✅']

/**
 * Component for displaying a single message in the chat
 */
export function MessageItem({ message, onAddReaction }: MessageItemProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [editText, setEditText] = useState(message.text || '')
  const { editMessage, deleteMessage, messageBeingEdited, setMessageBeingEdited } = useChatStore()
  const isEditing = messageBeingEdited === message.id

  // Get current user from user store
  const currentUser = useUserStore((state) => state.currentUser)

  const getUserById = useUserStore((state) => state.getUserById)
  // Get sender user data for status display
  const senderUser = getUserById(message.senderId)

  const handleEditClick = () => {
    setEditText(message.text || '')
    setMessageBeingEdited(message.id)
  }

  const handleSaveEdit = () => {
    if (editText.trim() && message.text !== editText) {
      // Get the current conversation ID from the URL
      const conversationId = window.location.pathname.split('/').pop() || ''
      editMessage(conversationId, message.id, editText)
    } else {
      setMessageBeingEdited(null)
    }
  }

  const handleCancelEdit = () => {
    setMessageBeingEdited(null)
  }

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const conversationId = window.location.pathname.split('/').pop() || ''
      deleteMessage(conversationId, message.id)
    }
  }

  return (
    <div className="group flex justify-between">
      {/* Avatar */}
      <div className="flex flex-1 gap-3">
        <div className="relative mt-1 flex-shrink-0">
          <Avatar>
            <AvatarImage src={message.senderAvatar || '/mock-image.svg'} alt={message.senderName} />
            <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
          </Avatar>
          <StatusIndicator status={senderUser?.status} className="absolute right-0 top-0" />
        </div>

        {/* Message Content */}
        <div className={cn('flex max-w-[75%] flex-col items-start', isEditing && 'flex-1')}>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800 dark:text-white">{message.senderName}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {message.isEdited && !message.isDeleted && <span className="text-xs text-muted-foreground">(edited)</span>}
          </div>

          <div className="relative w-full">
            <div
              className={cn(
                'rounded-2xl p-3',
                message.isDeleted
                  ? 'bg-gray-100/50 italic text-gray-500 dark:bg-white/5 dark:text-gray-400'
                  : 'bg-gray-100/80 text-gray-800 dark:bg-white/5 dark:text-white',
              )}
            >
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      <X className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Check className="mr-1 h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {message.text && <p className="whitespace-pre-wrap break-all">{message.text}</p>}

                  {message.fileData && !message.isDeleted && (
                    <div className={cn('mt-2', !message.text && 'mt-0')}>
                      {message.fileData.mimeType.startsWith('image/') ? (
                        <div className="overflow-hidden rounded-xl">
                          <ImageOverlay
                            src={message.fileData.url || '/mock-image.svg'}
                            alt={message.fileData.name}
                            width={600}
                            height={400}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl bg-background/50 p-2">
                          <Paperclip className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate text-sm">{message.fileData.name}</span>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            ({(message.fileData.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Reaction button */}
            {!message.isDeleted && !isEditing && (
              <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
                <PopoverTrigger asChild>
                  <button
                    onClick={() => setShowReactionPicker(true)}
                    className="absolute right-0 top-1/2 mr-2 -translate-y-1/2 translate-x-full opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <div className="rounded-full bg-gray-200 p-1 dark:bg-gray-800">
                      <Smile className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="flex gap-1 p-1" side="right" align="center">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onAddReaction(message.id, emoji)
                        setShowReactionPicker(false)
                      }}
                      className="rounded-full p-1 text-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {emoji}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            )}

            {/* Display reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <ReactionList
                reactions={message.reactions}
                onReactionClick={(emoji) => onAddReaction(message.id, emoji)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Message actions for current user's messages */}
      {message.senderId === currentUser?.id && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={handleEditClick}
          >
            <Pencil className="h-3 w-3 text-gray-600 dark:text-gray-300" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-3 w-3 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      )}
    </div>
  )
}
