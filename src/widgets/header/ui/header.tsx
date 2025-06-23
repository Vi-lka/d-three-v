import Link from "next/link";

import Logo from "@/shared/components/primitives/Logo";
import ModeToggle from "@/shared/components/primitives/ModeToggle";
import { cn } from "@/shared/lib/utils";

import UserNav from "./user-nav";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary fixed top-0 z-10 w-full shadow backdrop-blur",
        className,
      )}
    >
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
