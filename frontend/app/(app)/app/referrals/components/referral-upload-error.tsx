'use client'

import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui'

interface ReferralUploadErrorProps {
  fileName: string
  errorMessage: string
  onRetry: () => void
  onRemove: () => void
  isUploading: boolean
}

export const ReferralUploadError = ({
  fileName,
  errorMessage,
  onRetry,
  onRemove,
  isUploading
}: ReferralUploadErrorProps) => {
  return (
    <div className="border rounded-xl corner-smooth bg-background p-4 flex items-center gap-4 justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <XCircle className="size-5 text-red-500 flex-shrink-0" />
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs font-medium text-red-500">{errorMessage}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3"
          onClick={onRetry}
          disabled={isUploading}
        >
          Retry Upload
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3"
          onClick={onRemove}
          disabled={isUploading}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}
