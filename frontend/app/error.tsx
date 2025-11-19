'use client'

import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h2 className="text-3xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        {error.digest && <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>}
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}
