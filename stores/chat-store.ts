import { create } from 'zustand'

import type { Message, Conversation } from '../lib/mock-data'
import { mockConversations } from '../lib/mock-data'
import { useUserStore } from './user-store'

interface ChatStore {
  conversations: Conversation[]
  currentConversationId: string | null
  messageBeingEdited: string | null

  // Actions
  setCurrentConversation: (id: string) => void
  sendMessage: (conversationId: string, message: Message) => void
  editMessage: (conversationId: string, messageId: string, newText: string) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  setMessageBeingEdited: (messageId: string | null) => void
  addReaction: (conversationId: string, messageId: string, emoji: string, userId: string) => void
  removeReaction: (conversationId: string, messageId: string, emoji: string, userId: string) => void
  updateConversationLastMessage: (conversationId: string, message: Message) => void
  markMessagesAsRead: (conversationId: string, userId: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: mockConversations,
  currentConversationId: null,
  messageBeingEdited: null,

  setCurrentConversation: (id) => set({ currentConversationId: id }),

  setMessageBeingEdited: (messageId) => set({ messageBeingEdited: messageId }),

  sendMessage: (conversationId, message) =>
    set((state) => {
      // Get user data for the sender
      const senderUser = useUserStore.getState().getUserById(message.senderId)
      const senderName = senderUser?.displayName || 'Unknown User'

      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message.text || 'Sent a file',
            lastMessageTime: message.timestamp,
            lastMessageSender: senderName,
            updatedAt: new Date(),
          }
        }
        return conv
      })
      return { conversations: updatedConversations }
    }),

  editMessage: (conversationId, messageId, newText) =>
    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.map((message) => {
            if (message.id === messageId) {
              // Only allow editing your own messages that aren't deleted
              if (message.senderId === 'current-user' && !message.isDeleted) {
                return {
                  ...message,
                  text: newText,
                  isEdited: true,
                  editedAt: new Date(),
                }
              }
            }
            return message
          })

          // Check if the edited message was the last message
          const editedMessage = updatedMessages.find((m) => m.id === messageId)
          let lastMessage = conv.lastMessage
          let lastMessageTime = conv.lastMessageTime

          if (editedMessage && conv.messages[conv.messages.length - 1].id === messageId) {
            lastMessage = editedMessage.text || 'Sent a file'
            lastMessageTime = new Date()
          }

          return {
            ...conv,
            messages: updatedMessages,
            lastMessage,
            lastMessageTime,
            updatedAt: new Date(),
          }
        }
        return conv
      })
      return {
        conversations: updatedConversations,
        messageBeingEdited: null, // Clear the editing state
      }
    }),

  deleteMessage: (conversationId, messageId) =>
    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.map((message) => {
            if (message.id === messageId) {
              // Only allow deleting your own messages
              if (message.senderId === 'current-user') {
                return {
                  ...message,
                  text: 'This message has been deleted',
                  fileData: undefined,
                  reactions: [],
                  isDeleted: true,
                  deletedAt: new Date(),
                }
              }
            }
            return message
          })

          // Check if the deleted message was the last message
          const wasLastMessage = conv.messages[conv.messages.length - 1].id === messageId
          let lastMessage = conv.lastMessage
          let lastMessageTime = conv.lastMessageTime

          if (wasLastMessage) {
            // Find the last non-deleted message
            const lastNonDeletedMessage = [...updatedMessages].reverse().find((m) => !m.isDeleted)

            if (lastNonDeletedMessage) {
              lastMessage = lastNonDeletedMessage.text || 'Sent a file'
              lastMessageTime = lastNonDeletedMessage.timestamp
            } else {
              lastMessage = 'No messages'
              lastMessageTime = new Date()
            }
          }

          return {
            ...conv,
            messages: updatedMessages,
            lastMessage,
            lastMessageTime,
            updatedAt: new Date(),
          }
        }
        return conv
      })
      return { conversations: updatedConversations }
    }),

  addReaction: (conversationId, messageId, emoji, userId) =>
    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.map((message) => {
            if (message.id === messageId && !message.isDeleted) {
              const reactions = message.reactions || []
              const existingReaction = reactions.find((r) => r.emoji === emoji)

              if (existingReaction) {
                if (existingReaction.users.includes(userId)) {
                  // User already reacted, don't add again
                  return message
                }
                // Add user to existing reaction
                return {
                  ...message,
                  reactions: reactions.map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count + 1,
                          users: [...r.users, userId],
                        }
                      : r,
                  ),
                }
              } else {
                // Add new reaction
                return {
                  ...message,
                  reactions: [...reactions, { emoji, count: 1, users: [userId] }],
                }
              }
            }
            return message
          })

          return {
            ...conv,
            messages: updatedMessages,
            updatedAt: new Date(),
          }
        }
        return conv
      })
      return { conversations: updatedConversations }
    }),

  removeReaction: (conversationId, messageId, emoji, userId) =>
    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.map((message) => {
            if (message.id === messageId && !message.isDeleted) {
              const reactions = message.reactions || []
              const existingReaction = reactions.find((r) => r.emoji === emoji)

              if (existingReaction && existingReaction.users.includes(userId)) {
                if (existingReaction.count === 1) {
                  // Remove the entire reaction if this was the only user
                  return {
                    ...message,
                    reactions: reactions.filter((r) => r.emoji !== emoji),
                  }
                }
                // Remove user from reaction
                return {
                  ...message,
                  reactions: reactions.map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count - 1,
                          users: r.users.filter((u) => u !== userId),
                        }
                      : r,
                  ),
                }
              }
            }
            return message
          })

          return {
            ...conv,
            messages: updatedMessages,
          }
        }
        return conv
      })
      return { conversations: updatedConversations }
    }),

  updateConversationLastMessage: (conversationId, message) =>
    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: message.text || 'Sent a file',
            lastMessageTime: message.timestamp,
            lastMessageSender: message.senderName,
            updatedAt: new Date(),
          }
        }
        return conv
      })
      return { conversations: updatedConversations }
    }),

  markMessagesAsRead: (conversationId, userId) =>
    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.map((message) => {
            if (!message.readBy.includes(userId)) {
              return {
                ...message,
                readBy: [...message.readBy, userId],
              }
            }
            return message
          })

          return {
            ...conv,
            messages: updatedMessages,
            unreadCount: 0, // Reset unread count when messages are marked as read
          }
        }
        return conv
      })
      return { conversations: updatedConversations }
    }),
}))
