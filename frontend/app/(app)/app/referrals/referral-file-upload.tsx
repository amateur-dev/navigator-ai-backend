'use client'

import { Button, Skeleton } from '@/components/ui'
import { uploadReferralFile } from '@/lib/actions/referrals'
import { cn } from '@/utils/cn'
import { CheckCircle2, FileText, Loader2, X, XCircle } from 'lucide-react'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

interface UploadedFile {
  file: File
  id: string
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error'
  uploadError?: string
  uploadResponse?: {
    success: boolean
    message?: string
    [key: string]: unknown
  }
}

export const ReferralFileUpload = () => {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const uploadFile = React.useCallback(async (fileToUpload: UploadedFile) => {
    setUploadedFile({
      ...fileToUpload,
      uploadStatus: 'uploading'
    })

    try {
      const formData = new FormData()
      formData.append('file', fileToUpload.file)

      const result = await uploadReferralFile(formData)

      if (!result.success) {
        throw new Error(result.message || 'Upload failed')
      }

      setUploadedFile({
        ...fileToUpload,
        uploadStatus: 'success',
        uploadResponse: result
      })

      toast.success(`${fileToUpload.file.name} uploaded successfully`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'

      setUploadedFile({
        ...fileToUpload,
        uploadStatus: 'error',
        uploadError: errorMessage
      })

      toast.error(`Failed to upload ${fileToUpload.file.name}: ${errorMessage}`)
    }
  }, [])

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      const newFile: UploadedFile = {
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        uploadStatus: 'uploading'
      }

      setUploadedFile(newFile)
      uploadFile(newFile)
    },
    [uploadFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  const removeFile = () => {
    startTransition(() => {
      setUploadedFile(null)
    })
  }

  const retryUpload = () => {
    if (!uploadedFile) return

    setUploadedFile({
      ...uploadedFile,
      uploadStatus: 'uploading'
    })

    uploadFile(uploadedFile)
  }

  const isUploading = uploadedFile?.uploadStatus === 'uploading'
  const isSuccess = uploadedFile?.uploadStatus === 'success'
  const showDropzone = !uploadedFile || uploadedFile.uploadStatus === 'error'

  return (
    <div className="flex px-4 py-2 flex-1 flex-col gap-4">
      {showDropzone && (
        <div
          {...getRootProps({
            className: cn(
              'dropzone flex justify-center rounded-lg border px-6 py-10 w-full bg-background items-center transition-all flex-1',
              {
                'border-primary bg-primary/5': isDragActive,
                'border-border': !isDragActive
              }
            )
          })}
        >
          <input {...getInputProps()} />
          <div className="text-center flex flex-col items-center gap-2">
            <FileText className="size-16 text-accent" strokeWidth={1} />
            <div className="mt-4 flex text-sm/6 text-gray-600">
              <span className="relative cursor-pointer bg-transparent font-medium text-default focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default hover:text-default/90 text-base">
                <span>Select a referral document</span>
                <input id="file-upload" type="file" name="file-upload" className="sr-only" />
              </span>
              <p className="pl-1 text-base text-default">or Drag and drop</p>
            </div>
            <p className="text-sm text-muted-foreground">PDF up to 10MB</p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex flex-col items-center justify-center gap-4 py-10 flex-1">
          <Loader2 className="size-12 animate-spin text-default" strokeWidth={1} />
          <div className="text-center">
            <p className="text-base font-medium text-default">
              Uploading {uploadedFile.file.name}...
            </p>
            <p className="text-sm text-muted-foreground">Please wait while we process your file</p>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="flex flex-col gap-3 pb-6">
          <div className="flex items-center gap-3 border rounded-xl corner-smooth bg-background p-4">
            <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-default">{uploadedFile.file.name}</p>
              <p className="text-xs text-muted-foreground">Upload successful</p>
            </div>
            <Button variant="ghost" size="sm" className="h-9 px-2 gap-1.5" onClick={removeFile}>
              <span>Remove</span>
              <X className="size-3" strokeWidth={2} />
            </Button>
          </div>

          <div className="flex flex-col gap-4 border rounded-xl corner-smooth bg-background p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="size-5 animate-spin text-default flex-shrink-0" />
              <p className="text-sm font-medium text-default">Processing the document</p>
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        </div>
      )}

      {uploadedFile && uploadedFile.uploadStatus === 'error' && (
        <div className="border rounded-xl corner-smooth bg-background p-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <XCircle className="size-5 text-red-500 flex-shrink-0" />
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
              <p className="text-xs font-medium text-red-500">{uploadedFile.uploadError}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3"
              onClick={retryUpload}
              disabled={isPending}
            >
              Retry Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3"
              onClick={removeFile}
              disabled={isPending}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
