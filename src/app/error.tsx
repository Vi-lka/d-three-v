"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/shared/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-lg p-8 shadow-md">
        <div className="text-destructive mb-4 flex items-center justify-center">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-foreground mb-4 text-center text-2xl font-bold">
          Ошибка! Что-то пошло не так
        </h1>
        <p className="text-foreground/70 mb-6 text-center">{error.message}</p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => reset()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    </div>
  );
}
