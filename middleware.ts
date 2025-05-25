import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockConversations } from '@/lib/mock-data'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // If accessing the root path, redirect to the chat with the first conversation
  if (pathname === '/') {
    if (mockConversations.length > 0) {
      return NextResponse.redirect(new URL(`/chat/${mockConversations[0].id}`, request.url))
    }
    // Fallback if no conversations exist
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  // If accessing /chat without a specific conversation, redirect to the first conversation
  if (pathname === '/chat') {
    if (mockConversations.length > 0) {
      return NextResponse.redirect(new URL(`/chat/${mockConversations[0].id}`, request.url))
    }
  }

  return NextResponse.next()
}

// Configure the paths that should invoke the middleware
export const config = {
  matcher: ['/', '/chat'],
}
