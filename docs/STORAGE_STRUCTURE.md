# BelChat Storage Structure

This document outlines the Firebase Storage structure for the BelChat application, detailing how uploaded files and images are organized, named, and referenced.

## Storage Organization

Firebase Storage is organized in a hierarchical structure that mirrors Firestore data model, making it easy to manage access control and maintain relationships between documents and their associated files.

## Folder Structure

\`\`\`
/users/
  /{userId}/
    /avatar.jpg                     # User profile picture
    /profile-banner.jpg             # Optional profile banner image

/conversations/
  /{conversationId}/
    /avatar.jpg                     # Group conversation avatar
    /messages/
      /{messageId}/
        /original/                  # Original uploaded files
          /{filename}               # Original file with sanitized name
        /thumbnails/                # Generated thumbnails for images
          /small/{filename}         # Small thumbnail (150px)
          /medium/{filename}        # Medium thumbnail (300px)
          /large/{filename}         # Large thumbnail (600px)
\`\`\`

### Structure Rationale

1. **User-centric organization**: All user-specific files are stored under their user ID
2. **Conversation-based hierarchy**: Files related to conversations are grouped by conversation ID
3. **Message-level storage**: Each file is stored within the context of its message
4. **Separation of originals and derivatives**: Original files and generated thumbnails are stored separately

## File Naming Strategies

### General Principles

1. **Uniqueness**: Ensure filenames are unique to prevent overwrites
2. **Security**: Remove potentially harmful characters from filenames
3. **Retrievability**: Maintain a connection to the original filename when possible
4. **Versioning**: Include timestamps or version numbers when applicable

### Naming Patterns

#### User Avatars

\`\`\`
/users/{userId}/avatar.jpg
\`\`\`

- Fixed filename allows easy updates while maintaining the same reference
- Previous versions can be archived with timestamps if needed:
  \`\`\`
  /users/{userId}/avatar_archives/avatar_20230615.jpg
  \`\`\`

#### Message Attachments

\`\`\`
/conversations/{conversationId}/messages/{messageId}/original/{sanitized-filename}
\`\`\`

Where `{sanitized-filename}` follows these rules:
- Original filename is sanitized (remove spaces, special characters)
- Timestamp prefix is added for uniqueness: `{timestamp}-{sanitized-filename}`
- File extension is preserved
- For duplicate filenames, a counter is appended: `{timestamp}-{sanitized-filename}-{counter}.{ext}`

Example:
\`\`\`
/conversations/conv123/messages/msg456/original/1621234567-project-proposal.pdf
\`\`\`

#### Thumbnails

\`\`\`
/conversations/{conversationId}/messages/{messageId}/thumbnails/{size}/{filename}
\`\`\`

Where:
- `{size}` is one of: `small`, `medium`, or `large`
- `{filename}` is the same as the original file, with possible format conversion:
  \`\`\`
  1621234567-project-image.jpg
  \`\`\`

## Firestore References to Storage Files

### File Reference Structure

In Firestore documents, files are referenced using the following structure:

\`\`\`typescript
fileData: {
  url: string            // Full download URL for the file
  path: string           // Storage path for access control
  name: string           // Original filename for display
  size: number           // File size in bytes
  mimeType: string       // MIME type for handling
  thumbnailUrl?: string  // URL to thumbnail (for images)
  thumbnailPath?: string // Storage path to thumbnail
  width?: number         // Image width (if applicable)
  height?: number        // Image height (if applicable)
  createdAt: Timestamp   // When the file was uploaded
}
\`\`\`

### Example Firestore Document with File Reference

\`\`\`json
{
  "id": "msg456",
  "senderId": "user123",
  "senderName": "John Doe",
  "type": "file",
  "fileData": {
    "url": "...",
    "path": "conversations/conv123/messages/msg456/original/1621234567-project-proposal.pdf",
    "name": "project-proposal.pdf",
    "size": 1245678,
    "mimeType": "application/pdf",
    "createdAt": {
      "_seconds": 1621234567,
      "_nanoseconds": 0
    }
  },
  "timestamp": {
    "_seconds": 1621234567,
    "_nanoseconds": 0
  },
  "readBy": ["user123"]
}
\`\`\`

### Image with Thumbnails Example

\`\`\`json
{
  "id": "msg789",
  "senderId": "user456",
  "senderName": "Jane Smith",
  "type": "file",
  "fileData": {
    "url": "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    "path": "conversations/conv123/messages/msg789/original/1621234600-team-photo.jpg",
    "name": "team-photo.jpg",
    "size": 2457890,
    "mimeType": "image/jpeg",
    "thumbnailUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    "thumbnailPath": "conversations/conv123/messages/msg789/thumbnails/medium/1621234600-team-photo.jpg",
    "width": 1920,
    "height": 1080,
    "createdAt": {
      "_seconds": 1621234600,
      "_nanoseconds": 0
    }
  },
  "timestamp": {
    "_seconds": 1621234600,
    "_nanoseconds": 0
  },
  "readBy": ["user456"]
}
\`\`\`

## Versioning and Deduplication Strategies

### File Versioning

For files that may be updated (like user avatars or shared documents), we implement the following versioning strategy:

1. **Fixed-name current version**: The current version always has a fixed path
   \`\`\`
   /users/{userId}/avatar.jpg
   \`\`\`

2. **Archived versions**: Previous versions are moved to an archives folder with timestamps
   \`\`\`
   /users/{userId}/avatar_archives/avatar_20230615.jpg
   \`\`\`

3. **Version tracking in Firestore**: For document files that need version history, we track versions in Firestore
   \`\`\`typescript
   fileVersions: [
     {
       version: 1,
       url: "...",
       path: "...",
       updatedAt: Timestamp,
       updatedBy: "userId"
     },
     // More versions...
   ]
   \`\`\`

## Security Considerations

### Storage Security Rules

Firebase Storage security rules are configured to ensure that only authorized users can access files, for example:

\`\`\`
allow read, write: if request.auth.uid == userId;
\`\`\`

## Performance Optimization

### Download URL Caching

To improve performance and reduce bandwidth costs:

1. **Cache download URLs**: Store download URLs in the client app to avoid repeated token generation
2. **Preload thumbnails**: For image galleries, preload thumbnails before displaying
3. **Progressive loading**: Load small thumbnails first, then medium, then full-size images as needed


## Cleanup and Maintenance

### Orphaned File Cleanup

To prevent storage leaks, implement a cleanup strategy for orphaned files:

1. **Cloud Function trigger**: When a message is deleted, trigger a Cloud Function to delete associated files
2. **Batch cleanup job**: Run a periodic job to identify and remove orphaned files
3. **Soft delete**: Implement a soft delete strategy with a grace period before permanent deletion

### Example
\`\`\`typescript
// Cloud Function to delete files when a message is deleted
exports.cleanupMessageFiles = functions.firestore
  .document('conversations/{conversationId}/messages/{messageId}')
  .onDelete(async (snapshot, context) => {
    const { conversationId, messageId } = context.params;
    const messageData = snapshot.data();
    
    if (messageData.fileData && messageData.fileData.path) {
      // Delete original file
      // Delete thumbnails if they exist
    }
  });
\`\`\`

This storage structure provides a robust foundation for managing files in the BelChat application, with clear organization, efficient naming strategies, and proper references between Firestore documents and Storage files.
