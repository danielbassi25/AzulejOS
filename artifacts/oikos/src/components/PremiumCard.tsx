import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  variant?: "white" | "cobalt" | "beige" | "glass";
}

const tileStyles = {
  white: {
    background: 'hsl(38, 30%, 99%)',
    border: '1px solid rgba(30,60,130,0.12)',
    boxShadow: '2px 3px 10px rgba(20,40,100,0.08), 0 0 0 1px rgba(255,252,245,0.9) inset',
  },
  cobalt: {
    background: 'hsl(218, 70%, 28%)',
    border: '1px solid rgba(20,50,120,0.5)',
    boxShadow: '2px 3px 12px rgba(20,40,100,0.25)',
  },
  beige: {
    background: 'hsl(40, 35%, 93%)',
    border: '1px solid rgba(30,60,130,0.10)',
    boxShadow: '2px 3px 8px rgba(20,40,100,0.06)',
  },
  glass: {
    background: 'rgba(255,252,245,0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(30,60,130,0.12)',
    boxShadow: '2px 3px 12px rgba(20,40,100,0.08)',
  },
};

export default function PremiumCard({ children, className, variant = "white", ...props }: PremiumCardProps) {
  return (
    <motion.div
      {...props}
      className={cn("rounded-sm overflow-hidden tile-texture", className)}
      style={{
        ...tileStyles[variant],
        ...((props as any).style || {}),
      }}
    >
      {children}
    </motion.div>
  );
}
