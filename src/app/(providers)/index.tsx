import { TRPCReactProvider } from "@/shared/api/trpc/react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class" 
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </TRPCReactProvider>
  )
}
