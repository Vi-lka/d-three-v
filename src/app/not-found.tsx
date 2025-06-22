"use client";

import { Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-lg p-8 shadow-md">
        <div className="mb-4 flex items-center justify-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404
          </h1>
        </div>
        <p className="text-foreground/70 mb-6 text-center">Не найдено</p>
        <div className="flex flex-col items-center justify-center gap-4">
          <Button onClick={() => router.back()} className="w-full">
            Вернуться <Undo2 className="flex-none" />
          </Button>
          <Link href="/" passHref>
            <Button variant="outline">На главную</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
