import { useState, useCallback, useEffect } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllLetters, isCustomItem, deleteCustomLetter, updateCustomLetter } from "@/data/store";
import { motion, AnimatePresence } from "framer-motion";
import { LockKeyhole, MessageSquare, Sparkles, CalendarHeart, PenLine, Pencil, Trash2 } from "lucide-react";
import { Link } from "wouter";
import EditDeleteModal from "@/components/EditDeleteModal";
import type { Letter, NoteType } from "@/types";

const noteTilePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.18'%3E%3Ccircle cx='30' cy='30' r='12' stroke-width='0.7'/%3E%3Ccircle cx='30' cy='30' r='6' stroke-width='0.5'/%3E%3Cpath d='M30 0v60M0 30h60' stroke-width='0.4'/%3E%3Cpath d='M30 18a12 12 0 010 24M18 30a12 12 0 0124 0' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='18' r='2' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='42' r='2' stroke-width='0.5'/%3E%3Ccircle cx='18' cy='30' r='2' stroke-width='0.5'/%3E%3Ccircle cx='42' cy='30' r='2' stroke-width='0.5'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const openWhenTilePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.16'%3E%3Cpath d='M30 6l8.5 8.5L30 23l-8.5-8.5z' stroke-width='0.6'/%3E%3Cpath d='M30 37l8.5 8.5L30 54l-8.5-8.5z' stroke-width='0.6'/%3E%3Cpath d='M6 30l8.5-8.5L23 30l-8.5 8.5z' stroke-width='0.6'/%3E%3Cpath d='M37 30l8.5-8.5L54 30l-8.5 8.5z' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='4' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='1.5' stroke-width='0.4'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke-width='0.3'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const inviteTilePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.18'%3E%3Cpath d='M30 0Q60 30 30 60Q0 30 30 0z' stroke-width='0.7'/%3E%3Cpath d='M0 0Q30 30 0 60' stroke-width='0.5'/%3E%3Cpath d='M60 0Q30 30 60 60' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='5' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='2' stroke-width='0.4'/%3E%3Cpath d='M15 0Q30 15 15 30Q0 15 15 0z' stroke-width='0.4' transform='translate(15,15)'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const TILE_STYLES: Record<string, { bg: string; grad: string; pattern: string; border: string; shadow: string }> = {
  note: {
    bg: 'hsl(218,70%,28%)',
    grad: 'linear-gradient(155deg, hsl(218,68%,26%) 0%, hsl(218,72%,32%) 100%)',
    pattern: noteTilePattern,
    border: '1px solid rgba(15,45,130,0.55)',
    shadow: '2px 4px 14px rgba(12,25,80,0.28)',
  },
  "open-when": {
    bg: 'hsl(222,52%,18%)',
    grad: 'linear-gradient(155deg, hsl(222,50%,16%) 0%, hsl(222,55%,22%) 100%)',
    pattern: openWhenTilePattern,
    border: '1px solid rgba(10,30,80,0.60)',
    shadow: '2px 4px 14px rgba(8,18,55,0.35)',
  },
  invite: {
    bg: 'hsl(205,50%,30%)',
    grad: 'linear-gradient(155deg, hsl(205,48%,28%) 0%, hsl(208,54%,34%) 100%)',
    pattern: inviteTilePattern,
    border: '1px solid rgba(15,55,110,0.50)',
    shadow: '2px 4px 14px rgba(12,35,70,0.28)',
  },
};

function noteTypeIcon(t?: NoteType) {
  if (t === "open-when") return Sparkles;
  if (t === "invite") return CalendarHeart;
  return MessageSquare;
}

function noteTypeLabel(t?: NoteType): string {
  if (t === "open-when") return "Open When";
  if (t === "invite") return "Invite";
  return "Note";
}

export default function LettersPage() {
  const [letters, setLetters] = useState(() => getAllLetters());
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quickDeleteId, setQuickDeleteId] = useState<string | null>(null);

  const reload = useCallback(() => setLetters(getAllLetters()), []);

  useEffect(() => {
    const interval = setInterval(() => { setLetters(getAllLetters()); }, 60000);
    return () => clearInterval(interval);
  }, []);

  const openEdit = (letter: Letter) => {
    setEditingLetter(letter);
    setEditValues({
      title: letter.title,
      content: letter.content || '',
      author: letter.author || 'Daniel',
    });
    setShowDeleteConfirm(false);
  };

  const handleSave = () => {
    if (!editingLetter) return;
    updateCustomLetter(editingLetter.id, {
      title: editValues.title,
      content: editValues.content,
      author: editValues.author,
    });
    setEditingLetter(null);
    reload();
  };

  const handleDelete = () => {
    if (!editingLetter) return;
    deleteCustomLetter(editingLetter.id);
    setEditingLetter(null);
    reload();
  };

  const handleQuickDelete = (id: string) => {
    deleteCustomLetter(id);
    setQuickDeleteId(null);
    reload();
  };

  return (
    <AppShell>
      <SectionHeader title="Azulejos" subtitle="Each tile holds a piece of us"
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
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>
            {letters.length} {letters.length === 1 ? 'tile' : 'tiles'}
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
        </div>

        {letters.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
              style={{
                backgroundColor: 'hsl(218,70%,28%)',
                backgroundImage: `${noteTilePattern}`,
                backgroundSize: '60px 60px',
                borderRadius: '4px', border: '1px solid rgba(15,45,130,0.40)',
              }}>
              <MessageSquare className="w-5 h-5" style={{ color: 'rgba(255,252,245,0.50)' }} />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '1.05rem', color: 'hsl(220,18%,58%)', lineHeight: 1.6 }}>
              Your mosaic is empty.<br />Lay the first tile.
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {letters.map((letter, idx) => {
            const TypeIcon = noteTypeIcon(letter.noteType);
            const typeLabel = noteTypeLabel(letter.noteType);
            const style = TILE_STYLES[letter.noteType || 'note'] || TILE_STYLES.note;
            const isEditable = isCustomItem(letter.id);

            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
                style={{ aspectRatio: '1' }}
              >
                <Link href={`/letters/${letter.id}`} className="block w-full h-full">
                  <div
                    className="relative overflow-hidden w-full h-full flex flex-col justify-between"
                    style={{
                      backgroundColor: style.bg,
                      backgroundImage: `${style.pattern}, ${style.grad}`,
                      backgroundSize: '60px 60px, 100% 100%',
                      border: style.border,
                      borderRadius: '4px',
                      boxShadow: style.shadow,
                      padding: '14px 14px 12px',
                    }}
                  >
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l" style={{ borderColor: 'rgba(255,252,245,0.18)' }} />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r" style={{ borderColor: 'rgba(255,252,245,0.18)' }} />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l" style={{ borderColor: 'rgba(255,252,245,0.18)' }} />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r" style={{ borderColor: 'rgba(255,252,245,0.18)' }} />

                    <div className="relative z-10">
                      <span style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '6.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                        background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.16)',
                        borderRadius: '2px', padding: '2px 6px', color: 'rgba(215,205,185,0.55)',
                      }}>
                        {typeLabel}
                      </span>
                    </div>

                    <div className="relative z-10 flex-1 flex items-center justify-center px-1">
                      {letter.isLocked ? (
                        <LockKeyhole className="w-6 h-6" style={{ color: 'rgba(200,215,255,0.30)' }} />
                      ) : (
                        <TypeIcon className="w-6 h-6" style={{ color: 'rgba(255,252,245,0.14)' }} />
                      )}
                    </div>

                    <div className="relative z-10">
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600,
                        fontSize: '0.82rem', letterSpacing: '0.01em', lineHeight: 1.25,
                        color: 'rgba(222,212,194,0.85)',
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                      }}>
                        {letter.title}
                      </h3>
                      <p style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 500,
                        color: 'rgba(195,185,165,0.38)', marginTop: '3px',
                        letterSpacing: '0.06em',
                      }}>
                        {letter.author || ''}
                      </p>
                    </div>
                  </div>
                </Link>

                {isEditable && (
                  <div className="absolute top-1.5 right-1.5 z-20 flex gap-1">
                    <motion.button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(letter); }}
                      whileTap={{ scale: 0.85 }}
                      className="flex items-center justify-center"
                      style={{ width: 24, height: 24, borderRadius: '3px', background: 'rgba(255,252,245,0.15)', border: '1px solid rgba(255,252,245,0.20)', backdropFilter: 'blur(4px)' }}
                    >
                      <Pencil className="w-2.5 h-2.5" style={{ color: 'rgba(222,212,194,0.75)' }} />
                    </motion.button>
                    <motion.button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickDeleteId(letter.id); }}
                      whileTap={{ scale: 0.85 }}
                      className="flex items-center justify-center"
                      style={{ width: 24, height: 24, borderRadius: '3px', background: 'rgba(180,40,40,0.20)', border: '1px solid rgba(180,40,40,0.30)', backdropFilter: 'blur(4px)' }}
                    >
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-8"
            style={{ background: 'rgba(10,18,42,0.60)', backdropFilter: 'blur(4px)' }}
            onClick={() => setQuickDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-xs p-6 flex flex-col items-center gap-4"
              style={{ background: 'hsl(42,28%,97%)', borderRadius: '6px', boxShadow: '0 16px 48px rgba(10,20,60,0.30)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 flex items-center justify-center"
                style={{ background: 'rgba(180,40,40,0.10)', borderRadius: '50%' }}>
                <Trash2 className="w-5 h-5" style={{ color: 'hsl(0,50%,42%)' }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'hsl(222,38%,22%)', textAlign: 'center' }}>
                Remove this tile from the mosaic?
              </p>
              <div className="flex gap-3 w-full mt-1">
                <motion.button onClick={() => setQuickDeleteId(null)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                  Keep
                </motion.button>
                <motion.button onClick={() => handleQuickDelete(quickDeleteId)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(0,50%,42%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px' }}>
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
