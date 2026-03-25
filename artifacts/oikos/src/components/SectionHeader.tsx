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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, hsl(220, 68%, 26%) 0%, hsl(218, 72%, 30%) 100%)',
        borderBottom: '1px solid rgba(15,40,110,0.35)',
        padding: '32px 24px 28px',
      }}
    >
      {/* Very subtle light leak top-right — warmth, not pattern */}
      <div
        className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(255,252,245,0.06) 0%, transparent 65%)',
        }}
      />

      <div className="flex items-end justify-between relative z-10">
        <div>
          <h1
            className="font-serif font-semibold leading-none"
            style={{
              fontSize: '2.4rem',
              letterSpacing: '-0.025em',
              color: 'hsl(42, 30%, 96%)',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="font-serif italic mt-2"
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.02em',
                color: 'rgba(215, 205, 185, 0.58)',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="mb-0.5">{action}</div>}
      </div>
    </motion.div>
  );
}
