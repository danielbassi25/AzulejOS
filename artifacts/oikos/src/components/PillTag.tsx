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
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase transition-colors",
        variant === "default" && "bg-[hsl(40,18%,91%)] text-[hsl(220,25%,40%)]",
        variant === "primary" && "bg-[hsl(218,70%,28%)] text-[hsl(42,30%,95%)]",
        variant === "secondary" && "bg-[hsl(210,40%,88%)] text-[hsl(218,60%,30%)]",
        variant === "outline" && "border border-[rgba(30,60,130,0.25)] text-[hsl(218,50%,32%)]",
        className
      )}
      style={{ borderRadius: '2px' }}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </div>
  );
}
