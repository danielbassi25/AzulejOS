import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import PremiumCard from "@/components/PremiumCard";
import { mockGoals } from "@/data/mock";
import { motion } from "framer-motion";
import { Check, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        }
      />

      <div className="p-6 space-y-6 pb-20">
        <PremiumCard className="p-6 bg-foreground text-background">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-xl font-display font-bold">Progress</h3>
              <p className="text-sm text-muted-foreground mt-1">{completedCount} of {goals.length} completed</p>
            </div>
            <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2.5 bg-background/20" />
        </PremiumCard>

        <div className="space-y-3">
          {goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div 
                onClick={() => toggleGoal(goal.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none",
                  goal.completed 
                    ? "bg-muted/30 border-transparent" 
                    : "bg-card border-border hover:border-primary/50 shadow-sm"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  goal.completed 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "border-muted-foreground/30 text-transparent"
                )}>
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                <p className={cn(
                  "font-medium text-base transition-all",
                  goal.completed ? "text-muted-foreground line-through decoration-muted-foreground/40" : "text-foreground"
                )}>
                  {goal.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
