"use client";

import { signIn } from "next-auth/react";
import { useState, type HTMLAttributes } from "react";

import { SignInButton, type ProviderItem } from "@/features/auth";
import { cn } from "@/shared/lib/utils";

import { AuthErrorCard } from "./auth-error-card";

interface SignInFormProps extends HTMLAttributes<HTMLDivElement> {
  providers: ProviderItem[];
  callbackUrl: string | undefined;
}

export function SignInForm({ className, ...props }: SignInFormProps) {
  const { callbackUrl, ...otherProps } = props;

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  async function handleSignIn(provider: string) {
    setIsDisabled(true);
    await signIn(provider, { redirectTo: callbackUrl }).finally(() =>
      setIsDisabled(false),
    );
  }

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-5/6 flex-col justify-center space-y-6 sm:max-w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Вход</h1>
        </div>
        <AuthErrorCard />
        <div className={cn("grid gap-6", className)} {...otherProps}>
          {props.providers.map((provider) => (
            <SignInButton
              key={provider.id}
              provider={provider}
              disabled={isDisabled}
              handleSignIn={handleSignIn}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
