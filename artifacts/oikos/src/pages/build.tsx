import { useState, useMemo, useCallback } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllGoalsFromKV, isCustomItem } from "@/data/store";
import { useKV } from "@/data/kv-store";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Plane, Film, UtensilsCrossed, Sparkles, Pencil, Shuffle, ArrowDownUp, Layers } from "lucide-react";
import { Link } from "wouter";
import EditDeleteModal from "@/components/EditDeleteModal";
import type { Goal } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const CATEGORY_META: Record<string, { icon: typeof Sparkles; emoji: string; bg: string; gradient: string; border: string }> = {
  Activities: { icon: Sparkles, emoji: "\u2726", bg: 'hsl(218,70%,28%)', gradient: 'hsl(218,72%,32%)', border: 'rgba(15,45,115,0.50)' },
  Travel: { icon: Plane, emoji: "\u2708", bg: 'hsl(168,45%,28%)', gradient: 'hsl(166,42%,32%)', border: 'rgba(15,80,70,0.50)' },
  Movies: { icon: Film, emoji: "\u25C9", bg: 'hsl(338,45%,38%)', gradient: 'hsl(336,42%,42%)', border: 'rgba(120,20,50,0.50)' },
  Food: { icon: UtensilsCrossed, emoji: "\u25C8", bg: 'hsl(222,52%,18%)', gradient: 'hsl(220,50%,22%)', border: 'rgba(15,35,90,0.55)' },
};

const CATEGORIES = ["All", "Activities", "Travel", "Movies", "Food"];

const azulejoPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.10'%3E%3Ccircle cx='30' cy='30' r='12' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='6' stroke-width='0.4'/%3E%3Cpath d='M30 0v18M30 42v18M0 30h18M42 30h60' stroke-width='0.4'/%3E%3Cpath d='M30 18l-12 12 12 12 12-12z' stroke-width='0.5'/%3E%3Ccircle cx='0' cy='0' r='8' stroke-width='0.4'/%3E%3Ccircle cx='60' cy='0' r='8' stroke-width='0.4'/%3E%3Ccircle cx='0' cy='60' r='8' stroke-width='0.4'/%3E%3Ccircle cx='60' cy='60' r='8' stroke-width='0.4'/%3E%3Cpath d='M0 0l18 18M42 42l18 18M60 0l-18 18M18 42l-18 18' stroke-width='0.3'/%3E%3C/g%3E%3C/svg%3E")`;

const bgMosaicPattern = `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e3c82' opacity='0.04'%3E%3Ccircle cx='24' cy='24' r='10' stroke-width='0.5'/%3E%3Ccircle cx='24' cy='24' r='4' stroke-width='0.4'/%3E%3Cpath d='M24 14l-10 10 10 10 10-10z' stroke-width='0.4'/%3E%3Cpath d='M24 0v14M24 34v14M0 24h14M34 24h14' stroke-width='0.3'/%3E%3Ccircle cx='0' cy='0' r='6' stroke-width='0.3'/%3E%3Ccircle cx='48' cy='0' r='6' stroke-width='0.3'/%3E%3Ccircle cx='0' cy='48' r='6' stroke-width='0.3'/%3E%3Ccircle cx='48' cy='48' r='6' stroke-width='0.3'/%3E%3C/g%3E%3C/svg%3E")`;

export default function BuildPage() {
  const { data, set } = useKV();
  const goals = useMemo(() => getAllGoalsFromKV(data), [data]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortMode, setSortMode] = useState<'date' | 'type' | 'shuffle'>('date');
  const [shuffleKey, setShuffleKey] = useState(0);
  const [showCompleted, setShowCompleted] = useState<'all' | 'done' | 'todo'>('all');

  const toggleGoal = useCallback((id: string) => {
    const newGoals = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    const statusMap: Record<string, boolean> = {};
    newGoals.forEach(g => { statusMap[g.id] = g.completed; });
    set('oikos-goal-status', statusMap);
  }, [goals, set]);

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setEditValues({ text: goal.text, category: goal.category || '' });
    setShowDeleteConfirm(false);
  };

  const handleSave = useCallback(() => {
    if (!editingGoal) return;
    const custom = (data['oikos-custom-goals'] as Goal[]) || [];
    set('oikos-custom-goals', custom.map(g => g.id === editingGoal.id ? { ...g, text: editValues.text, category: editValues.category || undefined } : g));
    setEditingGoal(null);
  }, [editingGoal, editValues, data, set]);

  const handleDelete = useCallback(() => {
    if (!editingGoal) return;
    const custom = (data['oikos-custom-goals'] as Goal[]) || [];
    set('oikos-custom-goals', custom.filter(g => g.id !== editingGoal.id));
    setEditingGoal(null);
  }, [editingGoal, data, set]);

  const CATEGORY_ORDER: Record<string, number> = { Activities: 0, Travel: 1, Movies: 2, Food: 3 };

  const filteredGoals = useMemo(() => {
    let arr = activeCategory === "All" ? [...goals] : goals.filter(g => g.category === activeCategory);
    if (showCompleted === 'done') arr = arr.filter(g => g.completed);
    else if (showCompleted === 'todo') arr = arr.filter(g => !g.completed);
    if (sortMode === 'shuffle') {
      void shuffleKey;
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    } else if (sortMode === 'type') {
      arr.sort((a, b) => {
        const ca = CATEGORY_ORDER[a.category || ''] ?? 99;
        const cb = CATEGORY_ORDER[b.category || ''] ?? 99;
        if (ca !== cb) return ca - cb;
        return (b.id || '').localeCompare(a.id || '');
      });
    } else {
      arr.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals, activeCategory, sortMode, shuffleKey, showCompleted]);

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const categoryCounts = useMemo(() => {
    const map: Record<string, { total: number; done: number }> = {};
    goals.forEach(g => {
      const cat = g.category || 'Other';
      if (!map[cat]) map[cat] = { total: 0, done: 0 };
      map[cat].total++;
      if (g.completed) map[cat].done++;
    });
    return map;
  }, [goals]);

  return (
    <AppShell>
      <SectionHeader title="Desenhos" subtitle="What we are slowly painting together"
        action={
          <Link href="/build/new">
            <motion.div whileTap={{ scale: 0.92 }} className="flex items-center gap-1.5"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.18)', borderRadius: '3px', color: 'rgba(215,205,185,0.70)', padding: '6px 12px' }}>
              <Plus className="w-3 h-3" /> New
            </motion.div>
          </Link>
        }
      />

      <div className="px-4 pt-4 pb-6" style={{ backgroundImage: bgMosaicPattern, backgroundSize: '48px 48px' }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE as unknown as number[] }}
          className="relative overflow-hidden p-6"
          style={{ backgroundColor: 'hsl(222,42%,13%)', backgroundImage: `${azulejoPattern}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`, backgroundSize: '60px 60px, 100% 100%', border: '1px solid rgba(15,40,110,0.52)', borderRadius: '4px', boxShadow: '0 10px 38px rgba(10,20,60,0.30)', marginBottom: '10px' }}
>
          <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(180,165,140,0.48)', marginBottom: '8px' }}>
                {'\u2726'} &nbsp; Our List
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '0.82rem', color: 'rgba(200,190,170,0.52)' }}>
                {completedCount} of {goals.length} done
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.span key={progressPercent} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '3rem', letterSpacing: '-0.04em', color: 'hsl(42,32%,93%)', lineHeight: 1 }}>
                {progressPercent}%
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: goals.length }).map((_, i) => (
              <motion.div key={i} style={{ flex: 1, height: 3, borderRadius: '1px' }}
                animate={{ background: i < completedCount ? 'hsl(42,46%,76%)' : 'rgba(255,255,255,0.09)' }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
              />
            ))}
          </div>
        </motion.div>

        <div className="flex overflow-x-auto no-scrollbar gap-1.5 py-3">
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? goals.length : (categoryCounts[cat]?.total || 0);
            const meta = CATEGORY_META[cat];
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 transition-all duration-200"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: activeCategory === cat ? (meta?.bg || 'hsl(218,70%,28%)') : 'hsl(40,22%,95%)', color: activeCategory === cat ? 'hsl(42,30%,94%)' : 'hsl(222,30%,34%)', border: activeCategory === cat ? `1px solid ${meta?.border || 'rgba(15,45,115,0.40)'}` : '1px solid rgba(30,60,130,0.06)', borderRadius: '3px' }}>
                {meta && <span style={{ fontSize: '10px', opacity: 0.7 }}>{meta.emoji}</span>}
                {cat} <span style={{ opacity: 0.5 }}>({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-3">
          {([
            { key: 'all' as const, label: 'All', count: activeCategory === 'All' ? goals.length : goals.filter(g => g.category === activeCategory).length },
            { key: 'done' as const, label: 'Done', count: (activeCategory === 'All' ? goals : goals.filter(g => g.category === activeCategory)).filter(g => g.completed).length },
            { key: 'todo' as const, label: 'To Do', count: (activeCategory === 'All' ? goals : goals.filter(g => g.category === activeCategory)).filter(g => !g.completed).length },
          ]).map(btn => (
            <button key={btn.key} onClick={() => setShowCompleted(btn.key)} className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 transition-all duration-200"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: showCompleted === btn.key ? 'hsl(218,70%,28%)' : 'transparent', color: showCompleted === btn.key ? 'hsl(42,30%,96%)' : 'hsl(220,18%,55%)', border: showCompleted === btn.key ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.08)', borderRadius: '3px' }}>
              {btn.key === 'done' && <Check className="w-2.5 h-2.5" />}
              {btn.label} <span style={{ opacity: 0.5 }}>({btn.count})</span>
            </button>
          ))}
        </div>

        {activeCategory !== "All" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-3">
            <CategoryHeader category={activeCategory} count={categoryCounts[activeCategory]?.total || 0} done={categoryCounts[activeCategory]?.done || 0} />
          </motion.div>
        )}

        {goals.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-3">
            {([
              { mode: 'shuffle' as const, label: 'Shuffle', icon: Shuffle },
              { mode: 'date' as const, label: 'Date', icon: ArrowDownUp },
              { mode: 'type' as const, label: 'Type', icon: Layers },
            ]).map(btn => (
              <motion.button key={btn.mode} whileTap={{ scale: 0.93 }}
                onClick={() => {
                  if (btn.mode === 'shuffle') { setShuffleKey(k => k + 1); setSortMode('shuffle'); }
                  else { setSortMode(btn.mode); }
                }}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: sortMode === btn.mode ? 'hsl(218,70%,28%)' : 'rgba(30,60,130,0.06)', color: sortMode === btn.mode ? 'hsl(42,30%,96%)' : 'hsl(220,18%,55%)', border: sortMode === btn.mode ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.08)', borderRadius: '3px', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <btn.icon className="w-2.5 h-2.5" /> {btn.label}
              </motion.button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          {filteredGoals.map((goal, idx) => {
            const isCustom = isCustomItem(goal.id);
            const catColor = CATEGORY_META[goal.category || ''];
            const tileBg = catColor?.bg || 'hsl(218,68%,27%)';
            const tileGrad = catColor?.gradient || 'hsl(218,72%,32%)';
            const tileBorder = catColor?.border || 'rgba(15,45,115,0.42)';
            return (
              <motion.div key={goal.id} layout initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + idx * 0.025, duration: 0.40, layout: { type: "spring", stiffness: 350, damping: 30 } }}>
                <div className="relative">
                  <motion.div onClick={() => toggleGoal(goal.id)} whileTap={{ scale: 0.985 }} whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                    style={{
                      background: goal.completed ? tileBg : 'hsl(38,30%,99%)',
                      backgroundImage: goal.completed ? `${azulejoPattern}, linear-gradient(155deg, ${tileBg} 0%, ${tileGrad} 100%)` : 'none',
                      backgroundSize: goal.completed ? '60px 60px, 100% 100%' : undefined,
                      border: goal.completed ? `1px solid ${tileBorder}` : '1px solid rgba(30,60,130,0.08)',
                      borderRadius: '4px',
                      boxShadow: goal.completed ? '1px 2px 10px rgba(12,25,72,0.22)' : '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.05)',
                      transition: 'all 0.30s ease',
                      paddingRight: isCustom ? '52px' : '20px',
                    }}>
                    <motion.div className="flex items-center justify-center shrink-0"
                      style={{ width: 22, height: 22, borderRadius: '2px', border: goal.completed ? 'none' : '1.5px solid rgba(30,60,130,0.26)', background: goal.completed ? 'rgba(255,252,245,0.15)' : 'transparent' }}
                      animate={{ scale: goal.completed ? [1, 1.18, 1] : 1 }} transition={{ duration: 0.25 }}>
                      <AnimatePresence>
                        {goal.completed && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.18 }}>
                            <Check className="w-3.5 h-3.5" style={{ color: 'hsl(42,30%,94%)', strokeWidth: 2.5 }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: goal.completed ? 400 : 500, fontSize: '1.05rem', letterSpacing: '0.01em', lineHeight: 1.35, color: goal.completed ? 'rgba(215,205,188,0.78)' : 'hsl(222,38%,22%)', textDecoration: goal.completed ? 'line-through' : 'none', textDecorationColor: 'rgba(180,165,140,0.35)', transition: 'all 0.30s ease' }}>
                        {goal.text}
                      </p>
                      {goal.category && (
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: goal.completed ? 'rgba(175,162,140,0.35)' : 'hsl(220,18%,60%)', marginTop: '4px' }}>
                          {CATEGORY_META[goal.category]?.emoji || '\u2726'} &nbsp;{goal.category}
                        </p>
                      )}
                    </div>
                  </motion.div>
                  {isCustom && (
                    <motion.button onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(goal); }} whileTap={{ scale: 0.90 }}
                      className="absolute flex items-center justify-center z-10"
                      style={{ top: '50%', right: 12, transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '4px', background: goal.completed ? 'rgba(255,252,245,0.14)' : 'hsl(218,70%,28%)', border: goal.completed ? '1px solid rgba(180,200,255,0.20)' : '1px solid rgba(15,45,115,0.42)', boxShadow: '0 2px 6px rgba(12,25,72,0.18)' }}>
                      <Pencil className="w-3 h-3" style={{ color: goal.completed ? 'rgba(200,215,255,0.70)' : 'hsl(42,30%,94%)' }} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 text-center">
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.88rem', color: 'rgba(30,60,130,0.28)' }}>
            One day at a time, together.
          </p>
        </motion.div>
      </div>

      <EditDeleteModal
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        onSave={handleSave}
        onDelete={() => setShowDeleteConfirm(true)}
        title="Edit Goal"
        fields={[
          { key: 'text', label: 'What will we do?', type: 'text', placeholder: 'Goal description' },
          { key: 'category', label: 'Category', type: 'select', options: ['Activities', 'Travel', 'Movies', 'Food'] },
        ]}
        values={editValues}
        onChange={(key, val) => setEditValues(prev => ({ ...prev, [key]: val }))}
        showDeleteConfirm={showDeleteConfirm}
        onDeleteConfirm={handleDelete}
        onDeleteCancel={() => setShowDeleteConfirm(false)}
      />
    </AppShell>
  );
}

function CategoryHeader({ category, count, done }: { category: string; count: number; done: number }) {
  const meta = CATEGORY_META[category];
  const Icon = meta?.icon || Sparkles;
  const catBg = meta?.bg || 'hsl(218,70%,28%)';
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(30,60,130,0.04)', border: '1px solid rgba(30,60,130,0.06)', borderRadius: '4px' }}>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center" style={{ width: 20, height: 20, borderRadius: '3px', background: catBg }}>
          <Icon className="w-3 h-3" style={{ color: 'hsl(42,30%,94%)' }} />
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(218,60%,30%)' }}>{category}</span>
      </div>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 500, color: 'hsl(220,18%,56%)' }}>{done}/{count}</span>
    </div>
  );
}
