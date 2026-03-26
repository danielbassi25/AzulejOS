import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockGoals } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.12'%3E%3Ccircle cx='16' cy='16' r='5'/%3E%3Cline x1='16' y1='0' x2='16' y2='11'/%3E%3Cline x1='16' y1='21' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='16' x2='32' y2='16'/%3E%3C/g%3E%3C/svg%3E")`;

const CATEGORIES = ["All", "Travel", "Home", "Growth", "Ritual"];

export default function BuildPage() {
  const [goals, setGoals] = useState(mockGoals);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleGoal = (id: string) => setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));

  const filteredGoals = useMemo(() =>
    activeCategory === "All" ? goals : goals.filter(g => g.category === activeCategory),
    [goals, activeCategory]
  );

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercent = Math.round((completedCount / goals.length) * 100);

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
      <SectionHeader title="Build" subtitle="Shared horizons" />

      <div className="px-4 pt-4 pb-28">
        {/* Progress hero */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden p-8"
          style={{
            backgroundColor: 'hsl(222,42%,13%)',
            backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(222,42%,13%) 0%, hsl(220,40%,17%) 100%)`,
            backgroundSize: '32px 32px, 100% 100%',
            border: '1px solid rgba(15,40,110,0.52)', borderRadius: '4px',
            boxShadow: '0 10px 38px rgba(10,20,60,0.30)', marginBottom: '10px',
          }}
        >
          <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(180,165,140,0.48)', marginBottom: '10px' }}>
                ✦ &nbsp; Progress
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '0.82rem', color: 'rgba(200,190,170,0.52)' }}>
                {completedCount} of {goals.length} built
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.span key={progressPercent}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '3.4rem', letterSpacing: '-0.04em', color: 'hsl(42,32%,93%)', lineHeight: 1 }}>
                {progressPercent}%
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: goals.length }).map((_, i) => (
              <motion.div key={i} style={{ flex: 1, height: 3, borderRadius: '1px' }}
                animate={{ background: i < completedCount ? 'hsl(42,46%,76%)' : 'rgba(255,255,255,0.09)' }}
                transition={{ duration: 0.35, delay: i * 0.03 }} />
            ))}
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 py-3">
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? goals.length : (categoryCounts[cat]?.total || 0);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-3 py-2 transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: activeCategory === cat ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                  color: activeCategory === cat ? 'hsl(42,30%,94%)' : 'hsl(222,30%,34%)',
                  border: activeCategory === cat ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                  borderRadius: '3px',
                }}
              >
                {cat} <span style={{ opacity: 0.5 }}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Goal tiles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {filteredGoals.map((goal, idx) => (
            <motion.div key={goal.id}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + idx * 0.03, duration: 0.40 }}>
              <motion.div
                onClick={() => toggleGoal(goal.id)}
                whileTap={{ scale: 0.985 }} whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                style={{
                  background: goal.completed ? 'hsl(218,68%,27%)' : 'hsl(38,30%,99%)',
                  border: goal.completed ? '1px solid rgba(15,45,115,0.42)' : '1px solid rgba(30,60,130,0.08)',
                  borderRadius: '4px',
                  boxShadow: goal.completed ? '1px 2px 10px rgba(12,25,72,0.22)' : '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.05)',
                  transition: 'all 0.30s ease',
                }}
              >
                <motion.div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 20, height: 20, borderRadius: '2px',
                    border: goal.completed ? 'none' : '1.5px solid rgba(30,60,130,0.26)',
                    background: goal.completed ? 'rgba(255,252,245,0.15)' : 'transparent',
                  }}
                  animate={{ scale: goal.completed ? [1, 1.18, 1] : 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <AnimatePresence>
                    {goal.completed && (
                      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.18 }}>
                        <Check className="w-3 h-3" style={{ color: 'hsl(42,30%,94%)', strokeWidth: 2.5 }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: goal.completed ? 400 : 500, fontSize: '1.05rem', letterSpacing: '0.01em', lineHeight: 1.35,
                    color: goal.completed ? 'rgba(215,205,188,0.78)' : 'hsl(222,38%,22%)',
                    textDecoration: goal.completed ? 'line-through' : 'none', textDecorationColor: 'rgba(180,165,140,0.35)',
                    transition: 'all 0.30s ease',
                  }}>
                    {goal.text}
                  </p>
                  {goal.category && (
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: goal.completed ? 'rgba(175,162,140,0.35)' : 'hsl(220,18%,60%)', marginTop: '4px' }}>
                      {goal.category}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
