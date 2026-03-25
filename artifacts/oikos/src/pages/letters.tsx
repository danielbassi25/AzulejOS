import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockLetters } from "@/data/mock";
import { motion } from "framer-motion";
import { LockKeyhole, MailOpen } from "lucide-react";

// Azulejo decorative border pattern for sealed tiles
const sealPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e3c82' stroke-width='0.5' opacity='0.18'%3E%3Crect x='2' y='2' width='16' height='16' rx='0'/%3E%3Ccircle cx='10' cy='10' r='3'/%3E%3Cline x1='10' y1='2' x2='10' y2='7'/%3E%3Cline x1='10' y1='13' x2='10' y2='18'/%3E%3Cline x1='2' y1='10' x2='7' y2='10'/%3E%3Cline x1='13' y1='10' x2='18' y2='10'/%3E%3C/g%3E%3C/svg%3E")`;

export default function LettersPage() {
  return (
    <AppShell>
      <SectionHeader title="Letters" subtitle="Words preserved in time" />

      <div className="p-3 pb-10">
        <div className="px-1 py-3 mb-1">
          <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: 'hsl(220,22%,58%)' }}>
            ✦ &nbsp; {mockLetters.filter(l => !l.isLocked).length} open · {mockLetters.filter(l => l.isLocked).length} sealed
          </p>
        </div>

        {/* Mosaic tile grid — letters of varying visual weight */}
        <div className="space-y-2.5">
          {mockLetters.map((letter, idx) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {letter.isLocked ? (
                /* Sealed tile — cobalt with azulejo pattern, sacred feel */
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: 'hsl(218, 65%, 26%)',
                    backgroundImage: sealPattern,
                    backgroundSize: '20px 20px',
                    border: '1px solid rgba(20,50,120,0.45)',
                    borderRadius: '3px',
                    boxShadow: '2px 4px 12px rgba(15,30,80,0.22)',
                    padding: '20px',
                  }}
                >
                  {/* Decorative corner marks */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.22)' }} />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.22)' }} />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.22)' }} />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.22)' }} />

                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className="w-10 h-10 flex items-center justify-center shrink-0"
                      style={{
                        background: 'rgba(255,252,245,0.10)',
                        border: '1px solid rgba(180,200,255,0.20)',
                        borderRadius: '2px',
                      }}
                    >
                      <LockKeyhole className="w-4 h-4" style={{ color: 'rgba(200,215,255,0.65)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-medium text-base truncate" style={{ color: 'rgba(220,210,190,0.80)' }}>
                        {letter.title}
                      </h3>
                      <p className="text-[10px] font-semibold mt-1 uppercase tracking-wide" style={{ color: 'rgba(180,200,255,0.45)' }}>
                        Unlocks {letter.unlockDate}
                      </p>
                    </div>
                    <div
                      className="text-[8px] font-bold uppercase tracking-widest px-2.5 py-1.5 shrink-0"
                      style={{
                        border: '1px solid rgba(180,200,255,0.25)',
                        borderRadius: '2px',
                        color: 'rgba(200,215,255,0.50)',
                      }}
                    >
                      Sealed
                    </div>
                  </div>
                </div>
              ) : (
                /* Open tile — warm white, inviting */
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="cursor-pointer"
                  style={{
                    background: 'hsl(38, 30%, 99%)',
                    border: '1px solid rgba(30,60,130,0.12)',
                    borderRadius: '3px',
                    boxShadow: '2px 3px 10px rgba(20,40,100,0.08)',
                    padding: '20px',
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Blue tile icon */}
                    <div
                      className="w-10 h-10 flex items-center justify-center shrink-0"
                      style={{
                        background: 'hsl(218,70%,28%)',
                        borderRadius: '2px',
                      }}
                    >
                      <MailOpen className="w-4 h-4" style={{ color: 'hsl(42,30%,95%)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold text-base truncate" style={{ color: 'hsl(222,45%,16%)' }}>
                        {letter.title}
                      </h3>
                      <p className="text-[10px] font-semibold mt-1 uppercase tracking-wide" style={{ color: 'hsl(218,55%,42%)' }}>
                        Opened {letter.unlockDate}
                      </p>
                    </div>
                    <div
                      className="text-[8px] font-bold uppercase tracking-widest px-2.5 py-1.5 shrink-0"
                      style={{
                        background: 'hsl(218,70%,28%)',
                        borderRadius: '2px',
                        color: 'hsl(42,30%,95%)',
                      }}
                    >
                      Open
                    </div>
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
