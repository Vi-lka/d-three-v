"use client";

import { useUser } from "@/entities/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";

interface UserAvatarProps {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarProps) {
  const user = useUser();

  if (!user) return null;

  const matchesName = user.name?.match(/[\wа-я]+/gi);
  const acronymName =
    !!matchesName && matchesName.length > 0
      ? matchesName.map((match) => {
          return match[0]?.toUpperCase();
        })
      : "USR";

  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarImage src="#" alt="Avatar" />
      <AvatarFallback className="bg-transparent">{acronymName}</AvatarFallback>
    </Avatar>
  );
}
