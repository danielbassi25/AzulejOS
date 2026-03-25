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
        "rounded-[1.25rem] border overflow-hidden transition-all duration-300",
        glass 
          ? "bg-white/60 dark:bg-black/60 backdrop-blur-md border-white/20 dark:border-white/10 shadow-lg shadow-black/5" 
          : "bg-card border-border/50 shadow-sm hover:shadow-md",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
