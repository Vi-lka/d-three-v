"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/shared/lib/utils";

import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type ModeToggleProps = React.HTMLAttributes<HTMLButtonElement>;

export default function ModeToggle({ className }: ModeToggleProps) {
  const { setTheme, theme } = useTheme();

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "bg-background relative mr-2 h-8 w-8 rounded-full",
              className,
            )}
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="scale-0 rotate-90 !transition-all !duration-500 !ease-in-out dark:scale-100 dark:rotate-0" />
            <Moon className="absolute scale-100 rotate-0 !transition-all !duration-500 !ease-in-out dark:scale-0 dark:-rotate-90" />
            <span className="sr-only">Сменить Тему</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Сменить Тему</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
