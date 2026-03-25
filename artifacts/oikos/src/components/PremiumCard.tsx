import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export default function PremiumCard({ children, className, glass = false, ...props }: PremiumCardProps) {
  const baseStyle = glass
    ? {
        background: 'rgba(220,235,255,0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(200,220,255,0.6)',
        boxShadow: '0 8px 32px rgba(80,120,220,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset',
      }
    : {
        background: 'rgba(248,251,255,0.92)',
        border: '1px solid rgba(200,218,255,0.55)',
        boxShadow: '0 4px 20px rgba(80,120,220,0.07), 0 1px 4px rgba(0,0,0,0.03), 0 0 0 1px rgba(255,255,255,0.95) inset',
      };

  return (
    <motion.div
      {...props}
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-300",
        className
      )}
      style={{
        ...baseStyle,
        ...((props as any).style || {}),
      }}
    >
      {children}
    </motion.div>
  );
}