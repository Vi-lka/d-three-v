"use client";

import { AuthErrorCard } from "@/widgets/auth";

export default function AuthErrorPage() {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center">
      <AuthErrorCard />
    </div>
  );
}
