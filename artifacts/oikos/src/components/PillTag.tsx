import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PillTagProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "outline";
  icon?: ReactNode;
  className?: string;
}

export default function PillTag({ children, variant = "default", icon, className }: PillTagProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide transition-colors",
      variant === "default" && "bg-muted text-muted-foreground",
      variant === "primary" && "bg-primary/10 text-primary",
      variant === "secondary" && "bg-secondary/50 text-secondary-foreground",
      variant === "outline" && "border border-border text-foreground",
      className
    )}>
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </div>
  );
}
