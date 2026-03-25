import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockDashboard } from "@/data/mock";
import { motion } from "framer-motion";
import { Calendar, LockKeyhole, Target, Sparkles } from "lucide-react";
import { Link } from "wouter";

const tile = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
});

// Azulejo motif only for hero tiles
const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.13'%3E%3Ccircle cx='16' cy='16' r='5'/%3E%3Cline x1='16' y1='0' x2='16' y2='11'/%3E%3Cline x1='16' y1='21' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='16' x2='32' y2='16'/%3E%3Cline x1='3' y1='3' x2='10' y2='10'/%3E%3Cline x1='22' y1='22' x2='29' y2='29'/%3E%3Cline x1='29' y1='3' x2='22' y2='10'/%3E%3Cline x1='10' y1='22' x2='3' y2='29'/%3E%3C/g%3E%3C/svg%3E")`;

export default function SystemPage() {
  const data = mockDashboard;

  return (
    <AppShell>
      <SectionHeader
        title="System"
        action={
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(255,252,245,0.10)',
              border: '1px solid rgba(255,252,245,0.18)',
              color: 'rgba(215, 205, 185, 0.75)',
              borderRadius: '2px',
            }}
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            Online
          </motion.div>
        }
      />

      <div className="p-4 space-y-3">

        {/* Greeting — clean, warm, intimate */}
        <motion.div
          {...tile(0)}
          className="flex items-center gap-4 px-5 py-4"
          style={{
            background: 'hsl(38, 30%, 99%)',
            border: '1px solid rgba(30,60,130,0.09)',
            borderRadius: '4px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 2px 4px 12px rgba(20,40,100,0.06)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full overflow-hidden shrink-0"
            style={{
              border: '2px solid hsl(218,70%,28%)',
              boxShadow: '0 2px 10px rgba(20,40,100,0.20)',
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
              className="font-sans font-medium uppercase tracking-widest"
              style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'hsl(220,22%,60%)' }}
            >
              Good morning
            </p>
            <h2
              className="font-serif font-semibold leading-none mt-1"
              style={{ fontSize: '1.75rem', color: 'hsl(222,45%,16%)', letterSpacing: '-0.03em' }}
            >
              Sofia.
            </h2>
          </div>
        </motion.div>

        {/* ═══ HERO TILE — Days Together ═══ */}
        {/* This is the ONE dominant element on this screen */}
        <motion.div
          {...tile(1)}
          className="relative overflow-hidden"
          style={{
            backgroundColor: 'hsl(220,70%,26%)',
            backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)`,
            backgroundSize: '32px 32px, 100% 100%',
            border: '1px solid rgba(15,45,115,0.50)',
            borderRadius: '4px',
            boxShadow: '0 8px 32px rgba(15,30,80,0.28), 0 1px 0 rgba(255,255,255,0.08) inset',
            padding: '44px 28px 36px',
            textAlign: 'center',
          }}
        >
          {/* Warm light leak */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(255,252,245,0.07) 0%, transparent 70%)',
              filter: 'blur(12px)',
            }}
          />

          <p
            className="relative z-10 font-sans font-semibold uppercase tracking-[0.20em] mb-5"
            style={{ fontSize: '8.5px', color: 'rgba(200,185,160,0.52)' }}
          >
            ✦ &nbsp; Time Together &nbsp; ✦
          </p>

          {/* The number — iconic, majestic */}
          <div className="relative z-10 flex items-baseline justify-center gap-4">
            <span
              className="font-serif font-bold"
              style={{
                fontSize: '6.5rem',
                letterSpacing: '-0.07em',
                lineHeight: 0.88,
                color: 'hsl(42, 32%, 96%)',
                textShadow: '0 4px 24px rgba(10,25,70,0.40)',
              }}
            >
              {data.daysTogether}
            </span>
            <span
              className="font-serif italic font-medium"
              style={{
                fontSize: '1.5rem',
                color: 'rgba(200,188,165,0.55)',
                marginBottom: 6,
              }}
            >
              days
            </span>
          </div>

          {/* Subtle divider */}
          <div
            className="relative z-10 mx-auto mt-6 mb-4"
            style={{ width: 36, height: 1, background: 'rgba(200,185,160,0.22)' }}
          />

          <p
            className="relative z-10 font-serif italic"
            style={{ fontSize: '0.72rem', color: 'rgba(195,182,160,0.40)', letterSpacing: '0.04em' }}
          >
            Daniel & Sofia
          </p>
        </motion.div>

        {/* 2-col stat tiles — clean ceramic, no pattern */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <Calendar className="w-3.5 h-3.5" />,
              label: 'Next Event',
              value: data.nextEvent.name,
              sub: `In ${data.nextEvent.daysAway} days`,
              style: { background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.09)' },
              labelColor: 'hsl(220,22%,58%)',
              valueColor: 'hsl(222,45%,16%)',
              subColor: 'hsl(218,60%,36%)',
              iconBg: 'hsl(218,70%,28%)',
              iconColor: 'hsl(42,30%,96%)',
            },
            {
              icon: <LockKeyhole className="w-3.5 h-3.5" />,
              label: 'Unlocking Soon',
              value: data.nextLetterUnlock.name,
              sub: `In ${data.nextLetterUnlock.daysAway} days`,
              style: { background: 'hsl(40, 30%, 95%)', border: '1px solid rgba(30,60,130,0.08)' },
              labelColor: 'hsl(220,20%,55%)',
              valueColor: 'hsl(222,40%,20%)',
              subColor: 'hsl(218,50%,38%)',
              iconBg: 'rgba(30,60,130,0.10)',
              iconColor: 'hsl(218,55%,35%)',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              {...tile(i + 2)}
              className="p-5 flex flex-col justify-between"
              style={{
                ...card.style,
                borderRadius: '4px',
                boxShadow: '0 1px 0 rgba(255,255,255,0.85) inset, 2px 3px 10px rgba(20,40,100,0.06)',
                minHeight: 138,
              }}
            >
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ background: card.iconBg, color: card.iconColor, borderRadius: '3px' }}
              >
                {card.icon}
              </div>
              <div>
                <p className="font-sans font-semibold uppercase tracking-widest mb-1.5"
                  style={{ fontSize: '8.5px', letterSpacing: '0.13em', color: card.labelColor }}>
                  {card.label}
                </p>
                <p className="font-serif font-medium leading-snug" style={{ fontSize: '0.92rem', color: card.valueColor }}>
                  {card.value}
                </p>
                <p className="font-sans font-bold uppercase tracking-wide mt-1.5"
                  style={{ fontSize: '9px', color: card.subColor }}>
                  {card.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote tile — azulejo pattern here, it's earned */}
        <motion.div
          {...tile(4)}
          className="relative overflow-hidden p-8"
          style={{
            backgroundColor: 'hsl(222,42%,13%)',
            backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`,
            backgroundSize: '32px 32px, 100% 100%',
            border: '1px solid rgba(15,40,110,0.55)',
            borderRadius: '4px',
            boxShadow: '0 8px 28px rgba(10,20,60,0.30)',
          }}
        >
          <div className="absolute top-5 right-6 opacity-[0.07]">
            <Sparkles className="w-12 h-12" style={{ color: 'hsl(42,50%,80%)' }} />
          </div>

          {/* Opening quote mark */}
          <div
            className="font-serif font-bold mb-3 relative z-10"
            style={{ fontSize: '3rem', color: 'rgba(200,185,160,0.14)', lineHeight: 1, marginTop: -8 }}
          >
            "
          </div>

          <p
            className="font-serif italic leading-relaxed relative z-10"
            style={{ fontSize: '1.05rem', color: 'rgba(220,210,190,0.88)', lineHeight: 1.85 }}
          >
            {data.randomPhrase}
          </p>

          <div
            className="relative z-10 mt-6"
            style={{ width: 28, height: 1, background: 'rgba(200,185,160,0.18)' }}
          />
          <p
            className="relative z-10 mt-3 font-sans font-semibold uppercase tracking-[0.20em]"
            style={{ fontSize: '8px', color: 'rgba(175,162,140,0.35)' }}
          >
            Built daily.
          </p>
        </motion.div>

        {/* Goals row — clean, no pattern */}
        <motion.div {...tile(5)}>
          <Link href="/build" className="block">
            <motion.div
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-center justify-between px-5 py-4"
              style={{
                background: 'hsl(38,30%,99%)',
                border: '1px solid rgba(30,60,130,0.09)',
                borderRadius: '4px',
                boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 2px 3px 10px rgba(20,40,100,0.06)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-7 h-7 flex items-center justify-center"
                  style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '3px' }}
                >
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-serif font-medium" style={{ fontSize: '0.92rem', color: 'hsl(222,45%,16%)' }}>
                    Active Goals
                  </p>
                  <p className="font-sans mt-0.5" style={{ fontSize: '0.72rem', color: 'hsl(220,20%,55%)' }}>
                    {data.activeGoals} remaining to build
                  </p>
                </div>
              </div>
              <span
                className="font-sans font-bold uppercase tracking-widest px-3 py-1.5"
                style={{
                  fontSize: '8px',
                  background: 'hsl(218,70%,28%)',
                  color: 'hsl(42,30%,96%)',
                  borderRadius: '2px',
                }}
              >
                View →
              </span>
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </AppShell>
  );
}
