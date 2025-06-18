"use client"

import { signIn } from 'next-auth/react';
import React from 'react'
import { IconByName, Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AuthErrorCard from './auth-error-card';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  providers: {
    id: string;
    name: string;
  }[],
  callbackUrl: string | undefined
}

export default function SignInForm({ className, ...props }: SignInFormProps) {

  const {callbackUrl, ...otherProps} = props

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(provider: string) {
    setIsLoading(true)
    try {
      await signIn(
        provider,
        { redirectTo: callbackUrl }
      )
    } catch (error) {
      console.log(error)
      if (error instanceof AuthError) {
        return redirect(`/auth-error?error=${error.type}`)
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-5/6 flex-col justify-center space-y-6 sm:max-w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Вход
          </h1>
        </div>
        <AuthErrorCard />
        <div className={cn("grid gap-6", className)} {...otherProps}>
          {props.providers.map((provider) => (
            <Button 
              key={provider.id} 
              variant="outline" 
              type="button" 
              disabled={isLoading} 
              className='text-foreground stroke-foreground hover:bg-primary hover:text-primary-foreground hover:stroke-primary-foreground cursor-pointer'
              onClick={() => onSubmit(provider.id)}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <IconByName name={provider.id} className="mr-2 h-4 w-4" />
              )}{" "}
              {provider.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
