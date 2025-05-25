'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Check } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

/**
 * Unsplash images for the gallery with varying aspect ratios
 */
export const MOCKED_GALLERY_DATA = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Mountain lake at sunset',
    width: 1000,
    height: 667,
    photographer: 'Kalen Emsley',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-1 row-span-3',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Snowy mountain peaks',
    width: 1000,
    height: 667,
    photographer: 'Joshua Earle',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-1 row-span-3',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Misty forest lake',
    width: 1000,
    height: 667,
    photographer: 'Luca Bravo',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Woman meditating in mountains',
    width: 1000,
    height: 1500,
    photographer: 'Kalen Emsley',
    aspectRatio: 'portrait',
    gridSpan: 'col-span-1 row-span-1',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1579033385971-a7bc8c5f4b75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Aerial view of ice landscape',
    width: 1000,
    height: 667,
    photographer: 'Jonatan Pie',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-2 row-span-1',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1477936432016-8172ed08637e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Dog in snowy mountains',
    width: 1000,
    height: 1500,
    photographer: 'Ales Krivec',
    aspectRatio: 'portrait',
    gridSpan: 'col-span-2 row-span-3',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1515205244153-fce4e5d8bc49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Castle on hillside at sunset',
    width: 1000,
    height: 667,
    photographer: 'Jonny Clow',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-2 row-span-2',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Waterfall in landscape',
    width: 1000,
    height: 667,
    photographer: 'Rohit Tandon',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-1 row-span-2',
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Misty mountain valley',
    width: 1000,
    height: 667,
    photographer: 'Daniel Leone',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-2 row-span-2',
  },
  {
    id: 10,
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Northern lights over lake',
    width: 1000,
    height: 667,
    photographer: 'Johannes Groll',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-1 row-span-1',
  },
  {
    id: 11,
    url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Autumn forest path',
    width: 1000,
    height: 667,
    photographer: 'Sergei Akulich',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-1 row-span-1',
  },
  {
    id: 12,
    url: 'https://images.unsplash.com/photo-1543039625-14cbd3802e7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Mountain cabin in snow',
    width: 1000,
    height: 667,
    photographer: 'Simon Berger',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-3 row-span-3',
  },
  {
    id: 13,
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Mountain cabin in snow',
    width: 1000,
    height: 667,
    photographer: 'Simon Berger',
    aspectRatio: 'landscape',
    gridSpan: 'col-span-1 row-span-3',
  },
]

/**
 * Props for the ImageGallery component
 */
interface ImageGalleryProps {
  /** Whether the gallery is open */
  isOpen: boolean
  /** Function to close the gallery */
  onClose: () => void
  /** Function called when an image is selected */
  onSelectImage: (imageUrl: string, imageName: string) => void
}

/**
 * Component for displaying a gallery of images to select from
 * with a masonry-style grid layout in a drawer
 */
export function ImageGallery({ isOpen, onClose, onSelectImage }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})

  const handleSelectImage = () => {
    if (selectedImage !== null) {
      const image = MOCKED_GALLERY_DATA.find((img) => img.id === selectedImage)
      if (image) {
        onSelectImage(image.url, image.alt)
        onClose()
      }
    }
  }

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }))
  }

  const handleImageClick = (id: number) => {
    // Toggle selection - if already selected, deselect it
    setSelectedImage(selectedImage === id ? null : id)
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <div className="overflow-auto p-6">
          <DrawerHeader>
            <DrawerTitle>Gallery</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Choose an image to send in your message
            </DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto w-full">
            {/* Gallery Content */}
            <div className="grid h-full auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {MOCKED_GALLERY_DATA.map((image, index) => {
                  const chosen = selectedImage === null || selectedImage === image.id

                  return (
                    <motion.div
                      key={image.id}
                      animate={{
                        opacity: chosen ? 1 : 0.85,
                        y: 0,
                        scale: chosen ? 1 : 0.9,
                      }}
                      transition={{
                        type: 'spring',
                        bounce: 0.45,
                        duration: 1,
                        delay: selectedImage === index ? 0 : index * 0.02,
                      }}
                      className={cn('relative cursor-pointer overflow-hidden rounded-lg', image.gridSpan)}
                      style={{ height: '100%' }}
                      onClick={() => handleImageClick(image.id)}
                    >
                      <div className={cn('group relative h-full', selectedImage === image.id && 'ring-2 ring-primary')}>
                        {/* Loading skeleton */}
                        {!loadedImages[image.id] && (
                          <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-800"></div>
                        )}

                        {/* Image */}
                        <Image
                          src={image.url || '/mock-image.svg'}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          className={cn(
                            'h-full w-full rounded-lg object-cover transition-opacity duration-300',
                            loadedImages[image.id] ? 'opacity-100' : 'opacity-0',
                          )}
                          onLoad={() => handleImageLoad(image.id)}
                          unoptimized
                        />

                        {/* Selection overlay */}
                        <div
                          className={cn(
                            'absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100',
                            selectedImage === image.id && 'opacity-100',
                          )}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                            <AnimatePresence mode="wait">
                              {selectedImage === image.id && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                                >
                                  <Check className="h-5 w-5 text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Footer with action buttons */}
            <DrawerFooter className="pointer-events-none fixed bottom-0 w-full">
              <div
                className={cn(
                  'pointer-events-auto mx-auto flex translate-y-0 gap-4 rounded-full bg-foreground/20 px-6 py-2 backdrop-blur-md duration-300 ease-in-out',
                  selectedImage === null && 'translate-y-20',
                )}
              >
                <Button onClick={handleSelectImage} disabled={selectedImage === null} className="">
                  <Download className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
                <DrawerClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
