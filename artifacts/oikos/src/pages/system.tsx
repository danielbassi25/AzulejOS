import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import PremiumCard from "@/components/PremiumCard";
import PillTag from "@/components/PillTag";
import { mockDashboard } from "@/data/mock";
import { motion } from "framer-motion";
import { Heart, Calendar, LockKeyhole, Target, Sparkles } from "lucide-react";

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 + i * 0.08, type: "spring" as const, stiffness: 200, damping: 22 },
});

export default function SystemPage() {
  const data = mockDashboard;

  return (
    <AppShell>
      <div className="relative min-h-full">
        {/* Top ambient gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-80 -z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(160deg, rgba(140,175,255,0.28) 0%, rgba(180,210,255,0.18) 45%, transparent 100%)',
          }}
        />

        <SectionHeader
          title="System"
          action={
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(34,197,94,0.1)',
                color: 'rgb(21,128,61)',
                border: '1px solid rgba(34,197,94,0.2)',
                letterSpacing: '0.1em',
              }}
              animate={{ opacity: [1, 0.65, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              Running
            </motion.div>
          }
        />

        <div className="p-6 space-y-5">
          {/* Greeting */}
          <motion.div {...stagger(0)} className="flex items-center gap-4 pt-1">
            <div
              className="w-14 h-14 rounded-full overflow-hidden shrink-0"
              style={{
                border: '2px solid rgba(180,210,255,0.7)',
                boxShadow: '0 4px 16px rgba(80,120,220,0.18)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`}
                alt="Sofia"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: 'hsl(218,35%,55%)' }}
              >
                Good morning
              </p>
              <h2
                className="font-serif font-semibold leading-none mt-1"
                style={{ fontSize: '2rem', color: 'hsl(222,28%,16%)', letterSpacing: '-0.03em' }}
              >
                Sofia.
              </h2>
            </div>
          </motion.div>

          {/* Days Together Hero */}
          <motion.div {...stagger(1)}>
            <div
              className="rounded-2xl p-8 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(220,235,255,0.85) 0%, rgba(200,222,255,0.6) 100%)',
                border: '1px solid rgba(200,220,255,0.7)',
                boxShadow: '0 12px 40px rgba(80,120,220,0.10), 0 0 0 1px rgba(255,255,255,0.9) inset',
              }}
            >
              {/* Inner glow orbs */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full -mr-16 -mt-16 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(120,165,255,0.3) 0%, transparent 70%)', filter: 'blur(24px)' }}
              />
              <div
                className="absolute bottom-0 left-0 w-32 h-32 rounded-full -ml-12 -mb-12 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(160,200,255,0.35) 0%, transparent 70%)', filter: 'blur(20px)' }}
              />
              <PillTag icon={<Heart className="w-3 h-3" />} variant="secondary" className="mb-5 relative z-10">
                Time Together
              </PillTag>
              <div
                className="flex items-baseline justify-center gap-2 relative z-10"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                <span
                  className="font-serif font-bold text-foreground"
                  style={{ fontSize: '5rem', letterSpacing: '-0.06em', lineHeight: 1 }}
                >
                  {data.daysTogether}
                </span>
                <span
                  className="text-lg font-medium mb-1"
                  style={{ color: 'hsl(218,35%,52%)' }}
                >
                  days
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3.5">
            <motion.div {...stagger(2)}>
              <PremiumCard className="p-5 h-full flex flex-col justify-between min-h-[130px]">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(100,140,255,0.12)' }}
                >
                  <Calendar className="w-4 h-4" style={{ color: 'hsl(224,70%,55%)' }} />
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase font-bold tracking-widest mb-1"
                    style={{ color: 'hsl(218,22%,60%)' }}
                  >
                    Next Event
                  </p>
                  <p className="font-semibold text-foreground text-sm leading-snug">{data.nextEvent.name}</p>
                  <p
                    className="text-xs font-semibold mt-1.5"
                    style={{ color: 'hsl(224,70%,55%)' }}
                  >
                    In {data.nextEvent.daysAway} days
                  </p>
                </div>
              </PremiumCard>
            </motion.div>

            <motion.div {...stagger(3)}>
              <PremiumCard className="p-5 h-full flex flex-col justify-between min-h-[130px]">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(140,185,255,0.22)' }}
                >
                  <LockKeyhole className="w-4 h-4" style={{ color: 'hsl(218,45%,42%)' }} />
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase font-bold tracking-widest mb-1"
                    style={{ color: 'hsl(218,22%,60%)' }}
                  >
                    Unlocking Soon
                  </p>
                  <p className="font-semibold text-foreground text-sm leading-snug">{data.nextLetterUnlock.name}</p>
                  <p
                    className="text-xs font-semibold mt-1.5"
                    style={{ color: 'hsl(218,45%,45%)' }}
                  >
                    In {data.nextLetterUnlock.daysAway} days
                  </p>
                </div>
              </PremiumCard>
            </motion.div>
          </div>

          {/* Quote card — stunning dark */}
          <motion.div {...stagger(4)}>
            <div
              className="p-7 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, hsl(222,35%,14%) 0%, hsl(228,40%,18%) 100%)',
                border: '1px solid rgba(100,140,255,0.15)',
                boxShadow: '0 20px 60px rgba(20,30,80,0.28), 0 0 0 1px rgba(255,255,255,0.06) inset',
              }}
            >
              {/* Glow accent top right */}
              <div
                className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(100,140,255,0.35) 0%, transparent 70%)', filter: 'blur(20px)' }}
              />
              <div className="absolute bottom-4 right-5 opacity-10">
                <Sparkles className="w-12 h-12 text-[hsl(220,80%,80%)]" />
              </div>
              <p
                className="font-serif italic leading-relaxed relative z-10"
                style={{ fontSize: '1.05rem', color: 'rgba(220,235,255,0.92)', lineHeight: 1.75 }}
              >
                "{data.randomPhrase}"
              </p>
              <p
                className="text-[10px] mt-5 font-semibold tracking-[0.12em] uppercase relative z-10"
                style={{ color: 'rgba(160,190,255,0.40)' }}
              >
                Built daily.
              </p>
            </div>
          </motion.div>

          {/* Active Goals */}
          <motion.div {...stagger(5)}>
            <PremiumCard className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(100,140,255,0.10)' }}
                >
                  <Target className="w-5 h-5" style={{ color: 'hsl(224,70%,55%)' }} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Active Goals</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'hsl(218,22%,58%)' }}
                  >
                    {data.activeGoals} remaining to build
                  </p>
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