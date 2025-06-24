"use client";

import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

import { useUser } from "../api/useUser";
import { useUserModels } from "../api/useUserModels";

import { UserAvatar } from "./user-avatar";

interface UserInfoCardProps {
  className?: string;
}

export function UserInfoCard({ className }: UserInfoCardProps) {
  const user = useUser();

  if (!user) return null;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center space-x-6">
          <UserAvatar />
          <div className="flex-1">
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            <CardDescription className="text-lg mt-2">
              {user.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TotalModels />
      </CardContent>
    </Card>
  );
}

const TotalModels = () => {
  const { data, error, isLoading } = useUserModels();

  if (error) {
    toast.error(error.message);
    return null;
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="text-3xl font-bold text-accent-foreground animate-pulse">
          ...
        </div>
        <div className="text-sm text-muted-foreground">Загружено моделей</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-accent-foreground">
        {data.length}
      </div>
      <div className="text-sm text-muted-foreground">Загружено моделей</div>
    </div>
  );
};
