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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 px-6 pt-7 pb-5 flex items-end justify-between"
      style={{
        background: 'rgba(230,240,255,0.72)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderBottom: '1px solid rgba(180,210,255,0.30)',
      }}
    >
      <div>
        <h1
          className="font-serif font-semibold text-foreground leading-none"
          style={{ fontSize: '1.8rem', letterSpacing: '-0.03em' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-[11px] mt-1.5 italic font-light tracking-[0.06em]"
            style={{ color: 'hsl(218,30%,58%)' }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="mb-0.5">{action}</div>}
    </motion.div>
  );
}