"use client"

import React from 'react'
import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html 
      lang="en" 
      suppressHydrationWarning
    >
      <body className="font-sans bg-background">
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
          <div className="p-8 bg-background rounded-lg shadow-md max-w-md w-full">
            <div className="flex items-center justify-center text-destructive mb-4">
              <AlertCircle size={48} />
            </div>
            <h1 className="text-2xl text-foreground font-bold text-center mb-4">Error! Something went wrong</h1>
            <p className="text-foreground/70 text-center mb-6">
              {error.message}
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => reset()}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}