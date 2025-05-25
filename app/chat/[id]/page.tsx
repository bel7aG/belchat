import { notFound } from 'next/navigation'
import { mockConversations } from '@/lib/mock-data'

type Params = Promise<{ id: string }>

export const dynamic = 'force-static'

interface ChatConversationPageProps {
  params: Params
}

export default async function ChatConversationPage(props: ChatConversationPageProps) {
  const { id } = await props.params

  const conversation = mockConversations.find((c) => c.id === id)

  if (!conversation) {
    notFound()
  }

  return null // The actual rendering is handled by the layout
}
