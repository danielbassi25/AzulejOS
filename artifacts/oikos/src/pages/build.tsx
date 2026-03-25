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
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercent = Math.round((completedCount / goals.length) * 100);

  return (
    <AppShell>
      <SectionHeader
        title="Build"
        subtitle="Shared horizons"
        action={
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(107,140,255,0.12)' }}>
            <Target className="w-4 h-4 text-primary" />
          </div>
        }
      />

      <div className="p-5 space-y-5 pb-20">
        {/* Progress Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(224,20%,18%) 0%, hsl(228,30%,24%) 100%)',
              boxShadow: '0 16px 40px rgba(30,30,60,0.22), 0 0 0 1px rgba(255,255,255,0.07) inset',
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-8 -mt-8 blur-3xl" style={{ background: 'rgba(107,140,255,0.3)' }} />
            <div className="flex justify-between items-end mb-5 relative z-10">
              <div>
                <h3 className="text-xl font-serif font-semibold text-white">Progress</h3>
                <p className="text-sm text-white/50 mt-0.5">{completedCount} of {goals.length} completed</p>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={progressPercent}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-3xl font-serif font-bold text-primary"
                >
                  {progressPercent}%
                </motion.span>
              </AnimatePresence>
            </div>
            {/* Custom progress bar */}
            <div className="relative h-2 rounded-full overflow-hidden z-10" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  background: 'linear-gradient(90deg, rgba(107,140,255,0.9), rgba(175,203,255,0.95))',
                  boxShadow: '0 0 12px rgba(107,140,255,0.6)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Goals List */}
        <div className="space-y-2.5">
          {goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.045 }}
            >
              <motion.div
                onClick={() => toggleGoal(goal.id)}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl cursor-pointer select-none transition-all duration-250",
                )}
                style={{
                  background: goal.completed ? 'rgba(245,246,255,0.7)' : 'white',
                  border: goal.completed ? '1px solid rgba(220,228,255,0.4)' : '1px solid rgba(255,255,255,0.9)',
                  boxShadow: goal.completed ? 'none' : '0 2px 12px rgba(107,140,255,0.07), 0 0 0 1px rgba(255,255,255,0.8) inset',
                }}
              >
                {/* Checkbox */}
                <motion.div
                  animate={{
                    background: goal.completed ? 'linear-gradient(135deg, hsl(228,100%,71%), hsl(220,100%,78%))' : 'transparent',
                    borderColor: goal.completed ? 'transparent' : 'rgba(107,140,255,0.3)',
                    scale: goal.completed ? [1, 1.25, 1] : 1,
                  }}
                  transition={{ duration: 0.25 }}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ boxShadow: goal.completed ? '0 2px 8px rgba(107,140,255,0.3)' : 'none' }}
                >
                  <AnimatePresence>
                    {goal.completed && (
                      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <p className={cn(
                  "font-medium text-sm transition-all duration-200 flex-1",
                  goal.completed ? "text-muted-foreground/60 line-through decoration-muted-foreground/30" : "text-foreground"
                )}>
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