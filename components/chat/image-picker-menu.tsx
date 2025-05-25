'use client'

import type React from 'react'
import { Computer, ImageIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

/**
 * Props for the ImagePickerMenu component
 */
interface ImagePickerMenuProps {
  /** Whether the menu is open */
  isOpen: boolean
  /** Function to set the open state */
  onOpenChange: (open: boolean) => void
  /** Function called when desktop option is selected */
  onSelectDesktop: () => void
  /** Function called when gallery option is selected */
  onSelectGallery: () => void
  /** The trigger button element */
  children: React.ReactNode
}

/**
 * Component for displaying image picker options menu
 */
export function ImagePickerMenu({
  isOpen,
  onOpenChange,
  onSelectDesktop,
  onSelectGallery,
  children,
}: ImagePickerMenuProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onSelectDesktop()
              onOpenChange(false)
            }}
          >
            <Computer className="mr-2 h-4 w-4" />
            From Computer
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onSelectGallery()
              onOpenChange(false)
            }}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            From Gallery
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
