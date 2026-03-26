import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, LockKeyhole, LockKeyholeOpen, Calendar } from "lucide-react";

const CATEGORY_OPTIONS = ["anniversary", "reassurance", "hard day", "future", "just because", "gratitude"];
const MOOD_OPTIONS = ["hopeful", "grateful", "tender", "comforting", "celebratory", "playful"];

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

export default function WriteLetterPage() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Daniel");
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");
  const [sent, setSent] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [unlockDateInput, setUnlockDateInput] = useState("");

  const handleSend = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date();
    const letter = {
      id: `let-custom-${Date.now()}`,
      title: title.trim(),
      unlockDate: isSealed && unlockDateInput
        ? formatDateForDisplay(unlockDateInput)
        : now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isLocked: isSealed && !!unlockDateInput,
      lockedUntil: isSealed && unlockDateInput ? unlockDateInput + 'T00:00:00' : undefined,
      author,
      category: category || undefined,
      content: content.trim(),
      mood: mood || undefined,
    };
    try {
      const existing = JSON.parse(localStorage.getItem("oikos-custom-letters") || "[]");
      localStorage.setItem("oikos-custom-letters", JSON.stringify([...existing, letter]));
    } catch {}
    setSent(true);
    setTimeout(() => setLocation("/letters"), 1200);
  };

  const inputStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.08rem', fontWeight: 400 as const,
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
        padding: '36px 28px 32px',
      }}>
        <Link href="/letters" className="flex items-center gap-2 mb-6"
          style={{ color: 'rgba(200,215,255,0.78)' }}>
          <ArrowLeft className="w-4 h-4" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Back</span>
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '2.0rem', letterSpacing: '0.01em', color: 'hsl(42,30%,96%)', lineHeight: 1.15 }}>
          Write a Letter
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.92rem', color: 'rgba(200,188,165,0.50)', marginTop: '8px' }}>
          Words that will last
        </p>
      </div>

      <div className="px-4 pt-5 pb-20" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Letter No. 7 — ..."
            style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>From</label>
          <div className="flex gap-2">
            {['Daniel', 'Sofia'].map(name => (
              <button key={name} onClick={() => setAuthor(name)}
                className="flex-1 py-3 transition-all duration-200"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem', fontWeight: 600,
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
          <label style={labelStyle}>Your Letter</label>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Dear Sofia,&#10;&#10;I'm writing this because..."
            rows={10}
            style={{ ...inputStyle, resize: 'none' as const, fontStyle: 'italic', lineHeight: 1.85 }} />
        </div>

        <div>
          <label style={labelStyle}>Time Seal</label>
          <motion.button
            onClick={() => { setIsSealed(!isSealed); if (isSealed) setUnlockDateInput(''); }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center gap-3 px-4 py-3.5"
            style={{
              background: isSealed ? 'hsl(218,70%,28%)' : 'hsl(40,26%,95%)',
              border: isSealed ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.10)',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}>
            <div className="w-9 h-9 flex items-center justify-center shrink-0"
              style={{
                background: isSealed ? 'rgba(255,215,0,0.15)' : 'rgba(30,60,130,0.08)',
                borderRadius: '4px',
                border: isSealed ? '1px solid rgba(255,215,0,0.30)' : '1px solid rgba(30,60,130,0.06)',
              }}>
              {isSealed ?
                <LockKeyhole className="w-4 h-4" style={{ color: '#FFD700' }} /> :
                <LockKeyholeOpen className="w-4 h-4" style={{ color: 'hsl(220,18%,50%)' }} />
              }
            </div>
            <div className="flex-1 text-left">
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1rem',
                color: isSealed ? 'hsl(42,30%,96%)' : 'hsl(222,38%,22%)',
              }}>
                {isSealed ? 'Sealed until a special date' : 'Seal this letter'}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500,
                color: isSealed ? 'rgba(195,185,165,0.50)' : 'hsl(220,16%,62%)',
                marginTop: '2px',
              }}>
                {isSealed ? 'Tap to unseal' : 'Lock it until a chosen date'}
              </p>
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: isSealed ? 'rgba(255,215,0,0.15)' : 'rgba(30,60,130,0.06)',
              color: isSealed ? '#FFD700' : 'hsl(220,18%,50%)',
              borderRadius: '3px', padding: '5px 10px',
              border: isSealed ? '1px solid rgba(255,215,0,0.25)' : '1px solid rgba(30,60,130,0.08)',
            }}>
              {isSealed ? 'ON' : 'OFF'}
            </div>
          </motion.button>

          <AnimatePresence>
            {isSealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3">
                  <label style={labelStyle}>
                    <Calendar className="w-3 h-3 inline-block mr-1" style={{ verticalAlign: 'middle' }} />
                    Unlock Date
                  </label>
                  <input
                    type="date"
                    value={unlockDateInput}
                    onChange={e => setUnlockDateInput(e.target.value)}
                    min={getMinDate()}
                    style={{
                      ...inputStyle,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      background: 'hsl(40,26%,95%)',
                    }}
                  />
                  {unlockDateInput && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic',
                        fontSize: '0.88rem', color: 'hsl(218,50%,42%)',
                        marginTop: '8px', textAlign: 'center',
                      }}>
                      This letter will be sealed until {formatDateForDisplay(unlockDateInput)}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map(c => (
              <button key={c} onClick={() => setCategory(category === c ? '' : c)}
                className="transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                  background: category === c ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                  color: category === c ? 'hsl(42,30%,94%)' : 'hsl(222,30%,30%)',
                  border: category === c ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                  borderRadius: '3px', padding: '7px 14px',
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Mood</label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map(m => (
              <button key={m} onClick={() => setMood(mood === m ? '' : m)}
                className="transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                  background: mood === m ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                  color: mood === m ? 'hsl(42,30%,94%)' : 'hsl(222,30%,30%)',
                  border: mood === m ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                  borderRadius: '3px', padding: '7px 14px',
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSend}
          whileTap={{ scale: 0.97 }}
          disabled={!title.trim() || !content.trim() || sent || (isSealed && !unlockDateInput)}
          className="flex items-center justify-center gap-2.5 w-full"
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            background: sent ? 'hsl(160,40%,42%)' : isSealed ? 'hsl(222,42%,18%)' : 'hsl(218,70%,28%)',
            color: 'hsl(42,30%,96%)', borderRadius: '4px', padding: '16px 20px',
            border: 'none', marginTop: '8px',
            opacity: (!title.trim() || !content.trim() || (isSealed && !unlockDateInput)) ? 0.5 : 1,
            boxShadow: '2px 4px 14px rgba(12,25,72,0.22)',
          }}
        >
          {isSealed ? <LockKeyhole className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          {sent ? 'Sealed' : isSealed ? 'Seal Letter' : 'Send Letter'}
        </motion.button>
      </div>
    </AppShell>
  );
}
