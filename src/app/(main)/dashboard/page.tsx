import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/server/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/sign-in");
  return <div>page</div>;
}
