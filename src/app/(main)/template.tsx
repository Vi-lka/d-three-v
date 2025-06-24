import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import type React from "react";

import { auth } from "@/server/auth";

export default async function MainTemplate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) redirect("/sign-in");

  return (
    <SessionProvider session={session}>
      <main className="container mx-auto min-h-screen mt-14">{children}</main>
    </SessionProvider>
  );
}
