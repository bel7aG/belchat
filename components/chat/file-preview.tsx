'use client'

import { motion } from 'framer-motion'
import { Paperclip, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * Props for the FilePreview component
 */
interface FilePreviewProps {
  /** The file to preview */
  file: File
  /** URL for the file preview (for images) */
  previewUrl: string | null
  /** Function to clear the selected file */
  onClear: () => void
}

/**
 * Component for displaying a preview of a file before sending
 */
export function FilePreview({ file, previewUrl, onClear }: FilePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 flex items-center justify-between rounded-xl bg-gray-200/80 p-3 dark:bg-white/10"
    >
      <div className="flex items-center gap-3">
        {previewUrl ? (
          <img src={previewUrl || '/mock-image.svg'} alt="Preview" className="h-12 w-12 rounded-xl object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted-foreground/10">
            <Paperclip className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div>
          <p className="max-w-xs truncate text-sm font-medium text-gray-800 dark:text-white">{file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onClear}>
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}
