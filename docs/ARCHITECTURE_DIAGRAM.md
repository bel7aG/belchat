# Architecture Diagram

## High-Level System Architecture

- [Excalidraw Diagram](https://excalidraw.com/#json=QCdK7TIpXJq3Y1vRN5WRk,IvsXBpqJA7Iy-ngWvbih3Q)

## Component Interaction Flow

1. **User Authentication**:

   - User authenticates via Firebase Auth
   - Auth state is maintained in the Next.js application
   - Protected routes check auth status before rendering

2. **Real-time Messaging**:

   - Client components establish Firestore listeners for active conversations
   - New messages trigger UI updates in real-time
   - Message composition and sending is handled via Firebase SDK

3. **Media Handling**:

   - Files are uploaded directly to Firebase Storage
   - Storage URLs are stored in Firestore message documents
   - Images are displayed with optimized loading and previews (Skeleton)

4. **Background Processing**:
   - Cloud Functions handle notifications, message processing, and other background tasks
   - Functions can be triggered by Firestore writes, HTTP requests, or scheduled events


### Firebase Integration

- Firebase SDK is initialized in a singleton pattern
- Custom hooks abstract Firebase operations
- Server components use Firebase Admin SDK for privileged operations
- Client components use Firebase Web SDK for real-time features

### Performance Considerations

- Message pagination to limit initial data load
- Optimistic UI updates for better perceived performance
- Image optimization and lazy loading
- Selective subscription to active conversations only
