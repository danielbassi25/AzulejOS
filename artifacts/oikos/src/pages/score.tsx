import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import PremiumCard from "@/components/PremiumCard";
import { mockScore } from "@/data/mock";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Plus } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

export default function ScorePage() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6B8CFF', '#F7C8E0', '#FFD700']
    });
  };

  const totalPoints = mockScore.daniel + mockScore.sofia;
  const danielPercent = (mockScore.daniel / totalPoints) * 100;
  const sofiaPercent = (mockScore.sofia / totalPoints) * 100;

  return (
    <AppShell>
      <SectionHeader 
        title="Score" 
        subtitle="A friendly competition"
        action={
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10 border-primary text-primary hover:bg-primary hover:text-white" onClick={triggerConfetti}>
            <Plus className="w-5 h-5" />
          </Button>
        }
      />

      <div className="p-6 space-y-8 pb-20">
        
        {/* Versus Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <PremiumCard className="p-6 overflow-visible">
            <div className="flex justify-between items-center mb-8 relative">
              <div className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto rounded-full border-4 border-background shadow-md overflow-hidden mb-2">
                  <img src={`${import.meta.env.BASE_URL}images/avatar-daniel.png`} alt="Daniel" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-foreground">Daniel</h3>
                <p className="text-2xl font-display font-black text-primary">{mockScore.daniel}</p>
              </div>
              
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-muted rounded-full flex items-center justify-center font-display font-bold text-muted-foreground z-0">
                VS
              </div>

              <div className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto rounded-full border-4 border-background shadow-md overflow-hidden mb-2 relative">
                  <div className="absolute -top-1 -right-1 z-20 text-yellow-500">
                    <Trophy className="w-5 h-5 fill-yellow-500" />
                  </div>
                  <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-foreground">Sofia</h3>
                <p className="text-2xl font-display font-black text-secondary-foreground">{mockScore.sofia}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-4 w-full rounded-full flex overflow-hidden shadow-inner bg-muted">
              <div 
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${danielPercent}%` }}
              />
              <div 
                className="h-full bg-secondary transition-all duration-1000"
                style={{ width: `${sofiaPercent}%` }}
              />
            </div>
          </PremiumCard>
        </motion.div>

        {/* Milestones */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-display flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" />
            Milestones
          </h3>
          <div className="space-y-3">
            {mockScore.milestones.map((milestone, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <PremiumCard className={`p-4 flex items-center justify-between ${milestone.winner ? 'bg-secondary/10 border-secondary/30' : ''}`}>
                  <div>
                    <p className="font-semibold text-foreground">{milestone.title}</p>
                    {milestone.winner ? (
                      <p className="text-sm font-medium text-secondary-foreground mt-1">Won by {milestone.winner} 🏆</p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">In progress...</p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="font-bold text-foreground">{milestone.target}</span>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 font-display flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {mockScore.recentActivities.map((activity, idx) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex items-start gap-4"
              >
                <div className={`w-2 h-2 mt-2 rounded-full ${activity.user === 'Sofia' ? 'bg-secondary' : 'bg-primary'}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.date}</p>
                </div>
                <div className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md text-xs">
                  +{activity.points}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
