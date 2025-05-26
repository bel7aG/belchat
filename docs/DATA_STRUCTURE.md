# BelChat Firestore Data Structure

This document outlines the expected Firestore data models.

## Collections Overview

The database consists of three main components:
- **Users Collection**: Stores user profiles and preferences
- **Conversations Collection**: Stores chat room metadata
- **Messages Subcollection**: Stores individual messages under each conversation

## Users Collection

### Schema

```typescript
// Collection: users/{userId}
{
  id: string                    // Same as document ID
  username: string              // Unique username
  displayName: string           // User's display name
  avatarUrl: string             // Profile picture URL
  email: string                 // Email address
  lastSeen: Date           // Firestore Timestamp (converted from Date | number)
  status: 'online' | 'offline' | 'away'  // User's current status
  bio?: string                  // TODO
  createdAt: Date
  updatedAt?: Date

  // User preference
  settings?: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    soundEffects: boolean
  }
}
```

### Indexing Considerations

- Create index on `username` for @mention lookups and username searches
- Create index on `status` for filtering users by status
- Create composite index on `status` and `lastSeen` for "recently active users" queries

### Example Document

```json
{
  "id": "user123",
  "username": "johndoe",
  "displayName": "John Doe",
  "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
  "email": "john@example.com",
  "lastSeen": {
    "_seconds": 1621234567,
    "_nanoseconds": 0
  },
  "status": "online",
  "bio": "Software developer and coffee enthusiast",
  "createdAt": {
    "_seconds": 1609459200,
    "_nanoseconds": 0
  },
  "settings": {
    "theme": "dark",
    "notifications": true,
    "soundEffects": true
  }
}
```


### Schema

```typescript
// Collection: conversations/{conversationId}
{
  id: string                    // Same as document ID
  type: 'direct' | 'group'      // Conversation type
  name: string                  // Conversation name
  avatar?: string               // Optional group avatar URL
  participants: string[]        // Array of user IDs in this conversation
  lastMessage: string           // Preview text of the most recent message
  lastMessageSender?: string    // Name of the user who sent the last message
  lastMessageTime: Timestamp    // When the last message was sent (converted from Date)
  unreadCount: number           // Number of unread messages
  createdAt: Timestamp          // When conversation was created (converted from Date)
  updatedAt: Timestamp          // Last activity timestamp (converted from Date)
  
  // messages: Message[]        // MOVED to subcollection: conversations/{conversationId}/messages/{messageId}
}
```

### Indexing Considerations

- Create index on `participants` array for finding a user's conversations
- Create composite index on `participants` and `updatedAt` for sorting conversations by recent activity
- Create index on `type` for filtering direct vs. group chats

### Example Document

```json
{
  "id": "conv123",
  "type": "group",
  "name": "Project Team",
  "avatar": "https://storage.googleapis.com/belchat-app.appspot.com/conversations/conv123/avatar.jpg",
  "participants": ["user123", "user456", "user789"],
  "lastMessage": "Let's meet tomorrow at 10 AM",
  "lastMessageSender": "John Doe",
  "lastMessageTime": {
    "_seconds": 1621234567,
    "_nanoseconds": 0
  },
  "unreadCount": 5,
  "createdAt": {
    "_seconds": 1609459200,
    "_nanoseconds": 0
  },
  "updatedAt": {
    "_seconds": 1621234567,
    "_nanoseconds": 0
  }
}
```

## Messages Subcollection

Messages are stored as a subcollection under each conversation document.

### Schema

```typescript
// Subcollection: conversations/{conversationId}/messages/{messageId}
{
  id: string                    // Same as document ID
  senderId: string              // User ID of sender
  senderName: string            // Display name
  senderAvatar: string          // Avatar URL
  type: 'text' | 'file' | 'mixed'  // Message type
  text?: string                 // Text content (if applicable)
  fileData?: {                  // File data (if applicable)
    url: string                 // Storage URL to the file
    name: string                // Original filename
    size: number                // File size in bytes
    mimeType: string            // MIME type
    thumbnailUrl?: string       // URL to thumbnail (for images)
    width?: number              // Image width (if applicable)
    height?: number             // Image height (if applicable)
  }
  timestamp: Timestamp          // When message was sent (converted from Date)
  readBy: string[]              // Array of user IDs who have read this message
  reactions?: {                 // Optional reactions
    emoji: string               // Reaction emoji
    count: number               // Number of users who reacted
    users: string[]             // Array of user IDs who reacted
  }[]
  editedAt?: Timestamp          // When message was last edited (converted from Date)
  deletedAt?: Timestamp         // When message was deleted (converted from Date)
  isEdited?: boolean            // Whether message has been edited
  isDeleted?: boolean           // Soft delete flag
}
```

### Message Types Representation
1. **Text Message**: 
   - `type: 'text'`
   - `text` field contains the message content
   - `fileData` is null or undefined

2. **File/Image Message**:
   - `type: 'file'`
   - `text` is null or undefined
   - `fileData` contains file metadata including URL, name, size, etc.
   - For images, additional fields like `width`, `height`, and `thumbnailUrl` are included

3. **Mixed Message** (text + file):
   - `type: 'mixed'`
   - Both `text` and `fileData` fields are populated

### Metadata Fields

Key metadata:

- `senderId`: Links to the user who sent the message
- `timestamp`: When the message was sent (for ordering and display)
- `readBy`: Tracks which users have read the message
- `editedAt`/`isEdited`: Tracks message edits
- `deletedAt`/`isDeleted`: Supports soft deletion
- `reactions`: Tracks emoji reactions to messages

### Indexing Considerations

- Create index on `timestamp` for chronological message display
- Create composite index on `type` and `timestamp` for filtering by message type
- Consider index on `senderId` if filtering by sender is a common operation

### Example Documents

#### Text Message

```json
{
  "id": "msg123",
  "senderId": "user123",
  "senderName": "John Doe",
  "senderAvatar": "https://storage.googleapis.com/belchat-app.appspot.com/users/user123/avatar.jpg",
  "type": "text",
  "text": "Hello everyone! How are you doing today?",
  "timestamp": {
    "_seconds": 1621234567,
    "_nanoseconds": 0
  },
  "readBy": ["user123", "user456"],
  "reactions": [
    {
      "emoji": "👍",
      "count": 2,
      "users": ["user456", "user789"]
    },
    {
      "emoji": "❤️",
      "count": 1,
      "users": ["user456"]
    }
  ]
}
```

#### File/Image Message

```json
{
  "id": "msg456",
  "senderId": "user456",
  "senderName": "Jane Smith",
  "senderAvatar": "https://storage.googleapis.com/belchat-app.appspot.com/users/user456/avatar.jpg",
  "type": "file",
  "fileData": {
    "url": "https://storage.googleapis.com/belchat-app.appspot.com/conversations/conv123/messages/msg456/image.jpg",
    "name": "project-mockup.jpg",
    "size": 2457890,
    "mimeType": "image/jpeg",
    "thumbnailUrl": "https://storage.googleapis.com/belchat-app.appspot.com/conversations/conv123/messages/msg456/thumbnail.jpg",
    "width": 1920,
    "height": 1080
  },
  "timestamp": {
    "_seconds": 1621234600,
    "_nanoseconds": 0
  },
  "readBy": ["user456"]
}
```

#### Mixed Message (Text + File)

```json
{
  "id": "msg789",
  "senderId": "user789",
  "senderName": "Alex Johnson",
  "senderAvatar": "https://storage.googleapis.com/belchat-app.appspot.com/users/user789/avatar.jpg",
  "type": "mixed",
  "text": "Here's the document we discussed yesterday",
  "fileData": {
    "url": "https://storage.googleapis.com/belchat-app.appspot.com/conversations/conv123/messages/msg789/document.pdf",
    "name": "project-proposal.pdf",
    "size": 1245678,
    "mimeType": "application/pdf"
  },
  "timestamp": {
    "_seconds": 1621234700,
    "_nanoseconds": 0
  },
  "readBy": ["user789", "user123"],
  "isEdited": true,
  "editedAt": {
    "_seconds": 1621234800,
    "_nanoseconds": 0
  }
}
```

## Query Patterns

### Common Queries and Their Implementation

1. **Get User's Conversations**:
   ```javascript
   const conversationsRef = collection(db, 'conversations');
   const q = query(
     conversationsRef,
     where('participants', 'array-contains', userId),
     orderBy('updatedAt', 'desc')
   );
   ```

2. **Get Recent Messages in a Conversation**:
   ```javascript
   const messagesRef = collection(db, 'conversations', conversationId, 'messages');
   const q = query(
     messagesRef,
     orderBy('timestamp', 'desc'),
     limit(50)
   );
   ```

3. **Get Media Messages Only**:
   ```javascript
   const messagesRef = collection(db, 'conversations', conversationId, 'messages');
   const q = query(
     messagesRef,
     where('type', 'in', ['file', 'mixed']),
     orderBy('timestamp', 'desc')
   );
   ```

4. **Get Unread Messages**:
   ```javascript
   const messagesRef = collection(db, 'conversations', conversationId, 'messages');
   const q = query(
     messagesRef,
     where('readBy', 'array-contains', userId),
     orderBy('timestamp', 'desc')
   );
   ```


## Security Rules

Example Firestore security rules to protect this data structure:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection, only workspace users can read, and only the current user should have write access
    match /users/{userId} {
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      // Only participants can read/write conversations
      
      // Messages subcollection
      match /messages/{messageId} {
        // Only participants can read messages
        
        // Only participants can create messages
        
        // Only message sender can update/delete their own messages
      }
    }
  }
}
```
