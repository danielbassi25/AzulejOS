import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export default function PremiumCard({ children, className, glass = false, ...props }: PremiumCardProps) {
  return (
    <motion.div
      {...props}
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-300",
        glass
          ? "backdrop-blur-xl border-white/50"
          : "bg-white/90 border-white/70 hover:border-white",
        className
      )}
      style={{
        boxShadow: glass
          ? '0 8px 32px rgba(107,140,255,0.10), 0 0 0 1px rgba(255,255,255,0.5) inset'
          : '0 4px 16px rgba(107,140,255,0.08), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.9) inset',
        ...((props as any).style || {}),
      }}
    >
      {children}
    </motion.div>
  );
}