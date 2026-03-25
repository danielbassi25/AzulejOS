import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockLetters } from "@/data/mock";
import { motion } from "framer-motion";
import { LockKeyhole, MailOpen } from "lucide-react";

// Azulejo only for the sealed / special tiles
const sealPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.4' opacity='0.14'%3E%3Ccircle cx='10' cy='10' r='3.5'/%3E%3Cline x1='10' y1='0' x2='10' y2='6.5'/%3E%3Cline x1='10' y1='13.5' x2='10' y2='20'/%3E%3Cline x1='0' y1='10' x2='6.5' y2='10'/%3E%3Cline x1='13.5' y1='10' x2='20' y2='10'/%3E%3C/g%3E%3C/svg%3E")`;

export default function LettersPage() {
  const openCount = mockLetters.filter(l => !l.isLocked).length;
  const sealedCount = mockLetters.filter(l => l.isLocked).length;

  return (
    <AppShell>
      <SectionHeader title="Letters" subtitle="Words preserved in time" />

      <div className="p-4 pb-12">
        {/* Section count */}
        <div className="pt-3 pb-4 flex items-center gap-3">
          <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.18)' }} />
          <p className="font-sans font-semibold uppercase tracking-[0.18em]" style={{ fontSize: '8.5px', color: 'hsl(220,20%,58%)' }}>
            {openCount} open · {sealedCount} sealed
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.09)' }} />
        </div>

        <div className="space-y-2.5">
          {mockLetters.map((letter, idx) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {letter.isLocked ? (
                /* Sealed — deep cobalt with azulejo motif, sacred */
                <div
                  className="relative overflow-hidden"
                  style={{
                    backgroundColor: 'hsl(220,68%,24%)',
                    backgroundImage: `${sealPattern}, linear-gradient(140deg, hsl(220,68%,24%) 0%, hsl(218,70%,28%) 100%)`,
                    backgroundSize: '20px 20px, 100% 100%',
                    border: '1px solid rgba(15,45,115,0.52)',
                    borderRadius: '4px',
                    boxShadow: '2px 4px 14px rgba(12,25,72,0.24)',
                    padding: '18px 20px',
                  }}
                >
                  {/* Decorative corner marks */}
                  <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.18)' }} />
                  <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.18)' }} />
                  <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.18)' }} />
                  <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.18)' }} />

                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className="w-10 h-10 flex items-center justify-center shrink-0"
                      style={{
                        background: 'rgba(255,252,245,0.09)',
                        border: '1px solid rgba(180,200,255,0.18)',
                        borderRadius: '3px',
                      }}
                    >
                      <LockKeyhole className="w-4 h-4" style={{ color: 'rgba(200,215,255,0.60)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-serif font-medium truncate"
                        style={{ fontSize: '1rem', color: 'rgba(220,210,192,0.78)' }}
                      >
                        {letter.title}
                      </h3>
                      <p
                        className="font-sans font-semibold uppercase tracking-wide mt-1"
                        style={{ fontSize: '8.5px', color: 'rgba(175,190,240,0.40)' }}
                      >
                        Unlocks {letter.unlockDate}
                      </p>
                    </div>
                    <div
                      className="font-sans font-bold uppercase tracking-widest px-2.5 py-1.5 shrink-0"
                      style={{
                        fontSize: '7.5px',
                        border: '1px solid rgba(180,200,255,0.20)',
                        borderRadius: '2px',
                        color: 'rgba(195,210,255,0.45)',
                        letterSpacing: '0.12em',
                      }}
                    >
                      Sealed
                    </div>
                  </div>
                </div>
              ) : (
                /* Open — clean ceramic white, warm and inviting */
                <motion.div
                  whileHover={{ y: -1.5 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="cursor-pointer"
                  style={{
                    background: 'hsl(38, 30%, 99%)',
                    border: '1px solid rgba(30,60,130,0.09)',
                    borderRadius: '4px',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 12px rgba(20,40,100,0.07)',
                    padding: '18px 20px',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center shrink-0"
                      style={{ background: 'hsl(218,70%,28%)', borderRadius: '3px' }}
                    >
                      <MailOpen className="w-4 h-4" style={{ color: 'hsl(42,30%,96%)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-serif font-semibold truncate"
                        style={{ fontSize: '1rem', color: 'hsl(222,45%,16%)' }}
                      >
                        {letter.title}
                      </h3>
                      <p
                        className="font-sans font-semibold uppercase tracking-wide mt-1"
                        style={{ fontSize: '8.5px', color: 'hsl(218,50%,42%)' }}
                      >
                        Opened {letter.unlockDate}
                      </p>
                    </div>
                    <div
                      className="font-sans font-bold uppercase tracking-widest px-2.5 py-1.5 shrink-0"
                      style={{
                        fontSize: '7.5px',
                        background: 'hsl(218,70%,28%)',
                        borderRadius: '2px',
                        color: 'hsl(42,30%,96%)',
                        letterSpacing: '0.12em',
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
