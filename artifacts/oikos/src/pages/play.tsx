import { useState, useMemo, useCallback, useRef } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockQuestions } from "@/data/mock";
import { isCustomItem, getCustomQuestions, deleteCustomQuestion, updateCustomQuestion } from "@/data/store";
import type { Question } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Heart, Shuffle, Check, ChevronDown, Plus, X, Pencil } from "lucide-react";
import EditDeleteModal from "@/components/EditDeleteModal";

const CATEGORIES = ["All", "Deep", "Spicy", "Playful", "Memories", "Future", "Everyday", "Would You Rather", "This or That"];

const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.45' opacity='0.11'%3E%3Ccircle cx='18' cy='18' r='6'/%3E%3Cline x1='18' y1='0' x2='18' y2='12'/%3E%3Cline x1='18' y1='24' x2='18' y2='36'/%3E%3Cline x1='0' y1='18' x2='12' y2='18'/%3E%3Cline x1='24' y1='18' x2='36' y2='18'/%3E%3Cline x1='3.5' y1='3.5' x2='11' y2='11'/%3E%3Cline x1='25' y1='25' x2='32.5' y2='32.5'/%3E%3Cline x1='32.5' y1='3.5' x2='25' y2='11'/%3E%3Cline x1='11' y1='25' x2='3.5' y2='32.5'/%3E%3C/g%3E%3C/svg%3E")`;

function useLocalStorageSet(key: string): [Set<string>, (fn: (prev: Set<string>) => Set<string>) => void] {
  const [set, setSet] = useState<Set<string>>(() => {
    try { const stored = localStorage.getItem(key); return stored ? new Set(JSON.parse(stored)) : new Set(); }
    catch { return new Set(); }
  });
  const update = useCallback((fn: (prev: Set<string>) => Set<string>) => {
    setSet(prev => { const next = fn(prev); localStorage.setItem(key, JSON.stringify([...next])); return next; });
  }, [key]);
  return [set, update];
}

export default function PlayPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [favorites, setFavorites] = useLocalStorageSet("oikos-play-favorites");
  const [answered, setAnswered] = useLocalStorageSet("oikos-play-answered");
  const [shuffleMode, setShuffleMode] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => getCustomQuestions());
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState("Deep");
  const shuffleSeedRef = useRef(0);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const allQuestions = useMemo(() => [...mockQuestions, ...customQuestions], [customQuestions]);

  const filteredQuestions = useMemo(() => {
    const qs = activeCategory === "All"
      ? allQuestions
      : allQuestions.filter((q) => q.category === activeCategory);
    if (shuffleMode) {
      const seed = shuffleSeedRef.current;
      return [...qs].sort((a, b) => {
        const ha = Math.sin((parseInt(a.id.replace(/\D/g, ''), 10) + seed) * 9301 + 49297) % 233280;
        const hb = Math.sin((parseInt(b.id.replace(/\D/g, ''), 10) + seed) * 9301 + 49297) % 233280;
        return ha - hb;
      });
    }
    return qs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, shuffleMode, shuffleSeedRef.current, allQuestions]);

  const currentQuestion = filteredQuestions[currentIndex % filteredQuestions.length] || filteredQuestions[0];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  }, [filteredQuestions.length]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, [setFavorites]);

  const toggleAnswered = useCallback((id: string) => {
    setAnswered(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, [setAnswered]);

  const addCustomQuestion = useCallback(() => {
    if (!newQuestionText.trim()) return;
    const q: Question = { id: `custom-${Date.now()}`, category: newQuestionCategory, text: newQuestionText.trim() };
    setCustomQuestions(prev => { const next = [...prev, q]; localStorage.setItem("oikos-custom-questions", JSON.stringify(next)); return next; });
    setNewQuestionText("");
    setShowAddForm(false);
  }, [newQuestionText, newQuestionCategory]);

  const openEdit = (question: Question) => {
    setEditingQuestion(question);
    setEditValues({
      text: question.text,
      category: question.category,
    });
    setShowDeleteConfirm(false);
  };

  const handleSave = () => {
    if (!editingQuestion) return;
    updateCustomQuestion(editingQuestion.id, {
      text: editValues.text,
      category: editValues.category,
    });
    setCustomQuestions(getCustomQuestions());
    setEditingQuestion(null);
  };

  const handleDelete = () => {
    if (!editingQuestion) return;
    deleteCustomQuestion(editingQuestion.id);
    setCustomQuestions(getCustomQuestions());
    setEditingQuestion(null);
    if (currentIndex >= filteredQuestions.length - 1) {
      setCurrentIndex(0);
    }
  };

  const categoryCount = useMemo(() => {
    const map: Record<string, number> = { All: allQuestions.length };
    allQuestions.forEach(q => { map[q.category] = (map[q.category] || 0) + 1; });
    return map;
  }, [allQuestions]);

  const isFav = currentQuestion ? favorites.has(currentQuestion.id) : false;
  const isAns = currentQuestion ? answered.has(currentQuestion.id) : false;
  const isCurrentCustom = currentQuestion ? isCustomItem(currentQuestion.id) : false;

  return (
    <AppShell>
      <SectionHeader
        title="Play"
        subtitle="Discover each other, again"
        action={
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowAddForm(!showAddForm)}
              whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center"
              style={{
                width: 28, height: 28, borderRadius: '3px',
                background: showAddForm ? 'rgba(255,252,245,0.20)' : 'rgba(255,252,245,0.08)',
                border: '1px solid rgba(255,252,245,0.18)',
                color: showAddForm ? 'hsl(42,30%,94%)' : 'rgba(215,205,185,0.60)',
              }}
            >
              {showAddForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </motion.button>
            <motion.button
              onClick={() => { if (!shuffleMode) shuffleSeedRef.current = Date.now(); setShuffleMode(!shuffleMode); }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-1.5"
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                background: shuffleMode ? 'rgba(255,252,245,0.20)' : 'rgba(255,252,245,0.08)',
                border: '1px solid rgba(255,252,245,0.18)', borderRadius: '3px',
                color: shuffleMode ? 'hsl(42,30%,94%)' : 'rgba(215,205,185,0.60)', padding: '6px 10px',
              }}
            >
              <Shuffle className="w-3 h-3" />
              {shuffleMode ? 'On' : 'Off'}
            </motion.button>
          </div>
        }
      />

      <div className="flex flex-col">
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
              style={{ borderBottom: '1px solid rgba(30,60,130,0.09)' }}
            >
              <div className="p-4 flex flex-col gap-3">
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(218,68%,28%)' }}>
                  Write your own question
                </p>
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Your question for each other..."
                  rows={2}
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem', fontStyle: 'italic',
                    color: 'hsl(222,38%,22%)', background: 'hsl(40,26%,95%)',
                    border: '1px solid rgba(30,60,130,0.10)', borderRadius: '4px',
                    padding: '12px 16px', resize: 'none', outline: 'none', width: '100%',
                  }}
                />
                <div className="flex items-center gap-2">
                  <select
                    value={newQuestionCategory}
                    onChange={(e) => setNewQuestionCategory(e.target.value)}
                    style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                      color: 'hsl(222,30%,30%)', background: 'hsl(40,22%,95%)',
                      border: '1px solid rgba(30,60,130,0.08)', borderRadius: '3px', padding: '8px 12px', flex: 1,
                    }}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <motion.button
                    onClick={addCustomQuestion}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                      background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '3px', padding: '8px 16px', border: 'none',
                    }}
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative" style={{ borderBottom: '1px solid rgba(30,60,130,0.09)' }}>
          <button
            onClick={() => setShowCategoryPicker(!showCategoryPicker)}
            className="w-full flex items-center justify-between px-5 py-3"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(218,68%,28%)' }}
          >
            <span className="flex items-center gap-2">
              <span style={{ color: 'hsl(220,16%,56%)' }}>Category:</span>
              {activeCategory}
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'hsl(220,14%,64%)', letterSpacing: '0.08em' }}>
                ({categoryCount[activeCategory] || 0})
              </span>
            </span>
            <motion.div animate={{ rotate: showCategoryPicker ? 180 : 0 }}>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: 'hsl(220,16%,56%)' }} />
            </motion.div>
          </button>
          <AnimatePresence>
            {showCategoryPicker && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden" style={{ borderTop: '1px solid rgba(30,60,130,0.06)' }}>
                <div className="grid grid-cols-2 gap-1.5 p-3">
                  {CATEGORIES.map((cat) => (
                    <button key={cat}
                      onClick={() => { setActiveCategory(cat); setCurrentIndex(0); setShowCategoryPicker(false); }}
                      className="py-2.5 px-3 text-left transition-all duration-200"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                        background: activeCategory === cat ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                        color: activeCategory === cat ? 'hsl(42,30%,94%)' : 'hsl(222,30%,30%)',
                        borderRadius: '3px',
                        border: activeCategory === cat ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                      }}>
                      <span>{cat}</span>
                      <span className="ml-1" style={{ opacity: 0.5 }}>({categoryCount[cat] || 0})</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center px-4 pt-6 pb-4">
          <div className="relative w-full" style={{ maxWidth: 340, aspectRatio: '4/5' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentQuestion?.id}-${currentIndex}`}
                custom={direction}
                initial={{ opacity: 0, y: 28, scale: 0.96, rotate: direction > 0 ? 1.2 : -1.2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: -90 * direction, scale: 0.94, rotate: -2.5 * direction }}
                transition={{ type: "spring", stiffness: 250, damping: 28 }}
                style={{
                  backgroundColor: 'hsl(220,70%,26%)',
                  backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)`,
                  backgroundSize: '36px 36px, 100% 100%',
                  border: '1px solid rgba(15,45,115,0.50)',
                  borderRadius: '4px',
                  boxShadow: '4px 8px 30px rgba(12,25,72,0.28), -1px -1px 0 rgba(255,255,255,0.06) inset',
                  touchAction: 'pan-y',
                }}
                className="absolute inset-0 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 pointer-events-none"
                  style={{ height: 80, background: 'linear-gradient(to bottom, rgba(255,252,245,0.05) 0%, transparent 100%)' }} />
                <div className="absolute top-0 left-0 w-8 h-8 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.11)' }} />
                <div className="absolute top-0 right-0 w-8 h-8 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.11)' }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.11)' }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.11)' }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-9">
                  <div className="absolute top-6 left-0 right-0 flex justify-center">
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                      border: '1px solid rgba(180,200,255,0.16)', borderRadius: '2px',
                      color: 'rgba(195,210,255,0.46)', padding: '4px 12px',
                    }}>
                      {currentQuestion?.category}
                    </span>
                  </div>

                  <div className="absolute top-6 right-5 flex flex-col gap-2">
                    {isFav && <Heart className="w-3 h-3 fill-current" style={{ color: 'rgba(220,180,140,0.55)' }} />}
                    {isAns && <Check className="w-3 h-3" style={{ color: 'rgba(140,220,180,0.50)' }} />}
                  </div>

                  {isCurrentCustom && (
                    <motion.button
                      onClick={() => currentQuestion && openEdit(currentQuestion)}
                      whileTap={{ scale: 0.90 }}
                      className="absolute top-6 left-5 flex items-center justify-center z-10"
                      style={{
                        width: 26, height: 26, borderRadius: '4px',
                        background: 'rgba(255,252,245,0.12)',
                        border: '1px solid rgba(180,200,255,0.20)',
                      }}
                    >
                      <Pencil className="w-3 h-3" style={{ color: 'rgba(200,215,255,0.60)' }} />
                    </motion.button>
                  )}

                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', color: 'rgba(200,185,160,0.16)', lineHeight: 1, marginBottom: '20px' }}>{'\u2726'}</div>

                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 500,
                    fontSize: '1.48rem', letterSpacing: '0.01em', lineHeight: 1.42, color: 'hsl(42,30%,96%)',
                  }}>
                    "{currentQuestion?.text}"
                  </h2>

                  <p className="absolute bottom-6" style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'rgba(175,162,140,0.28)',
                  }}>
                    {(currentIndex % filteredQuestions.length) + 1} / {filteredQuestions.length}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2.5 w-full justify-center" style={{ marginTop: '24px', maxWidth: 340 }}>
            <motion.button onClick={() => currentQuestion && toggleFavorite(currentQuestion.id)} whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center"
              style={{ width: 44, height: 44, borderRadius: '4px', background: isFav ? 'hsl(218,70%,28%)' : 'hsl(38,30%,99%)', border: isFav ? '1px solid rgba(15,45,115,0.42)' : '1px solid rgba(30,60,130,0.10)', boxShadow: '0 1px 0 rgba(255,255,255,0.85) inset, 2px 3px 8px rgba(20,40,100,0.06)' }}>
              <Heart className="w-4 h-4" style={{ color: isFav ? 'hsl(42,48%,78%)' : 'hsl(220,18%,54%)', fill: isFav ? 'hsl(42,48%,78%)' : 'none' }} />
            </motion.button>

            <motion.button onClick={handleNext} whileTap={{ scale: 0.97 }} whileHover={{ y: -1.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex-1 flex items-center justify-center gap-2.5"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.10)', borderRadius: '4px', color: 'hsl(218,68%,30%)', boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 4px 12px rgba(20,40,100,0.07)', padding: '13px 20px' }}>
              <RefreshCw className="w-3.5 h-3.5" />
              Next Question
            </motion.button>

            <motion.button onClick={() => currentQuestion && toggleAnswered(currentQuestion.id)} whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center"
              style={{ width: 44, height: 44, borderRadius: '4px', background: isAns ? 'hsl(218,70%,28%)' : 'hsl(38,30%,99%)', border: isAns ? '1px solid rgba(15,45,115,0.42)' : '1px solid rgba(30,60,130,0.10)', boxShadow: '0 1px 0 rgba(255,255,255,0.85) inset, 2px 3px 8px rgba(20,40,100,0.06)' }}>
              <Check className="w-4 h-4" style={{ color: isAns ? 'hsl(140,50%,70%)' : 'hsl(220,18%,54%)' }} />
            </motion.button>
          </div>

          <div className="flex items-center justify-between w-full px-4 py-3"
            style={{ maxWidth: 340, marginTop: '16px', borderRadius: '4px', background: 'hsl(40,22%,95%)', border: '1px solid rgba(30,60,130,0.06)' }}>
            <div className="flex items-center gap-1.5">
              <Heart className="w-3 h-3" style={{ color: 'hsl(218,60%,42%)', fill: 'hsl(218,60%,42%)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, color: 'hsl(222,30%,32%)' }}>{favorites.size} saved</span>
            </div>
            <div style={{ width: 1, height: 12, background: 'rgba(30,60,130,0.12)' }} />
            <div className="flex items-center gap-1.5">
              <Check className="w-3 h-3" style={{ color: 'hsl(160,40%,42%)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, color: 'hsl(222,30%,32%)' }}>{answered.size} answered</span>
            </div>
            <div style={{ width: 1, height: 12, background: 'rgba(30,60,130,0.12)' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, color: 'hsl(222,30%,32%)' }}>{allQuestions.length} total</span>
          </div>
        </div>
      </div>

      <EditDeleteModal
        isOpen={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        onSave={handleSave}
        onDelete={() => setShowDeleteConfirm(true)}
        title="Edit Question"
        fields={[
          { key: 'text', label: 'Question', type: 'textarea', placeholder: 'Your question...', rows: 3 },
          { key: 'category', label: 'Category', type: 'select', options: CATEGORIES.filter(c => c !== 'All') },
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
