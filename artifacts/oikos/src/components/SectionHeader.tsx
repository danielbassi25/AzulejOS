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
      className="sticky top-0 z-40 px-6 pt-6 pb-5 flex items-center justify-between"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(220, 228, 255, 0.35)',
      }}
    >
      <div>
        <h1 className="text-[1.65rem] font-serif font-semibold tracking-tight text-foreground leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground/80 font-medium mt-1 tracking-wide italic">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}