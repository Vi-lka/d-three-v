"use client";

import { AlertCircle, SkipBack } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/shared/components/ui/button";

enum ErrorEnum {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
  Signin = "Signin",
  OAuthSignin = "OAuthSignin",
  OAuthCallbackError = "OAuthCallbackError",
  OAuthCreateAccount = "OAuthCreateAccount",
  EmailCreateAccount = "EmailCreateAccount",
  Callback = "Callback",
  OAuthAccountNotLinked = "OAuthAccountNotLinked",
  EmailSignin = "EmailSignin",
  CredentialsSignin = "CredentialsSignin",
  SessionRequired = "SessionRequired",
}

export function AuthErrorCard() {
  const search = useSearchParams();
  const error = search.get("error") as ErrorEnum | undefined;

  const router = useRouter();

  useEffect(() => {
    if (error) {
      // Log the error to an error reporting service
      console.error(error);
    }
  }, [error]);

  if (!error) return null;

  return (
    <div className="bg-background relative w-full max-w-md rounded-lg p-8 shadow-md">
      <Button
        variant="ghost"
        className="text-muted-foreground absolute top-2 left-2 aspect-square h-fit w-fit p-2"
        onClick={() => router.back()}
      >
        <SkipBack size={18} />
      </Button>
      <div className="text-destructive mb-4 flex items-center justify-center">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-foreground mb-4 text-center text-2xl font-bold">
        Ошибка! Что-то пошло не так
      </h1>
      <div className="mb-6 text-center">
        <p className="text-foreground/70 text-center">
          Возникла проблема при попытке аутентификации. Свяжитесь с нами, если
          эта ошибка повторяется. Уникальный код ошибки:
        </p>
        <p className="mt-1">
          <code className="bg-muted rounded-md p-2 text-xs shadow-md">
            {error.toString()}
          </code>
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => router.refresh()}>
          Перезагрузить
        </Button>
      </div>
    </div>
  );
}
