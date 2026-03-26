import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockDashboard } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon, CloudSun, MapPin, Calendar, Clock, Pencil, X, Check } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";

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

interface NextMeeting {
  date: string;
  location: string;
  note: string;
}

function loadMeeting(): NextMeeting {
  try {
    const raw = localStorage.getItem("oikos-next-meeting");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { date: "", location: "", note: "" };
}

function saveMeeting(m: NextMeeting) {
  localStorage.setItem("oikos-next-meeting", JSON.stringify(m));
}

function useCountdown(targetDate: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!targetDate) return;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!targetDate) return null;
  const target = new Date(targetDate + "T00:00:00");
  if (isNaN(target.getTime())) return null;
  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const minutes = differenceInMinutes(target, now) % 60;
  if (days < 0) return { days: 0, hours: 0, minutes: 0, passed: true };
  return { days, hours: Math.max(0, hours), minutes: Math.max(0, minutes), passed: false };
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
  const countdown = useCountdown(meeting.date);

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
    const empty = { date: "", location: "", note: "" };
    setMeeting(empty);
    saveMeeting(empty);
    setEditing(false);
  }, []);

  const hasMeeting = !!meeting.date;

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

          {/* ═══ COMPACT TOP: Greeting + Days Counter side by side ═══ */}
          <motion.div
            {...tile(0)}
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(220,70%,26%)',
              backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)`,
              backgroundSize: '32px 32px, 100% 100%',
              border: '1px solid rgba(15,45,115,0.50)', borderRadius: '4px',
              boxShadow: '0 10px 36px rgba(15,30,80,0.28), 0 1px 0 rgba(255,255,255,0.08) inset',
              padding: '20px 22px 18px',
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ width: 260, height: 100, background: 'radial-gradient(ellipse at top, rgba(255,252,245,0.06) 0%, transparent 70%)' }} />
            <div className="absolute top-0 left-0 w-8 h-8 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.08)' }} />

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0"
                style={{ border: '2px solid rgba(200,190,170,0.25)', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <GreetingIcon className="w-2.5 h-2.5" style={{ color: 'rgba(200,185,160,0.50)' }} />
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(200,185,160,0.45)' }}>
                    {greeting.text}
                  </p>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.55rem', letterSpacing: '0.02em', lineHeight: 1.15, color: 'hsl(42, 32%, 97%)', marginTop: '1px' }}>
                  Sofia.
                </p>
              </div>
            </div>

            <div className="relative z-10 mx-auto" style={{ width: '100%', height: 1, background: 'rgba(200,185,160,0.12)', marginTop: '16px', marginBottom: '14px' }} />

            <div className="relative z-10 flex items-end justify-between">
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(200,185,160,0.35)', marginBottom: '6px' }}>
                  ✦ &nbsp;Time Together&nbsp; ✦
                </p>
                <div className="flex items-baseline" style={{ gap: '6px' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '4.2rem', letterSpacing: '-0.04em', lineHeight: 0.88, color: 'hsl(42, 32%, 97%)', textShadow: '0 3px 20px rgba(10,25,70,0.35)' }}>
                    {data.daysTogether}
                  </span>
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.1rem', color: 'rgba(200,188,165,0.38)' }}>days</span>
                </div>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.7rem', letterSpacing: '0.03em', color: 'rgba(195,182,160,0.28)', paddingBottom: '4px', textAlign: 'right', maxWidth: '45%' }}>
                {years > 0 && `${years}y`}{years > 0 && months > 0 && ' '}{months > 0 && `${months}m`}{(years > 0 || months > 0) && remainDays > 0 && ' '}{remainDays > 0 && `${remainDays}d`}
                <br />Daniel & Sofia
              </p>
            </div>
          </motion.div>

          {/* ═══ QUOTE — compact ═══ */}
          <motion.div
            {...tile(1)}
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(222,42%,13%)',
              backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`,
              backgroundSize: '32px 32px, 100% 100%',
              border: '1px solid rgba(15,40,110,0.55)', borderRadius: '4px',
              boxShadow: '0 10px 30px rgba(10,20,60,0.30)', padding: '18px 20px 16px',
            }}
          >
            <div className="absolute top-4 right-5 opacity-[0.06] pointer-events-none">
              <Sparkles className="w-6 h-6" style={{ color: 'hsl(42,50%,80%)' }} />
            </div>
            <div className="flex gap-2">
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.8rem', color: 'rgba(200,185,160,0.10)', lineHeight: 1, shrink: 0 }}>"</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.95rem', letterSpacing: '0.01em', lineHeight: 1.65, color: 'rgba(222,212,194,0.82)', position: 'relative', zIndex: 1, paddingTop: '4px' }}>
                {data.randomPhrase}
              </p>
            </div>
          </motion.div>

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
                  <div>
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
                {...tile(2)}
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
                  <div className="relative z-10 flex items-end justify-center gap-3 mb-3">
                    <div className="text-center">
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '3rem', lineHeight: 0.9, color: 'hsl(42,32%,97%)', textShadow: '0 3px 16px rgba(10,25,70,0.30)' }}>
                        {countdown.days}
                      </span>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(200,185,160,0.40)', marginTop: '4px' }}>days</p>
                    </div>
                    <div style={{ width: 1, height: 32, background: 'rgba(200,185,160,0.15)', marginBottom: 8 }} />
                    <div className="text-center">
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '2rem', lineHeight: 0.9, color: 'rgba(240,235,225,0.80)' }}>
                        {countdown.hours}
                      </span>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(200,185,160,0.40)', marginTop: '4px' }}>hrs</p>
                    </div>
                    <div style={{ width: 1, height: 32, background: 'rgba(200,185,160,0.15)', marginBottom: 8 }} />
                    <div className="text-center">
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '2rem', lineHeight: 0.9, color: 'rgba(240,235,225,0.80)' }}>
                        {countdown.minutes}
                      </span>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(200,185,160,0.40)', marginTop: '4px' }}>min</p>
                    </div>
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
                {...tile(2)}
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

        </div>
      </div>
    </AppShell>
  );
}
