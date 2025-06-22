import "server-only";

import type { Session } from "next-auth";

import { auth } from "@/server/auth";
import { providerMap } from "@/server/auth/config";

import { SignInForm } from "./ui/sign-in-form";

export async function AuthProtected({
  children,
  callbackUrl,
}: Readonly<{
  children: (session: Session) => React.ReactNode;
  callbackUrl: string | undefined;
}>) {
  const session = await auth();

  const providers = Object.values(providerMap);

  if (!session?.user)
    return <SignInForm providers={providers} callbackUrl={callbackUrl} />;

  return <>{children(session)}</>;
}
