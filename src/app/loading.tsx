import { Loader } from "lucide-react";
import React from "react";

export default function LoadingPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <Loader className="h-8 w-8 animate-spin" />
        <p className="">Загрузка...</p>
      </div>
    </main>
  );
}
