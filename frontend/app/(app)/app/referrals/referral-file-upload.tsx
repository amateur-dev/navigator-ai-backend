'use client'

import { format } from 'date-fns'
import { X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Badge, Button } from '@/components/ui'

export const ReferralFileUpload = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

  return (
    <div className="flex px-4 py-2 flex-1 flex-col gap-4">
      <div
        {...getRootProps({
          className:
            'dropzone flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 w-full bg-background items-center transition-all hover:bg-secondary/5 flex-1'
        })}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="mx-auto size-16 text-accent"
          >
            <path
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
          <div className="mt-4 flex text-sm/6 text-gray-600">
            <span className="relative cursor-pointer bg-transparent font-medium text-default focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-default hover:text-default/90 text-base">
              <span>Upload a file</span>
              <input id="file-upload" type="file" name="file-upload" className="sr-only" />
            </span>
            <p className="pl-1 text-base text-default">or drag and drop</p>
          </div>
          <p className="text-sm text-muted-foreground">PDF up to 10MB</p>
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="grid w-full gap-1">
          {acceptedFiles.map((file) => {
            console.log(file)
            const fileSizeInMB = file.size / 1024 / 1024

            return (
              <div
                key={file.path}
                className="flex items-center justify-between gap-2 border rounded-xl corner-smooth bg-background pl-4 pr-2 py-3"
              >
                <div className="flex flex-col">
                  <div className="flex flex-center gap-1">
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {fileSizeInMB.toFixed(2)} MB
                    </Badge>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Last Modified on {format(new Date(file.lastModified), 'MM/dd/yyyy')}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-9 px-2 gap-1.5">
                  <span>Remove</span>
                  <X className="size-3" strokeWidth={2} />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
