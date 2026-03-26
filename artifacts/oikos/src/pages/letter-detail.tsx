import { useState, useCallback } from "react";
import AppShell from "@/components/AppShell";
import { getAllLetters, isCustomItem, deleteCustomLetter, updateCustomLetter } from "@/data/store";
import { Link, useRoute, Redirect, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, LockKeyhole, Heart, MessageSquare, Sparkles, CalendarHeart, Pencil, Trash2 } from "lucide-react";
import EditDeleteModal from "@/components/EditDeleteModal";
import type { Letter, NoteType } from "@/types";

const openWhenTilePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.16'%3E%3Cpath d='M30 6l8.5 8.5L30 23l-8.5-8.5z' stroke-width='0.6'/%3E%3Cpath d='M30 37l8.5 8.5L30 54l-8.5-8.5z' stroke-width='0.6'/%3E%3Cpath d='M6 30l8.5-8.5L23 30l-8.5 8.5z' stroke-width='0.6'/%3E%3Cpath d='M37 30l8.5-8.5L54 30l-8.5 8.5z' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='4' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='1.5' stroke-width='0.4'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke-width='0.3'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

function noteTypeLabel(t?: NoteType): string {
  if (t === "open-when") return "Open When";
  if (t === "invite") return "Invite";
  return "Note";
}

function noteTypeIcon(t?: NoteType) {
  if (t === "open-when") return Sparkles;
  if (t === "invite") return CalendarHeart;
  return MessageSquare;
}

export default function LetterDetailPage() {
  const [, params] = useRoute("/letters/:id");
  const [, setLocation] = useLocation();
  const [allLetters, setAllLetters] = useState(() => getAllLetters());
  const [showConfirm, setShowConfirm] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showQuickDelete, setShowQuickDelete] = useState(false);

  const reload = useCallback(() => setAllLetters(getAllLetters()), []);
  const letter = allLetters.find((l) => l.id === params?.id);
  if (!letter) return <Redirect to="/letters" />;

  const isEditable = isCustomItem(letter.id);

  const openEdit = () => {
    setEditingLetter(letter);
    setEditValues({
      title: letter.noteType === "open-when" ? letter.title.replace(/^Open when /i, '') : letter.title,
      content: letter.content || '',
      author: letter.author || 'Daniel',
    });
    setShowDeleteConfirm(false);
  };

  const handleSave = () => {
    if (!editingLetter) return;
    const newTitle = editingLetter.noteType === "open-when"
      ? `Open when ${editValues.title.toLowerCase()}`
      : editValues.title;
    updateCustomLetter(editingLetter.id, {
      title: newTitle,
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
    setLocation("/letters");
  };

  const handleQuickDelete = () => {
    deleteCustomLetter(letter.id);
    setShowQuickDelete(false);
    setLocation("/letters");
  };

  if (letter.noteType === "open-when" && letter.isLocked && !revealed) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col">
          <div
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(222,52%,18%)',
              backgroundImage: `${openWhenTilePattern}, linear-gradient(160deg, hsl(222,50%,16%) 0%, hsl(222,55%,22%) 100%)`,
              backgroundSize: '60px 60px, 100% 100%',
              padding: '36px 28px 48px',
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/letters" className="flex items-center gap-2"
                style={{ color: 'rgba(200,215,255,0.78)' }}>
                <ArrowLeft className="w-4 h-4" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Back to Parede
                </span>
              </Link>
              {isEditable && (
                <div className="flex gap-2">
                  <motion.button onClick={openEdit} whileTap={{ scale: 0.90 }}
                    className="flex items-center justify-center"
                    style={{ width: 30, height: 30, borderRadius: '4px', background: 'rgba(255,252,245,0.12)', border: '1px solid rgba(255,252,245,0.18)' }}>
                    <Pencil className="w-3 h-3" style={{ color: 'rgba(222,212,194,0.70)' }} />
                  </motion.button>
                  <motion.button onClick={() => setShowQuickDelete(true)} whileTap={{ scale: 0.90 }}
                    className="flex items-center justify-center"
                    style={{ width: 30, height: 30, borderRadius: '4px', background: 'rgba(180,40,40,0.20)', border: '1px solid rgba(180,40,40,0.30)' }}>
                    <Trash2 className="w-3 h-3" style={{ color: 'rgba(255,180,180,0.70)' }} />
                  </motion.button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 flex items-center justify-center mb-5"
                style={{ background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(180,200,255,0.16)', borderRadius: '4px' }}>
                <LockKeyhole className="w-5 h-5" style={{ color: 'rgba(200,215,255,0.55)' }} />
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(180,200,255,0.14)',
                borderRadius: '2px', padding: '3px 10px', color: 'rgba(195,210,255,0.45)', marginBottom: '14px',
              }}>
                Open When
              </span>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.6rem', letterSpacing: '0.01em', color: 'rgba(222,210,192,0.82)', lineHeight: 1.25 }}>
                {letter.title}
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'rgba(175,190,240,0.35)', marginTop: '10px' }}>
                From {letter.author || 'Unknown'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showConfirm ? (
              <motion.div key="prompt" className="flex-1 flex flex-col items-center justify-center p-8 gap-6"
                initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.1rem', color: 'hsl(220,18%,52%)', textAlign: 'center', lineHeight: 1.65 }}>
                  This tile is sealed.<br />It was written for a moment like this.
                </p>
                <motion.button
                  onClick={() => setShowConfirm(true)}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2"
                  style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: 'hsl(222,48%,18%)', color: 'hsl(42,30%,96%)', borderRadius: '4px', padding: '14px 28px',
                    border: '1px solid rgba(10,30,80,0.50)', boxShadow: '2px 4px 14px rgba(8,18,55,0.25)',
                  }}
                >
                  <LockKeyhole className="w-3.5 h-3.5" />
                  Open this tile
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="confirm" className="flex-1 flex flex-col items-center justify-center p-8 gap-5"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-14 h-14 flex items-center justify-center"
                  style={{ background: 'rgba(30,50,100,0.06)', borderRadius: '50%' }}>
                  <Sparkles className="w-5 h-5" style={{ color: 'hsl(218,50%,38%)' }} />
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.35rem', color: 'hsl(222,45%,18%)', textAlign: 'center', lineHeight: 1.35 }}>
                  Are you sure?
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.92rem', color: 'hsl(220,16%,52%)', textAlign: 'center', lineHeight: 1.6 }}>
                  Once opened, this tile cannot be sealed again.<br />Is this the right moment?
                </p>
                <div className="flex gap-3 w-full max-w-xs mt-2">
                  <motion.button onClick={() => setShowConfirm(false)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                    Not yet
                  </motion.button>
                  <motion.button onClick={() => setRevealed(true)} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(222,48%,18%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px', boxShadow: '2px 4px 12px rgba(8,18,55,0.20)' }}>
                    Yes, open it
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DeleteConfirmModal show={showQuickDelete} onCancel={() => setShowQuickDelete(false)} onConfirm={handleQuickDelete} />

        <EditDeleteModal
          isOpen={!!editingLetter}
          onClose={() => setEditingLetter(null)}
          onSave={handleSave}
          onDelete={() => setShowDeleteConfirm(true)}
          title="Edit Tile"
          fields={[
            { key: 'title', label: letter.noteType === 'open-when' ? 'Open when...' : 'Title', type: 'text', placeholder: 'Title' },
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

  const TypeIcon = noteTypeIcon(letter.noteType);

  return (
    <AppShell>
      <div className="min-h-screen">
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, hsl(220, 68%, 26%) 0%, hsl(218, 72%, 30%) 100%)',
            padding: '36px 28px 36px',
          }}
        >
          <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(255,252,245,0.06) 0%, transparent 60%)' }} />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <Link href="/letters" className="flex items-center gap-2"
              style={{ color: 'rgba(200,215,255,0.78)' }}>
              <ArrowLeft className="w-4 h-4" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Back to Parede
              </span>
            </Link>
            {isEditable && (
              <div className="flex gap-2">
                <motion.button onClick={openEdit} whileTap={{ scale: 0.90 }}
                  className="flex items-center justify-center"
                  style={{ width: 30, height: 30, borderRadius: '4px', background: 'rgba(255,252,245,0.12)', border: '1px solid rgba(255,252,245,0.18)' }}>
                  <Pencil className="w-3 h-3" style={{ color: 'rgba(222,212,194,0.70)' }} />
                </motion.button>
                <motion.button onClick={() => setShowQuickDelete(true)} whileTap={{ scale: 0.90 }}
                  className="flex items-center justify-center"
                  style={{ width: 30, height: 30, borderRadius: '4px', background: 'rgba(180,40,40,0.20)', border: '1px solid rgba(180,40,40,0.30)' }}>
                  <Trash2 className="w-3 h-3" style={{ color: 'rgba(255,180,180,0.70)' }} />
                </motion.button>
              </div>
            )}
          </div>

          <div className="relative z-10">
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.16)',
              borderRadius: '2px', padding: '4px 10px', color: 'rgba(200,185,160,0.60)',
            }}>
              {noteTypeLabel(letter.noteType)}
            </span>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600,
              fontSize: '1.85rem', letterSpacing: '0.01em', lineHeight: 1.2,
              color: 'hsl(42,30%,96%)', marginTop: '14px',
            }}>
              {letter.title}
            </h1>
          </div>
        </div>

        <div className="px-4 pt-4 pb-20" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.06)',
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'hsl(220,16%,55%)' }}>
              {letter.author || 'Unknown'}
            </span>
            <div style={{ width: 1, height: 10, background: 'rgba(30,60,130,0.10)' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'hsl(220,16%,55%)' }}>
              {letter.unlockDate}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="px-6 py-7"
            style={{
              background: 'hsl(40, 26%, 95%)',
              border: '1px solid rgba(30,60,130,0.06)',
              borderRadius: '4px',
            }}
          >
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400, fontStyle: 'italic',
              fontSize: '1.25rem', lineHeight: 1.85,
              letterSpacing: '0.01em', color: 'hsl(222,28%,26%)',
            }}>
              {letter.content}
            </p>
          </motion.div>

          <div className="flex justify-center py-4">
            <Heart className="w-4 h-4" style={{ color: 'rgba(30,60,130,0.14)' }} />
          </div>
        </div>
      </div>

      <DeleteConfirmModal show={showQuickDelete} onCancel={() => setShowQuickDelete(false)} onConfirm={handleQuickDelete} />

      <EditDeleteModal
        isOpen={!!editingLetter}
        onClose={() => setEditingLetter(null)}
        onSave={handleSave}
        onDelete={() => setShowDeleteConfirm(true)}
        title="Edit Tile"
        fields={[
          { key: 'title', label: letter.noteType === 'open-when' ? 'Open when...' : 'Title', type: 'text', placeholder: 'Title' },
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

function DeleteConfirmModal({ show, onCancel, onConfirm }: { show: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-8"
          style={{ background: 'rgba(10,18,42,0.60)', backdropFilter: 'blur(4px)' }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
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
              <motion.button onClick={onCancel} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px' }}>
                Keep
              </motion.button>
              <motion.button onClick={onConfirm} whileTap={{ scale: 0.97 }} className="flex-1 py-3"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(0,50%,42%)', color: 'hsl(42,30%,96%)', border: 'none', borderRadius: '4px' }}>
                Remove
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
