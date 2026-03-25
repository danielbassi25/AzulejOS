import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import PremiumCard from "@/components/PremiumCard";
import PillTag from "@/components/PillTag";
import { mockDashboard } from "@/data/mock";
import { motion } from "framer-motion";
import { Heart, Calendar, LockKeyhole, Target, Sparkles } from "lucide-react";

export default function SystemPage() {
  const data = mockDashboard;
  
  return (
    <AppShell>
      <div className="relative min-h-full">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-secondary/30 to-transparent -z-10 pointer-events-none" />
        
        <SectionHeader 
          title="System" 
          action={
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Running
            </div>
          }
        />

        <div className="p-6 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Good morning,</h2>
              <h2 className="text-3xl font-display font-bold text-primary">Sofia.</h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <PremiumCard className="p-8 text-center bg-gradient-to-br from-card to-card relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-secondary/30 rounded-full blur-3xl" />
              
              <PillTag icon={<Heart className="w-3 h-3" />} variant="secondary" className="mb-4">
                Time Together
              </PillTag>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-display font-bold tracking-tighter text-foreground">
                  {data.daysTogether}
                </span>
                <span className="text-xl font-medium text-muted-foreground">days</span>
              </div>
            </PremiumCard>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <PremiumCard className="p-5 h-full flex flex-col justify-between">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Next Event</p>
                  <p className="font-semibold text-foreground leading-tight">{data.nextEvent.name}</p>
                  <p className="text-xs text-primary font-medium mt-2">In {data.nextEvent.daysAway} days</p>
                </div>
              </PremiumCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <PremiumCard className="p-5 h-full flex flex-col justify-between">
                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-secondary-foreground mb-4">
                  <LockKeyhole className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Unlocking soon</p>
                  <p className="font-semibold text-foreground leading-tight">{data.nextLetterUnlock.name}</p>
                  <p className="text-xs text-secondary-foreground font-medium mt-2">In {data.nextLetterUnlock.daysAway} days</p>
                </div>
              </PremiumCard>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <PremiumCard className="p-6 bg-foreground text-background">
              <div className="flex gap-4">
                <Sparkles className="w-6 h-6 text-secondary shrink-0 mt-1" />
                <p className="font-serif italic text-lg leading-relaxed opacity-90">
                  "{data.randomPhrase}"
                </p>
              </div>
            </PremiumCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <PremiumCard className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Target className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Active Goals</p>
                  <p className="text-sm text-muted-foreground">{data.activeGoals} remaining</p>
                </div>
              </div>
              <PillTag variant="outline">View Build</PillTag>
            </PremiumCard>
          </motion.div>

        </div>
      </div>
    </AppShell>
  );
}
