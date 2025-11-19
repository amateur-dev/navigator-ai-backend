'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <h2 className="text-3xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground">
              A critical error occurred. Please refresh the page or contact support.
            </p>
            {error.digest && (
              <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
            )}
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  )
}
