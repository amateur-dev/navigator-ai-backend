'use client'

import * as React from 'react'

interface RedirectClientProps {
  url: string
}

export function RedirectClient({ url }: RedirectClientProps) {
  React.useEffect(() => {
    window.location.href = url
  }, [url])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to sign in...</h1>
        <p className="text-muted-foreground">
          If you're not redirected automatically,{' '}
          <a href={url} className="text-primary underline">
            click here
          </a>
        </p>
      </div>
    </div>
  )
}
