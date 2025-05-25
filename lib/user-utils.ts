import { formatDistanceToNow } from 'date-fns'
import type { User } from './mock-data'

/**
 * Get user status information
 * @param user The user to get status for
 * @param showLastMessage Whether to include last message in the status text
 * @param lastMessage Optional last message to include
 * @returns Object containing status text, status color, and whether to show status indicator
 */
export function getUserStatus(user: User | null | undefined, showLastMessage = false, lastMessage = '') {
  if (!user) {
    return {
      statusText: showLastMessage ? lastMessage : '',
      statusColor: '',
      showIndicator: false,
    }
  }

  switch (user.status) {
    case 'online':
      return {
        statusText: 'Active now',
        statusColor: 'bg-green-500',
        showIndicator: true,
      }
    case 'away':
      return {
        statusText: showLastMessage ? `Away · ${lastMessage}` : 'Away',
        statusColor: 'bg-yellow-500',
        showIndicator: true,
      }
    case 'offline':
    default:
      return {
        statusText: `Last seen ${formatDistanceToNow(user.lastSeen, { addSuffix: true })}`,
        statusColor: '',
        showIndicator: false,
      }
  }
}
