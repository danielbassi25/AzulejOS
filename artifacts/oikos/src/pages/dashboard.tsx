import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockDashboard, mockMemories, mockScore, mockGoals } from "@/data/mock";
import { motion } from "framer-motion";
import { Sparkles, Heart, PenLine, MessageCircle, Image, Sun, Moon, CloudSun } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const tile = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.50, ease: EASE as unknown as number[] },
});

const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.13'%3E%3Ccircle cx='16' cy='16' r='5'/%3E%3Cline x1='16' y1='0' x2='16' y2='11'/%3E%3Cline x1='16' y1='21' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='16' x2='32' y2='16'/%3E%3Cline x1='3' y1='3' x2='10' y2='10'/%3E%3Cline x1='22' y1='22' x2='29' y2='29'/%3E%3Cline x1='29' y1='3' x2='22' y2='10'/%3E%3Cline x1='10' y1='22' x2='3' y2='29'/%3E%3C/g%3E%3C/svg%3E")`;

const bgPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e3c82' stroke-width='0.35' opacity='0.045'%3E%3Ccircle cx='20' cy='20' r='7'/%3E%3Cline x1='20' y1='0' x2='20' y2='13'/%3E%3Cline x1='20' y1='27' x2='20' y2='40'/%3E%3Cline x1='0' y1='20' x2='13' y2='20'/%3E%3Cline x1='27' y1='20' x2='40' y2='20'/%3E%3Cline x1='4' y1='4' x2='12' y2='12'/%3E%3Cline x1='28' y1='28' x2='36' y2='36'/%3E%3Cline x1='36' y1='4' x2='28' y2='12'/%3E%3Cline x1='12' y1='28' x2='4' y2='36'/%3E%3C/g%3E%3C/svg%3E")`;

function getGreeting(): { text: string; icon: typeof Sun } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: Sun };
  if (hour < 18) return { text: 'Good afternoon', icon: CloudSun };
  return { text: 'Good evening', icon: Moon };
}

const RITUALS = [
  { text: "Write a letter tonight", icon: PenLine, href: "/letters/new", label: "Write" },
  { text: "Play a question game", icon: MessageCircle, href: "/play", label: "Play" },
  { text: "Save today as a memory", icon: Image, href: "/saudade/new", label: "Capture" },
];

export default function DashboardPage() {
  const data = mockDashboard;
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const memOfDay = useMemo(() => {
    const match = mockMemories.find(m => m.id === data.memoryOfTheDay.id);
    return match || mockMemories[0];
  }, [data.memoryOfTheDay.id]);

  const completedGoals = mockGoals.filter(g => g.completed).length;
  const totalGoals = mockGoals.length;
  const goalPercent = Math.round((completedGoals / totalGoals) * 100);

  const years = Math.floor(data.daysTogether / 365);
  const months = Math.floor((data.daysTogether % 365) / 30);

  return (
    <AppShell>
      <SectionHeader
        title="Dashboard"
        action={
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{ background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.18)', borderRadius: '2px' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 3.2, repeat: Infinity }}
          >
            <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
              animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2.4, repeat: Infinity }} />
            <span style={{ fontSize: '9px', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(215,205,185,0.72)', textTransform: 'uppercase' }}>Online</span>
          </motion.div>
        }
      />

      <div style={{ backgroundImage: bgPattern, backgroundSize: '40px 40px', minHeight: '100%' }}>
        <div className="px-4 pt-4 pb-10" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* ═══ GREETING — Separate tile ═══ */}
          <motion.div
            {...tile(0)}
            className="flex items-center gap-4 px-6 py-5"
            style={{
              background: 'hsl(38, 30%, 99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 2px 4px 14px rgba(20,40,100,0.06)',
            }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0"
              style={{ border: '2px solid hsl(218,68%,30%)', boxShadow: '0 2px 10px rgba(20,40,100,0.22)' }}>
              <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <GreetingIcon className="w-3 h-3" style={{ color: 'hsl(40,60%,52%)' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(220,20%,60%)' }}>
                  {greeting.text}
                </p>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.90rem', letterSpacing: '0.02em', lineHeight: 1.1, color: 'hsl(222,45%,16%)', marginTop: '3px' }}>
                Sofia.
              </p>
            </div>
          </motion.div>

          {/* ═══ HERO — Days Counter ═══ */}
          <motion.div
            {...tile(1)}
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(220,70%,26%)',
              backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)`,
              backgroundSize: '32px 32px, 100% 100%',
              border: '1px solid rgba(15,45,115,0.50)', borderRadius: '4px',
              boxShadow: '0 10px 36px rgba(15,30,80,0.28), 0 1px 0 rgba(255,255,255,0.08) inset',
              padding: '36px 28px 32px', textAlign: 'center',
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ width: 260, height: 120, background: 'radial-gradient(ellipse at top, rgba(255,252,245,0.07) 0%, transparent 70%)' }} />
            <div className="absolute top-0 left-0 w-10 h-10 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute top-0 right-0 w-10 h-10 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />

            <p className="relative z-10" style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(200,185,160,0.40)', marginBottom: '14px' }}>
              ✦ &nbsp; Time Together &nbsp; ✦
            </p>
            <div className="relative z-10 flex items-baseline justify-center" style={{ gap: '10px' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '6.5rem', letterSpacing: '-0.04em', lineHeight: 0.88, color: 'hsl(42, 32%, 97%)', textShadow: '0 4px 28px rgba(10,25,70,0.35)' }}>
                {data.daysTogether}
              </span>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.35rem', color: 'rgba(200,188,165,0.42)' }}>days</span>
            </div>
            <div className="relative z-10 mx-auto" style={{ width: 36, height: 1, background: 'rgba(200,185,160,0.18)', marginTop: '18px', marginBottom: '12px' }} />
            <p className="relative z-10" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.78rem', letterSpacing: '0.04em', color: 'rgba(195,182,160,0.32)' }}>
              {years > 0 && `${years} year${years > 1 ? 's' : ''}`}{years > 0 && months > 0 && ', '}{months > 0 && `${months} month${months > 1 ? 's' : ''}`} — Daniel & Sofia
            </p>
          </motion.div>

          {/* ═══ Quote — directly under days ═══ */}
          <motion.div
            {...tile(2)}
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(222,42%,13%)',
              backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`,
              backgroundSize: '32px 32px, 100% 100%',
              border: '1px solid rgba(15,40,110,0.55)', borderRadius: '4px',
              boxShadow: '0 10px 30px rgba(10,20,60,0.30)', padding: '28px 24px 24px',
            }}
          >
            <div className="absolute top-5 right-6 opacity-[0.06] pointer-events-none">
              <Sparkles className="w-8 h-8" style={{ color: 'hsl(42,50%,80%)' }} />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '2.4rem', color: 'rgba(200,185,160,0.10)', lineHeight: 1, marginBottom: '-2px' }}>"</div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.08rem', letterSpacing: '0.015em', lineHeight: 1.75, color: 'rgba(222,212,194,0.86)', position: 'relative', zIndex: 1 }}>
              {data.randomPhrase}
            </p>
            <div style={{ width: 24, height: 1, background: 'rgba(200,185,160,0.16)', marginTop: '16px', marginBottom: '10px' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(172,160,140,0.28)' }}>Built daily.</p>
          </motion.div>

          {/* ═══ SECTION: Today's Pulse ═══ */}
          <div className="flex items-center gap-3 mt-3 mb-1">
            <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,58%)' }}>
              Today's Pulse
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          </div>

          {/* Pulse stats row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Relationship age */}
            <motion.div {...tile(3)}
              className="p-4 text-center"
              style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'hsl(218,70%,28%)', lineHeight: 1 }}>{mockMemories.length}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,16%,60%)', marginTop: '6px' }}>Memories</p>
            </motion.div>

            {/* Score total */}
            <motion.div {...tile(4)}
              className="p-4 text-center"
              style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'hsl(218,70%,28%)', lineHeight: 1 }}>{mockScore.daniel + mockScore.sofia}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,16%,60%)', marginTop: '6px' }}>Points</p>
            </motion.div>

            {/* Goals progress */}
            <motion.div {...tile(5)}
              className="p-4 text-center"
              style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'hsl(218,70%,28%)', lineHeight: 1 }}>{goalPercent}%</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,16%,60%)', marginTop: '6px' }}>Goals done</p>
            </motion.div>
          </div>

          {/* ═══ SECTION: What's Coming ═══ */}
          <div className="flex items-center gap-3 mt-3 mb-1">
            <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,58%)' }}>
              What's Coming
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          </div>

          {/* Event countdown cards */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div {...tile(6)}
              className="p-5 flex flex-col"
              style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(220,20%,58%)', marginBottom: '8px' }}>Next event</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.0rem', letterSpacing: '0.01em', lineHeight: 1.25, color: 'hsl(222,45%,16%)', flex: 1 }}>{data.nextEvent.name}</p>
              <div className="flex items-baseline gap-1 mt-3">
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.6rem', color: 'hsl(218,70%,28%)', lineHeight: 1 }}>{data.nextEvent.daysAway}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(218,50%,40%)' }}>days away</span>
              </div>
            </motion.div>

            <motion.div {...tile(7)}
              className="p-5 flex flex-col"
              style={{ background: 'hsl(40,28%,94%)', border: '1px solid rgba(30,60,130,0.07)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(220,18%,55%)', marginBottom: '8px' }}>Next letter</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.0rem', letterSpacing: '0.01em', lineHeight: 1.25, color: 'hsl(222,40%,20%)', flex: 1 }}>{data.nextLetterUnlock.name}</p>
              <div className="flex items-baseline gap-1 mt-3">
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.6rem', color: 'hsl(218,48%,38%)', lineHeight: 1 }}>{data.nextLetterUnlock.daysAway}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(218,40%,48%)' }}>days away</span>
              </div>
            </motion.div>
          </div>

          {/* ═══ Memory of the Day ═══ */}
          <div className="flex items-center gap-3 mt-3 mb-1">
            <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,58%)' }}>
              Memory of the Day
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          </div>

          <motion.div {...tile(8)}>
            <Link href={`/saudade/${memOfDay.id}`} className="block">
              <div className="relative overflow-hidden" style={{ borderRadius: '4px', height: 155, border: '1px solid rgba(30,60,130,0.10)', boxShadow: '2px 4px 14px rgba(20,40,100,0.09)' }}>
                <img src={memOfDay.imageUrl} alt={memOfDay.title} className="w-full h-full object-cover" style={{ filter: 'saturate(0.78) brightness(0.84)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,25,72,0.90) 0%, rgba(18,38,96,0.38) 55%, transparent 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.20rem', letterSpacing: '0.01em', color: 'rgba(240,238,232,0.95)', textShadow: '0 2px 10px rgba(0,0,30,0.45)' }}>
                    {memOfDay.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 300, color: 'rgba(195,210,245,0.60)', marginTop: '4px' }} className="line-clamp-2">
                    {memOfDay.preview}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ═══ SECTION: Tonight's Rituals ═══ */}
          <div className="flex items-center gap-3 mt-3 mb-1">
            <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,58%)' }}>
              Tonight's Rituals
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {RITUALS.map((ritual, i) => (
              <motion.div key={i} {...tile(9 + i)}>
                <Link href={ritual.href} className="block h-full">
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    className="p-4 flex flex-col items-center text-center h-full"
                    style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)', minHeight: 100 }}>
                    <div className="w-9 h-9 flex items-center justify-center mb-3" style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '4px' }}>
                      <ritual.icon className="w-4 h-4" />
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.01em', lineHeight: 1.2, color: 'hsl(222,45%,16%)' }}>{ritual.label}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </AppShell>
  );
}
