import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockLetters } from "@/data/mock";
import { motion } from "framer-motion";
import { LockKeyhole, MailOpen, Calendar } from "lucide-react";

export default function LettersPage() {
  return (
    <AppShell>
      <div className="relative min-h-full">
        {/* Subtle radial glow top-right */}
        <div
          className="absolute top-0 right-0 w-72 h-72 -z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(130,175,255,0.22) 0%, transparent 70%)',
            transform: 'translate(30%,-25%)',
            filter: 'blur(20px)',
          }}
        />
        <SectionHeader title="Letters" subtitle="Words preserved in time" />

        <div className="p-5 space-y-3 pb-16">
          {mockLetters.map((letter, idx) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, type: "spring", stiffness: 200, damping: 26 }}
            >
              {letter.isLocked ? (
                /* Locked — sacred, sealed, desirable */
                <div
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{
                    background: 'rgba(225,235,255,0.45)',
                    border: '1.5px dashed rgba(160,195,255,0.55)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(170,200,255,0.22)',
                      boxShadow: '0 0 0 1px rgba(180,210,255,0.35) inset',
                    }}
                  >
                    <LockKeyhole className="w-5 h-5" style={{ color: 'hsl(220,45%,62%)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-serif font-medium text-base truncate"
                      style={{ color: 'hsl(220,25%,55%)' }}
                    >
                      {letter.title}
                    </h3>
                    <div
                      className="flex items-center gap-1.5 mt-1.5 text-xs font-medium"
                      style={{ color: 'hsl(218,22%,62%)' }}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Unlocks {letter.unlockDate}</span>
                    </div>
                  </div>
                  <div
                    className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      background: 'rgba(140,180,255,0.12)',
                      border: '1px solid rgba(160,200,255,0.3)',
                      color: 'hsl(220,40%,60%)',
                    }}
                  >
                    Sealed
                  </div>
                </div>
              ) : (
                /* Open — warm, precious, glowing */
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer"
                  style={{
                    background: 'rgba(245,250,255,0.95)',
                    border: '1px solid rgba(180,210,255,0.55)',
                    boxShadow: '0 4px 20px rgba(80,120,220,0.08), 0 0 0 1px rgba(255,255,255,0.95) inset',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(100,145,255,0.18), rgba(160,200,255,0.25))',
                    }}
                  >
                    <MailOpen className="w-5 h-5" style={{ color: 'hsl(224,65%,54%)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-serif font-semibold text-base truncate text-foreground"
                    >
                      {letter.title}
                    </h3>
                    <div
                      className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold"
                      style={{ color: 'hsl(224,60%,54%)' }}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Opened {letter.unlockDate}</span>
                    </div>
                  </div>
                  <div
                    className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      background: 'rgba(100,140,255,0.12)',
                      border: '1px solid rgba(120,160,255,0.3)',
                      color: 'hsl(224,65%,52%)',
                    }}
                  >
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