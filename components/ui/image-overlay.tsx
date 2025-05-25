'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface ImageOverlayProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  viewTransitionName?: string
}

export function ImageOverlay({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  viewTransitionName,
}: ImageOverlayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [id] = useState(() => `image-${Math.random().toString(36).substr(2, 9)}`)
  const [mounted, setMounted] = useState(false)
  const thumbnailRef = useRef<HTMLDivElement>(null)

  // Only run on client
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const openOverlay = () => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeOverlay = () => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeOverlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = ''
      }
    }
  }, [])

  // Shared transition settings
  const transitionSettings = {
    type: 'spring',
    stiffness: 280,
    damping: 26,
    mass: 1,
    duration: 0.5,
  }

  // Thumbnail image - only show when overlay is closed
  const thumbnailImage = (
    <motion.div
      ref={thumbnailRef}
      layoutId={id}
      className={cn('cursor-zoom-in overflow-hidden', className)}
      onClick={openOverlay}
      style={{
        visibility: isOpen ? 'hidden' : 'visible',
        viewTransitionName: viewTransitionName || 'none',
        display: 'inline-block', // Use inline-block to respect image dimensions
      }}
    >
      <Image
        src={src || '/mock-image.svg'}
        alt={alt}
        width={width * 2}
        height={height * 2}
        className="pointer-events-auto h-auto max-h-72 w-auto overflow-hidden rounded-lg object-contain md:max-h-96"
        priority
        unoptimized
      />
    </motion.div>
  )

  // Overlay content
  const overlayContent =
    mounted &&
    createPortal(
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="image-overlay no-transition fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Overlay background */}
            <div className="absolute inset-0 bg-background/80" onClick={closeOverlay} />

            {/* Image container */}
            <motion.div
              layoutId={id}
              className="pointer-events-none relative z-10 m-4 max-h-[90vh] max-w-5xl overflow-hidden rounded-lg p-4"
              onClick={(e) => e.stopPropagation()}
              transition={transitionSettings}
            >
              <Image
                src={src || '/mock-image.svg'}
                alt={alt}
                width={width * 2}
                height={height * 2}
                className="pointer-events-auto h-auto max-h-[80vh] w-auto overflow-hidden rounded-lg object-contain"
                priority
                unoptimized
              />

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="absolute right-6 top-6 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation()
                  closeOverlay()
                }}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    )

  return (
    <>
      {thumbnailImage}
      {overlayContent}
    </>
  )
}
