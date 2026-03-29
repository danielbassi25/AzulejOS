import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockDashboard } from "@/data/mock";
import { getAllMemories } from "@/data/store";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon, CloudSun, MapPin, Calendar, Pencil, X, Check, Clock } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";

const EASE = [0.22, 1, 0.36, 1] as const;

const DAILY_QUOTES = [
  { text: "Love is not love which alters when it alteration finds.", author: "William Shakespeare" },
  { text: "My bounty is as boundless as the sea.", author: "William Shakespeare" },
  { text: "Thy sweet love remembered such wealth brings.", author: "William Shakespeare" },
  { text: "And yet, by heaven, I think my love as rare.", author: "William Shakespeare" },
  { text: "How do I love thee? Let me count the ways.", author: "Elizabeth Barrett Browning" },
  { text: "I love thee to the depth and breadth and height.", author: "Elizabeth Barrett Browning" },
  { text: "If thou must love me, let it be for nought except for love's sake only.", author: "Elizabeth Barrett Browning" },
  { text: "That Love is all there is, is all we know of Love.", author: "Emily Dickinson" },
  { text: "Grow old along with me. The best is yet to be.", author: "Robert Browning" },
  { text: "We were together. I forget the rest.", author: "Walt Whitman" },
  { text: "Soul meets soul on lovers' lips.", author: "Percy Bysshe Shelley" },
  { text: "Love seeketh not itself to please.", author: "William Blake" },
  { text: "O my Luve's like a red, red rose.", author: "Robert Burns" },
  { text: "Come live with me and be my love.", author: "Christopher Marlowe" },
  { text: "One day I wrote her name upon the strand.", author: "Edmund Spenser" },
  { text: "My true-love hath my heart, and I have his.", author: "Sir Philip Sidney" },
  { text: "If ever two were one, then surely we.", author: "Anne Bradstreet" },
  { text: "There is a garden in her face.", author: "Thomas Campion" },
  { text: "I have spread my dreams under your feet.", author: "W. B. Yeats" },
  { text: "Tread softly because you tread on my dreams.", author: "W. B. Yeats" },
  { text: "Come to the window, sweet is the night-air.", author: "Matthew Arnold" },
  { text: "Love, that can quickly seize the gentle heart.", author: "Dante Alighieri" },
  { text: "All thoughts, all passions, all delights are ministers of Love.", author: "Samuel Taylor Coleridge" },
  { text: "My heart is like a singing bird.", author: "Christina Rossetti" },
  { text: "Love is enough.", author: "William Morris" },
  { text: "She walks in beauty, like the night.", author: "Lord Byron" },
  { text: "A thing of beauty is a joy for ever.", author: "John Keats" },
  { text: "Believe me, if all those endearing young charms.", author: "Thomas Moore" },
  { text: "My heart, the bird of the wilderness, has found its sky in your eyes.", author: "Rabindranath Tagore" },
  { text: "Someone, I tell you, will remember us.", author: "Sappho" },
];

function getDailyQuote() {
  const now = new Date();
  const ref = new Date(2026, 0, 1);
  const daysSinceRef = Math.floor((now.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
  return DAILY_QUOTES[((daysSinceRef % 30) + 30) % 30];
}

const tile = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.50, ease: EASE as unknown as number[] },
});

const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.13'%3E%3Ccircle cx='16' cy='16' r='5'/%3E%3Cline x1='16' y1='0' x2='16' y2='11'/%3E%3Cline x1='16' y1='21' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='16' x2='32' y2='16'/%3E%3Cline x1='3' y1='3' x2='10' y2='10'/%3E%3Cline x1='22' y1='22' x2='29' y2='29'/%3E%3Cline x1='29' y1='3' x2='22' y2='10'/%3E%3Cline x1='10' y1='22' x2='3' y2='29'/%3E%3C/g%3E%3C/svg%3E")`;

const azulejoLight = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e3c82' stroke-width='0.5' opacity='0.035'%3E%3Ccircle cx='16' cy='16' r='5'/%3E%3Cline x1='16' y1='0' x2='16' y2='11'/%3E%3Cline x1='16' y1='21' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='16' x2='32' y2='16'/%3E%3Cline x1='3' y1='3' x2='10' y2='10'/%3E%3Cline x1='22' y1='22' x2='29' y2='29'/%3E%3Cline x1='29' y1='3' x2='22' y2='10'/%3E%3Cline x1='10' y1='22' x2='3' y2='29'/%3E%3C/g%3E%3C/svg%3E")`;

const rosePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.20'%3E%3Ccircle cx='30' cy='30' r='14' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='8' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='2.5' stroke-width='0.5'/%3E%3Cpath d='M30 16v-16M30 44v16M16 30H0M44 30h16' stroke-width='0.4'/%3E%3Cpath d='M20.1 20.1L6 6M39.9 20.1L54 6M20.1 39.9L6 54M39.9 39.9L54 54' stroke-width='0.35'/%3E%3Ccircle cx='30' cy='16' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='30' cy='44' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='16' cy='30' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='44' cy='30' r='1.8' stroke-width='0.45'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

function getOnThisDayMemories() {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todayYear = today.getFullYear();

  return getAllMemories().filter(m => {
    const d = new Date(m.date);
    if (isNaN(d.getTime())) return false;
    return d.getMonth() === todayMonth && d.getDate() === todayDay && d.getFullYear() < todayYear;
  }).map(m => {
    const d = new Date(m.date);
    const yearsAgo = todayYear - d.getFullYear();
    return { ...m, yearsAgo };
  });
}

const bgPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e3c82' stroke-width='0.35' opacity='0.045'%3E%3Ccircle cx='20' cy='20' r='7'/%3E%3Cline x1='20' y1='0' x2='20' y2='13'/%3E%3Cline x1='20' y1='27' x2='20' y2='40'/%3E%3Cline x1='0' y1='20' x2='13' y2='20'/%3E%3Cline x1='27' y1='20' x2='40' y2='20'/%3E%3Cline x1='4' y1='4' x2='12' y2='12'/%3E%3Cline x1='28' y1='28' x2='36' y2='36'/%3E%3Cline x1='36' y1='4' x2='28' y2='12'/%3E%3Cline x1='12' y1='28' x2='4' y2='36'/%3E%3C/g%3E%3C/svg%3E")`;

function getGreeting(): { text: string; icon: typeof Sun } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: Sun };
  if (hour < 18) return { text: 'Good afternoon', icon: CloudSun };
  return { text: 'Good evening', icon: Moon };
}

interface NextMeeting {
  date: string;
  time: string;
  location: string;
  note: string;
}

function loadMeeting(): NextMeeting {
  try {
    const raw = localStorage.getItem("oikos-next-meeting");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { date: "", time: "", location: "", note: "" };
}

function saveMeeting(m: NextMeeting) {
  localStorage.setItem("oikos-next-meeting", JSON.stringify(m));
}

function parseLisbonTarget(dateStr: string, timeStr: string): Date {
  const t = timeStr || "00:00";
  const refDate = new Date(`${dateStr}T${t}:00Z`);
  const lisbonStr = refDate.toLocaleString("sv", { timeZone: "Europe/Lisbon" });
  const lisbonAsDate = new Date(lisbonStr.replace(" ", "T") + "Z");
  const offsetMs = lisbonAsDate.getTime() - refDate.getTime();
  return new Date(refDate.getTime() - offsetMs);
}

function useCountdown(targetDate: string, targetTime: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!targetDate) return;
    const id = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!targetDate) return null;
  const target = parseLisbonTarget(targetDate, targetTime);
  if (isNaN(target.getTime())) return null;
  const totalMs = target.getTime() - now.getTime();
  if (totalMs < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const minutes = differenceInMinutes(target, now) % 60;
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { days, hours: Math.max(0, hours), minutes: Math.max(0, minutes), seconds: Math.max(0, seconds), passed: false };
}

function CountdownUnit({ value, label, large }: { value: number; label: string; large?: boolean }) {
  return (
    <div className="text-center">
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 700,
        fontSize: large ? '3.2rem' : '2rem',
        lineHeight: 0.9,
        color: 'hsl(42,32%,97%)',
        textShadow: '0 3px 16px rgba(10,25,70,0.30)',
      }}>
        {value}
      </span>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '7px',
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase' as const,
        color: 'rgba(200,185,160,0.40)',
        marginTop: '4px',
      }}>{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const data = mockDashboard;
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const years = Math.floor(data.daysTogether / 365);
  const months = Math.floor((data.daysTogether % 365) / 30);
  const remainDays = data.daysTogether - years * 365 - months * 30;

  const [meeting, setMeeting] = useState<NextMeeting>(loadMeeting);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<NextMeeting>(meeting);
  const countdown = useCountdown(meeting.date, meeting.time);

  const startEdit = useCallback(() => {
    setDraft(meeting);
    setEditing(true);
  }, [meeting]);

  const cancelEdit = useCallback(() => setEditing(false), []);

  const saveEdit = useCallback(() => {
    setMeeting(draft);
    saveMeeting(draft);
    setEditing(false);
  }, [draft]);

  const clearMeeting = useCallback(() => {
    const empty = { date: "", time: "", location: "", note: "" };
    setMeeting(empty);
    saveMeeting(empty);
    setEditing(false);
  }, []);

  const hasMeeting = !!meeting.date;

  return (
    <AppShell>
      <SectionHeader title={<>Azulej<span style={{ color: 'hsl(42,36%,70%)' }}>OS</span></>} subtitle="Our love painted one tile at a time"/>

      <div style={{ backgroundImage: bgPattern, backgroundSize: '40px 40px', minHeight: '100%' }}>
        <div className="px-4 pt-4 pb-10" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* ═══ GREETING — white card ═══ */}
          <motion.div
            {...tile(0)}
            className="flex items-center gap-4 px-5 py-4"
            style={{
              backgroundColor: 'hsl(38,30%,99%)',
              backgroundImage: azulejoLight,
              backgroundSize: '32px 32px',
              border: '1px solid rgba(30,60,130,0.08)',
              borderRadius: '4px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 2px 4px 14px rgba(20,40,100,0.06)',
            }}
          >
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0"
              style={{ border: '2px solid hsl(338,45%,38%)', boxShadow: '0 2px 10px rgba(120,25,50,0.22)' }}>
              <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <GreetingIcon className="w-3 h-3" style={{ color: 'hsl(40,55%,52%)' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(220,18%,58%)' }}>
                  {greeting.text}
                </p>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.6rem', letterSpacing: '0.03em', lineHeight: 1.15, color: 'hsl(222,45%,16%)', marginTop: '2px' }}>
                Sofia
              </p>
            </div>
          </motion.div>

          {/* ═══ DAYS TOGETHER — cobalt card ═══ */}
          <motion.div
            {...tile(1)}
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(220,70%,26%)',
              backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)`,
              backgroundSize: '32px 32px, 100% 100%',
              border: '1px solid rgba(15,45,115,0.50)', borderRadius: '4px',
              boxShadow: '0 10px 36px rgba(15,30,80,0.28), 0 1px 0 rgba(255,255,255,0.08) inset',
              padding: '22px 24px 20px',
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ width: 260, height: 100, background: 'radial-gradient(ellipse at top, rgba(255,252,245,0.06) 0%, transparent 70%)' }} />
            <div className="absolute top-0 left-0 w-8 h-8 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />

            <p className="relative z-10 text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(200,185,200,200)', marginBottom: '14px' }}>
              ✦ &nbsp;Time Together&nbsp; ✦
            </p>

            <div className="relative z-10 flex items-end justify-center gap-4">
              <CountdownUnit value={years} label="years" />
              <div style={{ width: 1, height: 36, background: 'rgba(200,185,160,0.15)', marginBottom: 6 }} />
              <CountdownUnit value={months} label="months" large />
              <div style={{ width: 1, height: 36, background: 'rgba(200,185,160,0.15)', marginBottom: 6 }} />
              <CountdownUnit value={remainDays} label="days" />
            </div>

            <div className="relative z-10 mx-auto" style={{ width: 36, height: 1, background: 'rgba(200,185,160,0.15)', marginTop: '16px', marginBottom: '10px' }} />
            <p className="relative z-10 text-center" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.72rem', letterSpacing: '0.03em', color: 'rgba(200,185,200,200)' }}>
              {data.daysTogether} days — Daniel & Sofia
            </p>
          </motion.div>

          {/* ═══ QUOTE ═══ */}
          {(() => {
            const quote = getDailyQuote();
            return (
              <motion.div
                {...tile(2)}
                className="relative overflow-hidden"
                style={{
                  backgroundColor: 'hsl(222,42%,13%)',
                  backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`,
                  backgroundSize: '32px 32px, 100% 100%',
                  border: '1px solid rgba(15,40,110,0.55)', borderRadius: '4px',
                  boxShadow: '0 10px 30px rgba(10,20,60,0.30)', padding: '22px 24px 18px',
                }}
              >
                <div className="absolute top-4 right-5 opacity-[0.06] pointer-events-none">
                  <Sparkles className="w-6 h-6" style={{ color: 'hsl(42,50%,80%)' }} />
                </div>
                <div className="absolute top-3.5 left-5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '2.4rem', color: 'rgba(160,50,70,0.12)', lineHeight: 1 }}>"</div>
                <p className="text-center relative z-10" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.0rem', letterSpacing: '0.015em', lineHeight: 1.7, color: 'rgba(222,212,194,0.82)', padding: '4px 4px 0' }}>
                  {quote.text}
                </p>
                <p className="text-right relative z-10" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '0.7rem', letterSpacing: '0.04em', color: 'rgba(200,185,200,200)', marginTop: '12px' }}>
                  — {quote.author}
                </p>
              </motion.div>
            );
          })()}

          {/* ═══ NEXT MEETING ═══ */}
          <div className="flex items-center gap-3 mt-2 mb-1">
            <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,58%)' }}>
              Next Time We Meet
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          </div>

          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE as unknown as number[] }}
                className="relative overflow-hidden"
                style={{
                  background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.10)', borderRadius: '4px',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 4px 14px rgba(20,40,100,0.06)',
                  padding: '18px 18px 16px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(220,16%,56%)', display: 'block', marginBottom: '5px' }}>
                        <Calendar className="w-3 h-3 inline-block mr-1 -mt-0.5" />Date
                      </label>
                      <input
                        type="date"
                        value={draft.date}
                        onChange={e => setDraft(d => ({ ...d, date: e.target.value }))}
                        style={{
                          width: '100%', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 600,
                          color: 'hsl(222,45%,16%)', background: 'hsl(42,28%,95%)', border: '1px solid rgba(30,60,130,0.12)',
                          borderRadius: '3px', padding: '8px 10px', outline: 'none',
                        }}
                      />
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(220,16%,56%)', display: 'block', marginBottom: '5px' }}>
                        <Clock className="w-3 h-3 inline-block mr-1 -mt-0.5" />Time (Lisbon)
                      </label>
                      <input
                        type="time"
                        value={draft.time}
                        onChange={e => setDraft(d => ({ ...d, time: e.target.value }))}
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 600,
                          color: 'hsl(222,45%,16%)', background: 'hsl(42,28%,95%)', border: '1px solid rgba(30,60,130,0.12)',
                          borderRadius: '3px', padding: '8px 10px', outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(220,16%,56%)', display: 'block', marginBottom: '5px' }}>
                      <MapPin className="w-3 h-3 inline-block mr-1 -mt-0.5" />Location
                    </label>
                    <input
                      type="text"
                      value={draft.location}
                      onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
                      placeholder="Where will you meet?"
                      style={{
                        width: '100%', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 600,
                        color: 'hsl(222,45%,16%)', background: 'hsl(42,28%,95%)', border: '1px solid rgba(30,60,130,0.12)',
                        borderRadius: '3px', padding: '8px 10px', outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(220,16%,56%)', display: 'block', marginBottom: '5px' }}>
                      Note
                    </label>
                    <input
                      type="text"
                      value={draft.note}
                      onChange={e => setDraft(d => ({ ...d, note: e.target.value }))}
                      placeholder="Any plans? (optional)"
                      style={{
                        width: '100%', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 600,
                        color: 'hsl(222,45%,16%)', background: 'hsl(42,28%,95%)', border: '1px solid rgba(30,60,130,0.12)',
                        borderRadius: '3px', padding: '8px 10px', outline: 'none',
                      }}
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={saveEdit}
                      disabled={!draft.date}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
                        color: draft.date ? 'hsl(42,30%,96%)' : 'rgba(255,255,255,0.4)', background: draft.date ? 'hsl(218,70%,28%)' : 'hsl(218,30%,60%)',
                        borderRadius: '3px', border: 'none', cursor: draft.date ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <Check className="w-3.5 h-3.5" />Save
                    </button>
                    {hasMeeting && (
                      <button
                        onClick={clearMeeting}
                        className="px-4 py-2.5"
                        style={{
                          fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                          color: 'hsl(0,50%,55%)', background: 'hsl(0,30%,96%)',
                          borderRadius: '3px', border: '1px solid hsl(0,30%,90%)', cursor: 'pointer',
                        }}
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2.5"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                        color: 'hsl(220,16%,50%)', background: 'hsl(42,28%,95%)',
                        borderRadius: '3px', border: '1px solid rgba(30,60,130,0.10)', cursor: 'pointer',
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : hasMeeting ? (
              <motion.div
                key="meeting"
                {...tile(3)}
                className="relative overflow-hidden cursor-pointer"
                onClick={startEdit}
                style={{
                  backgroundColor: 'hsl(218,68%,26%)',
                  backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(218,68%,26%) 0%, hsl(220,65%,32%) 100%)`,
                  backgroundSize: '32px 32px, 100% 100%',
                  border: '1px solid rgba(15,45,115,0.50)', borderRadius: '4px',
                  boxShadow: '0 8px 28px rgba(15,30,80,0.25), 0 1px 0 rgba(255,255,255,0.06) inset',
                  padding: '20px 22px 18px',
                }}
              >
                <div className="absolute top-3 right-3">
                  <Pencil className="w-3.5 h-3.5" style={{ color: 'rgba(200,190,170,0.25)' }} />
                </div>

                {countdown && !countdown.passed && (
                  <div className="relative z-10 flex items-end justify-center gap-4 mb-4">
                    <CountdownUnit value={countdown.days} label="days" large />
                    <div style={{ width: 1, height: 36, background: 'rgba(200,185,160,0.15)', marginBottom: 6 }} />
                    <CountdownUnit value={countdown.hours} label="hours" />
                    <div style={{ width: 1, height: 36, background: 'rgba(200,185,160,0.15)', marginBottom: 6 }} />
                    <CountdownUnit value={countdown.minutes} label="min" />
                    {meeting.time && (
                      <>
                        <div style={{ width: 1, height: 36, background: 'rgba(200,185,160,0.15)', marginBottom: 6 }} />
                        <CountdownUnit value={countdown.seconds} label="sec" />
                      </>
                    )}
                  </div>
                )}

                {countdown && countdown.passed && (
                  <div className="relative z-10 text-center mb-3">
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.2rem', color: 'rgba(240,235,225,0.85)' }}>
                      Today is the day! ✦
                    </p>
                  </div>
                )}

                <div className="relative z-10" style={{ width: '100%', height: 1, background: 'rgba(200,185,160,0.12)', marginBottom: '12px' }} />

                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3 h-3 shrink-0" style={{ color: 'rgba(200,185,160,0.45)' }} />
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '0.95rem', color: 'rgba(240,235,225,0.88)' }}>
                        {format(new Date(meeting.date + "T00:00:00"), "EEEE, MMMM d")}
                        {meeting.time && (
                          <span style={{ color: 'rgba(200,185,160,0.60)', fontWeight: 400, marginLeft: '6px' }}>
                            · {meeting.time}
                          </span>
                        )}
                      </span>
                    </div>
                    {meeting.location && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3 h-3 shrink-0" style={{ color: 'rgba(200,185,160,0.45)' }} />
                        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '0.88rem', color: 'rgba(222,212,194,0.72)' }}>
                          {meeting.location}
                        </span>
                      </div>
                    )}
                    {meeting.note && (
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.82rem', color: 'rgba(195,182,160,0.45)', marginTop: '2px', marginLeft: '18px' }}>
                        {meeting.note}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                {...tile(3)}
                className="cursor-pointer"
                onClick={startEdit}
                style={{
                  background: 'hsl(38,30%,99%)', border: '1.5px dashed rgba(30,60,130,0.15)', borderRadius: '4px',
                  padding: '22px 20px', textAlign: 'center',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'hsl(218,70%,28%)', boxShadow: '0 2px 8px rgba(20,40,100,0.20)' }}>
                    <Calendar className="w-4 h-4" style={{ color: 'hsl(42,30%,96%)' }} />
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.05rem', color: 'hsl(222,45%,16%)' }}>
                    When do we meet next?
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'hsl(220,16%,56%)' }}>
                    Tap to set a date
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ ON THIS DAY — rose card ═══ */}
          {(() => {
            const anniversaries = getOnThisDayMemories();
            if (anniversaries.length === 0) return null;
            return (
              <>
                <div className="flex items-center gap-3 mt-2 mb-1">
                  <div style={{ width: 16, height: 1, background: 'rgba(130,25,55,0.20)' }} />
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(338,35%,50%)' }}>
                    On This Day
                  </p>
                  <div style={{ flex: 1, height: 1, background: 'rgba(130,25,55,0.10)' }} />
                </div>
                {anniversaries.map((memory, idx) => (
                  <Link key={memory.id} href={`/saudade/${memory.id}`}>
                    <motion.div
                      {...tile(5 + idx)}
                      className="relative overflow-hidden cursor-pointer"
                      style={{
                        backgroundColor: 'hsl(338,45%,38%)',
                        backgroundImage: `${rosePattern}, linear-gradient(155deg, hsl(338,42%,34%) 0%, hsl(340,48%,42%) 100%)`,
                        backgroundSize: '60px 60px, 100% 100%',
                        border: '1px solid rgba(120,20,50,0.50)', borderRadius: '4px',
                        boxShadow: '0 8px 28px rgba(80,15,35,0.25), 0 1px 0 rgba(255,255,255,0.06) inset',
                        padding: 0,
                      }}
                    >
                      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l" style={{ borderColor: 'rgba(255,252,245,0.14)' }} />
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r" style={{ borderColor: 'rgba(255,252,245,0.14)' }} />
                      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l" style={{ borderColor: 'rgba(255,252,245,0.14)' }} />
                      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r" style={{ borderColor: 'rgba(255,252,245,0.14)' }} />

                      {memory.imageUrl ? (
                        <div className="relative" style={{ height: 120 }}>
                          <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover"
                            style={{ filter: 'saturate(0.75) brightness(0.80)' }} />
                          <div className="absolute inset-0" style={{
                            background: 'linear-gradient(to top, hsl(338,45%,38%) 0%, rgba(130,25,55,0.40) 50%, transparent 100%)',
                          }} />
                        </div>
                      ) : null}

                      <div className="relative z-10" style={{ padding: memory.imageUrl ? '0 20px 18px' : '20px' }}>
                        {!memory.imageUrl && (
                          <div className="mb-3">
                            <Clock className="w-5 h-5" style={{ color: 'rgba(255,252,245,0.25)' }} />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{
                            fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700,
                            letterSpacing: '0.14em', textTransform: 'uppercase',
                            background: 'rgba(255,252,245,0.12)', border: '1px solid rgba(255,252,245,0.18)',
                            borderRadius: '2px', padding: '2px 8px',
                            color: 'rgba(255,220,200,0.70)',
                          }}>
                            {memory.yearsAgo} {memory.yearsAgo === 1 ? 'year' : 'years'} ago
                          </span>
                        </div>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontWeight: 600, fontSize: '1.25rem', letterSpacing: '0.01em',
                          lineHeight: 1.25, color: 'rgba(255,248,240,0.95)',
                        }}>
                          {memory.title}
                        </h3>
                        {memory.location && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <MapPin className="w-2.5 h-2.5" style={{ color: 'rgba(255,220,200,0.45)' }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'rgba(255,220,200,0.50)' }}>
                              {memory.location}
                            </span>
                          </div>
                        )}
                        {memory.preview && (
                          <p className="line-clamp-2" style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontStyle: 'italic', fontWeight: 400, fontSize: '0.85rem',
                            lineHeight: 1.55, color: 'rgba(255,230,215,0.55)', marginTop: '8px',
                          }}>
                            {memory.preview}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </>
            );
          })()}

        </div>
      </div>
    </AppShell>
  );
}
