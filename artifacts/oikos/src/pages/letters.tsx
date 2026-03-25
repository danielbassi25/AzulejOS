import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import PremiumCard from "@/components/PremiumCard";
import { mockLetters } from "@/data/mock";
import { motion } from "framer-motion";
import { LockKeyhole, MailOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LettersPage() {
  return (
    <AppShell>
      <div className="relative min-h-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <SectionHeader 
          title="Letters" 
          subtitle="Words preserved in time"
        />

        <div className="p-6 space-y-4">
          {mockLetters.map((letter, idx) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <PremiumCard className={cn(
                "p-5 flex items-center gap-4 transition-all duration-300",
                letter.isLocked ? "bg-muted/30 border-dashed border-border opacity-80" : "bg-card hover:bg-accent/5 cursor-pointer"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  letter.isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                )}>
                  {letter.isLocked ? <LockKeyhole className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-semibold text-base truncate",
                    letter.isLocked ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {letter.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-medium">
                    <Calendar className="w-3 h-3" />
                    <span className={letter.isLocked ? "text-muted-foreground" : "text-primary"}>
                      {letter.isLocked ? `Unlocks ${letter.unlockDate}` : `Opened ${letter.unlockDate}`}
                    </span>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
