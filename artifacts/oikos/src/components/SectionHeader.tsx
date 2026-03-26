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
        padding: '36px 28px 30px',
      }}
    >
      {/* Warm light leak — subtle, not decorative */}
      <div
        className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(255,252,245,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="flex items-end justify-between relative z-10">
        <div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              fontSize: '2.6rem',
              letterSpacing: '0.01em',
              lineHeight: 1,
              color: 'hsl(42, 30%, 96%)',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '0.92rem',
                letterSpacing: '0.03em',
                color: 'rgba(215, 205, 185, 0.55)',
                marginTop: '8px',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="mb-1">{action}</div>}
      </div>
    </motion.div>
  );
}
