import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockGoals } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const azulejoPattern = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.18'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cline x1='12' y1='0' x2='12' y2='8'/%3E%3Cline x1='12' y1='16' x2='12' y2='24'/%3E%3Cline x1='0' y1='12' x2='8' y2='12'/%3E%3Cline x1='16' y1='12' x2='24' y2='12'/%3E%3C/g%3E%3C/svg%3E")`;

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

      <div className="p-3 pb-24">
        {/* Progress hero tile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden mb-2.5 p-7"
          style={{
            background: 'hsl(222, 40%, 14%)',
            backgroundImage: azulejoPattern,
            backgroundSize: '24px 24px',
            border: '1px solid rgba(20,50,120,0.45)',
            borderRadius: '3px',
            boxShadow: '3px 5px 18px rgba(10,20,60,0.28)',
          }}
        >
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] font-bold mb-2" style={{ color: 'rgba(180,165,140,0.50)' }}>
                ✦ &nbsp; Progress
              </p>
              <p className="font-serif font-light text-sm" style={{ color: 'rgba(200,190,170,0.60)' }}>
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
                style={{ fontSize: '2.8rem', letterSpacing: '-0.05em', color: 'hsl(42,30%,92%)', lineHeight: 1 }}
              >
                {progressPercent}%
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Progress bar — tiled segments */}
          <div className="flex gap-1">
            {Array.from({ length: goals.length }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-2"
                style={{
                  borderRadius: '1px',
                  background: i < completedCount ? 'hsl(42,50%,80%)' : 'rgba(255,255,255,0.10)',
                }}
                animate={{ background: i < completedCount ? 'hsl(42,50%,80%)' : 'rgba(255,255,255,0.10)' }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Goal tiles */}
        <div className="px-1 py-2 mb-1">
          <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: 'hsl(220,22%,58%)' }}>
            ✦ &nbsp; Goals
          </p>
        </div>

        <div className="space-y-2">
          {goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
            >
              <motion.div
                onClick={() => toggleGoal(goal.id)}
                whileTap={{ scale: 0.99 }}
                className="flex items-center gap-4 px-4 py-4 cursor-pointer select-none"
                style={{
                  background: goal.completed ? 'hsl(218, 68%, 27%)' : 'hsl(38, 30%, 99%)',
                  border: goal.completed ? '1px solid rgba(20,50,120,0.4)' : '1px solid rgba(30,60,130,0.12)',
                  borderRadius: '3px',
                  boxShadow: goal.completed ? '1px 2px 8px rgba(15,30,80,0.20)' : '2px 3px 8px rgba(20,40,100,0.07)',
                  transition: 'all 0.25s ease',
                  backgroundImage: goal.completed ? azulejoPattern : 'none',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Tile-style checkbox */}
                <motion.div
                  className="w-6 h-6 flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '2px',
                    border: goal.completed ? 'none' : '1.5px solid rgba(30,60,130,0.30)',
                    background: goal.completed ? 'rgba(255,252,245,0.18)' : 'transparent',
                  }}
                  animate={{ scale: goal.completed ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatePresence>
                    {goal.completed && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <Check className="w-3.5 h-3.5" style={{ color: 'hsl(42,30%,92%)', strokeWidth: 3 }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <p
                  className="flex-1 font-medium text-sm"
                  style={{
                    color: goal.completed ? 'rgba(220,210,190,0.82)' : 'hsl(222,40%,22%)',
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    textDecorationColor: 'rgba(180,165,140,0.40)',
                    transition: 'all 0.25s ease',
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
