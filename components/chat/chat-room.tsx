'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import type { Conversation, Message } from '@/lib/mock-data'

import { useChatStore } from '@/stores/chat-store'
import { ChatHeader } from './chat-header'
import { FilePreview } from './file-preview'
import { MessageInput } from './message-input'
import { MessageListSkeleton } from './message-list-skeleton'
import { useUserStore } from '@/stores/user-store'

// Dynamically import MessageList with a skeleton fallback
const MessageList = dynamic(() => import('./message-list'), {
  loading: () => <MessageListSkeleton />,
  ssr: false, // Disable server-side rendering for this component
})
/**
 * Props for the ChatRoom component
 */
interface ChatRoomProps {
  /** The conversation to display */
  conversation?: Conversation
}

/**
 * Main component for the chat room interface
 */
export default function ChatRoom({ conversation }: ChatRoomProps) {
  // State for the message input
  const [inputText, setInputText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [newMessageSent, setNewMessageSent] = useState(false)

  // Get current user from user store
  const currentUser = useUserStore((state) => state.currentUser)
  const updateUserLastSeen = useUserStore((state) => state.updateUserLastSeen)

  // Update user's last seen when they interact with the chat
  useEffect(() => {
    if (currentUser && !currentUser.lastSeen) {
      updateUserLastSeen(currentUser.id)
    }
  }, [currentUser?.id, updateUserLastSeen, inputText]) // Update on typing

  // Get chat store actions
  const { sendMessage, addReaction, removeReaction, markMessagesAsRead } = useChatStore()

  // Get the latest conversation data from the store
  const conversations = useChatStore((state) => state.conversations)
  const currentConversation = conversations.find((c) => c.id === conversation?.id)
  const messages = currentConversation?.messages || []

  useEffect(() => {
    if (!currentUser) return

    if (currentConversation?.id) {
      // Mark messages as read immediately when conversation is selected
      markMessagesAsRead(currentConversation.id, currentUser.id)
    }
  }, [currentConversation?.id, markMessagesAsRead, currentUser?.id])

  /**
   * Handles file selection from the input
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if this is a gallery image (has a url property)
      if ('url' in file) {
        setSelectedFile(file)
        setPreviewUrl(file.url as string)
      } else {
        // Regular file from desktop
        setSelectedFile(file)
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setPreviewUrl(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  /**
   * Clears the selected file
   */
  const clearFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  /**
   * Handles sending a message
   */
  const handleSend = () => {
    if (!inputText.trim() && !selectedFile) return
    if (!currentConversation) return
    if (currentUser) {
      // Create a new message object
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        type: selectedFile && inputText ? 'mixed' : selectedFile ? 'file' : 'text',
        text: inputText || undefined,
        fileData: selectedFile
          ? ({
              url: 'url' in selectedFile ? selectedFile.url : previewUrl || '/mock-image.svg?height=200&width=200',
              name: selectedFile.name,
              size: selectedFile.size,
              mimeType: 'url' in selectedFile ? 'image/jpeg' : selectedFile.type,
              thumbnailUrl: 'url' in selectedFile ? selectedFile.url : previewUrl || undefined,
            } as Message['fileData'])
          : undefined,
        timestamp: new Date(),
        readBy: [currentUser.id],
        reactions: [],
      }

      // Send the message and reset input state
      sendMessage(currentConversation.id, newMessage)
      setInputText('')
      clearFile()

      // Set flag to indicate a new message was sent
      setNewMessageSent(true)
      setTimeout(() => setNewMessageSent(false), 100)
    }
  }

  /**
   * Handles adding or removing a reaction to a message
   */
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!currentConversation || !currentUser) return

    const message = messages.find((m) => m.id === messageId)
    if (!message) return

    const existingReaction = message.reactions?.find((r) => r.emoji === emoji)
    const userHasReacted = existingReaction?.users.includes(currentUser.id)

    if (userHasReacted) {
      removeReaction(currentConversation.id, messageId, emoji, currentUser.id)
    } else {
      addReaction(currentConversation.id, messageId, emoji, currentUser.id)
    }
  }

  /**
   * Initiates a call (audio or video)
   */
  const initiateCall = (type: 'audio' | 'video') => {
    // In a real implementation, this would initiate a call (WebRTC)
  }

  // If no conversation is selected, show a placeholder
  if (!currentConversation) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl bg-card backdrop-blur-md">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Select a conversation</h3>
          <p className="text-gray-600 dark:text-white/70">Choose a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border bg-card backdrop-blur-md dark:shadow-lg">
      {/* Header */}
      <div className="border-b bg-secondary px-6 py-4">
        <ChatHeader conversation={currentConversation} onInitiateCall={initiateCall} />
      </div>

      {/* Messages - Dynamically loaded with skeleton fallback */}
      <MessageList
        messages={messages}
        onAddReaction={handleAddReaction}
        conversationId={currentConversation.id}
        newMessageSent={newMessageSent}
      />

      {/* Input Area */}
      <div className="bg-secondary p-4">
        {/* File Preview */}
        {selectedFile && <FilePreview file={selectedFile} previewUrl={previewUrl} onClear={clearFile} />}

        {/* Message Input */}
        <MessageInput
          inputText={inputText}
          onInputChange={setInputText}
          onSend={handleSend}
          onFileSelect={handleFileSelect}
          isSendDisabled={!inputText.trim() && !selectedFile}
        />
      </div>
    </div>
  )
}
