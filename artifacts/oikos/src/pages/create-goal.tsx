import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useKV } from "@/data/kv-store";
import type { Goal } from "@/types";

const CATEGORIES = ["Activities", "Travel", "Movies", "Food"];

export default function CreateGoalPage() {
  const [, setLocation] = useLocation();
  const { data, set } = useKV();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!text.trim() || !category) return;
    const goal: Goal = {
      id: `goal-custom-${Date.now()}`,
      text: text.trim(),
      completed: false,
      category,
    };
    const existing = (data['oikos-custom-goals'] as Goal[]) || [];
    set('oikos-custom-goals', [...existing, goal]);
    setSaved(true);
    setTimeout(() => setLocation("/build"), 1200);
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
        <div>
          <Link href="/build" className="flex items-center gap-2 mb-6"
            style={{ color: 'rgba(200,215,255,0.78)' }}>
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Back</span>
          </Link>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600,
            fontSize: '2.0rem', letterSpacing: '0.01em', color: 'hsl(42,30%,96%)', lineHeight: 1.15,
          }}>
            Add a Dream
          </h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic',
            fontWeight: 400, fontSize: '0.92rem', color: 'rgba(200,188,165,0.50)', marginTop: '8px',
          }}>
            Something we'll do together
          </p>
        </div>
      </div>

      <div className="px-4 pt-5 pb-20" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={labelStyle}>What will we do?</label>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Visit the cherry blossoms in Japan..."
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(category === cat ? '' : cat)}
                className="transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  background: category === cat ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                  color: category === cat ? 'hsl(42,30%,94%)' : 'hsl(222,30%,30%)',
                  border: category === cat ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                  borderRadius: '3px', padding: '8px 16px',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          disabled={!text.trim() || !category || saved}
          className="flex items-center justify-center gap-2.5 w-full"
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            background: saved ? 'hsl(160,40%,42%)' : 'hsl(218,70%,28%)',
            color: 'hsl(42,30%,96%)', borderRadius: '4px', padding: '16px 20px',
            border: 'none', marginTop: '8px',
            opacity: (!text.trim() || !category) ? 0.5 : 1,
            boxShadow: '2px 4px 14px rgba(12,25,72,0.22)',
          }}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Added ✦' : 'Add to Our List'}
        </motion.button>
      </div>
    </AppShell>
  );
}
