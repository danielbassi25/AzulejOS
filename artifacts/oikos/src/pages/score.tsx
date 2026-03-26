import { useState, useMemo, useCallback, useEffect } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Plus, Minus, Pencil, Trash2, X, Save, Award, Crown, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import type { Milestone, Activity, SeasonResult } from "@/types";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getCurrentMonthKey(): string {
  const d = new Date();
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function safeParseInt(val: string | null): number {
  const n = parseInt(val || "0", 10);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function getScoreState() {
  try {
    const storedSeason = localStorage.getItem("oikos-score-season");
    const currentMonth = getCurrentMonthKey();
    return {
      daniel: safeParseInt(localStorage.getItem("oikos-score-daniel")),
      sofia: safeParseInt(localStorage.getItem("oikos-score-sofia")),
      currentSeason: storedSeason || currentMonth,
    };
  } catch {
    return { daniel: 0, sofia: 0, currentSeason: getCurrentMonthKey() };
  }
}

function getMilestones(): Milestone[] {
  try {
    return JSON.parse(localStorage.getItem("oikos-score-milestones") || "[]");
  } catch { return []; }
}

function saveMilestones(m: Milestone[]) {
  localStorage.setItem("oikos-score-milestones", JSON.stringify(m));
}

function getActivities(): Activity[] {
  try {
    return JSON.parse(localStorage.getItem("oikos-score-activities") || "[]");
  } catch { return []; }
}

function saveActivity(a: Activity) {
  const list = getActivities();
  list.unshift(a);
  if (list.length > 50) list.length = 50;
  localStorage.setItem("oikos-score-activities", JSON.stringify(list));
}

function getSeasons(): SeasonResult[] {
  try {
    return JSON.parse(localStorage.getItem("oikos-score-seasons") || "[]");
  } catch { return []; }
}

function saveSeasons(s: SeasonResult[]) {
  localStorage.setItem("oikos-score-seasons", JSON.stringify(s));
}

const azulejoPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.10'%3E%3Ccircle cx='30' cy='30' r='12' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='6' stroke-width='0.4'/%3E%3Cpath d='M30 0v18M30 42v18M0 30h18M42 30h60' stroke-width='0.4'/%3E%3Cpath d='M30 18l-12 12 12 12 12-12z' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`;

const EASE = [0.22, 1, 0.36, 1] as const;

const inputStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '1.05rem', fontWeight: 400 as const,
  color: 'hsl(222,38%,22%)', background: 'hsl(40,26%,95%)',
  border: '1px solid rgba(30,60,130,0.10)', borderRadius: '4px',
  padding: '10px 14px', outline: 'none', width: '100%',
};

const labelStyle = {
  fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700 as const,
  letterSpacing: '0.14em', textTransform: 'uppercase' as const,
  color: 'hsl(218,68%,28%)', marginBottom: '6px', display: 'block',
};

export default function ScorePage() {
  const [scores, setScores] = useState(getScoreState);
  const [milestones, setMilestones] = useState<Milestone[]>(getMilestones);
  const [activities, setActivities] = useState<Activity[]>(getActivities);
  const [seasons, setSeasons] = useState<SeasonResult[]>(getSeasons);

  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({ title: '', reward: '', targetPoints: '5' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEndSeason, setShowEndSeason] = useState(false);
  const [showSeasonHistory, setShowSeasonHistory] = useState(false);
  const [showRolloverPrompt, setShowRolloverPrompt] = useState(false);

  useEffect(() => {
    const current = getCurrentMonthKey();
    if (scores.currentSeason && scores.currentSeason !== current) {
      setShowRolloverPrompt(true);
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 110, spread: 68, origin: { y: 0.50 },
      colors: ['#1e3c82', '#2e5cbf', '#4878d4', '#f5f0e8', '#d4bc8a', '#FFD700'],
    });
  }, []);

  const addPoint = useCallback((user: 'daniel' | 'sofia', delta: number) => {
    setScores(prev => {
      const newVal = Math.max(0, prev[user] + delta);
      if (newVal === prev[user]) return prev;
      localStorage.setItem(`oikos-score-${user}`, String(newVal));

      const actionText = delta > 0 ? 'earned a point' : 'lost a point';
      saveActivity({
        id: `act-${Date.now()}`,
        user: user === 'daniel' ? 'Daniel' : 'Sofia',
        action: actionText,
        points: delta,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      });
      setActivities(getActivities());

      return { ...prev, [user]: newVal };
    });
  }, []);

  const danielWins = useMemo(() => seasons.filter(s => s.winner === 'Daniel').length, [seasons]);
  const sofiaWins = useMemo(() => seasons.filter(s => s.winner === 'Sofia').length, [seasons]);

  const totalPoints = scores.daniel + scores.sofia;
  const danielPercent = totalPoints > 0 ? (scores.daniel / totalPoints) * 100 : 50;
  const sofiaPercent = totalPoints > 0 ? (scores.sofia / totalPoints) * 100 : 50;

  const leader = scores.daniel > scores.sofia ? 'Daniel' : scores.sofia > scores.daniel ? 'Sofia' : null;

  const openAddMilestone = () => {
    setMilestoneForm({ title: '', reward: '', targetPoints: '5' });
    setShowAddMilestone(true);
    setEditingMilestone(null);
  };

  const openEditMilestone = (m: Milestone) => {
    setEditingMilestone(m);
    setMilestoneForm({ title: m.title, reward: m.reward, targetPoints: String(m.targetPoints) });
    setShowAddMilestone(true);
    setShowDeleteConfirm(false);
  };

  const saveMilestoneForm = () => {
    if (!milestoneForm.title.trim()) return;
    if (editingMilestone) {
      const updated = milestones.map(m => m.id === editingMilestone.id ? {
        ...m, title: milestoneForm.title.trim(), reward: milestoneForm.reward.trim(),
        targetPoints: parseInt(milestoneForm.targetPoints, 10) || 5,
      } : m);
      setMilestones(updated);
      saveMilestones(updated);
    } else {
      const newM: Milestone = {
        id: `ms-${Date.now()}`, title: milestoneForm.title.trim(), reward: milestoneForm.reward.trim(),
        targetPoints: parseInt(milestoneForm.targetPoints, 10) || 5, completed: false, winner: null,
      };
      const updated = [...milestones, newM];
      setMilestones(updated);
      saveMilestones(updated);
    }
    setShowAddMilestone(false);
    setEditingMilestone(null);
  };

  const deleteMilestone = () => {
    if (!editingMilestone) return;
    const updated = milestones.filter(m => m.id !== editingMilestone.id);
    setMilestones(updated);
    saveMilestones(updated);
    setShowAddMilestone(false);
    setEditingMilestone(null);
    setShowDeleteConfirm(false);
  };

  const completeMilestone = (id: string, winner: string) => {
    const updated = milestones.map(m => m.id === id ? { ...m, completed: true, winner } : m);
    setMilestones(updated);
    saveMilestones(updated);
    triggerConfetti();
  };

  const endSeason = () => {
    const winner = scores.daniel > scores.sofia ? 'Daniel' : scores.sofia > scores.daniel ? 'Sofia' : 'Tie';
    const result: SeasonResult = {
      id: `season-${Date.now()}`,
      month: scores.currentSeason.split(' ')[0],
      year: parseInt(scores.currentSeason.split(' ')[1], 10) || new Date().getFullYear(),
      danielPoints: scores.daniel, sofiaPoints: scores.sofia, winner,
    };

    const updated = [result, ...seasons];
    setSeasons(updated);
    saveSeasons(updated);

    localStorage.setItem("oikos-score-daniel", "0");
    localStorage.setItem("oikos-score-sofia", "0");
    const newSeason = getCurrentMonthKey();
    localStorage.setItem("oikos-score-season", newSeason);
    setScores({ daniel: 0, sofia: 0, currentSeason: newSeason });

    setShowEndSeason(false);
    triggerConfetti();
  };

  return (
    <AppShell>
      <SectionHeader title="Score" subtitle="A friendly competition"
        action={
          <motion.button onClick={triggerConfetti} whileTap={{ scale: 0.93 }} className="flex items-center gap-2"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.18)', borderRadius: '3px', color: 'rgba(215,205,185,0.70)', padding: '8px 14px' }}>
            <Trophy className="w-3.5 h-3.5" /> Celebrate
          </motion.button>
        }
      />

      <div className="px-4 pt-4 pb-24" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Season banner */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE as unknown as number[] }}
          className="relative overflow-hidden px-5 py-4"
          style={{
            backgroundColor: 'hsl(222,42%,13%)',
            backgroundImage: `${azulejoPattern}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`,
            backgroundSize: '60px 60px, 100% 100%',
            border: '1px solid rgba(15,40,110,0.52)', borderRadius: '4px',
            boxShadow: '0 8px 30px rgba(10,20,60,0.28)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(180,165,140,0.45)' }}>
                Current Season
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.35rem', color: 'hsl(42,32%,94%)', marginTop: '4px' }}>
                {scores.currentSeason}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setShowSeasonHistory(!showSeasonHistory)}
                whileTap={{ scale: 0.92 }}
                className="flex items-center gap-1.5"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(255,252,245,0.16)', borderRadius: '3px',
                  color: 'rgba(215,205,185,0.55)', padding: '6px 10px',
                }}
              >
                <Crown className="w-3 h-3" />
                History
              </motion.button>
              <motion.button
                onClick={() => setShowEndSeason(true)}
                whileTap={{ scale: 0.92 }}
                className="flex items-center gap-1.5"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(255,252,245,0.16)', borderRadius: '3px',
                  color: 'rgba(215,205,185,0.55)', padding: '6px 10px',
                }}
              >
                <RotateCcw className="w-3 h-3" />
                End
              </motion.button>
            </div>
          </div>

          {/* Trophy counts */}
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3 h-3" style={{ color: '#FFD700' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'rgba(200,190,170,0.50)' }}>
                Daniel: {danielWins} {danielWins === 1 ? 'trophy' : 'trophies'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3 h-3" style={{ color: '#FFD700' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'rgba(200,190,170,0.50)' }}>
                Sofia: {sofiaWins} {sofiaWins === 1 ? 'trophy' : 'trophies'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Scoreboard with +/- buttons */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease: EASE as unknown as number[] }}
          className="grid grid-cols-2 gap-3">
          {/* Daniel */}
          <div className="p-5 flex flex-col items-center text-center"
            style={{ background: 'hsl(38,26%,97%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 4px 14px rgba(20,40,100,0.06)' }}>
            <div className="relative" style={{ marginBottom: '10px' }}>
              <div className="w-12 h-12 rounded-full overflow-hidden"
                style={{ border: '2px solid hsl(218,68%,30%)', boxShadow: '0 3px 12px rgba(20,40,100,0.18)' }}>
                <img src={`${import.meta.env.BASE_URL}images/avatar-daniel.png`} alt="Daniel" className="w-full h-full object-cover" />
              </div>
              {leader === 'Daniel' && (
                <motion.div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center"
                  style={{ background: '#FFD700', borderRadius: '2px', boxShadow: '0 2px 6px rgba(180,130,0,0.35)' }}
                  animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>
                  <Crown className="w-3 h-3" style={{ color: 'hsl(35,30%,22%)' }} />
                </motion.div>
              )}
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(220,20%,54%)', marginBottom: '6px' }}>Daniel</p>
            <AnimatePresence mode="wait">
              <motion.p key={scores.daniel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '2.8rem', letterSpacing: '-0.04em', lineHeight: 1, color: 'hsl(218,70%,28%)' }}>
                {scores.daniel}
              </motion.p>
            </AnimatePresence>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(220,16%,64%)', marginTop: '4px', marginBottom: '10px' }}>points</p>
            <div className="flex items-center gap-2">
              <motion.button onClick={() => addPoint('daniel', -1)} whileTap={{ scale: 0.88 }}
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: '4px', background: 'hsl(40,22%,93%)', border: '1px solid rgba(30,60,130,0.08)' }}>
                <Minus className="w-4 h-4" style={{ color: 'hsl(220,18%,50%)' }} />
              </motion.button>
              <motion.button onClick={() => addPoint('daniel', 1)} whileTap={{ scale: 0.88 }}
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: '4px', background: 'hsl(218,70%,28%)', border: '1px solid rgba(15,45,115,0.42)', boxShadow: '0 2px 8px rgba(12,25,72,0.20)' }}>
                <Plus className="w-4 h-4" style={{ color: 'hsl(42,30%,94%)' }} />
              </motion.button>
            </div>
          </div>

          {/* Sofia */}
          <div className="relative overflow-hidden p-5 flex flex-col items-center text-center"
            style={{ background: 'linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)', border: '1px solid rgba(15,45,115,0.50)', borderRadius: '4px', boxShadow: '3px 5px 18px rgba(12,25,72,0.26)' }}>
            <div className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{ height: 60, background: 'linear-gradient(to bottom, rgba(255,252,245,0.05) 0%, transparent 100%)' }} />
            <div className="relative" style={{ marginBottom: '10px' }}>
              <div className="w-12 h-12 rounded-full overflow-hidden"
                style={{ border: '2px solid rgba(220,210,192,0.42)', boxShadow: '0 3px 14px rgba(10,20,60,0.30)' }}>
                <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
              </div>
              {leader === 'Sofia' && (
                <motion.div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center"
                  style={{ background: '#FFD700', borderRadius: '2px', boxShadow: '0 2px 6px rgba(180,130,0,0.35)' }}
                  animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>
                  <Crown className="w-3 h-3" style={{ color: 'hsl(35,30%,22%)' }} />
                </motion.div>
              )}
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(195,182,160,0.55)', marginBottom: '6px' }}>Sofia</p>
            <AnimatePresence mode="wait">
              <motion.p key={scores.sofia} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '2.8rem', letterSpacing: '-0.04em', lineHeight: 1, color: 'hsl(42,32%,96%)' }}>
                {scores.sofia}
              </motion.p>
            </AnimatePresence>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(175,162,142,0.38)', marginTop: '4px', marginBottom: '10px' }}>points</p>
            <div className="flex items-center gap-2">
              <motion.button onClick={() => addPoint('sofia', -1)} whileTap={{ scale: 0.88 }}
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: '4px', background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(180,200,255,0.16)' }}>
                <Minus className="w-4 h-4" style={{ color: 'rgba(200,215,255,0.55)' }} />
              </motion.button>
              <motion.button onClick={() => addPoint('sofia', 1)} whileTap={{ scale: 0.88 }}
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: '4px', background: 'rgba(255,252,245,0.14)', border: '1px solid rgba(180,200,255,0.22)', boxShadow: '0 2px 8px rgba(10,20,60,0.18)' }}>
                <Plus className="w-4 h-4" style={{ color: 'hsl(42,30%,94%)' }} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        {totalPoints > 0 && (
          <div className="flex items-center gap-3 px-5 py-3.5"
            style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.05)' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(218,55%,38%)', minWidth: 30 }}>{danielPercent.toFixed(0)}%</span>
            <div className="flex-1 flex overflow-hidden" style={{ height: 8, borderRadius: '2px', background: 'hsl(40,18%,90%)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${danielPercent}%` }}
                transition={{ duration: 0.8, ease: [0.34, 1.1, 0.64, 1] }}
                style={{ height: '100%', background: 'hsl(218,65%,38%)', borderRadius: '2px 0 0 2px' }} />
              <motion.div initial={{ width: 0 }} animate={{ width: `${sofiaPercent}%` }}
                transition={{ duration: 0.8, ease: [0.34, 1.1, 0.64, 1] }}
                style={{ height: '100%', background: 'hsl(38,48%,64%)', borderRadius: '0 2px 2px 0' }} />
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(38,42%,48%)', minWidth: 30, textAlign: 'right' }}>{sofiaPercent.toFixed(0)}%</span>
          </div>
        )}

        {/* Season History (collapsible) */}
        <AnimatePresence>
          {showSeasonHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3" style={{ paddingTop: '8px', paddingBottom: '10px' }}>
                <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>
                  Past Seasons
                </p>
                <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
              </div>

              {seasons.length === 0 ? (
                <div className="px-5 py-6 text-center" style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(30,60,130,0.30)' }}>
                    No seasons ended yet. End the current season to start tracking.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {seasons.map((season, idx) => (
                    <motion.div key={season.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="flex items-center gap-4 px-5 py-4"
                      style={{
                        background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px',
                        boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 8px rgba(20,40,100,0.05)',
                      }}
                    >
                      <div className="w-9 h-9 flex items-center justify-center shrink-0"
                        style={{ background: '#FFD700', borderRadius: '4px', boxShadow: '0 2px 8px rgba(180,130,0,0.25)' }}>
                        <Trophy className="w-4 h-4" style={{ color: 'hsl(35,30%,22%)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.02rem', color: 'hsl(222,38%,18%)' }}>
                          {season.month} {season.year}
                        </p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(220,16%,58%)', marginTop: '3px' }}>
                          {season.winner === 'Tie' ? 'Tied!' : `Won by ${season.winner}`} &middot; {season.danielPoints}-{season.sofiaPoints}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center justify-center w-8 h-8"
                        style={{
                          borderRadius: '50%', fontSize: '14px',
                          background: season.winner === 'Daniel' ? 'hsl(218,70%,28%)' : season.winner === 'Sofia' ? 'hsl(38,48%,64%)' : 'hsl(40,22%,90%)',
                        }}>
                        <span style={{ fontSize: '11px' }}>
                          {season.winner === 'Daniel' ? 'D' : season.winner === 'Sofia' ? 'S' : '='}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Milestones */}
        <div>
          <div className="flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '10px' }}>
            <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>Milestones</p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
            <motion.button onClick={openAddMilestone} whileTap={{ scale: 0.90 }}
              className="flex items-center gap-1"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(218,60%,36%)', background: 'rgba(30,60,130,0.06)', border: '1px solid rgba(30,60,130,0.10)', borderRadius: '3px', padding: '5px 10px' }}>
              <Plus className="w-3 h-3" /> Add
            </motion.button>
          </div>

          {milestones.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-5 py-6 text-center"
              style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}
            >
              <Award className="w-6 h-6 mx-auto mb-3" style={{ color: 'rgba(30,60,130,0.18)' }} />
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(30,60,130,0.30)' }}>
                Create your first milestone together
              </p>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {milestones.map((milestone, idx) => (
                <motion.div key={milestone.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + idx * 0.06, duration: 0.40 }}
                >
                  <div className="relative"
                    style={{
                      background: milestone.completed ? 'hsl(218,68%,27%)' : 'hsl(38,30%,99%)',
                      backgroundImage: milestone.completed ? azulejoPattern : 'none',
                      backgroundSize: '60px 60px',
                      border: milestone.completed ? '1px solid rgba(15,45,115,0.42)' : '1px solid rgba(30,60,130,0.08)',
                      borderRadius: '4px',
                      boxShadow: milestone.completed ? '1px 2px 10px rgba(12,25,72,0.20)' : '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 8px rgba(20,40,100,0.05)',
                      padding: '16px 18px',
                    }}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          width: 38, height: 38, borderRadius: '4px',
                          background: milestone.completed ? 'rgba(255,215,0,0.18)' : 'hsl(40,22%,92%)',
                          border: milestone.completed ? '1px solid rgba(255,215,0,0.30)' : '1px solid rgba(30,60,130,0.08)',
                        }}>
                        {milestone.completed ? (
                          <Trophy className="w-4.5 h-4.5" style={{ color: '#FFD700' }} />
                        ) : (
                          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: 'hsl(222,38%,28%)' }}>
                            {milestone.targetPoints}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '1.05rem', letterSpacing: '0.01em',
                          color: milestone.completed ? 'hsl(42,30%,93%)' : 'hsl(222,38%,18%)',
                        }}>
                          {milestone.title}
                        </p>
                        {milestone.reward && (
                          <p style={{
                            fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                            color: milestone.completed ? 'rgba(255,215,0,0.55)' : 'hsl(218,50%,42%)',
                            marginTop: '4px',
                          }}>
                            Reward: {milestone.reward}
                          </p>
                        )}
                        {milestone.completed && milestone.winner && (
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'rgba(195,182,160,0.50)', marginTop: '3px' }}>
                            Won by {milestone.winner}
                          </p>
                        )}
                        {!milestone.completed && (
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'hsl(220,16%,60%)', marginTop: '3px' }}>
                            Target: {milestone.targetPoints} pts
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {!milestone.completed && (
                          <>
                            <motion.button onClick={() => completeMilestone(milestone.id, 'Daniel')} whileTap={{ scale: 0.88 }}
                              className="flex items-center justify-center"
                              style={{ width: 28, height: 28, borderRadius: '3px', background: 'hsl(218,70%,28%)', border: '1px solid rgba(15,45,115,0.42)' }}>
                              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, color: 'hsl(42,30%,94%)' }}>D</span>
                            </motion.button>
                            <motion.button onClick={() => completeMilestone(milestone.id, 'Sofia')} whileTap={{ scale: 0.88 }}
                              className="flex items-center justify-center"
                              style={{ width: 28, height: 28, borderRadius: '3px', background: 'hsl(38,48%,64%)', border: '1px solid rgba(180,140,60,0.30)' }}>
                              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, color: 'hsl(35,30%,22%)' }}>S</span>
                            </motion.button>
                          </>
                        )}
                        <motion.button onClick={() => openEditMilestone(milestone)} whileTap={{ scale: 0.88 }}
                          className="flex items-center justify-center"
                          style={{
                            width: 28, height: 28, borderRadius: '3px',
                            background: milestone.completed ? 'rgba(255,252,245,0.10)' : 'hsl(40,22%,93%)',
                            border: milestone.completed ? '1px solid rgba(180,200,255,0.16)' : '1px solid rgba(30,60,130,0.08)',
                          }}>
                          <Pencil className="w-3 h-3" style={{ color: milestone.completed ? 'rgba(200,215,255,0.55)' : 'hsl(220,18%,50%)' }} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {activities.length > 0 && (
          <div>
            <div className="flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '10px' }}>
              <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>Recent Activity</p>
              <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
            </div>
            <div style={{ border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 10px rgba(20,40,100,0.05)' }}>
              {activities.slice(0, 10).map((activity, idx) => (
                <motion.div key={activity.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + idx * 0.04 }}
                  className="flex items-center gap-3 px-5 py-3"
                  style={{ background: idx % 2 === 0 ? 'hsl(38,30%,99%)' : 'hsl(40,18%,97%)', borderBottom: idx < Math.min(activities.length, 10) - 1 ? '1px solid rgba(30,60,130,0.06)' : 'none' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: activity.user === 'Sofia' ? 'hsl(38,48%,58%)' : 'hsl(218,60%,42%)' }} />
                  <div className="flex-1">
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: '0.95rem', color: 'hsl(222,32%,24%)' }}>
                      <span style={{ fontWeight: 600 }}>{activity.user}</span>{' '}
                      <span style={{ color: 'hsl(220,15%,53%)' }}>{activity.action}</span>
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', color: 'hsl(220,13%,63%)', marginTop: '1px' }}>{activity.date}</p>
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700,
                    background: activity.points > 0 ? 'hsl(218,70%,28%)' : 'hsl(0,45%,50%)',
                    color: 'hsl(42,30%,94%)', borderRadius: '2px', padding: '3px 7px',
                  }}>
                    {activity.points > 0 ? '+' : ''}{activity.points}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4 text-center">
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.88rem', color: 'rgba(30,60,130,0.28)' }}>
            It's not about winning, it's about playing together.
          </p>
        </motion.div>
      </div>

      {/* Add/Edit Milestone Modal */}
      <AnimatePresence>
        {showAddMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(10,18,42,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={() => { setShowAddMilestone(false); setEditingMilestone(null); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="w-full max-w-md"
              style={{ background: 'hsl(42,28%,97%)', borderRadius: '12px 12px 0 0', maxHeight: '85vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3"
                style={{ borderBottom: '1px solid rgba(30,60,130,0.08)' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.2rem', color: 'hsl(222,45%,16%)' }}>
                  {editingMilestone ? 'Edit Milestone' : 'New Milestone'}
                </h3>
                <button onClick={() => { setShowAddMilestone(false); setEditingMilestone(null); }}
                  className="flex items-center justify-center"
                  style={{ width: 28, height: 28, borderRadius: '4px', background: 'rgba(30,60,130,0.06)' }}>
                  <X className="w-3.5 h-3.5" style={{ color: 'hsl(220,18%,50%)' }} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {showDeleteConfirm ? (
                  <motion.div key="delete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-5 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center" style={{ background: 'rgba(180,40,40,0.10)', borderRadius: '50%' }}>
                      <Trash2 className="w-5 h-5" style={{ color: 'hsl(0,50%,42%)' }} />
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'hsl(222,38%,22%)', textAlign: 'center' }}>
                      Delete this milestone?
                    </p>
                    <div className="flex gap-3 w-full mt-2">
                      <motion.button onClick={() => setShowDeleteConfirm(false)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                        Cancel
                      </motion.button>
                      <motion.button onClick={deleteMilestone} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(0,50%,42%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px' }}>
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-5 flex flex-col gap-4">
                    <div>
                      <label style={labelStyle}>Milestone Name</label>
                      <input value={milestoneForm.title} onChange={e => setMilestoneForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="First to cook dinner 5 times" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Reward</label>
                      <input value={milestoneForm.reward} onChange={e => setMilestoneForm(p => ({ ...p, reward: e.target.value }))}
                        placeholder="Winner picks the movie" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Target Points</label>
                      <div className="flex items-center gap-2">
                        {[3, 5, 7, 10, 15, 20].map(n => (
                          <button key={n} onClick={() => setMilestoneForm(p => ({ ...p, targetPoints: String(n) }))}
                            className="flex-1 py-2.5 transition-all duration-200"
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem', fontWeight: 600,
                              background: milestoneForm.targetPoints === String(n) ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                              color: milestoneForm.targetPoints === String(n) ? 'hsl(42,30%,96%)' : 'hsl(222,30%,30%)',
                              border: milestoneForm.targetPoints === String(n) ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                              borderRadius: '4px',
                            }}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                      {editingMilestone && (
                        <motion.button onClick={() => setShowDeleteConfirm(true)} whileTap={{ scale: 0.97 }}
                          className="flex items-center justify-center py-3 px-4"
                          style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, background: 'rgba(180,40,40,0.08)', color: 'hsl(0,50%,42%)', border: '1px solid rgba(180,40,40,0.15)', borderRadius: '4px' }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      )}
                      <motion.button onClick={saveMilestoneForm} whileTap={{ scale: 0.97 }}
                        className="flex-1 flex items-center justify-center gap-2 py-3"
                        style={{
                          fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                          background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px',
                          boxShadow: '2px 4px 12px rgba(12,25,72,0.20)', opacity: milestoneForm.title.trim() ? 1 : 0.5,
                        }}>
                        <Save className="w-3.5 h-3.5" />
                        {editingMilestone ? 'Save Changes' : 'Create Milestone'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Season Confirmation */}
      <AnimatePresence>
        {showEndSeason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(10,18,42,0.60)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowEndSeason(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="w-full max-w-sm p-6"
              style={{ background: 'hsl(42,28%,97%)', borderRadius: '8px', boxShadow: '0 20px 60px rgba(10,20,60,0.35)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center"
                  style={{ background: '#FFD700', borderRadius: '8px', boxShadow: '0 4px 16px rgba(180,130,0,0.30)' }}>
                  <Trophy className="w-7 h-7" style={{ color: 'hsl(35,30%,22%)' }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.3rem', color: 'hsl(222,45%,16%)' }}>
                  End {scores.currentSeason}?
                </h3>
                {totalPoints > 0 ? (
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: 'hsl(222,30%,28%)' }}>
                      {leader ? (
                        <><span style={{ fontWeight: 600 }}>{leader}</span> wins this season with {scores[leader.toLowerCase() as 'daniel' | 'sofia']} points!</>
                      ) : (
                        <>It's a tie at {scores.daniel} points each!</>
                      )}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'hsl(220,16%,56%)', marginTop: '8px' }}>
                      Points will reset to 0 for the new season.
                    </p>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'hsl(220,16%,56%)' }}>
                    No points scored yet. End the season anyway?
                  </p>
                )}
                <div className="flex gap-3 w-full mt-2">
                  <motion.button onClick={() => setShowEndSeason(false)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                    Cancel
                  </motion.button>
                  <motion.button onClick={endSeason} whileTap={{ scale: 0.97 }} className="flex-1 py-3 flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px', boxShadow: '2px 4px 12px rgba(12,25,72,0.20)' }}>
                    <Trophy className="w-3.5 h-3.5" />
                    End Season
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Month Rollover Prompt */}
      <AnimatePresence>
        {showRolloverPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(10,18,42,0.60)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowRolloverPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="w-full max-w-sm p-6"
              style={{ background: 'hsl(42,28%,97%)', borderRadius: '8px', boxShadow: '0 20px 60px rgba(10,20,60,0.35)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center"
                  style={{ background: 'hsl(218,70%,28%)', borderRadius: '8px', boxShadow: '0 4px 16px rgba(12,25,72,0.30)' }}>
                  <RotateCcw className="w-6 h-6" style={{ color: 'hsl(42,30%,94%)' }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.2rem', color: 'hsl(222,45%,16%)' }}>
                  New month!
                </h3>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: 'hsl(222,30%,28%)' }}>
                  <span style={{ fontWeight: 600 }}>{scores.currentSeason}</span> has ended. Ready to close it and start <span style={{ fontWeight: 600 }}>{getCurrentMonthKey()}</span>?
                </p>
                <div className="flex gap-3 w-full mt-2">
                  <motion.button onClick={() => setShowRolloverPrompt(false)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                    Later
                  </motion.button>
                  <motion.button
                    onClick={() => { setShowRolloverPrompt(false); endSeason(); }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px', boxShadow: '2px 4px 12px rgba(12,25,72,0.20)' }}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    Close Season
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
