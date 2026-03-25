import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockLetters } from "@/data/mock";
import { motion } from "framer-motion";
import { LockKeyhole, MailOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LettersPage() {
  return (
    <AppShell>
      <div className="relative min-h-full">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -z-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(175,203,255,0.25) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <SectionHeader title="Letters" subtitle="Words preserved in time" />

        <div className="p-5 space-y-3 pb-16">
          {mockLetters.map((letter, idx) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, type: "spring", stiffness: 220, damping: 24 }}
            >
              {letter.isLocked ? (
                /* Locked letter — precious, blurred, slightly muted */
                <div
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{
                    background: 'rgba(245,245,255,0.6)',
                    border: '1px dashed rgba(175,203,255,0.5)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(220,228,255,0.5)', boxShadow: '0 2px 8px rgba(107,140,255,0.08) inset' }}>
                    <LockKeyhole className="w-5 h-5 text-primary/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-medium text-base text-muted-foreground/70 truncate">
                      {letter.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-muted-foreground/55">
                      <Calendar className="w-3 h-3" />
                      <span>Unlocks {letter.unlockDate}</span>
                    </div>
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-primary/30 px-2.5 py-1 rounded-full" style={{ background: 'rgba(107,140,255,0.07)', border: '1px solid rgba(107,140,255,0.15)' }}>
                    Sealed
                  </div>
                </div>
              ) : (
                /* Unlocked letter — warm, open, glowing */
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(107,140,255,0.09), 0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.9) inset',
                  }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(107,140,255,0.15), rgba(175,203,255,0.2))' }}>
                    <MailOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-base text-foreground truncate">
                      {letter.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-primary/70">
                      <Calendar className="w-3 h-3" />
                      <span>Opened {letter.unlockDate}</span>
                    </div>
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full" style={{ background: 'rgba(107,140,255,0.1)', border: '1px solid rgba(107,140,255,0.2)' }}>
                    Open
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}