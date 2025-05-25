import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'

import { AppProvider } from '@/contexts/app-provider'

// GLOBAL CSS FILES
import '../styles/globals.css'

const geist = Geist({ subsets: ['latin'] })

export const dynamic = 'force-static'

export const metadata: Metadata = {
  metadataBase: new URL('https:/chatroom.vercel.app'),
  title: 'Belchat',
  description: 'A chat app with mocked messaging',
  openGraph: {
    url: 'https://scira.ai',
    siteName: 'Scira AI',
  },
  keywords: [
    'Bel',
    'belhassen Gharsallah',
    'Bel chat',
    'Belchat',
    'chatroom',
    'free chatroom',
    'CHATROOM',
    'slack alternative',
    'bel7ag github',
    'Belhassen Gharsallah',
    'ai chat app',
    'chatroom app',
    'search engine',
    'AI',
    'ai',
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
