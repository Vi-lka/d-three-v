"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-background group-[.toaster]:!text-foreground group-[.toaster]:!border-border group-[.toaster]:!shadow-lg",
          error:
            "group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground",
          description: "group-[.toast]:!text-muted-foreground",
          actionButton:
            "group-[.toast]:!bg-foreground group-[.toast]:!text-background group-[.toast]:!py-4",
          cancelButton:
            "group-[.toast]:!bg-destructive group-[.toast]:!text-destructive-foreground group-[.toast]:!py-4",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
