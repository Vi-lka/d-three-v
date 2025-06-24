import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { UserInfoCard } from "@/entities/user";
import { Separator } from "@/shared/components/ui/separator";
import { UserModelsList } from "@/widgets/user";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/sign-in");
  return (
    <div className="min-h-screen pt-6">
      <div className="w-full space-y-8">
        <UserInfoCard />

        <Separator />

        <UserModelsList />
      </div>
    </div>
  );
}
