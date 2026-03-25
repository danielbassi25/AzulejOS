import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockGoals } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BuildPage() {
  const [goals, setGoals] = useState(mockGoals);

  const toggleGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercent = Math.round((completedCount / goals.length) * 100);

  return (
    <AppShell>
      <SectionHeader
        title="Build"
        subtitle="Shared horizons"
        action={
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(100,140,255,0.12)' }}
          >
            <Target className="w-4 h-4" style={{ color: 'hsl(224,70%,55%)' }} />
          </div>
        }
      />

      <div className="p-5 space-y-5 pb-20">
        {/* Progress hero card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="p-7 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, hsl(222,35%,14%) 0%, hsl(228,42%,19%) 100%)',
              boxShadow: '0 20px 60px rgba(20,30,80,0.28), 0 0 0 1px rgba(100,140,255,0.15) inset',
            }}
          >
            {/* Glow top-right */}
            <div
              className="absolute top-0 right-0 w-40 h-40 -mr-12 -mt-12 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(100,140,255,0.35) 0%, transparent 70%)',
                filter: 'blur(24px)',
              }}
            />
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <h3
                  className="font-serif font-semibold"
                  style={{ fontSize: '1.35rem', color: 'rgba(220,235,255,0.95)' }}
                >
                  Progress
                </h3>
                <p
                  className="text-sm mt-0.5 font-light"
                  style={{ color: 'rgba(180,205,255,0.55)' }}
                >
                  {completedCount} of {goals.length} completed
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={progressPercent}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="font-serif font-bold"
                  style={{ fontSize: '2.25rem', letterSpacing: '-0.04em', color: 'hsl(220,80%,75%)' }}
                >
                  {progressPercent}%
                </motion.span>
              </AnimatePresence>
            </div>
            {/* Progress bar */}
            <div
              className="h-1.5 rounded-full overflow-hidden relative z-10"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: [0.34, 1.4, 0.64, 1] }}
                style={{
                  background: 'linear-gradient(90deg, hsl(220,80%,65%), hsl(210,90%,78%))',
                  boxShadow: '0 0 16px rgba(100,160,255,0.7)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Goals list */}
        <div className="space-y-2.5">
          {goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <motion.div
                onClick={() => toggleGoal(goal.id)}
                whileTap={{ scale: 0.99 }}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer select-none transition-all duration-200"
                style={{
                  background: goal.completed ? 'rgba(220,232,255,0.35)' : 'rgba(245,250,255,0.95)',
                  border: goal.completed ? '1px solid rgba(180,210,255,0.35)' : '1px solid rgba(190,215,255,0.55)',
                  boxShadow: goal.completed ? 'none' : '0 2px 12px rgba(80,120,220,0.06), 0 0 0 1px rgba(255,255,255,0.9) inset',
                }}
              >
                {/* Checkbox */}
                <motion.div
                  animate={{
                    background: goal.completed
                      ? 'linear-gradient(135deg, hsl(220,75%,62%), hsl(210,85%,72%))'
                      : 'transparent',
                    borderColor: goal.completed ? 'transparent' : 'rgba(140,180,255,0.5)',
                    scale: goal.completed ? [1, 1.22, 1] : 1,
                  }}
                  transition={{ duration: 0.22 }}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{
                    boxShadow: goal.completed ? '0 2px 10px rgba(80,130,255,0.35)' : 'none',
                  }}
                >
                  <AnimatePresence>
                    {goal.completed && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <p
                  className={cn(
                    "font-medium text-sm flex-1 transition-all duration-200",
                    goal.completed ? "line-through decoration-[hsl(220,30%,65%)]" : ""
                  )}
                  style={{
                    color: goal.completed ? 'hsl(218,22%,62%)' : 'hsl(220,22%,22%)',
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