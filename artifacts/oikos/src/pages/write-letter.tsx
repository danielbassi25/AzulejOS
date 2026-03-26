import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";

const CATEGORY_OPTIONS = ["anniversary", "reassurance", "hard day", "future", "just because", "gratitude"];
const MOOD_OPTIONS = ["hopeful", "grateful", "tender", "comforting", "celebratory", "playful"];

export default function WriteLetterPage() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Daniel");
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !content.trim()) return;
    const letter = {
      id: `let-custom-${Date.now()}`,
      title: title.trim(),
      unlockDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isLocked: false,
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
          disabled={!title.trim() || !content.trim() || sent}
          className="flex items-center justify-center gap-2.5 w-full"
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            background: sent ? 'hsl(160,40%,42%)' : 'hsl(218,70%,28%)',
            color: 'hsl(42,30%,96%)', borderRadius: '4px', padding: '16px 20px',
            border: 'none', marginTop: '8px',
            opacity: (!title.trim() || !content.trim()) ? 0.5 : 1,
            boxShadow: '2px 4px 14px rgba(12,25,72,0.22)',
          }}
        >
          <Send className="w-4 h-4" />
          {sent ? 'Sent ✦' : 'Send Letter'}
        </motion.button>
      </div>
    </AppShell>
  );
}
