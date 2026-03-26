import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockDashboard } from "@/data/mock";
import { motion } from "framer-motion";
import { Calendar, LockKeyhole, Target, Sparkles } from "lucide-react";
import { Link } from "wouter";

const tile = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
});

const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.13'%3E%3Ccircle cx='16' cy='16' r='5'/%3E%3Cline x1='16' y1='0' x2='16' y2='11'/%3E%3Cline x1='16' y1='21' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='16' x2='32' y2='16'/%3E%3Cline x1='3' y1='3' x2='10' y2='10'/%3E%3Cline x1='22' y1='22' x2='29' y2='29'/%3E%3Cline x1='29' y1='3' x2='22' y2='10'/%3E%3Cline x1='10' y1='22' x2='3' y2='29'/%3E%3C/g%3E%3C/svg%3E")`;

export default function SystemPage() {
  const data = mockDashboard;

  return (
    <AppShell>
      <SectionHeader
        title="System"
        action={
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              background: 'rgba(255,252,245,0.10)',
              border: '1px solid rgba(255,252,245,0.18)',
              borderRadius: '2px',
            }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 3.2, repeat: Infinity }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <span style={{ fontSize: '9px', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(215,205,185,0.72)', textTransform: 'uppercase' }}>
              Online
            </span>
          </motion.div>
        }
      />

      <div className="px-4 pt-4 pb-8 space-y-3">

        {/* Greeting tile */}
        <motion.div
          {...tile(0)}
          className="flex items-center gap-4 px-6 py-5"
          style={{
            background: 'hsl(38, 30%, 99%)',
            border: '1px solid rgba(30,60,130,0.08)',
            borderRadius: '4px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 2px 4px 14px rgba(20,40,100,0.06)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full overflow-hidden shrink-0"
            style={{
              border: '2px solid hsl(218,68%,30%)',
              boxShadow: '0 2px 10px rgba(20,40,100,0.22)',
            }}
          >
            <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
          </div>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(220,20%,60%)' }}>
              Good morning
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.90rem', letterSpacing: '0.02em', lineHeight: 1.1, color: 'hsl(222,45%,16%)', marginTop: '2px' }}>
              Sofia.
            </p>
          </div>
        </motion.div>

        {/* ═══ HERO TILE — Days Together — The dominant element ═══ */}
        <motion.div
          {...tile(1)}
          className="relative overflow-hidden"
          style={{
            backgroundColor: 'hsl(220,70%,26%)',
            backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)`,
            backgroundSize: '32px 32px, 100% 100%',
            border: '1px solid rgba(15,45,115,0.50)',
            borderRadius: '4px',
            boxShadow: '0 10px 36px rgba(15,30,80,0.28), 0 1px 0 rgba(255,255,255,0.08) inset',
            padding: '48px 32px 40px',
            textAlign: 'center',
          }}
        >
          {/* Warm glow at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ width: 260, height: 120, background: 'radial-gradient(ellipse at top, rgba(255,252,245,0.07) 0%, transparent 70%)' }}
          />

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(200,185,160,0.50)', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
            ✦ &nbsp; Time Together &nbsp; ✦
          </p>

          {/* Iconic number */}
          <div className="relative z-10 flex items-baseline justify-center" style={{ gap: '12px' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: '7.5rem',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: 'hsl(42, 32%, 97%)',
              textShadow: '0 4px 28px rgba(10,25,70,0.35)',
            }}>
              {data.daysTogether}
            </span>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '1.65rem',
              color: 'rgba(200,188,165,0.52)',
              marginBottom: '8px',
              letterSpacing: '0.01em',
            }}>
              days
            </span>
          </div>

          {/* Thin rule */}
          <div className="relative z-10 mx-auto" style={{ width: 40, height: 1, background: 'rgba(200,185,160,0.20)', marginTop: '24px', marginBottom: '16px' }} />

          <p className="relative z-10" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '0.85rem',
            letterSpacing: '0.04em',
            color: 'rgba(195,182,160,0.38)',
          }}>
            Daniel & Sofia
          </p>
        </motion.div>

        {/* 2-col stat tiles */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <Calendar className="w-3.5 h-3.5" />,
              label: 'Next Event',
              value: data.nextEvent.name,
              sub: `In ${data.nextEvent.daysAway} days`,
              bg: 'hsl(38,30%,99%)',
              iconBg: 'hsl(218,70%,28%)',
              iconColor: 'hsl(42,30%,96%)',
              border: '1px solid rgba(30,60,130,0.08)',
              labelColor: 'hsl(220,20%,58%)',
              valueColor: 'hsl(222,45%,16%)',
              subColor: 'hsl(218,58%,36%)',
            },
            {
              icon: <LockKeyhole className="w-3.5 h-3.5" />,
              label: 'Unlocking Soon',
              value: data.nextLetterUnlock.name,
              sub: `In ${data.nextLetterUnlock.daysAway} days`,
              bg: 'hsl(40, 28%, 94%)',
              iconBg: 'rgba(30,60,130,0.10)',
              iconColor: 'hsl(218,55%,35%)',
              border: '1px solid rgba(30,60,130,0.07)',
              labelColor: 'hsl(220,18%,55%)',
              valueColor: 'hsl(222,40%,20%)',
              subColor: 'hsl(218,48%,38%)',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              {...tile(i + 2)}
              className="p-5 flex flex-col justify-between"
              style={{
                background: card.bg,
                border: card.border,
                borderRadius: '4px',
                boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)',
                minHeight: 144,
              }}
            >
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ background: card.iconBg, color: card.iconColor, borderRadius: '3px' }}
              >
                {card.icon}
              </div>
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: card.labelColor, marginBottom: '6px' }}>
                  {card.label}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.015em', lineHeight: 1.25, color: card.valueColor }}>
                  {card.value}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: card.subColor, marginTop: '8px' }}>
                  {card.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote tile */}
        <motion.div
          {...tile(4)}
          className="relative overflow-hidden"
          style={{
            backgroundColor: 'hsl(222,42%,13%)',
            backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`,
            backgroundSize: '32px 32px, 100% 100%',
            border: '1px solid rgba(15,40,110,0.55)',
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(10,20,60,0.30)',
            padding: '36px 32px 32px',
          }}
        >
          <div className="absolute top-6 right-7 opacity-[0.06] pointer-events-none">
            <Sparkles className="w-11 h-11" style={{ color: 'hsl(42,50%,80%)' }} />
          </div>

          {/* Opening mark */}
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '3.2rem', color: 'rgba(200,185,160,0.12)', lineHeight: 1, marginBottom: '-6px' }}>
            "
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '1.20rem',
            letterSpacing: '0.015em',
            lineHeight: 1.80,
            color: 'rgba(222,212,194,0.88)',
            position: 'relative',
            zIndex: 1,
          }}>
            {data.randomPhrase}
          </p>

          <div style={{ width: 32, height: 1, background: 'rgba(200,185,160,0.16)', marginTop: '24px', marginBottom: '14px' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(172,160,140,0.34)' }}>
            Built daily.
          </p>
        </motion.div>

        {/* Goals row */}
        <motion.div {...tile(5)}>
          <Link href="/build" className="block">
            <motion.div
              whileHover={{ y: -1.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-center justify-between px-6 py-5"
              style={{
                background: 'hsl(38,30%,99%)',
                border: '1px solid rgba(30,60,130,0.08)',
                borderRadius: '4px',
                boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 2px 3px 12px rgba(20,40,100,0.06)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-7 h-7 flex items-center justify-center"
                  style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '3px' }}>
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.02em', color: 'hsl(222,45%,16%)' }}>
                    Active Goals
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'hsl(220,18%,56%)', marginTop: '3px' }}>
                    {data.activeGoals} remaining to build
                  </p>
                </div>
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: 'hsl(218,70%,28%)',
                color: 'hsl(42,30%,96%)',
                borderRadius: '2px',
                padding: '6px 12px',
              }}>
                View →
              </span>
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </AppShell>
  );
}
