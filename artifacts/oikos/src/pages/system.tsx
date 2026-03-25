import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockDashboard } from "@/data/mock";
import { motion } from "framer-motion";
import { Heart, Calendar, LockKeyhole, Target, Sparkles } from "lucide-react";
import { Link } from "wouter";

const tile = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
});

// Azulejo cross/floral motif as SVG data URI
const azulejoPattern = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.6' opacity='0.18'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cline x1='12' y1='0' x2='12' y2='8'/%3E%3Cline x1='12' y1='16' x2='12' y2='24'/%3E%3Cline x1='0' y1='12' x2='8' y2='12'/%3E%3Cline x1='16' y1='12' x2='24' y2='12'/%3E%3Cline x1='2' y1='2' x2='7' y2='7'/%3E%3Cline x1='17' y1='17' x2='22' y2='22'/%3E%3Cline x1='22' y1='2' x2='17' y2='7'/%3E%3Cline x1='7' y1='17' x2='2' y2='22'/%3E%3C/g%3E%3C/svg%3E")`;

export default function SystemPage() {
  const data = mockDashboard;

  return (
    <AppShell>
      <SectionHeader
        title="System"
        action={
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(255,252,245,0.12)',
              border: '1px solid rgba(255,252,245,0.25)',
              color: 'rgba(220,210,190,0.90)',
              borderRadius: '2px',
            }}
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Online
          </motion.div>
        }
      />

      {/* Mosaic tile grid */}
      <div className="p-3 space-y-2.5">

        {/* Greeting row */}
        <motion.div {...tile(0)} className="flex items-center gap-3 px-4 py-3"
          style={{
            background: 'hsl(38, 30%, 99%)',
            border: '1px solid rgba(30,60,130,0.10)',
            borderRadius: '3px',
            boxShadow: '2px 3px 8px rgba(20,40,100,0.07)',
          }}
        >
          <div
            className="w-11 h-11 rounded-full overflow-hidden shrink-0"
            style={{
              border: '2px solid hsl(218, 70%, 28%)',
              boxShadow: '0 2px 8px rgba(20,40,100,0.20)',
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`}
              alt="Sofia"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'hsl(220,25%,55%)' }}>
              Good morning
            </p>
            <h2 className="font-serif font-semibold leading-none mt-0.5" style={{ fontSize: '1.6rem', color: 'hsl(222,45%,16%)', letterSpacing: '-0.03em' }}>
              Sofia.
            </h2>
          </div>
        </motion.div>

        {/* Hero DAYS tile — the centrepiece, deep cobalt */}
        <motion.div {...tile(1)}
          className="relative overflow-hidden"
          style={{
            background: 'hsl(218, 70%, 28%)',
            border: '1px solid rgba(20,50,120,0.4)',
            borderRadius: '3px',
            boxShadow: '3px 5px 16px rgba(20,40,100,0.25)',
            padding: '40px 24px',
            textAlign: 'center',
            backgroundImage: azulejoPattern,
            backgroundSize: '24px 24px',
          }}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: 'rgba(210,195,170,0.65)' }}>
            ✦ &nbsp; Time Together &nbsp; ✦
          </p>
          <div className="flex items-baseline justify-center gap-3">
            <span className="font-serif font-bold" style={{ fontSize: '5.5rem', letterSpacing: '-0.06em', lineHeight: 1, color: 'hsl(42, 30%, 95%)' }}>
              {data.daysTogether}
            </span>
            <span className="font-serif italic" style={{ fontSize: '1.4rem', color: 'rgba(200,190,165,0.70)', marginBottom: 4 }}>
              days
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-5">
            <Heart className="w-3 h-3 fill-current" style={{ color: 'rgba(200,185,160,0.50)' }} />
            <span className="text-[9px] uppercase tracking-[0.16em]" style={{ color: 'rgba(200,185,160,0.50)' }}>Daniel & Sofia</span>
            <Heart className="w-3 h-3 fill-current" style={{ color: 'rgba(200,185,160,0.50)' }} />
          </div>
        </motion.div>

        {/* 2-column stat tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          <motion.div {...tile(2)}
            className="relative overflow-hidden p-5 flex flex-col justify-between"
            style={{
              background: 'hsl(38, 30%, 99%)',
              border: '1px solid rgba(30,60,130,0.12)',
              borderRadius: '3px',
              boxShadow: '2px 3px 8px rgba(20,40,100,0.07)',
              minHeight: 130,
            }}
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-sm" style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,95%)' }}>
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'hsl(220,22%,58%)' }}>Next Event</p>
              <p className="font-serif font-semibold text-sm leading-snug" style={{ color: 'hsl(222,45%,16%)' }}>{data.nextEvent.name}</p>
              <p className="text-[10px] font-bold mt-1.5 uppercase tracking-wide" style={{ color: 'hsl(218,60%,38%)' }}>In {data.nextEvent.daysAway} days</p>
            </div>
          </motion.div>

          <motion.div {...tile(3)}
            className="relative overflow-hidden p-5 flex flex-col justify-between"
            style={{
              background: 'hsl(40, 35%, 93%)',
              border: '1px solid rgba(30,60,130,0.10)',
              borderRadius: '3px',
              boxShadow: '2px 3px 8px rgba(20,40,100,0.06)',
              minHeight: 130,
            }}
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-sm" style={{ background: 'rgba(30,60,130,0.12)' }}>
              <LockKeyhole className="w-3.5 h-3.5" style={{ color: 'hsl(218,60%,35%)' }} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'hsl(220,22%,55%)' }}>Unlocking Soon</p>
              <p className="font-serif font-semibold text-sm leading-snug" style={{ color: 'hsl(222,40%,22%)' }}>{data.nextLetterUnlock.name}</p>
              <p className="text-[10px] font-bold mt-1.5 uppercase tracking-wide" style={{ color: 'hsl(218,55%,38%)' }}>In {data.nextLetterUnlock.daysAway} days</p>
            </div>
          </motion.div>
        </div>

        {/* Quote tile — dark cobalt with italic serif */}
        <motion.div {...tile(4)}
          className="relative overflow-hidden p-7"
          style={{
            background: 'hsl(222, 40%, 14%)',
            border: '1px solid rgba(20,50,120,0.5)',
            borderRadius: '3px',
            boxShadow: '3px 5px 18px rgba(10,20,60,0.30)',
            backgroundImage: azulejoPattern,
            backgroundSize: '24px 24px',
          }}
        >
          <div className="absolute top-4 right-5 opacity-10">
            <Sparkles className="w-10 h-10" style={{ color: 'hsl(42,50%,80%)' }} />
          </div>
          <p className="font-serif italic leading-relaxed relative z-10" style={{ fontSize: '1rem', color: 'rgba(220,210,190,0.90)', lineHeight: 1.8 }}>
            "{data.randomPhrase}"
          </p>
          <p className="text-[9px] mt-5 font-bold tracking-[0.18em] uppercase relative z-10" style={{ color: 'rgba(180,165,140,0.40)' }}>
            ✦ &nbsp; Built daily.
          </p>
        </motion.div>

        {/* Goals tile */}
        <motion.div {...tile(5)}>
          <Link href="/build" className="block">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                background: 'hsl(38, 30%, 99%)',
                border: '1px solid rgba(30,60,130,0.12)',
                borderRadius: '3px',
                boxShadow: '2px 3px 8px rgba(20,40,100,0.06)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-7 h-7 flex items-center justify-center rounded-sm" style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,95%)' }}>
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-serif font-semibold text-sm" style={{ color: 'hsl(222,45%,16%)' }}>Active Goals</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'hsl(220,22%,52%)' }}>{data.activeGoals} remaining to build</p>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5" style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,95%)', borderRadius: '2px' }}>
                View →
              </span>
            </div>
          </Link>
        </motion.div>

      </div>
    </AppShell>
  );
}
