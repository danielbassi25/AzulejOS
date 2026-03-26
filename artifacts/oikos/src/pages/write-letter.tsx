import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, LockKeyhole, MessageSquare, Sparkles, CalendarHeart, Calendar } from "lucide-react";
import type { NoteType } from "@/types";

const MAX_CHARS = 200;

const OPEN_WHEN_PRESETS = [
  "Open when you are sad",
  "Open when you can't sleep",
  "Open when you need motivation",
  "Open when you miss me",
  "Open when you need to smile",
  "Open when you feel alone",
];

function formatDateForDisplay(isoDate: string): string {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

const typeOptions: { type: NoteType; icon: typeof MessageSquare; label: string; desc: string }[] = [
  { type: "note", icon: MessageSquare, label: "Note", desc: "A short, sweet message" },
  { type: "open-when", icon: Sparkles, label: "Open When", desc: "Unlock at the right moment" },
  { type: "invite", icon: CalendarHeart, label: "Invite", desc: "A tiny plan or invitation" },
];

export default function WriteLetterPage() {
  const [, setLocation] = useLocation();
  const [noteType, setNoteType] = useState<NoteType | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Daniel");
  const [sent, setSent] = useState(false);
  const [unlockDateInput, setUnlockDateInput] = useState("");
  const [customTitle, setCustomTitle] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !content.trim() || !noteType) return;
    const now = new Date();
    const isSealed = noteType === "open-when";
    const letter = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      unlockDate: isSealed && unlockDateInput
        ? formatDateForDisplay(unlockDateInput)
        : now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isLocked: isSealed && !!unlockDateInput,
      lockedUntil: isSealed && unlockDateInput ? unlockDateInput + 'T00:00:00' : undefined,
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

  const selectPreset = (preset: string) => {
    setTitle(preset);
    setCustomTitle(false);
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
          {noteType ? typeOptions.find(t => t.type === noteType)?.label : 'New Note'}
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.88rem', color: 'rgba(200,188,165,0.50)', marginTop: '6px' }}>
          Words, waiting for their moment
        </p>
      </div>

      <div className="px-4 pt-5 pb-20" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {!noteType ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ ...labelStyle, marginBottom: '4px' }}>What kind of note?</p>
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
                    style={{ background: 'hsl(218,70%,28%)', borderRadius: '4px' }}>
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
              <button onClick={() => { setNoteType(null); setTitle(''); setContent(''); setCustomTitle(false); }}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(218,55%,40%)', background: 'none', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer' }}>
                ← Change type
              </button>

              {noteType === "open-when" && !customTitle && (
                <div>
                  <label style={labelStyle}>Choose a moment</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {OPEN_WHEN_PRESETS.map(preset => (
                      <motion.button
                        key={preset}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectPreset(preset)}
                        className="text-left px-4 py-3"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '0.95rem',
                          color: title === preset ? 'hsl(42,30%,96%)' : 'hsl(222,38%,22%)',
                          background: title === preset ? 'hsl(218,70%,28%)' : 'hsl(40,26%,95%)',
                          border: title === preset ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.08)',
                          borderRadius: '4px', transition: 'all 0.2s',
                        }}>
                        {preset}
                      </motion.button>
                    ))}
                    <button
                      onClick={() => { setCustomTitle(true); setTitle(''); }}
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                        color: 'hsl(218,55%,40%)', background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', textAlign: 'left',
                      }}>
                      + Write your own
                    </button>
                  </div>
                </div>
              )}

              {(noteType !== "open-when" || customTitle) && (
                <div>
                  <label style={labelStyle}>
                    {noteType === "invite" ? "Invitation" : noteType === "open-when" ? "Open when..." : "Title"}
                  </label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder={noteType === "invite" ? "Movie night?" : noteType === "open-when" ? "Open when you..." : "Thinking of you"}
                    style={inputStyle} />
                </div>
              )}

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
                <div>
                  <label style={labelStyle}>
                    <Calendar className="w-3 h-3 inline-block mr-1" style={{ verticalAlign: 'middle' }} />
                    Seal until (optional)
                  </label>
                  <input
                    type="date"
                    value={unlockDateInput}
                    onChange={e => setUnlockDateInput(e.target.value)}
                    min={getMinDate()}
                    style={{ ...inputStyle, fontFamily: 'Inter, sans-serif', fontSize: '0.92rem' }}
                  />
                  {unlockDateInput && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic',
                        fontSize: '0.85rem', color: 'hsl(218,50%,42%)',
                        marginTop: '8px', textAlign: 'center',
                      }}>
                      Sealed until {formatDateForDisplay(unlockDateInput)}
                    </motion.p>
                  )}
                </div>
              )}

              <motion.button
                onClick={handleSend}
                whileTap={{ scale: 0.97 }}
                disabled={!title.trim() || !content.trim() || sent}
                className="flex items-center justify-center gap-2.5 w-full"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  background: sent ? 'hsl(160,40%,42%)' : noteType === 'open-when' ? 'hsl(222,42%,18%)' : 'hsl(218,70%,28%)',
                  color: 'hsl(42,30%,96%)', borderRadius: '4px', padding: '15px 20px',
                  border: 'none', marginTop: '4px',
                  opacity: (!title.trim() || !content.trim()) ? 0.5 : 1,
                  boxShadow: '2px 4px 14px rgba(12,25,72,0.22)',
                }}
              >
                {noteType === 'open-when' && unlockDateInput ? <LockKeyhole className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {sent ? 'Sent ✦' : noteType === 'open-when' && unlockDateInput ? 'Seal Note' : 'Send'}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AppShell>
  );
}
