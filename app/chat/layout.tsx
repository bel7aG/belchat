'use client'

import type React from 'react'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import ChatRoom from '@/components/chat/chat-room'
import { useChatStore } from '@/stores/chat-store'
import { cn } from '@/lib/utils'

export const dynamic = 'force-static'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const conversationId = pathname.split('/').pop()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Get conversations from the store
  const conversations = useChatStore((state) => state.conversations)
  const selectedConversation = conversations.find((c) => c.id === conversationId) || conversations[0]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen p-0 md:p-4">
      <div className="relative flex flex-1 gap-4 overflow-hidden">
        <Sidebar selectedConversation={selectedConversation} isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div
          className={cn(
            'relative !ml-0 flex flex-1 flex-col delay-300 duration-300 ease-in-out',
            !sidebarOpen && 'md:pl-4',
          )}
        >
          <ChatRoom conversation={selectedConversation} />
        </div>
      </div>
      {children}
    </div>
  )
}
