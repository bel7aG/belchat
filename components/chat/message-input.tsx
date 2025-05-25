'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'
import { Send, Paperclip, ImageIcon, Smile } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { ImagePickerMenu } from './image-picker-menu'
import { ImageGallery } from './image-gallery'
import { Textarea } from '../ui/textarea'

/**
 * Props for the MessageInput component
 */
interface MessageInputProps {
  /** Current input text value */
  inputText: string
  /** Function to update the input text */
  onInputChange: (text: string) => void
  /** Function to handle sending a message */
  onSend: () => void
  /** Function to handle file selection */
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether the send button should be disabled */
  isSendDisabled: boolean
}

/** Common emoji options for the picker */
const emojiOptions = ['😊', '😂', '👍', '❤️', '🎉', '🔥', '👏', '🙏', '😍', '🤔', '😮', '😢', '👋', '✅', '⭐', '🚀']

/**
 * Component for the message input area
 */
export function MessageInput({ inputText, onInputChange, onSend, onFileSelect, isSendDisabled }: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea and dispatch resize event for parent containers
  useEffect(() => {
    if (!inputRef?.current) return

    // Reset height to auto to get the correct scrollHeight
    inputRef.current.style.height = 'auto'

    // Set the height to scrollHeight + 2px for border
    const newHeight = Math.min(inputRef.current.scrollHeight, 200)
    inputRef.current.style.height = `${newHeight}px`

    // Dispatch a resize event to notify parent containers
    window.dispatchEvent(new Event('resize'))

    // Also dispatch a custom event for our layout component
    window.dispatchEvent(
      new CustomEvent('inputResize', {
        detail: { height: newHeight },
      }),
    )
  }, [inputText, inputRef])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    onInputChange(inputText + emoji)
    setIsEmojiPickerOpen(false)
    // Focus the input after selecting an emoji
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleSelectDesktop = () => {
    fileInputRef.current?.click()
  }

  const handleSelectGallery = () => {
    setIsGalleryOpen(true)
  }

  const handleGalleryImageSelect = (imageUrl: string, imageName: string) => {
    // Create a mock file event to pass to the parent component
    const mockEvent = {
      target: {
        files: [
          {
            name: imageName,
            size: 100000, // Mock size
            type: 'image/jpeg',
            // We'll pass the URL through a custom property
            url: imageUrl,
            // Add width and height for proper aspect ratio
            width: 1000,
            height: 667,
          },
        ],
      },
    }

    onFileSelect(mockEvent as any)
    setIsGalleryOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept="image/*" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild onClick={() => setIsImagePickerOpen(true)}>
              <ImageIcon className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Send image</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="relative flex-1 px-4">
          <Textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="scrollbar-none h-full max-h-[160px] min-h-[40px] w-full resize-none !rounded-2xl border-0 bg-gray-200/80 px-4 py-3 text-gray-800 duration-200 focus:ring-2 focus-visible:outline-none dark:bg-white/10 dark:text-white dark:placeholder:text-white/50 dark:focus:ring-white/20"
          />
        </div>

        <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="grid grid-cols-8 gap-1">
              {emojiOptions.map((emoji) => (
                <Button
                  variant="secondary"
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="rounded-md p-1 text-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={onSend}
          disabled={isSendDisabled}
          size="icon"
          className="rounded-full bg-gray-200/80 text-gray-800 hover:bg-gray-300 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Image Picker Menu */}
      <ImagePickerMenu
        isOpen={isImagePickerOpen}
        onOpenChange={setIsImagePickerOpen}
        onSelectDesktop={handleSelectDesktop}
        onSelectGallery={handleSelectGallery}
        children={<div />} // Hidden trigger
      />

      {/* Image Gallery Dialog */}
      <ImageGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={handleGalleryImageSelect}
      />
    </>
  )
}
