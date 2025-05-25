export interface User {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  email: string
  lastSeen: Date | number
  status: 'online' | 'offline' | 'away'
  bio?: string // TODO
  createdAt: Date
  updatedAt?: Date | number // Profile update timestamp

  // User preferences (not implemented yet)
  settings?: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    soundEffects: boolean
  }
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  type: 'text' | 'file' | 'mixed'
  text?: string
  fileData?: {
    url: string
    name: string
    size: number
    mimeType: string
    thumbnailUrl?: string
    width?: number
    height?: number
  }
  timestamp: Date
  readBy: string[]
  reactions?: {
    emoji: string
    count: number
    users: string[]
  }[]
  editedAt?: Date
  deletedAt?: Date
  isEdited?: boolean
  isDeleted?: boolean
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name: string
  avatar?: string
  participants: string[]
  lastMessage: string
  lastMessageSender?: string
  lastMessageTime: Date
  unreadCount: number
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Create mock users
export const mockUsers: User[] = [
  {
    id: 'current-user',
    username: 'bel',
    displayName: 'You',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
    email: 'you@example.com',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    lastSeen: new Date(),
    status: 'online',
  },
  {
    id: 'user-1',
    username: 'alice',
    displayName: 'Alice Johnson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    email: 'alice@example.com',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 15 * 60 * 1000),
    status: 'online',
  },
  {
    id: 'user-2',
    username: 'bob',
    displayName: 'Bob Smith',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    email: 'bob@example.com',
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'away',
  },
  {
    id: 'user-3',
    username: 'charlie',
    displayName: 'Charlie Davis',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    email: 'charlie@example.com',
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'offline',
  },
  {
    id: 'user-4',
    username: 'diana',
    displayName: 'Diana Miller',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    email: 'diana@example.com',
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'offline',
  },
  {
    id: 'user-5',
    username: 'ethan',
    displayName: 'Ethan Wilson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    email: 'ethan@example.com',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'offline',
  },
]

// Generate mock messages for a conversation
function generateMockMessages(senderId: string, senderName: string, senderAvatar: string, count: number): Message[] {
  const messages: Message[] = []
  const now = new Date()

  const textOptions = [
    "Hey, how's it going?",
    'Did you see the latest design updates?',
    "I'm working on the new feature right now.",
    "Let's schedule a meeting to discuss this further.",
    'Can you share the document with me?',
    "I'll be out of office tomorrow.",
    'Great work on the presentation!',
    'The client loved our proposal.',
    'We need to fix that bug before the release.',
    "I've updated the documentation.",
  ]

  const reactionOptions = [
    { emoji: '👍', count: 1, users: ['user-2'] },
    { emoji: '❤️', count: 2, users: ['user-1', 'user-3'] },
    { emoji: '😂', count: 3, users: ['user-2', 'user-3', 'user-4'] },
    { emoji: '🎉', count: 1, users: ['user-1'] },
    { emoji: '🔥', count: 2, users: ['user-3', 'user-4'] },
  ]

  for (let i = 0; i < count; i++) {
    const isCurrentUser = Math.random() > 0.6
    const messageType = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'file' : 'mixed') : 'text'
    const isEdited = Math.random() > 0.8
    const isDeleted = Math.random() > 0.95

    const message: Message = {
      id: `msg-${senderId}-${i}`,
      senderId: isCurrentUser ? 'current-user' : senderId,
      senderName: isCurrentUser ? 'You' : senderName,
      senderAvatar: isCurrentUser ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' : senderAvatar,
      type: messageType,
      timestamp: new Date(now.getTime() - (count - i) * 5 * 60000 - Math.random() * 300000),
      readBy: [isCurrentUser ? 'current-user' : senderId],
      isEdited: isEdited,
      isDeleted: isDeleted,
    }

    if (isEdited) {
      message.editedAt = new Date(message.timestamp.getTime() + 5 * 60000)
    }

    if (isDeleted) {
      message.deletedAt = new Date(message.timestamp.getTime() + 10 * 60000)
      message.text = 'This message has been deleted'
    } else {
      if (messageType === 'text' || messageType === 'mixed') {
        message.text = textOptions[Math.floor(Math.random() * textOptions.length)]
      }

      if (messageType === 'file' || messageType === 'mixed') {
        const isImage = Math.random() > 0.3
        message.fileData = {
          url: isImage ? `/mock-image.svg?height=400&width=600&query=chat image ${i}` : '/mock-image.svg',
          name: isImage ? `image-${i}.jpg` : `document-${i}.pdf`,
          size: Math.floor(Math.random() * 1000000) + 50000,
          mimeType: isImage ? 'image/jpeg' : 'application/pdf',
          width: isImage ? 600 : undefined,
          height: isImage ? 400 : undefined,
        }
        if (isImage) {
          message.fileData.thumbnailUrl = `/mock-image.svg?height=200&width=300&query=chat image thumbnail ${i}`
        }
      }
    }

    // Add reactions to some messages
    if (Math.random() > 0.6 && !message.isDeleted) {
      const numReactions = Math.floor(Math.random() * 3) + 1
      message.reactions = []

      for (let j = 0; j < numReactions; j++) {
        const reaction = reactionOptions[Math.floor(Math.random() * reactionOptions.length)]
        // Avoid duplicate emojis
        if (!message.reactions.some((r) => r.emoji === reaction.emoji)) {
          message.reactions.push({ ...reaction })
        }
      }
    }

    messages.push(message)
  }

  return messages
}

// Create mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    participants: ['user-1', 'current-user'],
    lastMessage: 'Did you see the latest design updates?',
    lastMessageTime: new Date(Date.now() - 15 * 60000),
    unreadCount: 2,
    messages: generateMockMessages(
      'user-1',
      'Alice Johnson',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      12,
    ),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'conv-2',
    type: 'direct',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    participants: ['user-2', 'current-user'],
    lastMessage: "I'll send you the report by EOD",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60000),
    unreadCount: 0,
    messages: generateMockMessages('user-2', 'Bob Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', 8),
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60000),
  },
  {
    id: 'conv-3',
    type: 'group',
    name: 'Design Team',
    participants: ['user-1', 'user-2', 'user-3', 'current-user'],
    lastMessage: "Let's finalize the color palette",
    lastMessageSender: 'Alice',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 60000),
    unreadCount: 5,
    messages: generateMockMessages(
      'user-1',
      'Alice Johnson',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      15,
    ),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60000),
  },
  {
    id: 'conv-4',
    type: 'direct',
    name: 'Charlie Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    participants: ['user-3', 'current-user'],
    lastMessage: 'Are we still meeting tomorrow?',
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60000),
    unreadCount: 0,
    messages: generateMockMessages(
      'user-3',
      'Charlie Davis',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
      10,
    ),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60000),
  },
  {
    id: 'conv-5',
    type: 'group',
    name: 'Project Alpha',
    participants: ['user-2', 'user-4', 'user-5', 'current-user'],
    lastMessage: 'The client approved the proposal!',
    lastMessageSender: 'Bob',
    lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60000),
    unreadCount: 0,
    messages: generateMockMessages('user-2', 'Bob Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', 20),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000),
  },
  {
    id: 'conv-6',
    type: 'direct',
    name: 'Diana Miller',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    participants: ['user-4', 'current-user'],
    lastMessage: 'Thanks for your help with the presentation',
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60000),
    unreadCount: 0,
    messages: generateMockMessages(
      'user-4',
      'Diana Miller',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
      7,
    ),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60000),
  },
  {
    id: 'conv-7',
    type: 'group',
    name: 'Marketing Team',
    participants: ['user-1', 'user-4', 'user-5', 'current-user'],
    lastMessage: "Let's review the campaign metrics",
    lastMessageSender: 'Diana',
    lastMessageTime: new Date(Date.now() - 4 * 24 * 60 * 60000),
    unreadCount: 0,
    messages: generateMockMessages(
      'user-4',
      'Diana Miller',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
      18,
    ),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60000),
  },
  {
    id: 'conv-8',
    type: 'direct',
    name: 'Ethan Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    participants: ['user-5', 'current-user'],
    lastMessage: "I've pushed the code changes",
    lastMessageTime: new Date(Date.now() - 5 * 24 * 60 * 60000),
    unreadCount: 0,
    messages: generateMockMessages(
      'user-5',
      'Ethan Wilson',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
      9,
    ),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60000),
  },
]
