import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockGoals } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

// Azulejo pattern only for the progress hero tile
const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.12'%3E%3Ccircle cx='16' cy='16' r='5'/%3E%3Cline x1='16' y1='0' x2='16' y2='11'/%3E%3Cline x1='16' y1='21' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='16' x2='32' y2='16'/%3E%3C/g%3E%3C/svg%3E")`;

export default function BuildPage() {
  const [goals, setGoals] = useState(mockGoals);

  const toggleGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercent = Math.round((completedCount / goals.length) * 100);

  return (
    <AppShell>
      <SectionHeader title="Build" subtitle="Shared horizons" />

      <div className="p-4 pb-24">
        {/* Progress hero — azulejo pattern, it's earned here */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden mb-3 p-7"
          style={{
            backgroundColor: 'hsl(222,42%,13%)',
            backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`,
            backgroundSize: '32px 32px, 100% 100%',
            border: '1px solid rgba(15,40,110,0.52)',
            borderRadius: '4px',
            boxShadow: '0 10px 36px rgba(10,20,60,0.30)',
          }}
        >
          {/* Light leak */}
          <div
            className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top right, rgba(255,252,245,0.06) 0%, transparent 65%)',
              filter: 'blur(16px)',
            }}
          />
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <p className="font-sans font-semibold uppercase tracking-[0.18em] mb-3" style={{ fontSize: '8.5px', color: 'rgba(180,165,140,0.50)' }}>
                ✦ &nbsp; Progress
              </p>
              <p className="font-sans font-light" style={{ fontSize: '0.82rem', color: 'rgba(200,190,170,0.55)' }}>
                {completedCount} of {goals.length} built
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={progressPercent}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="font-serif font-bold"
                style={{ fontSize: '3.2rem', letterSpacing: '-0.06em', color: 'hsl(42,32%,93%)', lineHeight: 1 }}
              >
                {progressPercent}%
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Tiled progress bar */}
          <div className="relative z-10 flex gap-1">
            {Array.from({ length: goals.length }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-2"
                style={{ borderRadius: '1px' }}
                animate={{
                  background: i < completedCount
                    ? 'hsl(42, 48%, 78%)'
                    : 'rgba(255,255,255,0.08)',
                }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Goals section label */}
        <div className="flex items-center gap-3 py-3 mb-1">
          <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.18)' }} />
          <p className="font-sans font-semibold uppercase tracking-[0.18em]" style={{ fontSize: '8.5px', color: 'hsl(220,20%,58%)' }}>
            Goals
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.09)' }} />
        </div>

        {/* Goal tiles — clean, no pattern */}
        <div className="space-y-2">
          {goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + idx * 0.04, duration: 0.38 }}
            >
              <motion.div
                onClick={() => toggleGoal(goal.id)}
                whileTap={{ scale: 0.985 }}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="flex items-center gap-4 px-4 py-4 cursor-pointer select-none"
                style={{
                  background: goal.completed ? 'hsl(218,68%,27%)' : 'hsl(38,30%,99%)',
                  border: goal.completed
                    ? '1px solid rgba(15,45,115,0.42)'
                    : '1px solid rgba(30,60,130,0.09)',
                  borderRadius: '4px',
                  boxShadow: goal.completed
                    ? '1px 2px 10px rgba(12,25,72,0.22)'
                    : '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.06)',
                  transition: 'all 0.30s ease',
                }}
              >
                {/* Tile-style checkbox */}
                <motion.div
                  className="w-5 h-5 flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '2px',
                    border: goal.completed ? 'none' : '1.5px solid rgba(30,60,130,0.28)',
                    background: goal.completed ? 'rgba(255,252,245,0.16)' : 'transparent',
                  }}
                  animate={{ scale: goal.completed ? [1, 1.18, 1] : 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <AnimatePresence>
                    {goal.completed && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Check className="w-3 h-3" style={{ color: 'hsl(42,30%,94%)', strokeWidth: 2.5 }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <p
                  className="flex-1 font-sans font-medium"
                  style={{
                    fontSize: '0.875rem',
                    color: goal.completed ? 'rgba(215,205,188,0.80)' : 'hsl(222,38%,22%)',
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    textDecorationColor: 'rgba(180,165,140,0.35)',
                    transition: 'all 0.30s ease',
                    lineHeight: 1.45,
                  }}
                >
                  {goal.text}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
