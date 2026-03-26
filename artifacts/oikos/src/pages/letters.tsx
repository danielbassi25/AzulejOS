import { useState, useCallback } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllLetters, isCustomItem, deleteCustomLetter, updateCustomLetter } from "@/data/store";
import { motion } from "framer-motion";
import { LockKeyhole, MailOpen, PenLine, Pencil } from "lucide-react";
import { Link } from "wouter";
import EditDeleteModal from "@/components/EditDeleteModal";
import type { Letter } from "@/types";

const sealPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.4' opacity='0.14'%3E%3Ccircle cx='10' cy='10' r='3.5'/%3E%3Cline x1='10' y1='0' x2='10' y2='6.5'/%3E%3Cline x1='10' y1='13.5' x2='10' y2='20'/%3E%3Cline x1='0' y1='10' x2='6.5' y2='10'/%3E%3Cline x1='13.5' y1='10' x2='20' y2='10'/%3E%3C/g%3E%3C/svg%3E")`;

const CATEGORY_OPTIONS = ["anniversary", "reassurance", "hard day", "future", "just because", "gratitude"];
const MOOD_OPTIONS = ["hopeful", "grateful", "tender", "comforting", "celebratory", "playful"];

export default function LettersPage() {
  const [letters, setLetters] = useState(() => getAllLetters());
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const reload = useCallback(() => setLetters(getAllLetters()), []);

  const openEdit = (letter: Letter) => {
    setEditingLetter(letter);
    setEditValues({
      title: letter.title,
      content: letter.content || '',
      author: letter.author || 'Daniel',
      category: letter.category || '',
      mood: letter.mood || '',
    });
    setShowDeleteConfirm(false);
  };

  const handleSave = () => {
    if (!editingLetter) return;
    updateCustomLetter(editingLetter.id, {
      title: editValues.title,
      content: editValues.content,
      author: editValues.author,
      category: editValues.category || undefined,
      mood: editValues.mood || undefined,
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

  const openLetters = letters.filter(l => !l.isLocked);
  const sealedLetters = letters.filter(l => l.isLocked);

  return (
    <AppShell>
      <SectionHeader title="Letters" subtitle="Words preserved in time"
        action={
          <Link href="/letters/new">
            <motion.div whileTap={{ scale: 0.92 }} className="flex items-center gap-1.5"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.18)', borderRadius: '3px', color: 'rgba(215,205,185,0.70)', padding: '6px 12px' }}>
              <PenLine className="w-3 h-3" /> Write
            </motion.div>
          </Link>
        }
      />

      <div className="px-4 pt-5 pb-14">
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>
            {openLetters.length} open · {sealedLetters.length} sealed
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {letters.map((letter, idx) => {
            const isCustom = isCustomItem(letter.id);
            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              >
                {letter.isLocked ? (
                  <div className="relative">
                    <Link href={`/letters/${letter.id}`} className="block">
                      <div
                        className="relative overflow-hidden"
                        style={{
                          backgroundColor: 'hsl(220,68%,24%)',
                          backgroundImage: `${sealPattern}, linear-gradient(140deg, hsl(220,68%,24%) 0%, hsl(218,70%,28%) 100%)`,
                          backgroundSize: '20px 20px, 100% 100%',
                          border: '1px solid rgba(15,45,115,0.52)', borderRadius: '4px',
                          boxShadow: '2px 4px 14px rgba(12,25,72,0.24)', padding: '20px 22px',
                        }}
                      >
                        <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.16)' }} />
                        <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.16)' }} />
                        <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.16)' }} />
                        <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.16)' }} />

                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-10 h-10 flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(255,252,245,0.09)', border: '1px solid rgba(180,200,255,0.16)', borderRadius: '3px' }}>
                            <LockKeyhole className="w-4 h-4" style={{ color: 'rgba(200,215,255,0.58)' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '1.08rem', letterSpacing: '0.015em', color: 'rgba(222,210,192,0.76)' }}>
                              {letter.title}
                            </h3>
                            <div className="flex items-center gap-2" style={{ marginTop: '5px' }}>
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(175,190,240,0.38)' }}>
                                Unlocks {letter.unlockDate}
                              </p>
                              {letter.category && (
                                <>
                                  <div style={{ width: 1, height: 8, background: 'rgba(180,200,255,0.15)' }} />
                                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(175,190,240,0.30)' }}>
                                    {letter.category}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: '1px solid rgba(180,200,255,0.18)', borderRadius: '2px', color: 'rgba(195,210,255,0.42)', padding: '5px 10px' }}>
                            Sealed
                          </div>
                        </div>
                      </div>
                    </Link>
                    {isCustom && (
                      <motion.button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(letter); }}
                        whileTap={{ scale: 0.90 }}
                        className="absolute flex items-center justify-center z-10"
                        style={{
                          bottom: 8, right: 8,
                          width: 30, height: 30, borderRadius: '4px',
                          background: 'rgba(255,252,245,0.14)',
                          border: '1px solid rgba(180,200,255,0.20)',
                        }}
                      >
                        <Pencil className="w-3 h-3" style={{ color: 'rgba(200,215,255,0.70)' }} />
                      </motion.button>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <Link href={`/letters/${letter.id}`} className="block">
                      <motion.div
                        whileHover={{ y: -1.5 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        style={{
                          background: 'hsl(38, 30%, 99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px',
                          boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 12px rgba(20,40,100,0.06)', padding: '20px 22px',
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center shrink-0"
                            style={{ background: 'hsl(218,70%,28%)', borderRadius: '3px' }}>
                            <MailOpen className="w-4 h-4" style={{ color: 'hsl(42,30%,96%)' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.10rem', letterSpacing: '0.015em', color: 'hsl(222,45%,16%)' }}>
                              {letter.title}
                            </h3>
                            <div className="flex items-center gap-2" style={{ marginTop: '5px' }}>
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(218,48%,42%)' }}>
                                By {letter.author || 'Unknown'} · {letter.unlockDate}
                              </p>
                              {letter.category && (
                                <>
                                  <div style={{ width: 1, height: 8, background: 'rgba(30,60,130,0.12)' }} />
                                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(220,18%,58%)' }}>
                                    {letter.category}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)', borderRadius: '2px', padding: '5px 10px' }}>
                            Read
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                    {isCustom && (
                      <motion.button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(letter); }}
                        whileTap={{ scale: 0.90 }}
                        className="absolute flex items-center justify-center z-10"
                        style={{
                          bottom: 8, right: 8,
                          width: 30, height: 30, borderRadius: '4px',
                          background: 'hsl(218,70%,28%)',
                          border: '1px solid rgba(15,45,115,0.42)',
                          boxShadow: '0 2px 6px rgba(12,25,72,0.18)',
                        }}
                      >
                        <Pencil className="w-3 h-3" style={{ color: 'hsl(42,30%,94%)' }} />
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <EditDeleteModal
        isOpen={!!editingLetter}
        onClose={() => setEditingLetter(null)}
        onSave={handleSave}
        onDelete={() => setShowDeleteConfirm(true)}
        title="Edit Letter"
        fields={[
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Letter title' },
          { key: 'author', label: 'From', type: 'select', options: ['Daniel', 'Sofia'] },
          { key: 'content', label: 'Letter', type: 'textarea', placeholder: 'Your letter...', rows: 6 },
          { key: 'category', label: 'Category', type: 'select', options: CATEGORY_OPTIONS },
          { key: 'mood', label: 'Mood', type: 'select', options: MOOD_OPTIONS },
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
