import { useState, useCallback, useMemo } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllLettersFromKV, isCustomItem } from "@/data/store";
import { useKV } from "@/data/kv-store";
import { motion, AnimatePresence } from "framer-motion";
import { LockKeyhole, MessageSquare, Sparkles, CalendarHeart, Shield, PenLine, Pencil, Trash2, Shuffle, ArrowDownUp, Layers } from "lucide-react";
import { Link } from "wouter";
import EditDeleteModal from "@/components/EditDeleteModal";
import type { Letter, NoteType } from "@/types";

const noteTilePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.18'%3E%3Ccircle cx='30' cy='30' r='16' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='9' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='3' stroke-width='0.5'/%3E%3Cpath d='M30 14c4.5 4 4.5 12 0 16c-4.5-4-4.5-12 0-16z' stroke-width='0.55'/%3E%3Cpath d='M14 30c4-4.5 12-4.5 16 0c-4 4.5-12 4.5-16 0z' stroke-width='0.55'/%3E%3Cpath d='M30 14c-4.5 4-4.5 12 0 16' stroke-width='0.55'/%3E%3Cpath d='M46 30c-4 4.5-12 4.5-16 0' stroke-width='0.55'/%3E%3Cpath d='M18.7 18.7c3.2 1.5 6.8 1.5 10 0' stroke-width='0.4'/%3E%3Cpath d='M41.3 18.7c-3.2 1.5-6.8 1.5-10 0' stroke-width='0.4'/%3E%3Cpath d='M18.7 41.3c3.2-1.5 6.8-1.5 10 0' stroke-width='0.4'/%3E%3Cpath d='M41.3 41.3c-3.2-1.5-6.8-1.5-10 0' stroke-width='0.4'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const openWhenTilePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.16'%3E%3Cpath d='M30 6l8.5 8.5L30 23l-8.5-8.5z' stroke-width='0.6'/%3E%3Cpath d='M30 37l8.5 8.5L30 54l-8.5-8.5z' stroke-width='0.6'/%3E%3Cpath d='M6 30l8.5-8.5L23 30l-8.5 8.5z' stroke-width='0.6'/%3E%3Cpath d='M37 30l8.5-8.5L54 30l-8.5 8.5z' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='4' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='1.5' stroke-width='0.4'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke-width='0.3'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const inviteTilePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.20'%3E%3Ccircle cx='30' cy='30' r='14' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='8' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='2.5' stroke-width='0.5'/%3E%3Cpath d='M30 16v-16M30 44v16M16 30H0M44 30h16' stroke-width='0.4'/%3E%3Cpath d='M20.1 20.1L6 6M39.9 20.1L54 6M20.1 39.9L6 54M39.9 39.9L54 54' stroke-width='0.35'/%3E%3Ccircle cx='30' cy='16' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='30' cy='44' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='16' cy='30' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='44' cy='30' r='1.8' stroke-width='0.45'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const pillarTilePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.18'%3E%3Crect x='10' y='10' width='40' height='40' stroke-width='0.5'/%3E%3Crect x='18' y='18' width='24' height='24' stroke-width='0.5'/%3E%3Cpath d='M10 10l8 8M50 10l-8 8M10 50l8-8M50 50l-8-8' stroke-width='0.45'/%3E%3Cpath d='M30 10v8M30 42v8M10 30h8M42 30h8' stroke-width='0.4'/%3E%3Ccircle cx='30' cy='30' r='5' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='2' stroke-width='0.4'/%3E%3Cpath d='M30 25v-7M30 35v7M25 30h-7M35 30h7' stroke-width='0.35'/%3E%3Ccircle cx='10' cy='10' r='3' stroke-width='0.35'/%3E%3Ccircle cx='50' cy='10' r='3' stroke-width='0.35'/%3E%3Ccircle cx='10' cy='50' r='3' stroke-width='0.35'/%3E%3Ccircle cx='50' cy='50' r='3' stroke-width='0.35'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const TILE_STYLES: Record<string, { bg: string; grad: string; pattern: string; border: string; shadow: string }> = {
  note: { bg: 'hsl(218,70%,28%)', grad: 'linear-gradient(155deg, hsl(218,68%,26%) 0%, hsl(218,72%,32%) 100%)', pattern: noteTilePattern, border: '1px solid rgba(15,45,130,0.55)', shadow: '2px 4px 14px rgba(12,25,80,0.28)' },
  "open-when": { bg: 'hsl(222,52%,18%)', grad: 'linear-gradient(155deg, hsl(222,50%,16%) 0%, hsl(222,55%,22%) 100%)', pattern: openWhenTilePattern, border: '1px solid rgba(10,30,80,0.60)', shadow: '2px 4px 14px rgba(8,18,55,0.35)' },
  invite: { bg: 'hsl(338,45%,38%)', grad: 'linear-gradient(155deg, hsl(338,42%,34%) 0%, hsl(340,48%,42%) 100%)', pattern: inviteTilePattern, border: '1px solid rgba(120,20,50,0.50)', shadow: '2px 4px 14px rgba(80,15,35,0.30)' },
  pillar: { bg: 'hsl(168,45%,28%)', grad: 'linear-gradient(155deg, hsl(168,42%,24%) 0%, hsl(170,48%,32%) 100%)', pattern: pillarTilePattern, border: '1px solid rgba(20,100,80,0.50)', shadow: '2px 4px 14px rgba(15,60,50,0.30)' },
};

function noteTypeLabel(t?: NoteType): string {
  if (t === "open-when") return "Open When";
  if (t === "invite") return "Invite";
  if (t === "pillar") return "Pillar";
  return "Note";
}

const TYPE_ORDER: Record<string, number> = { pillar: 0, note: 1, "open-when": 2, invite: 3 };
type SortMode = "date" | "type" | "shuffle";

function sortLetters(letters: Letter[], mode: SortMode, shuffleSeed: number): Letter[] {
  void shuffleSeed;
  const arr = [...letters];
  if (mode === "shuffle") {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  if (mode === "type") {
    return arr.sort((a, b) => {
      const typeA = TYPE_ORDER[a.noteType || 'note'] ?? 99;
      const typeB = TYPE_ORDER[b.noteType || 'note'] ?? 99;
      if (typeA !== typeB) return typeA - typeB;
      return (b.id || '').localeCompare(a.id || '');
    });
  }
  return arr.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
}

export default function LettersPage() {
  const { data, set } = useKV();
  const letters = useMemo(() => getAllLettersFromKV(data), [data]);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quickDeleteId, setQuickDeleteId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now());
  const [filterType, setFilterType] = useState<string>("all");

  const filteredLetters = useMemo(() => {
    if (filterType === 'all') return letters;
    return letters.filter(l => (l.noteType || 'note') === filterType);
  }, [letters, filterType]);

  const sortedLetters = useMemo(() => sortLetters(filteredLetters, sortMode, shuffleSeed), [filteredLetters, sortMode, shuffleSeed]);

  const handleShuffle = () => {
    setShuffleSeed(Date.now());
    setSortMode("shuffle");
  };

  const openEdit = (letter: Letter) => {
    setEditingLetter(letter);
    setEditValues({
      title: letter.title,
      content: letter.content || '',
      author: letter.author || 'Daniel',
      suggestedDate: letter.suggestedDate || '',
    });
    setShowDeleteConfirm(false);
  };

  const handleSave = useCallback(() => {
    if (!editingLetter) return;
    const custom = (data['oikos-custom-letters'] as Letter[]) || [];
    const updated = custom.map(l => l.id === editingLetter.id ? {
      ...l,
      title: editValues.title,
      content: editValues.content,
      author: editValues.author,
      ...(editingLetter.noteType === 'invite' ? { suggestedDate: editValues.suggestedDate || undefined } : {}),
    } : l);
    set('oikos-custom-letters', updated);
    setEditingLetter(null);
  }, [editingLetter, editValues, data, set]);

  const handleDelete = useCallback(() => {
    if (!editingLetter) return;
    const custom = (data['oikos-custom-letters'] as Letter[]) || [];
    set('oikos-custom-letters', custom.filter(l => l.id !== editingLetter.id));
    setEditingLetter(null);
  }, [editingLetter, data, set]);

  const handleQuickDelete = useCallback((id: string) => {
    const custom = (data['oikos-custom-letters'] as Letter[]) || [];
    set('oikos-custom-letters', custom.filter(l => l.id !== id));
    setQuickDeleteId(null);
  }, [data, set]);

  const sortBtnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700,
    letterSpacing: '0.10em', textTransform: 'uppercase',
    background: active ? 'hsl(218,70%,28%)' : 'rgba(30,60,130,0.06)',
    color: active ? 'hsl(42,30%,96%)' : 'hsl(220,18%,55%)',
    border: active ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.08)',
    borderRadius: '3px', padding: '5px 8px',
    display: 'flex', alignItems: 'center', gap: '3px',
  });

  return (
    <AppShell>
      <SectionHeader title="Parede" subtitle="Decorating our shared wall"
        action={
          <Link href="/letters/new">
            <motion.div whileTap={{ scale: 0.92 }} className="flex items-center gap-1.5"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.18)', borderRadius: '3px', color: 'rgba(215,205,185,0.70)', padding: '6px 12px' }}>
              <PenLine className="w-3 h-3" /> New Tile
            </motion.div>
          </Link>
        }
      />

      <div className="px-4 pt-5 pb-14">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>
            {filterType !== 'all' ? `${sortedLetters.length} of ${letters.length}` : letters.length} {letters.length === 1 ? 'tile' : 'tiles'}
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
        </div>

        {letters.length > 1 && (
          <div className="flex flex-col gap-2 mb-5">
            <div className="flex items-center justify-center gap-2">
              <motion.button whileTap={{ scale: 0.93 }} onClick={handleShuffle} style={sortBtnStyle(sortMode === 'shuffle')}>
                <Shuffle className="w-2.5 h-2.5" /> Shuffle
              </motion.button>
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => setSortMode('date')} style={sortBtnStyle(sortMode === 'date')}>
                <ArrowDownUp className="w-2.5 h-2.5" /> Date
              </motion.button>
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => setSortMode('type')} style={sortBtnStyle(sortMode === 'type')}>
                <Layers className="w-2.5 h-2.5" /> Type
              </motion.button>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {([
                { key: 'all', label: 'All' },
                { key: 'note', label: 'Note' },
                { key: 'open-when', label: 'Open When' },
                { key: 'invite', label: 'Invite' },
                { key: 'pillar', label: 'Pillar' },
              ] as const).map(f => {
                const count = f.key === 'all' ? letters.length : letters.filter(l => (l.noteType || 'note') === f.key).length;
                return (
                  <motion.button key={f.key} whileTap={{ scale: 0.93 }}
                    onClick={() => setFilterType(f.key)}
                    style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
                      background: filterType === f.key ? 'hsl(218,70%,28%)' : 'rgba(30,60,130,0.06)',
                      color: filterType === f.key ? 'hsl(42,30%,96%)' : 'hsl(220,18%,55%)',
                      border: filterType === f.key ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.08)',
                      borderRadius: '3px', padding: '5px 7px',
                    }}
                  >
                    {f.label} ({count})
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {letters.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
              style={{ backgroundColor: 'hsl(218,70%,28%)', backgroundImage: `${noteTilePattern}`, backgroundSize: '60px 60px', borderRadius: '4px', border: '1px solid rgba(15,45,130,0.40)' }}>
              <MessageSquare className="w-5 h-5" style={{ color: 'rgba(255,252,245,0.50)' }} />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '1.05rem', color: 'hsl(220,18%,58%)', lineHeight: 1.6 }}>
              Your wall is empty.<br />Lay the first tile.
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {sortedLetters.map((letter, idx) => {
            const typeLabel = noteTypeLabel(letter.noteType);
            const style = TILE_STYLES[letter.noteType || 'note'] || TILE_STYLES.note;
            const isEditable = isCustomItem(letter.id);

            return (
              <motion.div
                key={letter.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
                style={{ aspectRatio: '1' }}
              >
                <Link href={`/letters/${letter.id}`} className="block w-full h-full">
                  <div className="relative overflow-hidden w-full h-full flex flex-col"
                    style={{ backgroundColor: style.bg, backgroundImage: `${style.pattern}, ${style.grad}`, backgroundSize: '60px 60px, 100% 100%', border: style.border, borderRadius: '4px', boxShadow: style.shadow }}>
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l" style={{ borderColor: 'rgba(255,252,245,0.18)' }} />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r" style={{ borderColor: 'rgba(255,252,245,0.18)' }} />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l" style={{ borderColor: 'rgba(255,252,245,0.18)' }} />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r" style={{ borderColor: 'rgba(255,252,245,0.18)' }} />

                    <div className="relative z-10 flex items-start justify-between px-3.5 pt-3">
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '6.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.16)', borderRadius: '2px', padding: '2px 6px', color: 'rgba(215,205,185,0.55)' }}>
                        {typeLabel}
                      </span>
                      {letter.isLocked && <LockKeyhole className="w-3 h-3" style={{ color: 'rgba(200,215,255,0.35)' }} />}
                    </div>
                    <div className="flex-1" />
                    <div className="relative z-10">
                      <div style={{ background: 'rgba(255,252,248,0.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '10px 14px 10px', borderTop: '1px solid rgba(255,252,245,0.30)', height: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.01em', lineHeight: 1.35, color: 'hsl(222,45%,16%)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                          {letter.title}
                        </h3>
                        {letter.noteType === 'invite' && letter.suggestedDate && (
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '6.5px', fontWeight: 600, color: 'hsl(338,45%,38%)', marginTop: '2px', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <CalendarHeart className="w-2 h-2" style={{ flexShrink: 0 }} />
                            {letter.suggestedDate}
                          </p>
                        )}
                        {!(letter.noteType === 'invite' && letter.suggestedDate) && (
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 500, color: 'hsl(220,16%,52%)', marginTop: '2px', letterSpacing: '0.04em' }}>
                            {letter.author || ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                {isEditable && (
                  <div className="absolute top-1.5 right-1.5 z-20 flex gap-1">
                    <motion.button onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(letter); }} whileTap={{ scale: 0.85 }} className="flex items-center justify-center"
                      style={{ width: 24, height: 24, borderRadius: '3px', background: 'rgba(255,252,245,0.15)', border: '1px solid rgba(255,252,245,0.20)', backdropFilter: 'blur(4px)' }}>
                      <Pencil className="w-2.5 h-2.5" style={{ color: 'rgba(222,212,194,0.75)' }} />
                    </motion.button>
                    <motion.button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickDeleteId(letter.id); }} whileTap={{ scale: 0.85 }} className="flex items-center justify-center"
                      style={{ width: 24, height: 24, borderRadius: '3px', background: 'rgba(180,40,40,0.20)', border: '1px solid rgba(180,40,40,0.30)', backdropFilter: 'blur(4px)' }}>
                      <Trash2 className="w-2.5 h-2.5" style={{ color: 'rgba(255,180,180,0.75)' }} />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {quickDeleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-8"
            style={{ background: 'rgba(10,18,42,0.60)', backdropFilter: 'blur(4px)' }}
            onClick={() => setQuickDeleteId(null)}
          >
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-xs p-6 flex flex-col items-center gap-4"
              style={{ background: 'hsl(42,28%,97%)', borderRadius: '6px', boxShadow: '0 16px 48px rgba(10,20,60,0.30)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 flex items-center justify-center" style={{ background: 'rgba(180,40,40,0.10)', borderRadius: '50%' }}>
                <Trash2 className="w-5 h-5" style={{ color: 'hsl(0,50%,42%)' }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'hsl(222,38%,22%)', textAlign: 'center' }}>
                Remove this tile from the wall?
              </p>
              <div className="flex gap-3 w-full mt-1">
                <motion.button onClick={() => setQuickDeleteId(null)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                  Keep
                </motion.button>
                <motion.button onClick={() => handleQuickDelete(quickDeleteId)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(338,45%,38%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px' }}>
                  Remove
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditDeleteModal
        isOpen={!!editingLetter}
        onClose={() => setEditingLetter(null)}
        onSave={handleSave}
        onDelete={() => setShowDeleteConfirm(true)}
        title="Edit Tile"
        fields={[
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Note title' },
          { key: 'author', label: 'From', type: 'select', options: ['Daniel', 'Sofia'] },
          { key: 'content', label: 'Message', type: 'textarea', placeholder: 'Your message...', rows: 4 },
          ...(editingLetter?.noteType === 'invite' ? [{ key: 'suggestedDate', label: 'Suggested Date', type: 'text' as const, placeholder: 'Saturday evening, June 14' }] : []),
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
