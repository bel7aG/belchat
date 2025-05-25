'use client'

import { useRef, useEffect, useState } from 'react'

import useFirstRender from '@/hooks/use-first-render'
import type { Message } from '@/lib/mock-data'

import { MessageItem } from './message-item'
import { StickToBottom } from '../ui/stick-to-bottom'

/**
 * Props for the MessageList component
 */
interface MessageListProps {
  /** Array of messages to display */
  messages: Message[]
  /** Function to handle adding a reaction to a message */
  onAddReaction: (messageId: string, emoji: string) => void
  /** Conversation ID to track changes */
  conversationId: string
  /** Whether a new message was just sent by the current user */
  newMessageSent: boolean
}

/**
 * Component for displaying a list of messages
 */
function MessageList({ messages, onAddReaction, conversationId, newMessageSent }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousConversationId = useRef<string | null>(null)
  const previousMessageCount = useRef(messages.length)

  const [isAtBottom, setIsAtBottom] = useState(true)
  const isFirstRender = useFirstRender()

  // Force scroll to bottom
  const scrollToBottom = (smooth = false) => {
    if (containerRef.current) {
      // Method 1: Using scrollTop
      containerRef.current.scrollTop = containerRef.current.scrollHeight

      // Method 2: Using scrollIntoView on the end element
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
        })
      }
    }
  }

  // Check if user is at the bottom of the chat
  const checkIfAtBottom = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const atBottom = scrollHeight - scrollTop - clientHeight < 50 // 50px threshold
      setIsAtBottom(atBottom)
    }
  }

  // Handle scroll events
  const handleScroll = () => {
    checkIfAtBottom()
  }

  // Initial load and conversation change handler
  useEffect(() => {
    // Always scroll to bottom on initial load
    if (isFirstRender) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        scrollToBottom(false)
      }, 0)
    }

    // Scroll to bottom when conversation changes
    if (previousConversationId.current !== conversationId) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        scrollToBottom(false)
      }, 0)
      previousConversationId.current = conversationId
    }
  }, [conversationId, isFirstRender])

  // Handle new messages
  useEffect(() => {
    // If message count increased, we have new messages
    if (messages.length > previousMessageCount.current) {
      // If user sent a new message, always smooth scroll to bottom
      if (newMessageSent) {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }
      // Otherwise, only scroll if user is already at the bottom
      else if (isAtBottom && !isFirstRender) {
        scrollToBottom(false)
      }
    }

    // Update previous message count
    previousMessageCount.current = messages.length
  }, [messages.length, newMessageSent, isAtBottom, isFirstRender])

  // Additional effect to ensure scroll is at bottom after component mounts
  useEffect(() => {
    // Double-check scroll position after a short delay
    const timer = setTimeout(() => {
      scrollToBottom(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <StickToBottom
      dynamic
      conversationId={conversationId}
      scrollToBottomOnMount={true}
      scrollToBottomOnUpdate={true}
      className="scrollbar-none hover:scrollbar w-full flex-1 space-y-4 p-4"
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} onAddReaction={onAddReaction} />
      ))}
    </StickToBottom>
  )
}

export default MessageList
