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
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-colors",
        variant === "default" && "bg-[rgba(210,225,255,0.6)] text-[hsl(218,35%,45%)]",
        variant === "primary" && "bg-[rgba(100,140,255,0.12)] text-[hsl(224,70%,52%)]",
        variant === "secondary" && "bg-[rgba(165,200,255,0.25)] text-[hsl(218,45%,42%)]",
        variant === "outline" && "border border-[rgba(180,210,255,0.7)] text-[hsl(218,30%,40%)]",
        className
      )}
    >
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </div>
  );
}