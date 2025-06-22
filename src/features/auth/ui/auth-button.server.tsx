import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { auth } from '@/server/auth'
import { AuthButtonClient } from './auth-button.client'

export async function AuthButton() {
  const session = await auth()
  
  return (
    <SessionProvider session={session}>
      <AuthButtonClient />
    </SessionProvider>
  )
}
