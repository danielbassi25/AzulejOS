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
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden"
      style={{
        background: 'hsl(218, 70%, 28%)',
        borderBottom: '1px solid rgba(30,60,130,0.20)',
        padding: '28px 24px 24px',
      }}
    >
      {/* Subtle azulejo pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px',
        }}
      />
      <div className="flex items-end justify-between relative z-10">
        <div>
          <h1
            className="font-serif font-semibold leading-none"
            style={{
              fontSize: '2.1rem',
              letterSpacing: '-0.02em',
              color: 'hsl(42, 30%, 95%)',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="italic font-light mt-1.5"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.04em',
                color: 'rgba(220, 210, 190, 0.70)',
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
