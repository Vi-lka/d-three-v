import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TRPCReactProvider } from "@/shared/api/trpc/react";
import { Toaster } from "@/shared/components/ui/sonner";

import { ThemeProvider } from "./theme-provider";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </NuqsAdapter>
    </TRPCReactProvider>
  );
}
