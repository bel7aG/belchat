'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UsersIcon, PanelLeftClose, PanelLeft, Users } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusIndicator } from '@/components/status-indicator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useFirstRender from '@/hooks/use-first-render'
import type { Conversation } from '@/lib/mock-data'
import { useChatStore } from '@/stores/chat-store'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/user-store'
import { getUserStatus } from '@/lib/user-utils'

interface SidebarProps {
  selectedConversation: Conversation
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ selectedConversation, isOpen, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const [activeTab, setActiveTab] = useState('all')
  const router = useRouter()

  const isFirstRender = useFirstRender()

  // Get conversations from the store
  const conversations = useChatStore((state) => state.conversations)

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectConversation = (conversation: Conversation) => {
    router.push(`/chat/${conversation.id}`)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const tabsFramerConfig = useMemo(() => {
    const initial = isFirstRender ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }

    return {
      sidebar: {
        width: isOpen ? 320 : 0,
        opacity: isOpen ? 1 : 0,
      },
      tabs: {
        initial,
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 },
      },
    }
  }, [isFirstRender, isOpen])

  return (
    <>
      <motion.div
        initial={false}
        animate={tabsFramerConfig.sidebar}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 z-50 h-screen w-screen flex-shrink-0 overflow-hidden md:relative md:h-full"
      >
        <div className="flex h-full w-full flex-col rounded-none bg-card shadow-lg backdrop-blur-md md:rounded-2xl">
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hover:bg-gray-200/50 dark:hover:bg-white/10"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="flex-shrink-0 px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="border-0 bg-gray-100/80 pl-8 dark:bg-white/10 dark:placeholder:text-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="flex min-h-0 flex-1 flex-col">
            <Tabs defaultValue="all" className="flex flex-1 flex-col" value={activeTab} onValueChange={handleTabChange}>
              <div className="flex-shrink-0 px-4 pb-2">
                <TabsList className="w-full bg-gray-100/80 dark:bg-white/10">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="direct" className="flex-1">
                    Direct
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="flex-1">
                    Groups
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === 'all' && (
                    <motion.div {...tabsFramerConfig.tabs} key="all" className="absolute inset-0 flex flex-col">
                      <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="flex flex-col px-4 pb-2">
                          {filteredConversations.map((conversation) => (
                            <ConversationItem
                              key={conversation.id}
                              conversation={conversation}
                              isSelected={selectedConversation.id === conversation.id}
                              onClick={() => handleSelectConversation(conversation)}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'direct' && (
                    <motion.div {...tabsFramerConfig.tabs} key="direct" className="absolute inset-0 flex flex-col">
                      <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="flex flex-col px-4 pb-2">
                          {filteredConversations
                            .filter((c) => c.type === 'direct')
                            .map((conversation) => (
                              <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isSelected={selectedConversation.id === conversation.id}
                                onClick={() => handleSelectConversation(conversation)}
                              />
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'groups' && (
                    <motion.div {...tabsFramerConfig.tabs} key="groups" className="absolute inset-0 flex flex-col">
                      <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="flex flex-col px-4 pb-2">
                          {filteredConversations
                            .filter((c) => c.type === 'group')
                            .map((conversation) => (
                              <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isSelected={selectedConversation.id === conversation.id}
                                onClick={() => handleSelectConversation(conversation)}
                              />
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </motion.div>

      {/* Floating toggle button when sidebar is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, x: -40, opacity: 0 }}
            animate={{ scale: 1, x: 0, opacity: 1 }}
            exit={{ scale: 0, x: -40, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={onToggle}
            className="fixed left-2 top-8 z-30 rounded-full p-2 transition-colors hover:bg-gray-100/10 dark:hover:bg-white/10"
          >
            <PanelLeft className="h-5 w-5 text-gray-800 dark:text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  // Get user store functions without creating a subscription
  const getUserById = useUserStore((state) => state.getUserById)

  // For direct conversations, get the other user's data
  const otherUserId =
    conversation.type === 'direct' ? conversation.participants.find((id) => id !== 'current-user') : null
  const otherUser = otherUserId ? getUserById(otherUserId) : null

  // Get status information with last message
  const { statusText } = getUserStatus(otherUser, true, conversation.lastMessage)

  // For group conversations, use the last message with sender
  const displayText =
    conversation.type === 'group' && conversation.lastMessageSender
      ? `${conversation.lastMessageSender}: ${conversation.lastMessage}`
      : statusText

  return (
    <button
      onClick={onClick}
      className={cn(
        'mb-2 flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors',
        isSelected
          ? 'bg-gray-200/80 text-gray-800 dark:bg-white/10 dark:text-white'
          : 'text-gray-700 hover:bg-gray-100/80 dark:text-white/90 dark:hover:bg-white/5',
      )}
    >
      {conversation.type === 'direct' ? (
        <div className="relative">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={conversation.avatar || '/mock-image.svg'} alt={conversation.name} />
            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <StatusIndicator status={otherUser?.status} />
        </div>
      ) : (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{conversation.name}</p>
          <span className="flex-shrink-0 text-xs text-muted-foreground">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">{displayText}</p>
      </div>

      {conversation.unreadCount > 0 && (
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {conversation.unreadCount}
        </div>
      )}
    </button>
  )
}

// Fixed formatTime function to ensure consistent output between server and client
function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const oneDay = 24 * 60 * 60 * 1000

  if (diff < oneDay) {
    // Use 24-hour format without AM/PM to avoid locale differences
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } else if (diff < 7 * oneDay) {
    // Use abbreviated day name in English
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[date.getDay()]
  } else {
    // Use abbreviated month name in English and day
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}`
  }
}
