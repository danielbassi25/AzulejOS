import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockDashboard, mockMemories, mockScore } from "@/data/mock";
import { motion } from "framer-motion";
import { Calendar, LockKeyhole, Target, Sparkles, Image, Trophy, MessageCircle, PenLine, Heart } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";

const tile = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.50, ease: [0.22, 1, 0.36, 1] },
});

const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.13'%3E%3Ccircle cx='16' cy='16' r='5'/%3E%3Cline x1='16' y1='0' x2='16' y2='11'/%3E%3Cline x1='16' y1='21' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='16' x2='32' y2='16'/%3E%3Cline x1='3' y1='3' x2='10' y2='10'/%3E%3Cline x1='22' y1='22' x2='29' y2='29'/%3E%3Cline x1='29' y1='3' x2='22' y2='10'/%3E%3Cline x1='10' y1='22' x2='3' y2='29'/%3E%3C/g%3E%3C/svg%3E")`;

const bgPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e3c82' stroke-width='0.35' opacity='0.045'%3E%3Ccircle cx='20' cy='20' r='7'/%3E%3Cline x1='20' y1='0' x2='20' y2='13'/%3E%3Cline x1='20' y1='27' x2='20' y2='40'/%3E%3Cline x1='0' y1='20' x2='13' y2='20'/%3E%3Cline x1='27' y1='20' x2='40' y2='20'/%3E%3Cline x1='4' y1='4' x2='12' y2='12'/%3E%3Cline x1='28' y1='28' x2='36' y2='36'/%3E%3Cline x1='36' y1='4' x2='28' y2='12'/%3E%3Cline x1='12' y1='28' x2='4' y2='36'/%3E%3C/g%3E%3C/svg%3E")`;

const SUGGESTIONS = [
  { text: "Write a new letter", icon: PenLine, href: "/letters/new" },
  { text: "Ask a deep question", icon: MessageCircle, href: "/play" },
  { text: "Save a memory", icon: Image, href: "/saudade/new" },
];

export default function SystemPage() {
  const data = mockDashboard;
  const [suggestionIdx] = useState(() => Math.floor(Math.random() * SUGGESTIONS.length));
  const suggestion = SUGGESTIONS[suggestionIdx];
  const memOfDay = useMemo(() => {
    const match = mockMemories.find(m => m.id === data.memoryOfTheDay.id);
    return match || mockMemories[0];
  }, [data.memoryOfTheDay.id]);

  const leader = mockScore.sofia > mockScore.daniel ? 'Sofia' : 'Daniel';
  const totalPoints = mockScore.daniel + mockScore.sofia;

  return (
    <AppShell>
      <SectionHeader
        title="System"
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

          {/* ═══ HERO — Days + Greeting combined ═══ */}
          <motion.div
            {...tile(0)}
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(220,70%,26%)',
              backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)`,
              backgroundSize: '32px 32px, 100% 100%',
              border: '1px solid rgba(15,45,115,0.50)', borderRadius: '4px',
              boxShadow: '0 10px 36px rgba(15,30,80,0.28), 0 1px 0 rgba(255,255,255,0.08) inset',
              padding: '28px 28px 32px',
            }}
          >
            <div className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{ height: 100, background: 'linear-gradient(to bottom, rgba(255,252,245,0.06) 0%, transparent 100%)' }} />
            <div className="absolute top-0 left-0 w-10 h-10 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute top-0 right-0 w-10 h-10 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />

            {/* Greeting row */}
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0"
                style={{ border: '2px solid rgba(220,210,192,0.35)', boxShadow: '0 3px 14px rgba(10,20,60,0.30)' }}>
                <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(195,182,160,0.42)' }}>Good morning</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.45rem', letterSpacing: '0.02em', lineHeight: 1.1, color: 'hsl(42,30%,96%)', marginTop: '2px' }}>Sofia.</p>
              </div>
            </div>

            <div className="relative z-10" style={{ width: '100%', height: 1, background: 'rgba(200,185,160,0.12)', marginBottom: '24px' }} />

            {/* Days counter */}
            <div className="relative z-10 text-center">
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(200,185,160,0.40)', marginBottom: '12px' }}>
                ✦ &nbsp; Time Together &nbsp; ✦
              </p>
              <div className="flex items-baseline justify-center" style={{ gap: '10px' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '6rem', letterSpacing: '-0.04em', lineHeight: 0.88, color: 'hsl(42, 32%, 97%)', textShadow: '0 4px 28px rgba(10,25,70,0.35)' }}>
                  {data.daysTogether}
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.35rem', color: 'rgba(200,188,165,0.42)' }}>days</span>
              </div>
              <p className="relative z-10" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.78rem', letterSpacing: '0.04em', color: 'rgba(195,182,160,0.28)', marginTop: '16px' }}>Daniel & Sofia</p>
            </div>
          </motion.div>

          {/* ═══ MOSAIC ROW 1: Memory of Day (wide) + Score (narrow) ═══ */}
          <div className="grid gap-3" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
            {/* Memory of the Day */}
            <motion.div {...tile(1)}>
              <Link href={`/saudade/${memOfDay.id}`} className="block h-full">
                <div className="relative overflow-hidden h-full" style={{ borderRadius: '4px', minHeight: 170, border: '1px solid rgba(30,60,130,0.10)', boxShadow: '2px 4px 14px rgba(20,40,100,0.09)' }}>
                  <img src={memOfDay.imageUrl} alt={memOfDay.title} className="w-full h-full object-cover absolute inset-0" style={{ filter: 'saturate(0.78) brightness(0.84)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,25,72,0.92) 0%, rgba(18,38,96,0.40) 50%, transparent 100%)' }} />
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.12)', border: '1px solid rgba(255,252,245,0.15)', borderRadius: '2px', color: 'rgba(215,210,195,0.65)' }}>
                    <Image className="w-2.5 h-2.5" /> Today
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.10rem', letterSpacing: '0.01em', color: 'rgba(240,238,232,0.95)', textShadow: '0 2px 10px rgba(0,0,30,0.45)', lineHeight: 1.2 }}>
                      {memOfDay.title}
                    </h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 300, color: 'rgba(195,210,245,0.55)', marginTop: '4px' }} className="line-clamp-2">
                      {memOfDay.preview}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Score tile */}
            <motion.div {...tile(2)}>
              <Link href="/score" className="block h-full">
                <div className="relative overflow-hidden p-5 flex flex-col justify-between h-full"
                  style={{
                    backgroundColor: 'hsl(220,68%,24%)',
                    backgroundImage: `${azulejoMotif}, linear-gradient(165deg, hsl(220,68%,24%) 0%, hsl(218,70%,28%) 100%)`,
                    backgroundSize: '32px 32px, 100% 100%',
                    border: '1px solid rgba(15,45,115,0.48)', borderRadius: '4px',
                    boxShadow: '2px 4px 16px rgba(12,25,72,0.22)',
                    minHeight: 170,
                  }}>
                  <div className="w-7 h-7 flex items-center justify-center" style={{ background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.14)', borderRadius: '3px' }}>
                    <Trophy className="w-3.5 h-3.5" style={{ color: 'hsl(42,50%,72%)' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(195,182,160,0.42)', marginBottom: '6px' }}>Score</p>
                    <div className="flex items-baseline gap-1.5">
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.8rem', letterSpacing: '-0.02em', color: 'hsl(42,32%,96%)' }}>{mockScore.daniel}</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: '0.9rem', color: 'rgba(200,188,165,0.35)' }}>—</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.8rem', letterSpacing: '-0.02em', color: 'hsl(38,48%,72%)' }}>{mockScore.sofia}</span>
                    </div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(215,205,185,0.45)', marginTop: '6px' }}>
                      {leader} leads ✦
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* ═══ ROW 2: Next Event + Letter Unlock + Goals — 3 columns ═══ */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div {...tile(3)}>
              <Link href="/build" className="block h-full">
                <div className="p-4 flex flex-col justify-between h-full"
                  style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)', minHeight: 115 }}>
                  <div className="w-6 h-6 flex items-center justify-center" style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '3px' }}>
                    <Calendar className="w-3 h-3" />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,20%,58%)', marginBottom: '4px' }}>Next</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.01em', lineHeight: 1.2, color: 'hsl(222,45%,16%)' }}>{data.nextEvent.name}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(218,58%,36%)', marginTop: '6px' }}>{data.nextEvent.daysAway}d</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div {...tile(4)}>
              <Link href="/letters" className="block h-full">
                <div className="p-4 flex flex-col justify-between h-full"
                  style={{ background: 'hsl(40,28%,94%)', border: '1px solid rgba(30,60,130,0.07)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)', minHeight: 115 }}>
                  <div className="w-6 h-6 flex items-center justify-center" style={{ background: 'rgba(30,60,130,0.10)', color: 'hsl(218,55%,35%)', borderRadius: '3px' }}>
                    <LockKeyhole className="w-3 h-3" />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,18%,55%)', marginBottom: '4px' }}>Unlock</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.01em', lineHeight: 1.2, color: 'hsl(222,40%,20%)' }}>Letter No. 4</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(218,48%,38%)', marginTop: '6px' }}>{data.nextLetterUnlock.daysAway}d</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div {...tile(5)}>
              <Link href="/build" className="block h-full">
                <div className="p-4 flex flex-col justify-between h-full"
                  style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 12px rgba(20,40,100,0.06)', minHeight: 115 }}>
                  <div className="w-6 h-6 flex items-center justify-center" style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '3px' }}>
                    <Target className="w-3 h-3" />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,20%,58%)', marginBottom: '4px' }}>Goals</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', color: 'hsl(218,70%,28%)', lineHeight: 1 }}>{data.activeGoals}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(220,16%,58%)', marginTop: '6px' }}>active</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* ═══ Quote tile ═══ */}
          <motion.div
            {...tile(6)}
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

          {/* ═══ ROW 3: Suggestion CTA ═══ */}
          <motion.div {...tile(7)}>
            <Link href={suggestion.href} className="block">
              <motion.div
                whileHover={{ y: -1.5 }} whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-center gap-4 px-6 py-5"
                style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 2px 3px 12px rgba(20,40,100,0.06)' }}
              >
                <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '4px' }}>
                  <suggestion.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(220,18%,58%)', marginBottom: '4px' }}>Tonight's suggestion</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.08rem', letterSpacing: '0.015em', color: 'hsl(222,45%,16%)', lineHeight: 1.2 }}>{suggestion.text}</p>
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '2px', padding: '5px 10px' }}>Go →</span>
              </motion.div>
            </Link>
          </motion.div>

        </div>
      </div>
    </AppShell>
  );
}
