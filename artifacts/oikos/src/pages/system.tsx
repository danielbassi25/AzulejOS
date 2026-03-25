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
        {/* Ambient gradient background */}
        <div
          className="absolute top-0 left-0 right-0 h-72 -z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(160deg, rgba(175,203,255,0.35) 0%, rgba(247,200,224,0.25) 60%, transparent 100%)',
          }}
        />

        <SectionHeader
          title="System"
          action={
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{
                background: 'rgba(34,197,94,0.1)',
                color: 'rgb(21,128,61)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Running
            </motion.div>
          }
        />

        <div className="p-6 space-y-6">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center gap-4 pt-2"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/80" style={{ boxShadow: '0 4px 16px rgba(107,140,255,0.2)' }}>
              <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Good morning,</p>
              <h2 className="text-3xl font-serif font-semibold text-foreground leading-none mt-0.5">Sofia.</h2>
            </div>
          </motion.div>

          {/* Days Together */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, type: "spring", stiffness: 200, damping: 22 }}
          >
            <PremiumCard className="p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 -mr-12 -mt-12 rounded-full blur-3xl" style={{ background: 'rgba(175,203,255,0.4)' }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 -ml-10 -mb-10 rounded-full blur-3xl" style={{ background: 'rgba(247,200,224,0.5)' }} />
              <PillTag icon={<Heart className="w-3 h-3" />} variant="secondary" className="mb-5">
                Time Together
              </PillTag>
              <div className="flex items-baseline justify-center gap-2 relative z-10">
                <span className="text-7xl font-serif font-bold tracking-tighter text-foreground" style={{ letterSpacing: '-0.04em' }}>
                  {data.daysTogether}
                </span>
                <span className="text-xl font-medium text-muted-foreground mb-1">days</span>
              </div>
            </PremiumCard>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
              <PremiumCard className="p-5 h-full flex flex-col justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(107,140,255,0.12)' }}>
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-semibold mb-1">Next Event</p>
                  <p className="font-semibold text-foreground leading-snug text-sm">{data.nextEvent.name}</p>
                  <p className="text-xs text-primary font-semibold mt-2">In {data.nextEvent.daysAway} days</p>
                </div>
              </PremiumCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
              <PremiumCard className="p-5 h-full flex flex-col justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(247,200,224,0.5)' }}>
                  <LockKeyhole className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground/70 font-semibold mb-1">Unlocking Soon</p>
                  <p className="font-semibold text-foreground leading-snug text-sm">{data.nextLetterUnlock.name}</p>
                  <p className="text-xs text-secondary-foreground font-semibold mt-2">In {data.nextLetterUnlock.daysAway} days</p>
                </div>
              </PremiumCard>
            </motion.div>
          </div>

          {/* Quote */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
            <PremiumCard
              className="p-7 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(224,20%,18%) 0%, hsl(228,30%,22%) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 16px 40px rgba(30,30,60,0.25), 0 0 0 1px rgba(255,255,255,0.07) inset',
              }}
            >
              <div className="absolute top-3 right-4 opacity-20">
                <Sparkles className="w-10 h-10 text-secondary" />
              </div>
              <p className="font-serif italic text-[1.05rem] leading-relaxed text-white/90 relative z-10">
                "{data.randomPhrase}"
              </p>
              <p className="text-xs text-white/35 mt-4 font-medium tracking-wide">Built daily.</p>
            </PremiumCard>
          </motion.div>

          {/* Active Goals */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.40 }}>
            <PremiumCard className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(107,140,255,0.08)' }}>
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Active Goals</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{data.activeGoals} remaining to build</p>
                </div>
              </div>
              <PillTag variant="primary">View</PillTag>
            </PremiumCard>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}