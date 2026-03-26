import { useState, useMemo, useCallback, useEffect } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Plus, Minus, Pencil, Trash2, X, Save, Award, Crown, RotateCcw, Star } from "lucide-react";
import confetti from "canvas-confetti";
import type { Milestone, Activity, SeasonResult, ScoreSnapshot } from "@/types";

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
    return {
      daniel: safeParseInt(localStorage.getItem("oikos-score-daniel")),
      sofia: safeParseInt(localStorage.getItem("oikos-score-sofia")),
      currentSeason: storedSeason || getCurrentMonthKey(),
    };
  } catch {
    return { daniel: 0, sofia: 0, currentSeason: getCurrentMonthKey() };
  }
}

function getMilestones(): Milestone[] {
  try { return JSON.parse(localStorage.getItem("oikos-score-milestones") || "[]"); } catch { return []; }
}
function saveMilestonesLS(m: Milestone[]) { localStorage.setItem("oikos-score-milestones", JSON.stringify(m)); }

function getActivities(): Activity[] {
  try { return JSON.parse(localStorage.getItem("oikos-score-activities") || "[]"); } catch { return []; }
}
function saveActivitiesLS(list: Activity[]) { localStorage.setItem("oikos-score-activities", JSON.stringify(list)); }
function pushActivity(a: Activity) {
  const list = getActivities();
  list.unshift(a);
  if (list.length > 50) list.length = 50;
  saveActivitiesLS(list);
}

function getSeasons(): SeasonResult[] {
  try { return normalizeSeasons(JSON.parse(localStorage.getItem("oikos-score-seasons") || "[]")); } catch { return []; }
}
function saveSeasonsLS(s: SeasonResult[]) { localStorage.setItem("oikos-score-seasons", JSON.stringify(s)); }

function getSnapshots(): ScoreSnapshot[] {
  try { return JSON.parse(localStorage.getItem("oikos-score-snapshots") || "[]"); } catch { return []; }
}
function saveSnapshotsLS(s: ScoreSnapshot[]) { localStorage.setItem("oikos-score-snapshots", JSON.stringify(s)); }
function pushSnapshot(d: number, s: number) {
  const list = getSnapshots();
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const last = list[list.length - 1];
  if (last && last.date === today) {
    last.daniel = d;
    last.sofia = s;
  } else {
    list.push({ daniel: d, sofia: s, date: today });
    if (list.length > 30) list.shift();
  }
  saveSnapshotsLS(list);
}

const azulejoPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.10'%3E%3Ccircle cx='30' cy='30' r='12' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='6' stroke-width='0.4'/%3E%3Cpath d='M30 0v18M30 42v18M0 30h18M42 30h60' stroke-width='0.4'/%3E%3Cpath d='M30 18l-12 12 12 12 12-12z' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`;

const EASE = [0.22, 1, 0.36, 1];

function isAutoMonthSeason(name: string): boolean {
  return MONTHS.some(m => name.startsWith(m + ' '));
}

function normalizeSeasons(raw: SeasonResult[]): SeasonResult[] {
  return raw.map(s => ({
    ...s,
    name: s.name || `${s.month || 'Unknown'} ${s.year || ''}`.trim(),
    trophyName: s.trophyName || '',
    description: s.description || '',
  }));
}

const inputStyle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '1.05rem', fontWeight: 400,
  color: 'hsl(222,38%,22%)', background: 'hsl(40,26%,95%)',
  border: '1px solid rgba(30,60,130,0.10)', borderRadius: '4px',
  padding: '10px 14px', outline: 'none', width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'hsl(218,68%,28%)', marginBottom: '6px', display: 'block',
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '10px' }}>
      <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>{label}</p>
      <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
    </div>
  );
}

function BottomSheet({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(10,18,42,0.55)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="w-full max-w-md"
            style={{ background: 'hsl(42,28%,97%)', borderRadius: '12px 12px 0 0', maxHeight: '85vh', overflowY: 'auto', paddingBottom: '80px' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3" style={{ borderBottom: '1px solid rgba(30,60,130,0.08)' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.2rem', color: 'hsl(222,45%,16%)' }}>{title}</h3>
              <button onClick={onClose} className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: '4px', background: 'rgba(30,60,130,0.06)' }}>
                <X className="w-3.5 h-3.5" style={{ color: 'hsl(220,18%,50%)' }} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CenterModal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(10,18,42,0.60)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="w-full max-w-sm p-6"
            style={{ background: 'hsl(42,28%,97%)', borderRadius: '8px', boxShadow: '0 20px 60px rgba(10,20,60,0.35)' }}
            onClick={e => e.stopPropagation()}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ScorePage() {
  const [scores, setScores] = useState(getScoreState);
  const [milestones, setMilestones] = useState<Milestone[]>(getMilestones);
  const [activities, setActivities] = useState<Activity[]>(getActivities);
  const [seasons, setSeasons] = useState<SeasonResult[]>(getSeasons);
  const [snapshots, setSnapshots] = useState<ScoreSnapshot[]>(getSnapshots);

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({ title: '', reward: '', targetPoints: '5' });
  const [milestoneDeleteConfirm, setMilestoneDeleteConfirm] = useState(false);

  const [showSeasonHistory, setShowSeasonHistory] = useState(false);
  const [showNewSeason, setShowNewSeason] = useState(false);
  const [seasonForm, setSeasonForm] = useState({ name: '', trophyName: '', description: '' });

  const [showEndSeason, setShowEndSeason] = useState(false);
  const [showRolloverPrompt, setShowRolloverPrompt] = useState(false);

  const [editingSeason, setEditingSeason] = useState<SeasonResult | null>(null);
  const [seasonEditForm, setSeasonEditForm] = useState({ name: '', trophyName: '', description: '', winner: '' });
  const [seasonDeleteConfirm, setSeasonDeleteConfirm] = useState(false);

  useEffect(() => {
    const current = getCurrentMonthKey();
    if (scores.currentSeason && scores.currentSeason !== current && isAutoMonthSeason(scores.currentSeason)) {
      setShowRolloverPrompt(true);
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({ particleCount: 110, spread: 68, origin: { y: 0.50 }, colors: ['#1e3c82', '#2e5cbf', '#4878d4', '#f5f0e8', '#d4bc8a', '#FFD700'] });
  }, []);

  const addPoint = useCallback((user: 'daniel' | 'sofia', delta: number) => {
    setScores(prev => {
      const newVal = Math.max(0, prev[user] + delta);
      if (newVal === prev[user]) return prev;
      localStorage.setItem(`oikos-score-${user}`, String(newVal));
      const updated = { ...prev, [user]: newVal };
      pushSnapshot(updated.daniel, updated.sofia);
      setSnapshots(getSnapshots());
      pushActivity({
        id: `act-${Date.now()}`, user: user === 'daniel' ? 'Daniel' : 'Sofia',
        action: delta > 0 ? 'earned a point' : 'lost a point', points: delta,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      });
      setActivities(getActivities());
      return updated;
    });
  }, []);

  const deleteActivity = useCallback((id: string) => {
    const updated = getActivities().filter(a => a.id !== id);
    saveActivitiesLS(updated);
    setActivities(updated);
  }, []);

  const danielWins = useMemo(() => seasons.filter(s => s.winner === 'Daniel').length, [seasons]);
  const sofiaWins = useMemo(() => seasons.filter(s => s.winner === 'Sofia').length, [seasons]);
  const totalPoints = scores.daniel + scores.sofia;
  const danielPercent = totalPoints > 0 ? (scores.daniel / totalPoints) * 100 : 50;
  const sofiaPercent = totalPoints > 0 ? (scores.sofia / totalPoints) * 100 : 50;
  const leader = scores.daniel > scores.sofia ? 'Daniel' : scores.sofia > scores.daniel ? 'Sofia' : null;

  const openAddMilestone = () => { setMilestoneForm({ title: '', reward: '', targetPoints: '5' }); setShowMilestoneModal(true); setEditingMilestone(null); setMilestoneDeleteConfirm(false); };
  const openEditMilestone = (m: Milestone) => { setEditingMilestone(m); setMilestoneForm({ title: m.title, reward: m.reward, targetPoints: String(m.targetPoints) }); setShowMilestoneModal(true); setMilestoneDeleteConfirm(false); };

  const saveMilestoneForm = () => {
    if (!milestoneForm.title.trim()) return;
    let updated: Milestone[];
    if (editingMilestone) {
      updated = milestones.map(m => m.id === editingMilestone.id ? { ...m, title: milestoneForm.title.trim(), reward: milestoneForm.reward.trim(), targetPoints: parseInt(milestoneForm.targetPoints, 10) || 5 } : m);
    } else {
      const newM: Milestone = { id: `ms-${Date.now()}`, title: milestoneForm.title.trim(), reward: milestoneForm.reward.trim(), targetPoints: parseInt(milestoneForm.targetPoints, 10) || 5, completed: false, winner: null };
      updated = [...milestones, newM];
    }
    setMilestones(updated); saveMilestonesLS(updated);
    setShowMilestoneModal(false); setEditingMilestone(null);
  };

  const deleteMilestone = () => {
    if (!editingMilestone) return;
    const updated = milestones.filter(m => m.id !== editingMilestone.id);
    setMilestones(updated); saveMilestonesLS(updated);
    setShowMilestoneModal(false); setEditingMilestone(null); setMilestoneDeleteConfirm(false);
  };

  const completeMilestone = (id: string, winner: string) => {
    const updated = milestones.map(m => m.id === id ? { ...m, completed: true, winner } : m);
    setMilestones(updated); saveMilestonesLS(updated); triggerConfetti();
  };

  const resetMilestone = (id: string) => {
    const updated = milestones.map(m => m.id === id ? { ...m, completed: false, winner: null } : m);
    setMilestones(updated); saveMilestonesLS(updated);
  };

  const startNewSeason = () => {
    if (!seasonForm.name.trim()) return;
    localStorage.setItem("oikos-score-season", seasonForm.name.trim());
    localStorage.setItem("oikos-score-season-trophy", seasonForm.trophyName.trim());
    localStorage.setItem("oikos-score-season-desc", seasonForm.description.trim());
    localStorage.setItem("oikos-score-daniel", "0");
    localStorage.setItem("oikos-score-sofia", "0");
    saveSnapshotsLS([]);
    setSnapshots([]);
    setScores({ daniel: 0, sofia: 0, currentSeason: seasonForm.name.trim() });
    setShowNewSeason(false);
    setSeasonForm({ name: '', trophyName: '', description: '' });
  };

  const endSeason = () => {
    const winner = scores.daniel > scores.sofia ? 'Daniel' : scores.sofia > scores.daniel ? 'Sofia' : 'Tie';
    const trophyName = localStorage.getItem("oikos-score-season-trophy") || '';
    const desc = localStorage.getItem("oikos-score-season-desc") || '';
    const parts = scores.currentSeason.split(' ');
    const result: SeasonResult = {
      id: `season-${Date.now()}`, name: scores.currentSeason,
      trophyName, description: desc,
      month: parts[0] || scores.currentSeason, year: parseInt(parts[1], 10) || new Date().getFullYear(),
      danielPoints: scores.daniel, sofiaPoints: scores.sofia, winner,
    };
    const updated = [result, ...seasons];
    setSeasons(updated); saveSeasonsLS(updated);
    localStorage.setItem("oikos-score-daniel", "0");
    localStorage.setItem("oikos-score-sofia", "0");
    localStorage.removeItem("oikos-score-season-trophy");
    localStorage.removeItem("oikos-score-season-desc");
    saveSnapshotsLS([]);
    setSnapshots([]);
    const newSeason = getCurrentMonthKey();
    localStorage.setItem("oikos-score-season", newSeason);
    setScores({ daniel: 0, sofia: 0, currentSeason: newSeason });
    setShowEndSeason(false); triggerConfetti();
  };

  const openEditSeason = (s: SeasonResult) => {
    setEditingSeason(s);
    setSeasonEditForm({ name: s.name, trophyName: s.trophyName || '', description: s.description || '', winner: s.winner });
    setSeasonDeleteConfirm(false);
  };

  const saveSeasonEdit = () => {
    if (!editingSeason) return;
    const updated = seasons.map(s => s.id === editingSeason.id ? {
      ...s, name: seasonEditForm.name.trim() || s.name,
      trophyName: seasonEditForm.trophyName.trim(),
      description: seasonEditForm.description.trim(),
      winner: seasonEditForm.winner || s.winner,
    } : s);
    setSeasons(updated); saveSeasonsLS(updated); setEditingSeason(null);
  };

  const deleteSeason = () => {
    if (!editingSeason) return;
    const updated = seasons.filter(s => s.id !== editingSeason.id);
    setSeasons(updated); saveSeasonsLS(updated); setEditingSeason(null); setSeasonDeleteConfirm(false);
  };

  const maxSnap = useMemo(() => Math.max(1, ...snapshots.flatMap(s => [s.daniel, s.sofia])), [snapshots]);

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
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}
          className="relative overflow-hidden px-5 py-4"
          style={{ backgroundColor: 'hsl(222,42%,13%)', backgroundImage: `${azulejoPattern}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`, backgroundSize: '60px 60px, 100% 100%', border: '1px solid rgba(15,40,110,0.52)', borderRadius: '4px', boxShadow: '0 8px 30px rgba(10,20,60,0.28)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(180,165,140,0.45)' }}>Current Season</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.35rem', color: 'hsl(42,32%,94%)', marginTop: '4px' }}>{scores.currentSeason}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.button onClick={() => setShowNewSeason(true)} whileTap={{ scale: 0.92 }} className="flex items-center gap-1"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(255,252,245,0.16)', borderRadius: '3px', color: 'rgba(215,205,185,0.55)', padding: '5px 8px' }}>
                <Plus className="w-2.5 h-2.5" /> New
              </motion.button>
              <motion.button onClick={() => setShowSeasonHistory(!showSeasonHistory)} whileTap={{ scale: 0.92 }} className="flex items-center gap-1"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(255,252,245,0.16)', borderRadius: '3px', color: 'rgba(215,205,185,0.55)', padding: '5px 8px' }}>
                <Crown className="w-2.5 h-2.5" /> History
              </motion.button>
              <motion.button onClick={() => setShowEndSeason(true)} whileTap={{ scale: 0.92 }} className="flex items-center gap-1"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(255,252,245,0.16)', borderRadius: '3px', color: 'rgba(215,205,185,0.55)', padding: '5px 8px' }}>
                <RotateCcw className="w-2.5 h-2.5" /> End
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Palmares */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.04, ease: EASE }}
          className="grid grid-cols-2 gap-3">
          {[{ name: 'Daniel', wins: danielWins, avatar: 'avatar-daniel.png', light: true }, { name: 'Sofia', wins: sofiaWins, avatar: 'avatar-sofia.png', light: false }].map(p => (
            <div key={p.name} className="relative overflow-hidden px-4 py-4 flex flex-col items-center"
              style={{
                background: p.light ? 'hsl(38,30%,99%)' : 'linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)',
                border: p.light ? '1px solid rgba(30,60,130,0.08)' : '1px solid rgba(15,45,115,0.50)',
                borderRadius: '4px', boxShadow: p.light ? '0 1px 0 rgba(255,255,255,0.88) inset, 2px 4px 14px rgba(20,40,100,0.06)' : '3px 5px 18px rgba(12,25,72,0.26)',
              }}>
              {!p.light && <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 50, background: 'linear-gradient(to bottom, rgba(255,252,245,0.05) 0%, transparent 100%)' }} />}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden" style={{ border: p.light ? '1.5px solid hsl(218,68%,30%)' : '1.5px solid rgba(220,210,192,0.42)' }}>
                  <img src={`${import.meta.env.BASE_URL}images/${p.avatar}`} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: p.light ? 'hsl(220,20%,54%)' : 'rgba(195,182,160,0.55)' }}>{p.name}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4" style={{ color: '#FFD700' }} />
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.8rem', letterSpacing: '-0.03em', color: p.light ? 'hsl(218,70%,28%)' : 'hsl(42,32%,96%)' }}>{p.wins}</span>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', letterSpacing: '0.12em', textTransform: 'uppercase', color: p.light ? 'hsl(220,16%,64%)' : 'rgba(175,162,142,0.38)', marginTop: '2px' }}>
                {p.wins === 1 ? 'trophy' : 'trophies'} won
              </p>
            </div>
          ))}
        </motion.div>

        {/* Scoreboard */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
          className="grid grid-cols-2 gap-3">
          {/* Daniel */}
          <div className="p-5 flex flex-col items-center text-center"
            style={{ background: 'hsl(38,26%,97%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 4px 14px rgba(20,40,100,0.06)' }}>
            <div className="relative" style={{ marginBottom: '8px' }}>
              {leader === 'Daniel' && (
                <motion.div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center" style={{ background: '#FFD700', borderRadius: '2px', boxShadow: '0 2px 6px rgba(180,130,0,0.35)', zIndex: 1 }}
                  animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>
                  <Crown className="w-3 h-3" style={{ color: 'hsl(35,30%,22%)' }} />
                </motion.div>
              )}
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(220,20%,54%)', marginBottom: '4px' }}>Daniel</p>
            <AnimatePresence mode="wait">
              <motion.p key={scores.daniel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '2.6rem', letterSpacing: '-0.04em', lineHeight: 1, color: 'hsl(218,70%,28%)' }}>
                {scores.daniel}
              </motion.p>
            </AnimatePresence>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(220,16%,64%)', marginTop: '4px', marginBottom: '8px' }}>points</p>
            <div className="flex items-center gap-2">
              <motion.button onClick={() => addPoint('daniel', -1)} whileTap={{ scale: 0.88 }} className="flex items-center justify-center"
                style={{ width: 34, height: 34, borderRadius: '4px', background: 'hsl(40,22%,93%)', border: '1px solid rgba(30,60,130,0.08)' }}>
                <Minus className="w-3.5 h-3.5" style={{ color: 'hsl(220,18%,50%)' }} />
              </motion.button>
              <motion.button onClick={() => addPoint('daniel', 1)} whileTap={{ scale: 0.88 }} className="flex items-center justify-center"
                style={{ width: 34, height: 34, borderRadius: '4px', background: 'hsl(218,70%,28%)', border: '1px solid rgba(15,45,115,0.42)', boxShadow: '0 2px 8px rgba(12,25,72,0.20)' }}>
                <Plus className="w-3.5 h-3.5" style={{ color: 'hsl(42,30%,94%)' }} />
              </motion.button>
            </div>
          </div>
          {/* Sofia */}
          <div className="relative overflow-hidden p-5 flex flex-col items-center text-center"
            style={{ background: 'linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)', border: '1px solid rgba(15,45,115,0.50)', borderRadius: '4px', boxShadow: '3px 5px 18px rgba(12,25,72,0.26)' }}>
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 50, background: 'linear-gradient(to bottom, rgba(255,252,245,0.05) 0%, transparent 100%)' }} />
            <div className="relative" style={{ marginBottom: '8px' }}>
              {leader === 'Sofia' && (
                <motion.div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center" style={{ background: '#FFD700', borderRadius: '2px', boxShadow: '0 2px 6px rgba(180,130,0,0.35)', zIndex: 1 }}
                  animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>
                  <Crown className="w-3 h-3" style={{ color: 'hsl(35,30%,22%)' }} />
                </motion.div>
              )}
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(195,182,160,0.55)', marginBottom: '4px' }}>Sofia</p>
            <AnimatePresence mode="wait">
              <motion.p key={scores.sofia} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '2.6rem', letterSpacing: '-0.04em', lineHeight: 1, color: 'hsl(42,32%,96%)' }}>
                {scores.sofia}
              </motion.p>
            </AnimatePresence>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(175,162,142,0.38)', marginTop: '4px', marginBottom: '8px' }}>points</p>
            <div className="flex items-center gap-2">
              <motion.button onClick={() => addPoint('sofia', -1)} whileTap={{ scale: 0.88 }} className="flex items-center justify-center"
                style={{ width: 34, height: 34, borderRadius: '4px', background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(180,200,255,0.16)' }}>
                <Minus className="w-3.5 h-3.5" style={{ color: 'rgba(200,215,255,0.55)' }} />
              </motion.button>
              <motion.button onClick={() => addPoint('sofia', 1)} whileTap={{ scale: 0.88 }} className="flex items-center justify-center"
                style={{ width: 34, height: 34, borderRadius: '4px', background: 'rgba(255,252,245,0.14)', border: '1px solid rgba(180,200,255,0.22)', boxShadow: '0 2px 8px rgba(10,20,60,0.18)' }}>
                <Plus className="w-3.5 h-3.5" style={{ color: 'hsl(42,30%,94%)' }} />
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
              <motion.div initial={{ width: 0 }} animate={{ width: `${danielPercent}%` }} transition={{ duration: 0.8, ease: [0.34, 1.1, 0.64, 1] }}
                style={{ height: '100%', background: 'hsl(218,65%,38%)', borderRadius: '2px 0 0 2px' }} />
              <motion.div initial={{ width: 0 }} animate={{ width: `${sofiaPercent}%` }} transition={{ duration: 0.8, ease: [0.34, 1.1, 0.64, 1] }}
                style={{ height: '100%', background: 'hsl(38,48%,64%)', borderRadius: '0 2px 2px 0' }} />
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(38,42%,48%)', minWidth: 30, textAlign: 'right' }}>{sofiaPercent.toFixed(0)}%</span>
          </div>
        )}

        {/* Score History Chart */}
        {snapshots.length >= 2 && (
          <div>
            <SectionDivider label="Score Evolution" />
            <div className="px-5 py-5" style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 10px rgba(20,40,100,0.05)' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 10, height: 3, borderRadius: '1px', background: 'hsl(218,65%,38%)' }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(220,18%,54%)' }}>Daniel</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 10, height: 3, borderRadius: '1px', background: 'hsl(38,48%,58%)' }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(220,18%,54%)' }}>Sofia</span>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: 120 }}>
                <svg viewBox={`0 0 ${Math.max(1, (snapshots.length - 1)) * 36} 110`} className="w-full h-full" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  {[0, 27.5, 55, 82.5, 110].map(y => (
                    <line key={y} x1="0" y1={y} x2={(snapshots.length - 1) * 36} y2={y} stroke="rgba(30,60,130,0.06)" strokeWidth="0.5" />
                  ))}
                  <motion.polyline initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    points={snapshots.map((s, i) => `${i * 36},${110 - (s.daniel / maxSnap) * 100}`).join(' ')}
                    fill="none" stroke="hsl(218,65%,38%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <motion.polyline initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    points={snapshots.map((s, i) => `${i * 36},${110 - (s.sofia / maxSnap) * 100}`).join(' ')}
                    fill="none" stroke="hsl(38,48%,58%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {snapshots.map((s, i) => (
                    <motion.circle key={`d-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                      cx={i * 36} cy={110 - (s.daniel / maxSnap) * 100} r="3" fill="hsl(218,65%,38%)" stroke="hsl(38,30%,99%)" strokeWidth="1.5" />
                  ))}
                  {snapshots.map((s, i) => (
                    <motion.circle key={`s-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                      cx={i * 36} cy={110 - (s.sofia / maxSnap) * 100} r="3" fill="hsl(38,48%,58%)" stroke="hsl(38,30%,99%)" strokeWidth="1.5" />
                  ))}
                </svg>
                <div className="flex justify-between" style={{ marginTop: '6px' }}>
                  {snapshots.map((s, i) => (
                    <span key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '6.5px', fontWeight: 500, color: 'hsl(220,14%,62%)', width: 36, textAlign: 'center' }}>{s.date}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Season History (collapsible) */}
        <AnimatePresence>
          {showSeasonHistory && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <SectionDivider label="Past Seasons" />
              {seasons.length === 0 ? (
                <div className="px-5 py-6 text-center" style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(30,60,130,0.30)' }}>No seasons ended yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {seasons.map((season, idx) => (
                    <motion.div key={season.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                      className="px-4 py-4" style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 8px rgba(20,40,100,0.05)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: '#FFD700', borderRadius: '4px', boxShadow: '0 2px 8px rgba(180,130,0,0.25)' }}>
                          <Trophy className="w-4 h-4" style={{ color: 'hsl(35,30%,22%)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.02rem', color: 'hsl(222,38%,18%)' }}>{season.name}</p>
                          {season.trophyName && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 600, color: 'hsl(218,50%,42%)', marginTop: '2px' }}>{season.trophyName}</p>}
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(220,16%,58%)', marginTop: '2px' }}>
                            {season.winner === 'Tie' ? 'Tied!' : `Won by ${season.winner}`} &middot; {season.danielPoints}-{season.sofiaPoints}
                          </p>
                          {season.description && <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'hsl(220,15%,55%)', marginTop: '4px' }}>{season.description}</p>}
                        </div>
                        <motion.button onClick={() => openEditSeason(season)} whileTap={{ scale: 0.88 }} className="flex items-center justify-center shrink-0"
                          style={{ width: 28, height: 28, borderRadius: '3px', background: 'hsl(40,22%,93%)', border: '1px solid rgba(30,60,130,0.08)' }}>
                          <Pencil className="w-3 h-3" style={{ color: 'hsl(220,18%,50%)' }} />
                        </motion.button>
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
            <motion.button onClick={openAddMilestone} whileTap={{ scale: 0.90 }} className="flex items-center gap-1"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(218,60%,36%)', background: 'rgba(30,60,130,0.06)', border: '1px solid rgba(30,60,130,0.10)', borderRadius: '3px', padding: '5px 10px' }}>
              <Plus className="w-3 h-3" /> Add
            </motion.button>
          </div>

          {milestones.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 py-6 text-center"
              style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
              <Award className="w-6 h-6 mx-auto mb-3" style={{ color: 'rgba(30,60,130,0.18)' }} />
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(30,60,130,0.30)' }}>Create your first milestone together</p>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {milestones.map((milestone, idx) => (
                <motion.div key={milestone.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + idx * 0.06, duration: 0.40 }}>
                  <div className="relative" style={{
                    background: milestone.completed ? 'hsl(218,68%,27%)' : 'hsl(38,30%,99%)',
                    backgroundImage: milestone.completed ? azulejoPattern : 'none', backgroundSize: '60px 60px',
                    border: milestone.completed ? '1px solid rgba(15,45,115,0.42)' : '1px solid rgba(30,60,130,0.08)',
                    borderRadius: '4px', boxShadow: milestone.completed ? '1px 2px 10px rgba(12,25,72,0.20)' : '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 8px rgba(20,40,100,0.05)',
                    padding: '14px 16px',
                  }}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center shrink-0 mt-0.5" style={{
                        width: 36, height: 36, borderRadius: '4px',
                        background: milestone.completed ? 'rgba(255,215,0,0.18)' : 'hsl(40,22%,92%)',
                        border: milestone.completed ? '1px solid rgba(255,215,0,0.30)' : '1px solid rgba(30,60,130,0.08)',
                      }}>
                        {milestone.completed ? <Trophy className="w-4 h-4" style={{ color: '#FFD700' }} /> :
                          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '0.95rem', color: 'hsl(222,38%,28%)' }}>{milestone.targetPoints}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '1.02rem', color: milestone.completed ? 'hsl(42,30%,93%)' : 'hsl(222,38%,18%)' }}>{milestone.title}</p>
                        {milestone.reward && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: milestone.completed ? 'rgba(255,215,0,0.55)' : 'hsl(218,50%,42%)', marginTop: '3px' }}>Reward: {milestone.reward}</p>}
                        {milestone.completed && milestone.winner ? (
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 600, color: 'rgba(195,182,160,0.50)', marginTop: '2px' }}>Won by {milestone.winner}</p>
                        ) : !milestone.completed && (
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 500, color: 'hsl(220,16%,60%)', marginTop: '2px' }}>Target: {milestone.targetPoints} pts</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        {!milestone.completed ? (
                          <>
                            <motion.button onClick={() => completeMilestone(milestone.id, 'Daniel')} whileTap={{ scale: 0.88 }} className="flex items-center justify-center"
                              style={{ width: 26, height: 26, borderRadius: '3px', background: 'hsl(218,70%,28%)', border: '1px solid rgba(15,45,115,0.42)' }}>
                              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, color: 'hsl(42,30%,94%)' }}>D</span>
                            </motion.button>
                            <motion.button onClick={() => completeMilestone(milestone.id, 'Sofia')} whileTap={{ scale: 0.88 }} className="flex items-center justify-center"
                              style={{ width: 26, height: 26, borderRadius: '3px', background: 'hsl(38,48%,64%)', border: '1px solid rgba(180,140,60,0.30)' }}>
                              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, color: 'hsl(35,30%,22%)' }}>S</span>
                            </motion.button>
                          </>
                        ) : (
                          <motion.button onClick={() => resetMilestone(milestone.id)} whileTap={{ scale: 0.88 }} className="flex items-center justify-center"
                            style={{ width: 26, height: 26, borderRadius: '3px', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(180,200,255,0.16)' }}>
                            <RotateCcw className="w-3 h-3" style={{ color: 'rgba(200,215,255,0.55)' }} />
                          </motion.button>
                        )}
                        <motion.button onClick={() => openEditMilestone(milestone)} whileTap={{ scale: 0.88 }} className="flex items-center justify-center"
                          style={{ width: 26, height: 26, borderRadius: '3px', background: milestone.completed ? 'rgba(255,252,245,0.10)' : 'hsl(40,22%,93%)', border: milestone.completed ? '1px solid rgba(180,200,255,0.16)' : '1px solid rgba(30,60,130,0.08)' }}>
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
            <SectionDivider label="Recent Activity" />
            <div style={{ border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 10px rgba(20,40,100,0.05)' }}>
              {activities.slice(0, 10).map((activity, idx) => (
                <motion.div key={activity.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + idx * 0.04 }}
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{ background: idx % 2 === 0 ? 'hsl(38,30%,99%)' : 'hsl(40,18%,97%)', borderBottom: idx < Math.min(activities.length, 10) - 1 ? '1px solid rgba(30,60,130,0.06)' : 'none' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: activity.user === 'Sofia' ? 'hsl(38,48%,58%)' : 'hsl(218,60%,42%)' }} />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: '0.92rem', color: 'hsl(222,32%,24%)' }}>
                      <span style={{ fontWeight: 600 }}>{activity.user}</span>{' '}<span style={{ color: 'hsl(220,15%,53%)' }}>{activity.action}</span>
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: 'hsl(220,13%,63%)', marginTop: '1px' }}>{activity.date}</p>
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, background: activity.points > 0 ? 'hsl(218,70%,28%)' : 'hsl(0,45%,50%)', color: 'hsl(42,30%,94%)', borderRadius: '2px', padding: '3px 6px' }}>
                    {activity.points > 0 ? '+' : ''}{activity.points}
                  </div>
                  <motion.button onClick={() => deleteActivity(activity.id)} whileTap={{ scale: 0.85 }} className="flex items-center justify-center shrink-0"
                    style={{ width: 22, height: 22, borderRadius: '3px', background: 'rgba(180,40,40,0.06)', border: '1px solid rgba(180,40,40,0.10)' }}>
                    <X className="w-2.5 h-2.5" style={{ color: 'hsl(0,40%,50%)' }} />
                  </motion.button>
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

      {/* ──── MODALS ──── */}

      {/* New Season Modal */}
      <BottomSheet isOpen={showNewSeason} onClose={() => setShowNewSeason(false)} title="New Season">
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Season Name</label>
            <input value={seasonForm.name} onChange={e => setSeasonForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. April 2026, Kitchen Wars" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Trophy Name</label>
            <input value={seasonForm.trophyName} onChange={e => setSeasonForm(p => ({ ...p, trophyName: e.target.value }))} placeholder="e.g. The Golden Spatula" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={seasonForm.description} onChange={e => setSeasonForm(p => ({ ...p, description: e.target.value }))} placeholder="What's this season about?" rows={3} style={{ ...inputStyle, resize: 'none' as const }} />
          </div>
          <motion.button onClick={startNewSeason} whileTap={{ scale: 0.97 }} className="flex items-center justify-center gap-2 py-3 mt-2"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px', boxShadow: '2px 4px 12px rgba(12,25,72,0.20)', opacity: seasonForm.name.trim() ? 1 : 0.5 }}>
            <Star className="w-3.5 h-3.5" /> Start Season
          </motion.button>
        </div>
      </BottomSheet>

      {/* Milestone Modal */}
      <BottomSheet isOpen={showMilestoneModal} onClose={() => { setShowMilestoneModal(false); setEditingMilestone(null); }} title={editingMilestone ? 'Edit Milestone' : 'New Milestone'}>
        <AnimatePresence mode="wait">
          {milestoneDeleteConfirm ? (
            <motion.div key="del" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 flex flex-col items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center" style={{ background: 'rgba(180,40,40,0.10)', borderRadius: '50%' }}>
                <Trash2 className="w-5 h-5" style={{ color: 'hsl(0,50%,42%)' }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'hsl(222,38%,22%)', textAlign: 'center' }}>Delete this milestone?</p>
              <div className="flex gap-3 w-full mt-2">
                <motion.button onClick={() => setMilestoneDeleteConfirm(false)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>Cancel</motion.button>
                <motion.button onClick={deleteMilestone} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(0,50%,42%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px' }}>Delete</motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 flex flex-col gap-4">
              <div>
                <label style={labelStyle}>Milestone Name</label>
                <input value={milestoneForm.title} onChange={e => setMilestoneForm(p => ({ ...p, title: e.target.value }))} placeholder="First to cook dinner 5 times" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Reward</label>
                <input value={milestoneForm.reward} onChange={e => setMilestoneForm(p => ({ ...p, reward: e.target.value }))} placeholder="Winner picks the movie" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Target Points</label>
                <div className="flex items-center gap-2">
                  {[3, 5, 7, 10, 15, 20].map(n => (
                    <button key={n} onClick={() => setMilestoneForm(p => ({ ...p, targetPoints: String(n) }))} className="flex-1 py-2.5 transition-all duration-200"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, background: milestoneForm.targetPoints === String(n) ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)', color: milestoneForm.targetPoints === String(n) ? 'hsl(42,30%,96%)' : 'hsl(222,30%,30%)', border: milestoneForm.targetPoints === String(n) ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)', borderRadius: '4px' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                {editingMilestone && (
                  <motion.button onClick={() => setMilestoneDeleteConfirm(true)} whileTap={{ scale: 0.97 }} className="flex items-center justify-center py-3 px-4"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, background: 'rgba(180,40,40,0.08)', color: 'hsl(0,50%,42%)', border: '1px solid rgba(180,40,40,0.15)', borderRadius: '4px' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                )}
                <motion.button onClick={saveMilestoneForm} whileTap={{ scale: 0.97 }} className="flex-1 flex items-center justify-center gap-2 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px', boxShadow: '2px 4px 12px rgba(12,25,72,0.20)', opacity: milestoneForm.title.trim() ? 1 : 0.5 }}>
                  <Save className="w-3.5 h-3.5" /> {editingMilestone ? 'Save Changes' : 'Create Milestone'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </BottomSheet>

      {/* Edit Season Modal */}
      <BottomSheet isOpen={!!editingSeason} onClose={() => { setEditingSeason(null); setSeasonDeleteConfirm(false); }} title="Edit Season">
        <AnimatePresence mode="wait">
          {seasonDeleteConfirm ? (
            <motion.div key="del" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 flex flex-col items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center" style={{ background: 'rgba(180,40,40,0.10)', borderRadius: '50%' }}>
                <Trash2 className="w-5 h-5" style={{ color: 'hsl(0,50%,42%)' }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'hsl(222,38%,22%)', textAlign: 'center' }}>Remove this season from history?</p>
              <div className="flex gap-3 w-full mt-2">
                <motion.button onClick={() => setSeasonDeleteConfirm(false)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>Cancel</motion.button>
                <motion.button onClick={deleteSeason} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(0,50%,42%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px' }}>Delete</motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 flex flex-col gap-4">
              <div>
                <label style={labelStyle}>Season Name</label>
                <input value={seasonEditForm.name} onChange={e => setSeasonEditForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Trophy Name</label>
                <input value={seasonEditForm.trophyName} onChange={e => setSeasonEditForm(p => ({ ...p, trophyName: e.target.value }))} placeholder="e.g. The Golden Spatula" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={seasonEditForm.description} onChange={e => setSeasonEditForm(p => ({ ...p, description: e.target.value }))} placeholder="Season story..." rows={2} style={{ ...inputStyle, resize: 'none' as const }} />
              </div>
              <div>
                <label style={labelStyle}>Winner</label>
                <div className="flex gap-2">
                  {['Daniel', 'Sofia', 'Tie'].map(w => (
                    <button key={w} onClick={() => setSeasonEditForm(p => ({ ...p, winner: w }))} className="flex-1 py-2.5 transition-all duration-200"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: seasonEditForm.winner === w ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)', color: seasonEditForm.winner === w ? 'hsl(42,30%,96%)' : 'hsl(222,30%,30%)', border: seasonEditForm.winner === w ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)', borderRadius: '4px' }}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <motion.button onClick={() => setSeasonDeleteConfirm(true)} whileTap={{ scale: 0.97 }} className="flex items-center justify-center py-3 px-4"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, background: 'rgba(180,40,40,0.08)', color: 'hsl(0,50%,42%)', border: '1px solid rgba(180,40,40,0.15)', borderRadius: '4px' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button onClick={saveSeasonEdit} whileTap={{ scale: 0.97 }} className="flex-1 flex items-center justify-center gap-2 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px', boxShadow: '2px 4px 12px rgba(12,25,72,0.20)' }}>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </BottomSheet>

      {/* End Season Confirmation */}
      <CenterModal isOpen={showEndSeason} onClose={() => setShowEndSeason(false)}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center" style={{ background: '#FFD700', borderRadius: '8px', boxShadow: '0 4px 16px rgba(180,130,0,0.30)' }}>
            <Trophy className="w-7 h-7" style={{ color: 'hsl(35,30%,22%)' }} />
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.3rem', color: 'hsl(222,45%,16%)' }}>End {scores.currentSeason}?</h3>
          {totalPoints > 0 ? (
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: 'hsl(222,30%,28%)' }}>
                {leader ? <><span style={{ fontWeight: 600 }}>{leader}</span> wins with {scores[leader.toLowerCase() as 'daniel' | 'sofia']} points!</> : <>It's a tie at {scores.daniel} points each!</>}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'hsl(220,16%,56%)', marginTop: '8px' }}>Points will reset to 0 for the new season.</p>
            </div>
          ) : (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'hsl(220,16%,56%)' }}>No points scored yet. End anyway?</p>
          )}
          <div className="flex gap-3 w-full mt-2">
            <motion.button onClick={() => setShowEndSeason(false)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>Cancel</motion.button>
            <motion.button onClick={endSeason} whileTap={{ scale: 0.97 }} className="flex-1 py-3 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px', boxShadow: '2px 4px 12px rgba(12,25,72,0.20)' }}>
              <Trophy className="w-3.5 h-3.5" /> End Season
            </motion.button>
          </div>
        </div>
      </CenterModal>

      {/* Month Rollover Prompt */}
      <CenterModal isOpen={showRolloverPrompt} onClose={() => setShowRolloverPrompt(false)}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center" style={{ background: 'hsl(218,70%,28%)', borderRadius: '8px', boxShadow: '0 4px 16px rgba(12,25,72,0.30)' }}>
            <RotateCcw className="w-6 h-6" style={{ color: 'hsl(42,30%,94%)' }} />
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.2rem', color: 'hsl(222,45%,16%)' }}>New month!</h3>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: 'hsl(222,30%,28%)' }}>
            <span style={{ fontWeight: 600 }}>{scores.currentSeason}</span> has ended. Close it and start <span style={{ fontWeight: 600 }}>{getCurrentMonthKey()}</span>?
          </p>
          <div className="flex gap-3 w-full mt-2">
            <motion.button onClick={() => setShowRolloverPrompt(false)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>Later</motion.button>
            <motion.button onClick={() => { setShowRolloverPrompt(false); endSeason(); }} whileTap={{ scale: 0.97 }} className="flex-1 py-3 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px', boxShadow: '2px 4px 12px rgba(12,25,72,0.20)' }}>
              <Trophy className="w-3.5 h-3.5" /> Close Season
            </motion.button>
          </div>
        </div>
      </CenterModal>
    </AppShell>
  );
}
