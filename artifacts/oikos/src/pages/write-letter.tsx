import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, LockKeyhole, MessageSquare, Sparkles, CalendarHeart } from "lucide-react";
import type { NoteType } from "@/types";

const MAX_CHARS = 200;

const TYPE_COLORS: Record<NoteType, string> = {
  note: 'hsl(218,70%,28%)',
  "open-when": 'hsl(222,52%,18%)',
  invite: 'hsl(338,45%,38%)',
};

const typeOptions: { type: NoteType; icon: typeof MessageSquare; label: string; desc: string }[] = [
  { type: "note", icon: MessageSquare, label: "Note", desc: "A short, sweet message" },
  { type: "open-when", icon: Sparkles, label: "Open When", desc: "Sealed until the right moment" },
  { type: "invite", icon: CalendarHeart, label: "Invite", desc: "A tiny plan or invitation" },
];

export default function WriteLetterPage() {
  const [, setLocation] = useLocation();
  const [noteType, setNoteType] = useState<NoteType | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Daniel");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !content.trim() || !noteType) return;
    const now = new Date();
    const letter = {
      id: `note-${Date.now()}`,
      title: noteType === "open-when" ? `Open when ${title.trim().toLowerCase()}` : title.trim(),
      unlockDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isLocked: noteType === "open-when",
      author,
      content: content.trim(),
      noteType,
    };
    try {
      const existing = JSON.parse(localStorage.getItem("oikos-custom-letters") || "[]");
      localStorage.setItem("oikos-custom-letters", JSON.stringify([...existing, letter]));
    } catch {}
    setSent(true);
    setTimeout(() => setLocation("/letters"), 1000);
  };

  const inputStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.05rem', fontWeight: 400 as const,
    color: 'hsl(222,38%,22%)', background: 'hsl(40,26%,95%)',
    border: '1px solid rgba(30,60,130,0.10)', borderRadius: '4px',
    padding: '12px 16px', outline: 'none', width: '100%',
  };

  const labelStyle = {
    fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700 as const,
    letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    color: 'hsl(218,68%,28%)', marginBottom: '8px', display: 'block',
  };

  return (
    <AppShell>
      <div style={{
        background: 'linear-gradient(160deg, hsl(220, 68%, 26%) 0%, hsl(218, 72%, 30%) 100%)',
        padding: '36px 28px 28px',
      }}>
        <Link href="/letters" className="flex items-center gap-2 mb-6"
          style={{ color: 'rgba(200,215,255,0.78)' }}>
          <ArrowLeft className="w-4 h-4" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Back</span>
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '2.0rem', letterSpacing: '0.01em', color: 'hsl(42,30%,96%)', lineHeight: 1.15 }}>
          {noteType ? typeOptions.find(t => t.type === noteType)?.label : 'New Tile'}
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.88rem', color: 'rgba(200,188,165,0.50)', marginTop: '6px' }}>
          Add a piece to the mosaic
        </p>
      </div>

      <div className="px-4 pt-5 pb-20" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {!noteType ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ ...labelStyle, marginBottom: '4px' }}>What kind of tile?</p>
            {typeOptions.map(opt => {
              const Icon = opt.icon;
              return (
                <motion.button
                  key={opt.type}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setNoteType(opt.type)}
                  className="flex items-center gap-4 w-full text-left px-5 py-4"
                  style={{
                    background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 12px rgba(20,40,100,0.06)',
                  }}
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ background: TYPE_COLORS[opt.type], borderRadius: '4px' }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: 'hsl(42,30%,96%)' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.1rem', color: 'hsl(222,45%,16%)' }}>
                      {opt.label}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 400, color: 'hsl(220,16%,55%)', marginTop: '2px' }}>
                      {opt.desc}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <button onClick={() => { setNoteType(null); setTitle(''); setContent(''); }}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(218,55%,40%)', background: 'none', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer' }}>
                ← Change type
              </button>

              <div>
                <label style={labelStyle}>
                  {noteType === "open-when" ? "Open when..." : noteType === "invite" ? "Invitation" : "Title"}
                </label>
                {noteType === "open-when" && (
                  <div className="flex items-center gap-0 mb-0">
                    <div style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem', fontWeight: 500,
                      color: 'hsl(218,60%,32%)', background: 'hsl(218,70%,28%)', borderRadius: '4px 0 0 4px',
                      padding: '12px 12px 12px 16px', border: '1px solid rgba(15,45,115,0.40)', borderRight: 'none',
                      whiteSpace: 'nowrap',
                    }}>
                      <span style={{ color: 'hsl(42,30%,90%)', fontSize: '0.95rem' }}>Open when</span>
                    </div>
                    <input value={title} onChange={e => setTitle(e.target.value)}
                      placeholder="you eat pizza"
                      style={{ ...inputStyle, borderRadius: '0 4px 4px 0', flex: 1 }} />
                  </div>
                )}
                {noteType !== "open-when" && (
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder={noteType === "invite" ? "Movie night?" : "Thinking of you"}
                    style={inputStyle} />
                )}
              </div>

              <div>
                <label style={labelStyle}>From</label>
                <div className="flex gap-2">
                  {['Daniel', 'Sofia'].map(name => (
                    <button key={name} onClick={() => setAuthor(name)}
                      className="flex-1 py-2.5 transition-all duration-200"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem', fontWeight: 600,
                        background: author === name ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                        color: author === name ? 'hsl(42,30%,96%)' : 'hsl(222,30%,30%)',
                        border: author === name ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                        borderRadius: '4px',
                      }}>
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Message</label>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500,
                    color: content.length > MAX_CHARS ? 'hsl(0,60%,50%)' : 'hsl(220,16%,62%)',
                  }}>
                    {content.length}/{MAX_CHARS}
                  </span>
                </div>
                <textarea value={content}
                  onChange={e => { if (e.target.value.length <= MAX_CHARS) setContent(e.target.value); }}
                  placeholder={
                    noteType === "invite" ? "Pack a bag. Surprise trip."
                    : noteType === "open-when" ? "I want you to know that..."
                    : "Tonight is ours."
                  }
                  rows={4}
                  style={{ ...inputStyle, resize: 'none' as const, fontStyle: 'italic', lineHeight: 1.75 }} />
              </div>

              {noteType === "open-when" && (
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{ background: 'rgba(30,50,100,0.05)', borderRadius: '4px', border: '1px solid rgba(30,60,130,0.08)' }}>
                  <LockKeyhole className="w-4 h-4 shrink-0" style={{ color: 'hsl(218,60%,38%)' }} />
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'hsl(218,40%,42%)', lineHeight: 1.5 }}>
                    This tile will be sealed. The reader must confirm before opening.
                  </p>
                </div>
              )}

              <motion.button
                onClick={handleSend}
                whileTap={{ scale: 0.97 }}
                disabled={!title.trim() || !content.trim() || sent}
                className="flex items-center justify-center gap-2.5 w-full"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  background: sent ? 'hsl(160,40%,42%)' : noteType === 'open-when' ? 'hsl(222,48%,18%)' : 'hsl(218,70%,28%)',
                  color: 'hsl(42,30%,96%)', borderRadius: '4px', padding: '15px 20px',
                  border: 'none', marginTop: '4px',
                  opacity: (!title.trim() || !content.trim()) ? 0.5 : 1,
                  boxShadow: '2px 4px 14px rgba(12,25,72,0.22)',
                }}
              >
                {noteType === 'open-when' ? <LockKeyhole className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {sent ? 'Placed ✦' : noteType === 'open-when' ? 'Seal Tile' : 'Place Tile'}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AppShell>
  );
}
