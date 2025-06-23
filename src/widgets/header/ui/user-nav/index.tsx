"use server";

import { SessionProvider } from 'next-auth/react'

import { auth } from "@/server/auth"

import UserNavClient from './client'


export default async function UserNav() {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <UserNavClient />
    </SessionProvider>
  )
}