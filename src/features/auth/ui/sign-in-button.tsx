import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { IconByName, Icons } from "@/shared/components/ui/icons";

import type { ProviderItem } from "../model/types";

export const SignInButton = ({
  provider,
  handleSignIn,
  disabled,
}: {
  provider: ProviderItem;
  handleSignIn: (provider: string) => Promise<void>;
  disabled?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSignIn(provider: string) {
    setIsLoading(true);
    try {
      await handleSignIn(provider);
    } catch (error) {
      console.error(error);
      if (error instanceof AuthError) {
        return redirect(`/auth-error?error=${error.type}`);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      key={provider.id}
      variant="outline"
      type="button"
      disabled={isLoading || disabled}
      className="text-foreground stroke-foreground hover:bg-primary hover:text-primary-foreground hover:stroke-primary-foreground cursor-pointer"
      onClick={() => onSignIn(provider.id)}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <IconByName name={provider.id} className="mr-2 h-4 w-4" />
      )}{" "}
      {provider.name}
    </Button>
  );
};
