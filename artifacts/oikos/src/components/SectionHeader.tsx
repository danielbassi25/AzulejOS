import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 py-5 flex items-center justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
