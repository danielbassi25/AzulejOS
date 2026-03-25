import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockScore } from "@/data/mock";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import confetti from "canvas-confetti";

export default function ScorePage() {
  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#6B8CFF', '#F7C8E0', '#FFD700'] });
  };

  const totalPoints = mockScore.daniel + mockScore.sofia;
  const danielPercent = (mockScore.daniel / totalPoints) * 100;
  const sofiaPercent = (mockScore.sofia / totalPoints) * 100;
  const leader = mockScore.sofia > mockScore.daniel ? "Sofia" : "Daniel";

  return (
    <AppShell>
      <div className="relative min-h-full">
        <div className="absolute top-0 left-0 right-0 h-56 -z-10 pointer-events-none" style={{ background: 'linear-gradient(160deg, rgba(107,140,255,0.12) 0%, rgba(247,200,224,0.15) 100%)' }} />

        <SectionHeader
          title="Score"
          subtitle="A friendly competition"
          action={
            <motion.button
              onClick={triggerConfetti}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.06 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-primary transition-all"
              style={{ background: 'rgba(107,140,255,0.12)', border: '1px solid rgba(107,140,255,0.2)' }}
            >
              <Trophy className="w-4.5 h-4.5 text-primary" />
            </motion.button>
          }
        />

        <div className="p-5 space-y-6 pb-20">
          {/* Scoreboard */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}>
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'white',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 8px 32px rgba(107,140,255,0.10), 0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.9) inset',
              }}
            >
              <div className="flex justify-between items-center mb-8 relative">
                {/* Daniel */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white" style={{ boxShadow: '0 4px 16px rgba(107,140,255,0.2)' }}>
                      <img src={`${import.meta.env.BASE_URL}images/avatar-daniel.png`} alt="Daniel" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Daniel</p>
                  <p className="text-3xl font-serif font-bold text-primary">{mockScore.daniel}</p>
                </div>

                {/* VS */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground" style={{ background: 'rgba(220,228,255,0.5)', border: '1px solid rgba(220,228,255,0.8)' }}>
                  VS
                </div>

                {/* Sofia (leader) */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white" style={{ boxShadow: '0 4px 16px rgba(247,200,224,0.4)' }}>
                      <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
                    </div>
                    <motion.div
                      className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', boxShadow: '0 2px 8px rgba(255,165,0,0.4)' }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Trophy className="w-3.5 h-3.5 text-white fill-white" />
                    </motion.div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Sofia</p>
                  <p className="text-3xl font-serif font-bold text-secondary-foreground">{mockScore.sofia}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full rounded-full flex overflow-hidden" style={{ background: 'rgba(220,228,255,0.4)' }}>
                <motion.div
                  className="h-full rounded-l-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${danielPercent}%` }}
                  transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1], delay: 0.3 }}
                  style={{ background: 'linear-gradient(90deg, rgba(107,140,255,0.9), rgba(107,140,255,0.7))', boxShadow: '0 0 8px rgba(107,140,255,0.4)' }}
                />
                <motion.div
                  className="h-full rounded-r-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${sofiaPercent}%` }}
                  transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1], delay: 0.3 }}
                  style={{ background: 'linear-gradient(90deg, rgba(247,200,224,0.8), rgba(247,180,220,0.9))', boxShadow: '0 0 8px rgba(247,200,224,0.5)' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-primary/60">{danielPercent.toFixed(0)}%</span>
                <span className="text-secondary-foreground/60">{sofiaPercent.toFixed(0)}%</span>
              </div>
            </div>
          </motion.div>

          {/* Milestones */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Milestones</h3>
            </div>
            <div className="space-y-3">
              {mockScore.milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.1 }}
                >
                  <div
                    className="p-4 rounded-xl flex items-center justify-between gap-4"
                    style={{
                      background: milestone.winner ? 'linear-gradient(135deg, rgba(247,200,224,0.18), rgba(175,203,255,0.12))' : 'white',
                      border: milestone.winner ? '1px solid rgba(247,200,224,0.4)' : '1px solid rgba(255,255,255,0.8)',
                      boxShadow: milestone.winner ? 'none' : '0 2px 12px rgba(107,140,255,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset',
                    }}
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">{milestone.title}</p>
                      {milestone.winner ? (
                        <p className="text-xs text-secondary-foreground mt-1 font-semibold">Won by {milestone.winner} 🏆</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">In progress...</p>
                      )}
                    </div>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-sm" style={{ background: 'rgba(220,228,255,0.5)', color: 'hsl(228,50%,40%)' }}>
                      {milestone.target}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {mockScore.recentActivities.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + idx * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: activity.user === 'Sofia' ? 'rgba(247,140,200,0.9)' : 'rgba(107,140,255,0.9)' }} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground/80">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-muted-foreground font-light">{activity.action}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-medium">{activity.date}</p>
                  </div>
                  <div className="text-xs font-bold text-primary px-2.5 py-1 rounded-lg" style={{ background: 'rgba(107,140,255,0.1)' }}>
                    +{activity.points}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}