'use client'

import type React from 'react'
import { useEffect, useRef, useState, useCallback } from 'react'

import { cn } from '@/lib/utils'

// Custom hook to handle the sticky bottom behavior
export function useStickToBottom(options?: {
  threshold?: number
  conversationId?: string | number
  scrollToBottomOnMount?: boolean
  scrollToBottomOnUpdate?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(true)
  const [isChangingConversation, setIsChangingConversation] = useState(false)
  const prevScrollHeightRef = useRef<number>(0)
  const prevConversationIdRef = useRef<string | number | undefined>(options?.conversationId)
  const threshold = options?.threshold ?? 10
  const scrollToBottomOnMount = options?.scrollToBottomOnMount ?? true
  const scrollToBottomOnUpdate = options?.scrollToBottomOnUpdate ?? true

  // Check if we should stick to bottom based on scroll position
  const checkIfShouldStickToBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const { scrollHeight, scrollTop, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    // If we're close enough to the bottom, consider it "sticky"
    setIsSticky(distanceFromBottom <= threshold)
  }, [threshold])

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = false) => {
    const container = containerRef.current
    if (!container) return

    // Explicitly set scroll behavior based on smooth parameter
    container.style.scrollBehavior = smooth ? 'smooth' : 'auto'

    // Use requestAnimationFrame to ensure the scroll happens after any pending renders
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = container.scrollHeight

        // Reset scroll behavior after animation
        if (smooth) {
          setTimeout(() => {
            if (container) {
              container.style.scrollBehavior = 'auto'
            }
          }, 300) // Match this with your CSS transition duration
        }
      }
    })
  }, [])

  // Monitor for content changes and maintain position
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new MutationObserver(() => {
      const newScrollHeight = container.scrollHeight

      // Only take action if content has actually changed
      if (newScrollHeight !== prevScrollHeightRef.current) {
        if (isSticky && !isChangingConversation) {
          scrollToBottom(true)
        } else if (isChangingConversation) {
          // If we're changing conversation, scroll immediately without animation
          scrollToBottom(false)
        }
        prevScrollHeightRef.current = newScrollHeight
      }
    })

    // Observe changes to the container's children
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    })

    // Initialize the previous scroll height
    prevScrollHeightRef.current = container.scrollHeight

    // Initial scroll to bottom if sticky - IMPORTANT: pass false for immediate scroll
    if (scrollToBottomOnMount) {
      scrollToBottom(false) // Changed from scrollToBottom() to scrollToBottom(false)
    }

    return () => {
      observer.disconnect()
    }
  }, [isSticky, scrollToBottom, scrollToBottomOnMount, isChangingConversation, containerRef.current])

  // Handle conversation changes
  useEffect(() => {
    // If the conversation ID changed
    if (options?.conversationId !== prevConversationIdRef.current && scrollToBottomOnUpdate) {
      const container = containerRef.current
      if (container) {
        // Signal that we're changing conversations
        setIsChangingConversation(true)

        // Ensure scroll behavior is set to auto
        container.style.scrollBehavior = 'auto'

        // Set scroll position to bottom immediately
        container.scrollTop = container.scrollHeight

        // Reset the conversation change flag after a delay
        setTimeout(() => {
          setIsChangingConversation(false)
          setIsSticky(true)
        }, 100)
      }

      prevConversationIdRef.current = options?.conversationId
    }
  }, [options?.conversationId, scrollToBottomOnUpdate])

  return {
    containerRef,
    isSticky,
    scrollToBottom,
    setIsSticky,
    isChangingConversation,
  }
}

// Component that implements the sticky bottom behavior
export function StickToBottom({
  children,
  className = '',
  height,
  maxHeight,
  dynamic = false,
  threshold = 10,
  conversationId,
  scrollToBottomOnMount = true,
  scrollToBottomOnUpdate = true,
}: {
  children: React.ReactNode
  className?: string
  height?: string | number
  maxHeight?: string | number
  dynamic?: boolean
  threshold?: number
  conversationId?: string | number
  scrollToBottomOnMount?: boolean
  scrollToBottomOnUpdate?: boolean
}) {
  const { containerRef, isSticky, scrollToBottom, isChangingConversation } = useStickToBottom({
    threshold,
    conversationId,
    scrollToBottomOnMount,
    scrollToBottomOnUpdate,
  })

  // Determine the style based on whether height is dynamic or fixed
  const containerStyle: React.CSSProperties = {
    scrollbarWidth: 'thin', // For Firefox
    scrollbarGutter: 'stable', // Prevent layout shifts
  }

  if (!dynamic) {
    // Fixed height mode
    containerStyle.height = typeof height === 'number' ? `${height}px` : height || '400px'
  } else {
    // Dynamic height mode
    containerStyle.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight || '100%'
  }

  return (
    <div ref={containerRef} className={cn('overflow-y-auto overscroll-none', className)} style={containerStyle}>
      {children}
    </div>
  )
}
