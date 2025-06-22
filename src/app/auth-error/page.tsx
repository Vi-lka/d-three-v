"use client"

import { AuthErrorCard } from "@/widgets/auth"

 
export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
      <AuthErrorCard />
    </div>
  )
}