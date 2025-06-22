import { cn } from "@/shared/lib/utils";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "text-accent-foreground text-xl font-bold md:text-2xl lg:text-3xl",
        className,
      )}
    >
      D3V
    </span>
  );
}
